export function compileShader(
  gl: WebGL2RenderingContext,
  shaderSource: string,
  shaderType: WebGL2RenderingContext['FRAGMENT_SHADER'] | WebGL2RenderingContext['VERTEX_SHADER'],
) {
  const shader = gl.createShader(shaderType)!;
  gl.shaderSource(shader, shaderSource);
  gl.compileShader(shader);

  return shader;
}

export function uploadQuadBuffer(gl: WebGL2RenderingContext) {
  const quadVertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, quadVertices, gl.STATIC_DRAW);

  return buffer;
}

export function bindQuadBuffer(
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  quadBuffer: WebGLBuffer,
) {
  gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);

  const aPosition = gl.getAttribLocation(program, 'a_position');
  gl.enableVertexAttribArray(aPosition);
  gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
}

export function attachShader(
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  shaderSource: string,
  shaderType: WebGL2RenderingContext['FRAGMENT_SHADER'] | WebGL2RenderingContext['VERTEX_SHADER'],
) {
  const shader = gl.createShader(shaderType)!;
  gl.shaderSource(shader, shaderSource);
  gl.compileShader(shader);

  gl.attachShader(program, shader);

  return shader;
}

export type GrowableBuffer = {
  buffer: WebGLBuffer;
  /* Highest byte length ever uploaded; lets us reuse the GPU allocation via bufferSubData. */
  capacity: number;
  /* Identity of the last uploaded view — uploads short-circuit when the same ref comes back. */
  lastUploaded: ArrayBufferView | null;
};

export function createGrowableBuffer(gl: WebGL2RenderingContext): GrowableBuffer {
  return { buffer: gl.createBuffer(), capacity: 0, lastUploaded: null };
}

/**
 * Uploads `data` into `target.buffer`. Reuses the existing GPU allocation via
 * `bufferSubData` while the size fits, only re-allocating with `bufferData` when
 * the data grows past the previous high-water mark. Skips the upload entirely
 * when the same typed-array reference is passed twice in a row.
 */
export function uploadGrowableBuffer(
  gl: WebGL2RenderingContext,
  target: GrowableBuffer,
  data: ArrayBufferView,
) {
  if (target.lastUploaded === data) {
    return;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, target.buffer);
  if (data.byteLength <= target.capacity) {
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, data);
  } else {
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);
    target.capacity = data.byteLength;
  }
  target.lastUploaded = data;
}

/**
 * Logs WebGL errors to the console in development mode.
 */
export function logWebGLErrors(gl: WebGL2RenderingContext) {
  /* Only log errors in dev because it has a performance cost:
   * https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices#avoid_blocking_api_calls_in_production */
  if (process.env.NODE_ENV !== 'production') {
    let error = gl.getError();

    while (error !== gl.NO_ERROR) {
      console.error('WebGL error:', error);
      error = gl.getError();
    }
  }
}
