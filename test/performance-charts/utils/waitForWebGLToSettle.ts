/**
 * Lets the ChartsWebGLLayer ResizeObserver + canvas init settle deterministically
 * before the harness samples renders. Without this, iterations race and produce
 * different render-event counts.
 *
 * The benchmark harness forces `--disable-gpu`; WebGL runs through SwiftShader
 * (software). On CI under load, the first frame can take well over 100ms to
 * commit — a fixed short delay is flaky for the canvas-empty check.
 *
 * The harness also collects React Profiler render events for every iteration
 * and asserts that all iterations produced the same render-event count. The
 * `requestRender` calls from WebGL plot `useEffect`s land in a tail after
 * mount — if some iterations close their measurement window before that tail
 * lands and others don't, counts diverge. So we wait a deterministic minimum
 * window on every iteration (long enough for those effects to flush) and only
 * poll past that for the slow-draw case.
 *
 * Polling reads pixels back, and `readPixels` forces SwiftShader to
 * synchronously rasterize everything drawn so far — hundreds of ms to seconds
 * per call on big scenes. Callers that don't need the canvas-content check
 * (iterations after the first draw is verified) pass `pollForContent: false`
 * to get just the fixed minimum window without any pixel reads.
 */
const MIN_WAIT_MS = 300;
const MAX_WAIT_MS = 2000;
const POLL_INTERVAL_MS = 50;

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

export const waitForWebGLToSettle = async ({ pollForContent = true } = {}) => {
  const start = performance.now();
  const minDeadline = start + MIN_WAIT_MS;
  const maxDeadline = start + (pollForContent ? MAX_WAIT_MS : MIN_WAIT_MS);
  while (performance.now() < maxDeadline) {
    const now = performance.now();
    if (pollForContent && now >= minDeadline && canvasHasContent()) {
      return;
    }
    // eslint-disable-next-line no-await-in-loop -- polling is inherently sequential
    await new Promise<void>((r) => {
      setTimeout(r, POLL_INTERVAL_MS);
    });
  }
};
