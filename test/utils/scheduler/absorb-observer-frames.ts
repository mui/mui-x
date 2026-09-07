import { act } from '@mui/internal-test-utils';
import { vi } from 'vitest';

// Captured at module load, before any test can install fake timers: the frame
// wait below must ride the real rendering pipeline, like ResizeObserver does.
const capturedRequestAnimationFrame =
  typeof requestAnimationFrame === 'function' ? requestAnimationFrame : null;
const nativeRequestAnimationFrame = capturedRequestAnimationFrame?.bind(globalThis) ?? null;
// Same reason as the frame capture: fake timers freeze `performance.now`, which would
// stop the quiet window below from ever elapsing.
const nativeNow = performance.now.bind(performance);

// A ResizeObserver delivery does not settle the virtualizer on its own: it schedules a
// dimension update throttled by `resizeThrottleMs` (100ms by default), whose trailing
// edge runs on a timer rather than a frame. Waiting a fixed number of frames therefore
// races that timer, so drain until the DOM has been still for longer than that window.
const QUIET_WINDOW_MS = 150;
// Upper bound so a genuinely oscillating layout fails the test instead of hanging.
const MAX_DRAIN_MS = 1000;

/**
 * Waits inside act until the scheduler surface stops mutating the DOM, so pending
 * ResizeObserver deliveries and the throttled dimension updates they schedule land as
 * acted updates instead of between test steps. Call it after rendering a scheduler
 * surface (prefer `renderSettled`) or after a scroll that mounts observed elements.
 * jsdom has no ResizeObserver and so nothing to absorb; there it flushes pending
 * microtasks inside act instead.
 */
export async function absorbObserverFrames() {
  if (typeof ResizeObserver === 'undefined' || nativeRequestAnimationFrame === null) {
    // No frames to absorb in jsdom, but flush pending microtasks inside act so
    // async work the render started (e.g. a data source fetch) lands acted too.
    await act(async () => {});
    return;
  }
  if (!vi.isFakeTimers() && globalThis.requestAnimationFrame !== capturedRequestAnimationFrame) {
    // With real timers the live rAF is the captured one unless a test leaked fake
    // timers into module collection — awaiting the stale capture would hang forever.
    throw new Error(
      'absorbObserverFrames: the requestAnimationFrame captured at module load is no longer ' +
        'the live one. A test likely leaked fake timers without restoring them.',
    );
  }
  await act(async () => {
    let lastMutationAt = nativeNow();
    // Record in the callback: delivering records to it also drains the queue, so
    // `takeRecords()` would come back empty and read as a false quiet.
    const observer = new MutationObserver(() => {
      lastMutationAt = nativeNow();
    });
    observer.observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
      characterData: true,
    });
    try {
      const startedAt = nativeNow();
      lastMutationAt = startedAt;
      // The frames have to be pumped one at a time: each one may produce the mutation
      // that extends the quiet window.
      /* eslint-disable no-await-in-loop */
      do {
        await new Promise<void>((resolve) => {
          nativeRequestAnimationFrame!(() => resolve());
        });
        // Let React commit what the frame produced, and the observer deliver the
        // records for it, before testing the quiet window below.
        await Promise.resolve();
      } while (
        nativeNow() - lastMutationAt < QUIET_WINDOW_MS &&
        nativeNow() - startedAt < MAX_DRAIN_MS
      );
      /* eslint-enable no-await-in-loop */
    } finally {
      observer.disconnect();
    }
  });
}
