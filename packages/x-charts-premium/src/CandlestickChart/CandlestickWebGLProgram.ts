import {
  type GrowableBuffer,
  compileShader,
  createGrowableBuffer,
  logWebGLErrors,
  uploadGrowableBuffer,
} from '../utils/webgl/utils';
import { candleFragmentShader, candleVertexShader } from './candleShaders';
import { type CandlestickPlotData } from './useCandlestickPlotData';

const QUAD_VERTICES = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
/* The wick's a_position.x is 0, so the vertex shader's `a_position.x * u_candle_width`
 * term vanishes for wicks — the candle shader produces correct wick geometry. */
const WICK_VERTICES = new Float32Array([0, -1, 0, 1]);

type InstanceBuffers = {
  vao: WebGLVertexArrayObject;
  centers: GrowableBuffer;
  heights: GrowableBuffer;
  colors: GrowableBuffer;
};

export class CandlestickWebGLProgram {
  private readonly shaders: WebGLShader[] = [];

  private readonly program: WebGLProgram;

  private readonly quadBuffer: WebGLBuffer;

  private readonly wickGeometryBuffer: WebGLBuffer;

  private readonly candle: InstanceBuffers;

  private readonly wick: InstanceBuffers;

  private readonly uResolution: WebGLUniformLocation | null;

  private readonly uCandleWidth: WebGLUniformLocation | null;

  constructor(private gl: WebGL2RenderingContext) {
    /* Global to the WebGL context; set once. */
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    this.quadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quadBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, QUAD_VERTICES, gl.STATIC_DRAW);

    this.wickGeometryBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.wickGeometryBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, WICK_VERTICES, gl.STATIC_DRAW);

    this.program = initializeProgram(gl, candleVertexShader, candleFragmentShader, this.shaders);

    this.uResolution = gl.getUniformLocation(this.program, 'u_resolution');
    this.uCandleWidth = gl.getUniformLocation(this.program, 'u_candle_width');

    this.candle = this.initInstanceBuffers(this.quadBuffer);
    this.wick = this.initInstanceBuffers(this.wickGeometryBuffer);
  }

  private initInstanceBuffers(geometryBuffer: WebGLBuffer): InstanceBuffers {
    const { gl, program } = this;
    const vao = gl.createVertexArray();
    const centers = createGrowableBuffer(gl);
    const heights = createGrowableBuffer(gl);
    const colors = createGrowableBuffer(gl);

    gl.bindVertexArray(vao);
    bindAttribute(gl, program, 'a_position', geometryBuffer, 2, 0);
    bindAttribute(gl, program, 'a_center', centers.buffer, 2, 1);
    bindAttribute(gl, program, 'a_height', heights.buffer, 1, 1);
    /* Colors live in a Uint8(Clamped)Array — 1 byte per channel, normalized to [0, 1]
     * in the shader. 4x less GPU traffic than Float32 RGBA. */
    bindAttribute(gl, program, 'a_color', colors.buffer, 4, 1, gl.UNSIGNED_BYTE, true);
    gl.bindVertexArray(null);

    return { vao, centers, heights, colors };
  }

  setResolution(width: number, height: number) {
    this.gl.useProgram(this.program);
    this.gl.uniform2f(this.uResolution, width, height);
  }

  setCandleWidth(candleWidth: number) {
    this.gl.useProgram(this.program);
    this.gl.uniform1f(this.uCandleWidth, candleWidth);
  }

  plot(plotData: CandlestickPlotData) {
    if (plotData.candleCenters.length === 0) {
      return;
    }
    const { gl } = this;
    uploadGrowableBuffer(gl, this.candle.centers, plotData.candleCenters);
    uploadGrowableBuffer(gl, this.candle.heights, plotData.candleHeights);
    uploadGrowableBuffer(gl, this.candle.colors, plotData.candleColors);
    uploadGrowableBuffer(gl, this.wick.centers, plotData.wickCenters);
    uploadGrowableBuffer(gl, this.wick.heights, plotData.wickHeights);
    uploadGrowableBuffer(gl, this.wick.colors, plotData.wickColors);
  }

  render(dataLength: number) {
    if (dataLength === 0) {
      return;
    }
    const { gl } = this;

    gl.useProgram(this.program);

    gl.bindVertexArray(this.wick.vao);
    gl.drawArraysInstanced(gl.LINES, 0, 2, dataLength * 2);

    gl.bindVertexArray(this.candle.vao);
    gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, dataLength);

    logWebGLErrors(gl);
  }

  dispose() {
    const { gl } = this;
    gl.deleteBuffer(this.quadBuffer);
    gl.deleteBuffer(this.wickGeometryBuffer);
    gl.deleteProgram(this.program);

    for (const buffers of [this.candle, this.wick]) {
      gl.deleteVertexArray(buffers.vao);
      gl.deleteBuffer(buffers.centers.buffer);
      gl.deleteBuffer(buffers.heights.buffer);
      gl.deleteBuffer(buffers.colors.buffer);
    }

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

function initializeProgram(
  gl: WebGL2RenderingContext,
  vertexShaderSource: string,
  fragmentShaderSource: string,
  shaderSink: WebGLShader[],
) {
  const program = gl.createProgram();
  const vertexShader = compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
  const fragmentShader = compileShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);
  shaderSink.push(vertexShader, fragmentShader);
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  /* Only inspect link status when linking actually failed; the parameter call stalls the pipeline.
   * https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices#dont_check_shader_compile_status_unless_linking_fails */
  if (process.env.NODE_ENV !== 'production') {
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(`Program linking failed: ${gl.getProgramInfoLog(program)}`);
      console.error(`Vertex shader info-log: ${gl.getShaderInfoLog(vertexShader)}`);
      console.error(`Fragment shader info-log: ${gl.getShaderInfoLog(fragmentShader)}`);
    }
  }

  return program;
}
