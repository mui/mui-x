import {
  type GrowableBuffer,
  bindAttribute,
  createGrowableBuffer,
  createLinkedProgram,
  enableAlphaBlending,
  logWebGLErrors,
  uploadGrowableBuffer,
  uploadQuadBuffer,
} from '../../utils/webgl/utils';
import { scatterVertexShader, scatterFragmentShader } from './shaders';
import { type ScatterWebGLPlotData } from './useScatterWebGLPlotData';

export class ScatterWebGLProgram {
  private readonly shaders: WebGLShader[] = [];
  private readonly quadBuffer: WebGLBuffer;

  private readonly program: WebGLProgram;
  private readonly vao: WebGLVertexArrayObject;
  private readonly centers: GrowableBuffer;
  private readonly sizes: GrowableBuffer;
  private readonly colors: GrowableBuffer;

  constructor(private gl: WebGL2RenderingContext) {
    enableAlphaBlending(gl);

    this.quadBuffer = uploadQuadBuffer(gl);

    const prog = createLinkedProgram(gl, scatterVertexShader, scatterFragmentShader);
    this.program = prog.program;
    this.shaders.push(prog.vertexShader, prog.fragmentShader);

    this.vao = gl.createVertexArray();
    gl.bindVertexArray(this.vao);

    // a_position references the shared quad; bind it once while the VAO is active.
    bindAttribute(gl, this.program, 'a_position', this.quadBuffer, 2, 0);

    this.centers = this.setupInstancedAttribute('a_center', 2, gl.FLOAT, false);
    this.sizes = this.setupInstancedAttribute('a_size', 1, gl.FLOAT, false);
    // Colors come in as Uint8 [0, 255]; normalized=true makes the GPU read them back as vec4 in [0, 1].
    this.colors = this.setupInstancedAttribute('a_color', 4, gl.UNSIGNED_BYTE, true);

    gl.bindVertexArray(null);
  }

  setResolution(width: number, height: number) {
    const { gl } = this;
    gl.useProgram(this.program);
    gl.uniform2f(gl.getUniformLocation(this.program, 'u_resolution'), width, height);
  }

  plot(plotData: ScatterWebGLPlotData) {
    const { gl } = this;
    uploadGrowableBuffer(gl, this.centers, plotData.centers);
    uploadGrowableBuffer(gl, this.sizes, plotData.sizes);
    uploadGrowableBuffer(gl, this.colors, plotData.colors);
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
    gl.deleteBuffer(this.centers.buffer);
    gl.deleteBuffer(this.sizes.buffer);
    gl.deleteBuffer(this.colors.buffer);
    gl.deleteBuffer(this.quadBuffer);
    this.shaders.forEach((shader) => gl.deleteShader(shader));
  }

  // Assumes the owning VAO (Vertex Array Object) is already bound.
  private setupInstancedAttribute(
    name: string,
    size: 1 | 2 | 4,
    glType: GLenum,
    normalized: boolean,
  ): GrowableBuffer {
    const { gl, program } = this;
    const target = createGrowableBuffer(gl);
    bindAttribute(gl, program, name, target.buffer, size, 1, glType, normalized);
    return target;
  }
}
