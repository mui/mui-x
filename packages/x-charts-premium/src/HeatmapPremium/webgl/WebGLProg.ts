/**
 * A small abstraction over WebGL programs.
 */
export class WebGLProg {
  readonly program: WebGLProgram;

  constructor(public gl: WebGL2RenderingContext) {
    this.program = gl.createProgram();

    // Enable blending for transparency
    gl.enable(gl.BLEND);
    this.logErrors();

    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    this.logErrors();
  }

  /**
   * Attach a vertex shader to the program. Replaces any existing vertex shader.
   * Remember to link and use the program after attaching.
   * @param source The GLSL source code of the vertex shader.
   */
  attachVertexShader(source: string) {
    return this.attachShader(source, this.gl.VERTEX_SHADER);
  }

  /**
   * Attach a fragment shader to the program. Replaces any existing fragment shader.
   * Remember to link and use the program after attaching.
   * @param source The GLSL source code of the fragment shader.
   */
  attachFragmentShader(source: string) {
    return this.attachShader(source, this.gl.FRAGMENT_SHADER);
  }

  private attachShader(
    source: string,
    shaderType: WebGL2RenderingContext['FRAGMENT_SHADER'] | WebGL2RenderingContext['VERTEX_SHADER'],
  ) {
    const shader = this.gl.createShader(shaderType)!;
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error('Shader compilation error:', this.gl.getShaderInfoLog(shader));
    }

    this.gl.attachShader(this.program, shader);
  }

  /**
   * Link the program after attaching shaders. Remember to use the program after linking.
   */
  link() {
    this.gl.linkProgram(this.program);

    if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
      console.error('Program linking error:', this.gl.getProgramInfoLog(this.program));
    }
  }

  /**
   * Use the program for subsequent WebGL operations.
   */
  use() {
    this.gl.useProgram(this.program);

    this.logErrors();
  }

  /**
   * Logs all current WebGL errors to the console.
   * It is recommended to run this method after significant WebGL operations to catch errors early,
   * as WebGL does not throw exceptions on errors.
   */
  private logErrors() {
    let error = this.gl.getError();
    while (error !== this.gl.NO_ERROR) {
      console.error('WebGL error:', error);
      error = this.gl.getError();
    }
  }
}
