import { act } from '@mui/internal-test-utils';
import { vi } from 'vitest';

// Captured at module load, before any test can install fake timers: the frame
// wait below must ride the real rendering pipeline, like ResizeObserver does.
const capturedRequestAnimationFrame =
  typeof requestAnimationFrame === 'function' ? requestAnimationFrame : null;
const nativeRequestAnimationFrame = capturedRequestAnimationFrame?.bind(globalThis) ?? null;

/**
 * Waits two pairs of native frames inside separate act scopes, so ResizeObserver deliveries land as
 * acted updates instead of between test steps. Call it after rendering a scheduler
 * surface (prefer `renderSettled`) or after a scroll that mounts observed elements.
 * jsdom has no ResizeObserver and so no frames to absorb; there it flushes pending
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
  // React can flush observer-driven state updates when act exits, changing layout
  // and scheduling another delivery. A second act scope absorbs that delivery;
  // waiting more frames in the first scope would leave the update batched.
  const waitForFramePair = () =>
    new Promise<void>((resolve) => {
      nativeRequestAnimationFrame!(() => nativeRequestAnimationFrame!(() => resolve()));
    });
  await act(waitForFramePair);
  await act(waitForFramePair);
}
