import {
  type GrowableBuffer,
  bindAttribute,
  createGrowableBuffer,
  createLinkedProgram,
  enableAlphaBlending,
  logWebGLErrors,
  uploadGrowableBuffer,
  uploadQuadBuffer,
} from '../utils/webgl/utils';
import { candleFragmentShader, candleVertexShader } from './candleShaders';
import { wickFragmentShader, wickVertexShader } from './wickShaders';
import { type CandlestickPlotData } from './useCandlestickPlotData';

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
    enableAlphaBlending(gl);

    /* Shared, write-once geometry buffers */
    this.quadBuffer = uploadQuadBuffer(gl);

    this.wickGeometryBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.wickGeometryBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, WICK_VERTICES, gl.STATIC_DRAW);

    this.candle = this.initCandleProgram();
    this.wick = this.initWickProgram();
  }

  private initCandleProgram(): CandleProgram {
    const gl = this.gl;
    const { program, fragmentShader, vertexShader } = createLinkedProgram(
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
    const { program, fragmentShader, vertexShader } = createLinkedProgram(
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

