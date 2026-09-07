import {
  bindQuadBuffer,
  linkProgram,
  logWebGLErrors,
  setupStandardBlending,
  uploadGrowableBuffer,
  uploadQuadBuffer,
} from '../../utils/webgl/utils';
import type { InstancedAttribute } from '../../utils/webgl/instancedAttribute';
import { createInstancedAttribute } from '../../utils/webgl/instancedAttribute';
import { barFragmentShaderSource, barVertexShaderSource } from './shaders';
import type { BarWebGLPlotData } from './useBarWebGLPlotData';

export class BarWebGLProgram {
  private readonly shaders: WebGLShader[] = [];

  private readonly program: WebGLProgram;
  private readonly vao: WebGLVertexArrayObject;
  private readonly quadBuffer: WebGLBuffer;

  private readonly centers: InstancedAttribute;
  private readonly halfSizes: InstancedAttribute;
  /* Colors come in as Uint8 [0, 255]; normalized=true makes the GPU read them back as vec4 in [0, 1]. */
  private readonly colors: InstancedAttribute;
  private readonly cornerRadii: InstancedAttribute;

  private readonly uResolution: WebGLUniformLocation | null;

  constructor(private gl: WebGL2RenderingContext) {
    setupStandardBlending(gl);

    const linked = linkProgram(gl, barVertexShaderSource, barFragmentShaderSource);
    this.program = linked.program;
    this.shaders.push(...linked.shaders);

    this.uResolution = gl.getUniformLocation(this.program, 'u_resolution');

    this.quadBuffer = uploadQuadBuffer(gl);
    this.vao = gl.createVertexArray();
    gl.bindVertexArray(this.vao);

    bindQuadBuffer(gl, this.program, this.quadBuffer);
    this.centers = createInstancedAttribute(gl, this.program, 'a_center', 2);
    this.halfSizes = createInstancedAttribute(gl, this.program, 'a_halfSize', 2);
    this.colors = createInstancedAttribute(gl, this.program, 'a_color', 4, gl.UNSIGNED_BYTE, true);
    this.cornerRadii = createInstancedAttribute(gl, this.program, 'a_cornerRadii', 4);

    gl.bindVertexArray(null);
  }

  setResolution(width: number, height: number) {
    this.gl.useProgram(this.program);
    this.gl.uniform2f(this.uResolution, width, height);
  }

  plot(plotData: BarWebGLPlotData) {
    const gl = this.gl;
    uploadGrowableBuffer(gl, this.centers.buffer, plotData.centers);
    uploadGrowableBuffer(gl, this.halfSizes.buffer, plotData.halfSizes);
    uploadGrowableBuffer(gl, this.colors.buffer, plotData.colors);
    uploadGrowableBuffer(gl, this.cornerRadii.buffer, plotData.cornerRadii);
    logWebGLErrors(gl);
  }

  render(count: number) {
    if (count === 0) {
      return;
    }
    const gl = this.gl;
    gl.useProgram(this.program);
    gl.bindVertexArray(this.vao);
    gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, count);
    gl.bindVertexArray(null);
  }

  dispose() {
    const gl = this.gl;
    gl.deleteProgram(this.program);
    gl.deleteVertexArray(this.vao);
    gl.deleteBuffer(this.quadBuffer);
    gl.deleteBuffer(this.centers.buffer.buffer);
    gl.deleteBuffer(this.halfSizes.buffer.buffer);
    gl.deleteBuffer(this.colors.buffer.buffer);
    gl.deleteBuffer(this.cornerRadii.buffer.buffer);
    this.shaders.forEach((shader) => gl.deleteShader(shader));
  }
}
