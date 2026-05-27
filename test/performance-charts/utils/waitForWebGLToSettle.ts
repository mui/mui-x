/**
 * Lets the ChartsWebGLLayer ResizeObserver + canvas init settle deterministically
 * before the harness samples renders. Without this, iterations race and produce
 * different render-event counts.
 */
export const waitForWebGLToSettle = () =>
  new Promise<void>((r) => {
    setTimeout(r, 100);
  });
