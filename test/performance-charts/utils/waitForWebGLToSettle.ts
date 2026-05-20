/**
 * Lets the ChartsWebGLLayer ResizeObserver + canvas init settle deterministically
 * before the harness samples renders. Without this, iterations race and produce
 * different render-event counts.
 *
 * The benchmark harness forces `--disable-gpu`; WebGL runs through SwiftShader
 * (software). On CI under load, the first frame can take well over 100ms to
 * commit — a fixed delay is flaky. Poll the canvas until at least one pixel
 * has been drawn (with a generous timeout), so iterations start from a known,
 * non-empty state.
 */
const POLL_INTERVAL_MS = 50;
const MAX_WAIT_MS = 2000;

function canvasHasContent(): boolean {
  const canvas = document.querySelector('canvas');
  if (!canvas) {
    return false;
  }

  const gl = canvas.getContext('webgl2', { preserveDrawingBuffer: true });
  if (!gl || gl.drawingBufferWidth === 0 || gl.drawingBufferHeight === 0) {
    return false;
  }

  // Sample a sparse grid instead of the full drawing buffer — full readPixels
  // each poll is expensive and dominates the wait.
  const w = gl.drawingBufferWidth;
  const h = gl.drawingBufferHeight;
  const stepX = Math.max(1, Math.floor(w / 8));
  const stepY = Math.max(1, Math.floor(h / 8));
  const buf = new Uint8Array(4);
  for (let y = 0; y < h; y += stepY) {
    for (let x = 0; x < w; x += stepX) {
      gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, buf);
      if (buf[0] !== 0 || buf[1] !== 0 || buf[2] !== 0 || buf[3] !== 0) {
        return true;
      }
    }
  }
  return false;
}

export const waitForWebGLToSettle = async () => {
  const deadline = performance.now() + MAX_WAIT_MS;
  while (performance.now() < deadline) {
    if (canvasHasContent()) {
      return;
    }
    // eslint-disable-next-line no-await-in-loop -- polling is inherently sequential
    await new Promise<void>((r) => {
      setTimeout(r, POLL_INTERVAL_MS);
    });
  }
};
