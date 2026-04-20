import { compileShader, logWebGLErrors } from '../../utils/webgl/utils';
import { scatterVertexShader, scatterFragmentShader } from './shaders';
import { type ScatterWebGLPlotData } from './useScatterWebGLPlotData';

const QUAD_VERTICES = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);

interface InstancedBuffer {
  buffer: WebGLBuffer;
  size: 1 | 2 | 4;
  capacity: number;
  lastUploaded: Float32Array | null;
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
    this.centers = this.setupInstancedAttribute('a_center', 2);
    this.sizes = this.setupInstancedAttribute('a_size', 1);
    this.colors = this.setupInstancedAttribute('a_color', 4);
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
    const { gl } = this;
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    if (plotData.pointCount === 0) {
      return;
    }

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

  private setupInstancedAttribute(name: string, size: 1 | 2 | 4): InstancedBuffer {
    const { gl, program, vao } = this;
    const buffer = gl.createBuffer();

    gl.bindVertexArray(vao);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.quadBuffer);
    const aPosition = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    const location = gl.getAttribLocation(program, name);
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0);
    gl.vertexAttribDivisor(location, 1);

    gl.bindVertexArray(null);

    return { buffer, size, capacity: 0, lastUploaded: null };
  }

  private uploadBuffer(target: InstancedBuffer, data: Float32Array) {
    if (target.lastUploaded === data) {
      return;
    }
    const { gl } = this;
    gl.bindBuffer(gl.ARRAY_BUFFER, target.buffer);

    if (data.length <= target.capacity) {
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, data);
    } else {
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);
      target.capacity = data.length;
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
