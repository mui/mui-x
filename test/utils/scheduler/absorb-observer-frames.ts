import { act } from '@mui/internal-test-utils';
import { vi } from 'vitest';

// Captured at module load, before any test can install fake timers: the frame
// wait below must ride the real rendering pipeline, like ResizeObserver does.
const capturedRequestAnimationFrame =
  typeof requestAnimationFrame === 'function' ? requestAnimationFrame : null;
const nativeRequestAnimationFrame = capturedRequestAnimationFrame?.bind(globalThis) ?? null;

/**
 * Absorbs native observer frames inside act until React stops changing the DOM.
 * Call after rendering a scheduler surface (prefer `renderSettled`) or scrolling
 * to mount observed elements. Each pass allows React to commit observer-driven
 * updates before waiting for the resulting layout deliveries.
 * In jsdom, flush pending microtasks inside act without waiting for native frames.
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
  const waitForFramePair = () =>
    new Promise<void>((resolve) => {
      nativeRequestAnimationFrame!(() => nativeRequestAnimationFrame!(() => resolve()));
    });
  let didMutate = false;
  const observer = new MutationObserver(() => {
    didMutate = true;
  });
  observer.observe(document.body, {
    attributes: true,
    childList: true,
    characterData: true,
    subtree: true,
  });

  async function waitForSettledDom(pass: number): Promise<void> {
    didMutate = false;
    // React commits at the end of each act scope; the next pass must follow it.
    await act(waitForFramePair);
    if (!didMutate && observer.takeRecords().length === 0) {
      return;
    }
    if (pass === 10) {
      throw new Error(
        'absorbObserverFrames: the DOM did not settle after 10 observer frame pairs.',
      );
    }
    await waitForSettledDom(pass + 1);
  }

  try {
    await waitForSettledDom(1);
  } finally {
    observer.disconnect();
  }
}
