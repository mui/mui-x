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
// Upper bound so a genuinely oscillating layout throws instead of hanging.
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
  let lastMutationAt = nativeNow();
  // Record in the callback: delivering records to it also drains the queue, so
  // `takeRecords()` would come back empty and read as a false quiet.
  const observer = new MutationObserver(() => {
    lastMutationAt = nativeNow();
  });
  const startedAt = lastMutationAt;
  observer.observe(document.body, {
    subtree: true,
    childList: true,
    attributes: true,
    characterData: true,
  });
  try {
    // One act scope per frame, rather than one wrapping the whole drain: React 18
    // only flushes the work queued inside an act scope when that scope exits, so a
    // single long-running one would hide every update until the very end and read
    // as quiet throughout.
    /* eslint-disable no-await-in-loop */
    while (nativeNow() - lastMutationAt < QUIET_WINDOW_MS) {
      if (nativeNow() - startedAt >= MAX_DRAIN_MS) {
        throw new Error(
          `absorbObserverFrames: the DOM did not settle within ${MAX_DRAIN_MS}ms. An ` +
            'observer-driven update is most likely resizing an observed element in a loop.',
        );
      }
      await act(async () => {
        await new Promise<void>((resolve) => {
          nativeRequestAnimationFrame!(() => resolve());
        });
      });
    }
    /* eslint-enable no-await-in-loop */
  } finally {
    observer.disconnect();
  }
}
