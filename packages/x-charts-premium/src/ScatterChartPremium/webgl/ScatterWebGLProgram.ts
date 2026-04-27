import { compileShader, logWebGLErrors } from '../../utils/webgl/utils';
import { scatterVertexShader, scatterFragmentShader } from './shaders';
import { type ScatterWebGLPlotData } from './useScatterWebGLPlotData';

const QUAD_VERTICES = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);

interface InstancedBuffer {
  buffer: WebGLBuffer;
  size: 1 | 2 | 4;
  glType: GLenum;
  // Capacity is tracked in bytes so attributes with different element types
  // (Float32 vs Uint8) reuse the grow-only logic without comparing apples to oranges.
  capacityBytes: number;
  lastUploaded: ArrayBufferView | null;
}

export class ScatterWebGLProgram {
  private readonly shaders: WebGLShader[] = [];
  private readonly quadBuffer: WebGLBuffer;

  private readonly program: WebGLProgram;
  private readonly vao: WebGLVertexArrayObject;
  private readonly centers: InstancedBuffer;
  private readonly sizes: InstancedBuffer;
  private readonly colors: InstancedBuffer;

  constructor(private gl: WebGL2RenderingContext) {
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    this.quadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quadBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, QUAD_VERTICES, gl.STATIC_DRAW);

    const prog = initializeProgram(gl, scatterVertexShader, scatterFragmentShader);
    this.program = prog.program;
    this.shaders.push(prog.vertexShader, prog.fragmentShader);

    this.vao = gl.createVertexArray();
    gl.bindVertexArray(this.vao);

    // a_position references the shared quad; bind it once while the VAO is active.
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quadBuffer);
    const aPosition = gl.getAttribLocation(this.program, 'a_position');
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

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
    this.uploadBuffer(this.centers, plotData.centers);
    this.uploadBuffer(this.sizes, plotData.sizes);
    this.uploadBuffer(this.colors, plotData.colors);
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

  // Assumes the owning VAO is already bound.
  private setupInstancedAttribute(
    name: string,
    size: 1 | 2 | 4,
    glType: GLenum,
    normalized: boolean,
  ): InstancedBuffer {
    const { gl, program } = this;
    const buffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    const location = gl.getAttribLocation(program, name);
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location, size, glType, normalized, 0, 0);
    gl.vertexAttribDivisor(location, 1);

    return { buffer, size, glType, capacityBytes: 0, lastUploaded: null };
  }

  private uploadBuffer(target: InstancedBuffer, data: ArrayBufferView) {
    if (target.lastUploaded === data) {
      return;
    }
    const { gl } = this;
    gl.bindBuffer(gl.ARRAY_BUFFER, target.buffer);

    if (data.byteLength <= target.capacityBytes) {
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, data);
    } else {
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);
      target.capacityBytes = data.byteLength;
    }
    target.lastUploaded = data;
  }
}

function initializeProgram(
  gl: WebGL2RenderingContext,
  vertexShaderSource: string,
  fragmentShaderSource: string,
) {
  const program = gl.createProgram();
  const vertexShader = compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
  const fragmentShader = compileShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(`Program linking failed: ${gl.getProgramInfoLog(program)}`);
    console.error(`Vertex shader info-log: ${gl.getShaderInfoLog(vertexShader)}`);
    console.error(`Fragment shader info-log: ${gl.getShaderInfoLog(fragmentShader)}`);
  }

  return { program, vertexShader, fragmentShader };
}
