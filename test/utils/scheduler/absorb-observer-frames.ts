import { act } from '@mui/internal-test-utils';
import { vi } from 'vitest';

// Captured at module load, before any test can install fake timers: the frame
// wait below must ride the real rendering pipeline, like ResizeObserver does.
const capturedRequestAnimationFrame =
  typeof requestAnimationFrame === 'function' ? requestAnimationFrame : null;
const nativeRequestAnimationFrame = capturedRequestAnimationFrame?.bind(globalThis) ?? null;

/**
 * Waits two native frames inside act, so pending ResizeObserver deliveries land as
 * acted updates instead of between test steps. Call it after rendering a scheduler
 * surface (prefer `renderSettled`) or after a scroll that mounts observed elements.
 * No-op in jsdom, which has no ResizeObserver.
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
  // Two frames: one for layout, one for the delivery. A delivery chain (observer-driven
  // state resizing an observed element) would need a third; nothing observed does today.
  await act(async () => {
    await new Promise<void>((resolve) => {
      nativeRequestAnimationFrame!(() => nativeRequestAnimationFrame!(() => resolve()));
    });
  });
}
