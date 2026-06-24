import { compileShader, logWebGLErrors, uploadQuadBuffer } from '../../utils/webgl/utils';
import { barFragmentShaderSource, barVertexShaderSource } from './shaders';
import type { BarWebGLPlotData } from './useBarWebGLPlotData';

interface InstancedBuffer {
  buffer: WebGLBuffer;
  // Tracked in bytes so attributes with different element types (Float32 vs
  // Uint8) reuse the grow-only logic without comparing apples to oranges.
  capacityBytes: number;
  lastUploaded: ArrayBufferView | null;
  location: number;
  size: number;
  glType: GLenum;
  normalized: boolean;
}

export class BarWebGLProgram {
  private readonly shaders: WebGLShader[] = [];

  private readonly program: WebGLProgram;
  private readonly vao: WebGLVertexArrayObject;
  private readonly quadBuffer: WebGLBuffer;
  private readonly aPositionLocation: number;

  private readonly centersBuffer: InstancedBuffer;
  private readonly halfSizesBuffer: InstancedBuffer;
  private readonly colorsBuffer: InstancedBuffer;
  private readonly cornerRadiiBuffer: InstancedBuffer;

  private readonly uResolution: WebGLUniformLocation | null;

  constructor(private gl: WebGL2RenderingContext) {
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    this.program = gl.createProgram();
    const vertexShader = compileShader(gl, barVertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(gl, barFragmentShaderSource, gl.FRAGMENT_SHADER);
    gl.attachShader(this.program, vertexShader);
    gl.attachShader(this.program, fragmentShader);
    gl.linkProgram(this.program);
    this.shaders.push(vertexShader, fragmentShader);

    if (
      process.env.NODE_ENV !== 'production' &&
      !gl.getProgramParameter(this.program, gl.LINK_STATUS)
    ) {
      console.error(`Program linking failed: ${gl.getProgramInfoLog(this.program)}`);
      console.error(`Vertex info-log: ${gl.getShaderInfoLog(vertexShader)}`);
      console.error(`Fragment info-log: ${gl.getShaderInfoLog(fragmentShader)}`);
    }

    // Cache locations once.
    this.uResolution = gl.getUniformLocation(this.program, 'u_resolution');
    this.aPositionLocation = gl.getAttribLocation(this.program, 'a_position');

    this.quadBuffer = uploadQuadBuffer(gl);
    this.vao = gl.createVertexArray();

    this.centersBuffer = createInstancedBuffer(gl, this.program, 'a_center', 2, gl.FLOAT, false);
    this.halfSizesBuffer = createInstancedBuffer(
      gl,
      this.program,
      'a_halfSize',
      2,
      gl.FLOAT,
      false,
    );
    // Colors come in as Uint8 [0, 255]; normalized=true makes the GPU read them back as vec4 in [0, 1].
    this.colorsBuffer = createInstancedBuffer(
      gl,
      this.program,
      'a_color',
      4,
      gl.UNSIGNED_BYTE,
      true,
    );
    this.cornerRadiiBuffer = createInstancedBuffer(
      gl,
      this.program,
      'a_cornerRadii',
      4,
      gl.FLOAT,
      false,
    );
  }

  setResolution(width: number, height: number) {
    this.gl.useProgram(this.program);
    this.gl.uniform2f(this.uResolution, width, height);
  }

  plot(plotData: BarWebGLPlotData) {
    const gl = this.gl;
    gl.useProgram(this.program);
    gl.bindVertexArray(this.vao);

    // Bind quad buffer + a_position (per-vertex).
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quadBuffer);
    gl.enableVertexAttribArray(this.aPositionLocation);
    gl.vertexAttribPointer(this.aPositionLocation, 2, gl.FLOAT, false, 0, 0);

    uploadAndBindInstanced(gl, this.centersBuffer, plotData.centers);
    uploadAndBindInstanced(gl, this.halfSizesBuffer, plotData.halfSizes);
    uploadAndBindInstanced(gl, this.colorsBuffer, plotData.colors);
    uploadAndBindInstanced(gl, this.cornerRadiiBuffer, plotData.cornerRadii);

    gl.bindVertexArray(null);
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
}

function createInstancedBuffer(
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  name: string,
  size: number,
  glType: GLenum,
  normalized: boolean,
): InstancedBuffer {
  return {
    buffer: gl.createBuffer(),
    capacityBytes: 0,
    lastUploaded: null,
    location: gl.getAttribLocation(program, name),
    size,
    glType,
    normalized,
  };
}

function uploadAndBindInstanced(
  gl: WebGL2RenderingContext,
  target: InstancedBuffer,
  data: ArrayBufferView,
) {
  gl.bindBuffer(gl.ARRAY_BUFFER, target.buffer);

  if (target.lastUploaded !== data) {
    if (data.byteLength <= target.capacityBytes) {
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, data);
    } else {
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);
      target.capacityBytes = data.byteLength;
    }
    target.lastUploaded = data;
  }

  gl.enableVertexAttribArray(target.location);
  gl.vertexAttribPointer(target.location, target.size, target.glType, target.normalized, 0, 0);
  gl.vertexAttribDivisor(target.location, 1);
}
