/**
 * Asserts the WebGL canvas actually drew something.
 *
 * The benchmark harness forces `--disable-gpu`; WebGL runs through SwiftShader
 * (software). If the `webgl2` context fails to initialize, `ChartsWebGLLayer`
 * returns early and the chart renders nothing — the bench would still "pass"
 * while measuring an empty canvas. This guard turns that silent failure loud.
 *
 * Reads back the drawing buffer (the layer creates its context with
 * `preserveDrawingBuffer: true`, and `getContext` returns the existing one)
 * and throws if every pixel is fully transparent.
 */
export function expectWebGLCanvasDrawn() {
  const canvas = document.querySelector('canvas');
  if (!canvas) {
    throw new Error('WebGL bench: no <canvas> found in the DOM. The WebGL layer did not mount.');
  }

  const gl = canvas.getContext('webgl2', { preserveDrawingBuffer: true });
  if (!gl) {
    throw new Error(
      'WebGL bench: could not acquire a webgl2 context. ' +
        'The benchmark would measure an empty canvas — failing instead of reporting a false pass.',
    );
  }

  const pixels = new Uint8Array(gl.drawingBufferWidth * gl.drawingBufferHeight * 4);
  gl.readPixels(
    0,
    0,
    gl.drawingBufferWidth,
    gl.drawingBufferHeight,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    pixels,
  );

  if (!pixels.some((v) => v !== 0)) {
    throw new Error(
      'WebGL bench: canvas is empty after render. ' +
        'WebGL produced no output — the benchmark numbers would be meaningless.',
    );
  }
}
