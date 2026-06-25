import {
  bindQuadBuffer,
  linkProgram,
  logWebGLErrors,
  setupStandardBlending,
  uploadQuadBuffer,
} from '../../utils/webgl/utils';
import {
  type InstancedAttribute,
  createInstancedAttribute,
  uploadInstancedAttribute,
} from '../../utils/webgl/instancedAttribute';
import { scatterVertexShader, scatterFragmentShader } from './shaders';
import type { ScatterWebGLPlotData } from './useScatterWebGLPlotData';

export class ScatterWebGLProgram {
  private readonly shaders: WebGLShader[];
  private readonly quadBuffer: WebGLBuffer;

  private readonly program: WebGLProgram;
  private readonly vao: WebGLVertexArrayObject;
  private readonly centers: InstancedAttribute;
  private readonly sizes: InstancedAttribute;
  /* Colors come in as Uint8 [0, 255]; normalized=true makes the GPU read them back as vec4 in [0, 1]. */
  private readonly colors: InstancedAttribute;

  constructor(private gl: WebGL2RenderingContext) {
    setupStandardBlending(gl);

    const linked = linkProgram(gl, scatterVertexShader, scatterFragmentShader);
    this.program = linked.program;
    this.shaders = linked.shaders;

    this.quadBuffer = uploadQuadBuffer(gl);
    this.vao = gl.createVertexArray();
    gl.bindVertexArray(this.vao);

    bindQuadBuffer(gl, this.program, this.quadBuffer);
    this.centers = createInstancedAttribute(gl, this.program, 'a_center', 2);
    this.sizes = createInstancedAttribute(gl, this.program, 'a_size', 1);
    this.colors = createInstancedAttribute(gl, this.program, 'a_color', 4, gl.UNSIGNED_BYTE, true);

    gl.bindVertexArray(null);
  }

  setResolution(width: number, height: number) {
    const { gl } = this;
    gl.useProgram(this.program);
    gl.uniform2f(gl.getUniformLocation(this.program, 'u_resolution'), width, height);
  }

  plot(plotData: ScatterWebGLPlotData) {
    const { gl } = this;
    uploadInstancedAttribute(gl, this.centers, plotData.centers);
    uploadInstancedAttribute(gl, this.sizes, plotData.sizes);
    uploadInstancedAttribute(gl, this.colors, plotData.colors);
  }

  render(plotData: ScatterWebGLPlotData) {
    if (plotData.pointCount === 0) {
      return;
    }
    const { gl } = this;
    gl.useProgram(this.program);
    logWebGLErrors(gl);
    gl.bindVertexArray(this.vao);
    gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, plotData.pointCount);
    gl.bindVertexArray(null);
  }

  dispose() {
    const { gl } = this;
    gl.deleteProgram(this.program);
    gl.deleteVertexArray(this.vao);
    gl.deleteBuffer(this.centers.buffer.buffer);
    gl.deleteBuffer(this.sizes.buffer.buffer);
    gl.deleteBuffer(this.colors.buffer.buffer);
    gl.deleteBuffer(this.quadBuffer);
    this.shaders.forEach((shader) => gl.deleteShader(shader));
  }
}
