import {
  bindQuadBuffer,
  createGrowableBuffer,
  linkProgram,
  logWebGLErrors,
  setupStandardBlending,
  uploadGrowableBuffer,
  uploadQuadBuffer,
} from '../../utils/webgl/utils';
import { bindInstancedAttribute } from '../../utils/webgl/instancedAttribute';
import type { GrowableBuffer } from '../../utils/webgl/utils';
import {
  heatmapFragmentShaderSourceNoBorderRadius,
  heatmapFragmentShaderSourceWithBorderRadius,
  heatmapVertexShaderSource,
} from './shaders';

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
    /* These are global to the WebGL context and need to be set only once. */
    setupStandardBlending(gl);

    this.quadBuffer = uploadQuadBuffer(gl);

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
    const linked = linkProgram(gl, heatmapVertexShaderSource, fragmentShaderSource);
    this.shaders.push(...linked.shaders);
    const program = linked.program;

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    bindQuadBuffer(gl, program, this.quadBuffer);
    bindInstancedAttribute(gl, program, 'a_center', this.centers, 2);
    /* Colors are uploaded as Uint8(Clamped)Array; shader sees normalized [0, 1] floats. */
    bindInstancedAttribute(gl, program, 'a_color', this.colors, 4, gl.UNSIGNED_BYTE, true);
    bindInstancedAttribute(gl, program, 'a_saturation', this.saturations, 1);
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
