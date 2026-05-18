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

/** Enables the standard non-premultiplied src-alpha blending used by all premium WebGL renderers. */
export function setupStandardBlending(gl: WebGL2RenderingContext) {
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
}

/**
 * Returns `existing` when it's large enough to hold `length` elements, otherwise
 * allocates a fresh typed array via `Ctor`. Lets consumers keep one ref per
 * pool and short-circuit growth checks inline.
 */
export function ensurePool<T extends { length: number }>(
  existing: T | null | undefined,
  length: number,
  Ctor: new (length: number) => T,
): T {
  if (existing != null && existing.length >= length) {
    return existing;
  }
  return new Ctor(length);
}

export interface LinkedProgram {
  program: WebGLProgram;
  /** The vertex + fragment shaders that were attached. Hold them so dispose() can delete them. */
  shaders: WebGLShader[];
}

/**
 * Compiles vertex + fragment shaders, attaches them, links the program, and returns
 * both the program and its shaders. Logs link/compile diagnostics in dev when linking fails.
 *
 * Per WebGL best-practices, the compile/link status is only consulted in development:
 * https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices#dont_check_shader_compile_status_unless_linking_fails
 */
export function linkProgram(
  gl: WebGL2RenderingContext,
  vertexShaderSource: string,
  fragmentShaderSource: string,
): LinkedProgram {
  const program = gl.createProgram();
  const vertexShader = compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
  const fragmentShader = compileShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (process.env.NODE_ENV !== 'production' && !gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(`Program linking failed: ${gl.getProgramInfoLog(program)}`);
    console.error(`Vertex shader info-log: ${gl.getShaderInfoLog(vertexShader)}`);
    console.error(`Fragment shader info-log: ${gl.getShaderInfoLog(fragmentShader)}`);
  }

  return { program, shaders: [vertexShader, fragmentShader] };
}
