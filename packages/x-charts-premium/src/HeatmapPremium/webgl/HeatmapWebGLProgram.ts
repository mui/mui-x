import {
  type GrowableBuffer,
  attachShader,
  compileShader,
  createGrowableBuffer,
  logWebGLErrors,
  uploadGrowableBuffer,
} from '../../utils/webgl/utils';
import {
  heatmapFragmentShaderSourceNoBorderRadius,
  heatmapFragmentShaderSourceWithBorderRadius,
  heatmapVertexShaderSource,
} from './shaders';

const QUAD_VERTICES = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);

export interface HeatmapPlotData {
  centers: Float32Array;
  /* RGBA, 1 byte per channel; shader reads normalized [0, 1] floats. */
  colors: Uint8Array;
  saturations: Float32Array;
}

type ProgramVariant = {
  program: WebGLProgram;
  vao: WebGLVertexArrayObject;
  uResolution: WebGLUniformLocation | null;
  uDimensions: WebGLUniformLocation | null;
  uBorderRadius: WebGLUniformLocation | null;
};

export class HeatmapWebGLProgram {
  private readonly shaders: WebGLShader[] = [];

  private readonly quadBuffer: WebGLBuffer;

  private readonly centers: GrowableBuffer;

  private readonly colors: GrowableBuffer;

  private readonly saturations: GrowableBuffer;

  private readonly flatVariant: ProgramVariant;

  private readonly roundedVariant: ProgramVariant;

  private active: ProgramVariant;

  constructor(private gl: WebGL2RenderingContext) {
    /* Enable blending for transparency
     * These are global to the WebGL context and need to be set only once */
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    this.quadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quadBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, QUAD_VERTICES, gl.STATIC_DRAW);

    this.centers = createGrowableBuffer(gl);
    this.colors = createGrowableBuffer(gl);
    this.saturations = createGrowableBuffer(gl);

    /* Two pre-built programs let us swap border-radius on/off without re-linking. */
    this.flatVariant = this.buildVariant(heatmapFragmentShaderSourceNoBorderRadius);
    this.roundedVariant = this.buildVariant(heatmapFragmentShaderSourceWithBorderRadius);
    this.active = this.flatVariant;
  }

  private buildVariant(fragmentShaderSource: string): ProgramVariant {
    const gl = this.gl;
    const program = gl.createProgram();

    const vertexShader = compileShader(gl, heatmapVertexShaderSource, gl.VERTEX_SHADER);
    gl.attachShader(program, vertexShader);
    const fragmentShader = attachShader(gl, program, fragmentShaderSource, gl.FRAGMENT_SHADER);

    gl.linkProgram(program);

    /* https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices#dont_check_shader_compile_status_unless_linking_fails */
    if (process.env.NODE_ENV !== 'production') {
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error(`Program linking failed: ${gl.getProgramInfoLog(program)}`);
        console.error(`Vertex shader info-log: ${gl.getShaderInfoLog(vertexShader)}`);
        console.error(`Fragment shader info-log: ${gl.getShaderInfoLog(fragmentShader)}`);
      }
    }

    this.shaders.push(vertexShader, fragmentShader);

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    bindAttribute(gl, program, 'a_position', this.quadBuffer, 2, 0);
    bindAttribute(gl, program, 'a_center', this.centers.buffer, 2, 1);
    /* Colors are uploaded as Uint8(Clamped)Array; shader sees normalized [0, 1] floats. */
    bindAttribute(gl, program, 'a_color', this.colors.buffer, 4, 1, gl.UNSIGNED_BYTE, true);
    bindAttribute(gl, program, 'a_saturation', this.saturations.buffer, 1, 1);

    gl.bindVertexArray(null);

    return {
      program,
      vao,
      uResolution: gl.getUniformLocation(program, 'u_resolution'),
      uDimensions: gl.getUniformLocation(program, 'u_dimensions'),
      uBorderRadius: gl.getUniformLocation(program, 'u_borderRadius'),
    };
  }

  setBorderRadius(borderRadius: number) {
    this.active = borderRadius > 0 ? this.roundedVariant : this.flatVariant;
    if (this.active.uBorderRadius) {
      this.gl.useProgram(this.active.program);
      this.gl.uniform1f(this.active.uBorderRadius, borderRadius);
    }
  }

  setResolution(width: number, height: number) {
    const { gl } = this;
    gl.useProgram(this.flatVariant.program);
    gl.uniform2f(this.flatVariant.uResolution, width, height);
    gl.useProgram(this.roundedVariant.program);
    gl.uniform2f(this.roundedVariant.uResolution, width, height);
  }

  setRectDimensions(width: number, height: number) {
    const { gl } = this;
    gl.useProgram(this.flatVariant.program);
    gl.uniform2f(this.flatVariant.uDimensions, width, height);
    gl.useProgram(this.roundedVariant.program);
    gl.uniform2f(this.roundedVariant.uDimensions, width, height);
  }

  plot(plotData: HeatmapPlotData) {
    const { gl } = this;
    uploadGrowableBuffer(gl, this.centers, plotData.centers);
    uploadGrowableBuffer(gl, this.colors, plotData.colors);
    uploadGrowableBuffer(gl, this.saturations, plotData.saturations);
  }

  render(dataLength: number) {
    if (dataLength === 0) {
      return;
    }
    const { gl } = this;
    gl.useProgram(this.active.program);
    gl.bindVertexArray(this.active.vao);
    gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, dataLength);
    logWebGLErrors(gl);
  }

  dispose() {
    const { gl } = this;
    gl.deleteBuffer(this.quadBuffer);
    gl.deleteBuffer(this.centers.buffer);
    gl.deleteBuffer(this.colors.buffer);
    gl.deleteBuffer(this.saturations.buffer);

    gl.deleteProgram(this.flatVariant.program);
    gl.deleteVertexArray(this.flatVariant.vao);
    gl.deleteProgram(this.roundedVariant.program);
    gl.deleteVertexArray(this.roundedVariant.vao);

    this.shaders.forEach((shader) => gl.deleteShader(shader));
  }
}

function bindAttribute(
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  name: string,
  buffer: WebGLBuffer,
  size: number,
  divisor: number,
  type: GLenum = gl.FLOAT,
  normalized: boolean = false,
) {
  const location = gl.getAttribLocation(program, name);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.enableVertexAttribArray(location);
  gl.vertexAttribPointer(location, size, type, normalized, 0, 0);
  if (divisor !== 0) {
    gl.vertexAttribDivisor(location, divisor);
  }
}
