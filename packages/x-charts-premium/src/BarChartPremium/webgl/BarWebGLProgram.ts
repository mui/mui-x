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
import { barFragmentShaderSource, barVertexShaderSource } from './shaders';
import { type BarWebGLPlotData } from './useBarWebGLPlotData';

export class BarWebGLProgram {
  private readonly shaders: WebGLShader[] = [];

  private readonly program: WebGLProgram;
  private readonly vao: WebGLVertexArrayObject;
  private readonly quadBuffer: WebGLBuffer;

  private readonly centersBuffer: GrowableBuffer;
  private readonly halfSizesBuffer: GrowableBuffer;
  private readonly colorsBuffer: GrowableBuffer;
  private readonly cornerRadiiBuffer: GrowableBuffer;

  private readonly uResolution: WebGLUniformLocation | null;

  constructor(private gl: WebGL2RenderingContext) {
    enableAlphaBlending(gl);

    const { program, vertexShader, fragmentShader } = createLinkedProgram(
      gl,
      barVertexShaderSource,
      barFragmentShaderSource,
    );
    this.program = program;
    this.shaders.push(vertexShader, fragmentShader);

    this.uResolution = gl.getUniformLocation(this.program, 'u_resolution');

    this.quadBuffer = uploadQuadBuffer(gl);
    this.vao = gl.createVertexArray();
    gl.bindVertexArray(this.vao);

    // a_position references the shared quad (per-vertex); bind it into the VAO once.
    bindAttribute(gl, this.program, 'a_position', this.quadBuffer, 2, 0);

    this.centersBuffer = this.setupInstancedAttribute('a_center', 2, gl.FLOAT, false);
    this.halfSizesBuffer = this.setupInstancedAttribute('a_halfSize', 2, gl.FLOAT, false);
    // Colors come in as Uint8 [0, 255]; normalized=true makes the GPU read them back as vec4 in [0, 1].
    this.colorsBuffer = this.setupInstancedAttribute('a_color', 4, gl.UNSIGNED_BYTE, true);
    this.cornerRadiiBuffer = this.setupInstancedAttribute('a_cornerRadii', 4, gl.FLOAT, false);

    gl.bindVertexArray(null);
  }

  setResolution(width: number, height: number) {
    this.gl.useProgram(this.program);
    this.gl.uniform2f(this.uResolution, width, height);
  }

  plot(plotData: BarWebGLPlotData) {
    const gl = this.gl;
    uploadGrowableBuffer(gl, this.centersBuffer, plotData.centers);
    uploadGrowableBuffer(gl, this.halfSizesBuffer, plotData.halfSizes);
    uploadGrowableBuffer(gl, this.colorsBuffer, plotData.colors);
    uploadGrowableBuffer(gl, this.cornerRadiiBuffer, plotData.cornerRadii);
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
    gl.deleteBuffer(this.centersBuffer.buffer);
    gl.deleteBuffer(this.halfSizesBuffer.buffer);
    gl.deleteBuffer(this.colorsBuffer.buffer);
    gl.deleteBuffer(this.cornerRadiiBuffer.buffer);
    this.shaders.forEach((shader) => gl.deleteShader(shader));
  }

  // Assumes the owning VAO (Vertex Array Object) is already bound.
  private setupInstancedAttribute(
    name: string,
    size: number,
    glType: GLenum,
    normalized: boolean,
  ): GrowableBuffer {
    const { gl, program } = this;
    const target = createGrowableBuffer(gl);
    bindAttribute(gl, program, name, target.buffer, size, 1, glType, normalized);
    return target;
  }
}
