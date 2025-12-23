/**
 * Initializes a WebGL program with given vertex and fragment shader sources.
 */
export function initializeWebGLProgram(
  gl: WebGL2RenderingContext,
  vertexShaderSource: string,
  fragmentShaderSource: string,
) {
  const vertexShader = gl.createShader(gl.VERTEX_SHADER)!;
  gl.shaderSource(vertexShader, vertexShaderSource);
  gl.compileShader(vertexShader);

  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    console.error('Shader compilation error:', gl.getShaderInfoLog(vertexShader));
  }

  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!;
  gl.shaderSource(fragmentShader, fragmentShaderSource);
  gl.compileShader(fragmentShader);

  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    console.error('Shader compilation error:', gl.getShaderInfoLog(fragmentShader));
  }

  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program linking error:', gl.getProgramInfoLog(program));
  }

  gl.useProgram(program);

  if (gl.getError()) {
    console.error('WebGL error during program setup');
  }

  const quadVertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);

  const quadBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, quadVertices, gl.STATIC_DRAW);

  const aPosition = gl.getAttribLocation(program, 'a_position');
  gl.enableVertexAttribArray(aPosition);
  gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

  // Enable blending for transparency
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  return program;
}

export function replaceShader(
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  shaderSource: string,
  shaderType: WebGL2RenderingContext['FRAGMENT_SHADER'] | WebGL2RenderingContext['VERTEX_SHADER'],
) {
  const shader = gl.createShader(shaderType)!;
  gl.shaderSource(shader, shaderSource);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
  }

  const shaders = gl.getAttachedShaders(program) ?? [];

  // Detach old shader of this type
  shaders.forEach((attachedShader) => {
    if (gl.getShaderParameter(attachedShader, gl.SHADER_TYPE) === shaderType) {
      gl.detachShader(program, attachedShader);
      gl.deleteShader(attachedShader);
    }
  });

  gl.attachShader(program, shader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program linking error:', gl.getProgramInfoLog(program));
  }
}
