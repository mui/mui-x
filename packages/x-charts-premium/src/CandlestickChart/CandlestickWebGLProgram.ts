import {
  bindQuadBuffer,
  compileShader,
  logWebGLErrors,
  uploadQuadBuffer,
} from '../utils/webgl/utils';
import { candleFragmentShader, candleVertexShader } from './candleShaders';
import { wickFragmentShader, wickVertexShader } from './wickShaders';
import { type CandlestickPlotData } from './useCandlestickPlotData';

export class CandlestickWebGLProgram {
  private readonly shaders: WebGLShader[] = [];

  // Candle program and buffers. If you add more WebGL resources, remember to dispose of them in the dispose() method.
  private readonly candleProgram: WebGLProgram;
  private readonly candleVao: WebGLVertexArrayObject;
  private readonly candleCentersBuffer: WebGLBuffer;
  private readonly candleHeightsBuffer: WebGLBuffer;
  private readonly candleColorsBuffer: WebGLBuffer;

  // Wick program and buffers. If you add more WebGL resources, remember to dispose of them in the dispose() method.
  private readonly wickProgram: WebGLProgram;
  private readonly wickVao: WebGLVertexArrayObject;
  private readonly wickVerticesBuffer: WebGLBuffer;
  private readonly wickCentersBuffer: WebGLBuffer;
  private readonly wickHeightsBuffer: WebGLBuffer;
  private readonly wickColorsBuffer: WebGLBuffer;

  constructor(private gl: WebGL2RenderingContext) {
    /* Enable blending for transparency
     * These are global to the WebGL context and need to be set only once */
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const candleProg = initializeProgram(this.gl, candleVertexShader, candleFragmentShader);
    this.candleProgram = candleProg.program;
    this.shaders.push(candleProg.fragmentShader);
    this.shaders.push(candleProg.vertexShader);
    this.candleVao = this.gl.createVertexArray();
    this.candleCentersBuffer = this.gl.createBuffer();
    this.candleHeightsBuffer = this.gl.createBuffer();
    this.candleColorsBuffer = this.gl.createBuffer();

    const wickProg = initializeProgram(this.gl, wickVertexShader, wickFragmentShader);
    this.wickProgram = wickProg.program;
    this.shaders.push(wickProg.fragmentShader);
    this.shaders.push(wickProg.vertexShader);
    this.wickVao = this.gl.createVertexArray();
    this.wickVerticesBuffer = this.gl.createBuffer();
    this.wickCentersBuffer = this.gl.createBuffer();
    this.wickHeightsBuffer = this.gl.createBuffer();
    this.wickColorsBuffer = this.gl.createBuffer();
  }

  setResolution(width: number, height: number) {
    this.gl.useProgram(this.candleProgram);
    this.gl.uniform2f(
      this.gl.getUniformLocation(this.candleProgram, 'u_resolution'),
      width,
      height,
    );

    this.gl.useProgram(this.wickProgram);
    this.gl.uniform2f(this.gl.getUniformLocation(this.wickProgram, 'u_resolution'), width, height);
  }

  setCandleWidth(candleWidth: number) {
    this.gl.useProgram(this.candleProgram);
    this.gl.uniform1f(
      this.gl.getUniformLocation(this.candleProgram, 'u_candle_width'),
      candleWidth,
    );

    this.gl.useProgram(this.wickProgram);
    this.gl.uniform1f(this.gl.getUniformLocation(this.wickProgram, 'u_candle_width'), candleWidth);
  }

  plot(plotData: CandlestickPlotData) {
    const { candleCenters, candleHeights, wickCenters, wickHeights, candleColors, wickColors } =
      plotData;

    // Setup candle attributes

    this.gl.useProgram(this.candleProgram);
    this.gl.bindVertexArray(this.candleVao);

    bindQuadBuffer(this.gl, this.candleProgram, uploadQuadBuffer(this.gl));

    // Center attribute
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.candleCentersBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, candleCenters, this.gl.STATIC_DRAW);

    const candleCenterLocation = this.gl.getAttribLocation(this.candleProgram, 'a_center');
    this.gl.enableVertexAttribArray(candleCenterLocation);
    this.gl.vertexAttribPointer(candleCenterLocation, 2, this.gl.FLOAT, false, 0, 0);
    this.gl.vertexAttribDivisor(candleCenterLocation, 1); // One per instance

    // Height attribute
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.candleHeightsBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, candleHeights, this.gl.STATIC_DRAW);

    const candleHeightLocation = this.gl.getAttribLocation(this.candleProgram, 'a_height');
    this.gl.enableVertexAttribArray(candleHeightLocation);
    this.gl.vertexAttribPointer(candleHeightLocation, 1, this.gl.FLOAT, false, 0, 0);
    this.gl.vertexAttribDivisor(candleHeightLocation, 1); // One per instance

    // Color attribute
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.candleColorsBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, candleColors, this.gl.STATIC_DRAW);

    const candleColorLocation = this.gl.getAttribLocation(this.candleProgram, 'a_color');
    this.gl.enableVertexAttribArray(candleColorLocation);
    this.gl.vertexAttribPointer(candleColorLocation, 4, this.gl.FLOAT, false, 0, 0);
    this.gl.vertexAttribDivisor(candleColorLocation, 1); // One per instance

    this.gl.bindVertexArray(null);

    // Setup wick attributes
    this.gl.useProgram(this.wickProgram);
    this.gl.bindVertexArray(this.wickVao);

    const wickVertices = new Float32Array([0, -1, 0, 1]);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.wickVerticesBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, wickVertices, this.gl.STATIC_DRAW);

    const aPosition = this.gl.getAttribLocation(this.wickProgram, 'a_position');
    this.gl.enableVertexAttribArray(aPosition);
    this.gl.vertexAttribPointer(aPosition, 2, this.gl.FLOAT, false, 0, 0);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.wickCentersBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, wickCenters, this.gl.STATIC_DRAW);

    const wickCenterLocation = this.gl.getAttribLocation(this.wickProgram, 'a_center');
    this.gl.enableVertexAttribArray(wickCenterLocation);
    this.gl.vertexAttribPointer(wickCenterLocation, 2, this.gl.FLOAT, false, 0, 0);
    this.gl.vertexAttribDivisor(wickCenterLocation, 1); // One per instance

    // Height attribute
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.wickHeightsBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, wickHeights, this.gl.STATIC_DRAW);

    const wickHeightLocation = this.gl.getAttribLocation(this.wickProgram, 'a_height');
    this.gl.enableVertexAttribArray(wickHeightLocation);
    this.gl.vertexAttribPointer(wickHeightLocation, 1, this.gl.FLOAT, false, 0, 0);
    this.gl.vertexAttribDivisor(wickHeightLocation, 1); // One per instance

    // Color attribute
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.wickColorsBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, wickColors, this.gl.STATIC_DRAW);

    const wickColorLocation = this.gl.getAttribLocation(this.wickProgram, 'a_wick_color');
    this.gl.enableVertexAttribArray(wickColorLocation);
    this.gl.vertexAttribPointer(wickColorLocation, 4, this.gl.FLOAT, false, 0, 0);
    this.gl.vertexAttribDivisor(wickColorLocation, 1); // One per instance

    this.gl.bindVertexArray(null);
  }

  render(dataLength: number) {
    this.gl.useProgram(this.wickProgram);
    logWebGLErrors(this.gl);
    this.gl.bindVertexArray(this.wickVao);
    this.gl.drawArraysInstanced(this.gl.LINES, 0, 2, dataLength * 2);

    this.gl.useProgram(this.candleProgram);
    logWebGLErrors(this.gl);
    this.gl.bindVertexArray(this.candleVao);
    this.gl.drawArraysInstanced(this.gl.TRIANGLE_STRIP, 0, 4, dataLength);
  }

  dispose() {
    this.gl.deleteProgram(this.candleProgram);
    this.gl.deleteVertexArray(this.candleVao);
    this.gl.deleteBuffer(this.candleCentersBuffer);
    this.gl.deleteBuffer(this.candleHeightsBuffer);
    this.gl.deleteBuffer(this.candleColorsBuffer);

    this.gl.deleteProgram(this.wickProgram);
    this.gl.deleteVertexArray(this.wickVao);
    this.gl.deleteBuffer(this.wickVerticesBuffer);
    this.gl.deleteBuffer(this.wickCentersBuffer);
    this.gl.deleteBuffer(this.wickHeightsBuffer);
    this.gl.deleteBuffer(this.wickColorsBuffer);

    this.shaders.forEach((shader) => this.gl.deleteShader(shader));
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

  // https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices#dont_check_shader_compile_status_unless_linking_fails
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(`Program linking failed: ${gl.getProgramInfoLog(program)}`);
    console.error(`Vertex shader info-log: ${gl.getShaderInfoLog(vertexShader)}`);
    console.error(`Fragment shader info-log: ${gl.getShaderInfoLog(fragmentShader)}`);
  }

  return { program, vertexShader, fragmentShader };
}
