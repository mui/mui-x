import {
  type GrowableBuffer,
  compileShader,
  createGrowableBuffer,
  logWebGLErrors,
  uploadGrowableBuffer,
} from '../utils/webgl/utils';
import { candleFragmentShader, candleVertexShader } from './candleShaders';
import { wickFragmentShader, wickVertexShader } from './wickShaders';
import { type CandlestickPlotData } from './useCandlestickPlotData';

const QUAD_VERTICES = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
const WICK_VERTICES = new Float32Array([0, -1, 0, 1]);

type CandleProgram = {
  program: WebGLProgram;
  vao: WebGLVertexArrayObject;
  centers: GrowableBuffer;
  heights: GrowableBuffer;
  colors: GrowableBuffer;
  uResolution: WebGLUniformLocation | null;
  uCandleWidth: WebGLUniformLocation | null;
};

type WickProgram = {
  program: WebGLProgram;
  vao: WebGLVertexArrayObject;
  centers: GrowableBuffer;
  heights: GrowableBuffer;
  colors: GrowableBuffer;
  uResolution: WebGLUniformLocation | null;
  uCandleWidth: WebGLUniformLocation | null;
};

export class CandlestickWebGLProgram {
  private readonly shaders: WebGLShader[] = [];

  private readonly quadBuffer: WebGLBuffer;

  private readonly wickGeometryBuffer: WebGLBuffer;

  private readonly candle: CandleProgram;

  private readonly wick: WickProgram;

  constructor(private gl: WebGL2RenderingContext) {
    /* Enable blending for transparency
     * These are global to the WebGL context and need to be set only once */
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    /* Shared, write-once geometry buffers */
    this.quadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quadBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, QUAD_VERTICES, gl.STATIC_DRAW);

    this.wickGeometryBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.wickGeometryBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, WICK_VERTICES, gl.STATIC_DRAW);

    this.candle = this.initCandleProgram();
    this.wick = this.initWickProgram();
  }

  private initCandleProgram(): CandleProgram {
    const gl = this.gl;
    const { program, fragmentShader, vertexShader } = initializeProgram(
      gl,
      candleVertexShader,
      candleFragmentShader,
    );
    this.shaders.push(fragmentShader, vertexShader);

    const vao = gl.createVertexArray();
    const centers = createGrowableBuffer(gl);
    const heights = createGrowableBuffer(gl);
    const colors = createGrowableBuffer(gl);

    gl.bindVertexArray(vao);

    /* Quad geometry — shared, instanced over per-candle attributes. */
    bindAttribute(gl, program, 'a_position', this.quadBuffer, 2, 0);

    bindAttribute(gl, program, 'a_center', centers.buffer, 2, 1);
    bindAttribute(gl, program, 'a_height', heights.buffer, 1, 1);
    /* Colors live in a Uint8(Clamped)Array — 1 byte per channel, normalized to [0, 1]
     * in the shader. 4x less GPU traffic than Float32 RGBA. */
    bindAttribute(gl, program, 'a_color', colors.buffer, 4, 1, gl.UNSIGNED_BYTE, true);

    gl.bindVertexArray(null);

    return {
      program,
      vao,
      centers,
      heights,
      colors,
      uResolution: gl.getUniformLocation(program, 'u_resolution'),
      uCandleWidth: gl.getUniformLocation(program, 'u_candle_width'),
    };
  }

  private initWickProgram(): WickProgram {
    const gl = this.gl;
    const { program, fragmentShader, vertexShader } = initializeProgram(
      gl,
      wickVertexShader,
      wickFragmentShader,
    );
    this.shaders.push(fragmentShader, vertexShader);

    const vao = gl.createVertexArray();
    const centers = createGrowableBuffer(gl);
    const heights = createGrowableBuffer(gl);
    const colors = createGrowableBuffer(gl);

    gl.bindVertexArray(vao);

    bindAttribute(gl, program, 'a_position', this.wickGeometryBuffer, 2, 0);

    bindAttribute(gl, program, 'a_center', centers.buffer, 2, 1);
    bindAttribute(gl, program, 'a_height', heights.buffer, 1, 1);
    bindAttribute(gl, program, 'a_wick_color', colors.buffer, 4, 1, gl.UNSIGNED_BYTE, true);

    gl.bindVertexArray(null);

    return {
      program,
      vao,
      centers,
      heights,
      colors,
      uResolution: gl.getUniformLocation(program, 'u_resolution'),
      uCandleWidth: gl.getUniformLocation(program, 'u_candle_width'),
    };
  }

  setResolution(width: number, height: number) {
    this.gl.useProgram(this.candle.program);
    this.gl.uniform2f(this.candle.uResolution, width, height);

    this.gl.useProgram(this.wick.program);
    this.gl.uniform2f(this.wick.uResolution, width, height);
  }

  setCandleWidth(candleWidth: number) {
    this.gl.useProgram(this.candle.program);
    this.gl.uniform1f(this.candle.uCandleWidth, candleWidth);

    this.gl.useProgram(this.wick.program);
    this.gl.uniform1f(this.wick.uCandleWidth, candleWidth);
  }

  plot(plotData: CandlestickPlotData) {
    const { gl } = this;
    const { candleCenters, candleHeights, wickCenters, wickHeights, candleColors, wickColors } =
      plotData;

    uploadGrowableBuffer(gl, this.candle.centers, candleCenters);
    uploadGrowableBuffer(gl, this.candle.heights, candleHeights);
    uploadGrowableBuffer(gl, this.candle.colors, candleColors);

    uploadGrowableBuffer(gl, this.wick.centers, wickCenters);
    uploadGrowableBuffer(gl, this.wick.heights, wickHeights);
    uploadGrowableBuffer(gl, this.wick.colors, wickColors);
  }

  render(dataLength: number) {
    if (dataLength === 0) {
      return;
    }
    const { gl } = this;

    gl.useProgram(this.wick.program);
    gl.bindVertexArray(this.wick.vao);
    gl.drawArraysInstanced(gl.LINES, 0, 2, dataLength * 2);
    logWebGLErrors(gl);

    gl.useProgram(this.candle.program);
    gl.bindVertexArray(this.candle.vao);
    gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, dataLength);
    logWebGLErrors(gl);
  }

  dispose() {
    const { gl } = this;
    gl.deleteBuffer(this.quadBuffer);
    gl.deleteBuffer(this.wickGeometryBuffer);

    gl.deleteProgram(this.candle.program);
    gl.deleteVertexArray(this.candle.vao);
    gl.deleteBuffer(this.candle.centers.buffer);
    gl.deleteBuffer(this.candle.heights.buffer);
    gl.deleteBuffer(this.candle.colors.buffer);

    gl.deleteProgram(this.wick.program);
    gl.deleteVertexArray(this.wick.vao);
    gl.deleteBuffer(this.wick.centers.buffer);
    gl.deleteBuffer(this.wick.heights.buffer);
    gl.deleteBuffer(this.wick.colors.buffer);

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
) {
  const program = gl.createProgram();
  const vertexShader = compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
  const fragmentShader = compileShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);
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

  return { program, vertexShader, fragmentShader };
}
