import { act } from '@mui/internal-test-utils';

// Captured at module load, before any test can install fake timers: the frame
// wait below must ride the real rendering pipeline, like ResizeObserver does.
const nativeRequestAnimationFrame =
  typeof requestAnimationFrame === 'function' ? requestAnimationFrame.bind(globalThis) : null;

/**
 * Waits two native frames inside act, so pending ResizeObserver deliveries land as
 * acted updates instead of between test steps. Call it after any step that perturbs
 * layout (render, drag start/end, scroll). No-op in jsdom, which has no ResizeObserver.
 */
export async function absorbObserverFrames() {
  if (typeof ResizeObserver === 'undefined' || nativeRequestAnimationFrame === null) {
    return;
  }
  await act(async () => {
    await new Promise<void>((resolve) => {
      nativeRequestAnimationFrame!(() => nativeRequestAnimationFrame!(() => resolve()));
    });
  });
}
