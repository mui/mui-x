'use client';
import * as React from 'react';
import {
  type ContinuousScaleName,
  useDrawingArea,
  useRegisterPointerInteractions,
} from '@mui/x-charts/internals';
import { useXScale, useYScale } from '@mui/x-charts/hooks';
import { type DefaultizedOHLCSeriesType } from '../models';
import { useOHLCSeriesContext } from '../hooks/useOHLCSeries';
import {
  bindQuadBuffer,
  compileShader,
  logWebGLErrors,
  uploadQuadBuffer,
} from '../utils/webgl/utils';
import { candleFragmentShader, candleVertexShader } from './candleShaders';
import { wickFragmentShader, wickVertexShader } from './wickShaders';
import { selectorCandlestickItemAtPosition } from '../plugins/selectors/useChartCandlestickPosition.selectors';
import { useCandlestickPlotData } from './useCandlestickPlotData';
import { useWebGLResizeObserver } from '../utils/webgl/useWebGLResizeObserver';
import { useWebGLContext } from '../ChartsWebGLLayer/ChartsWebGLLayer';
import { checkCandlestickScaleErrors } from './checkCandlestickScaleErrors';

export interface CandlestickPlotProps {}

export function CandlestickPlot() {
  return <CandlestickWebGLPlot />;
}

function CandlestickWebGLPlot() {
  const gl = useWebGLContext();
  const series = useOHLCSeriesContext();

  const seriesToDisplay = series?.series[series.seriesOrder[0]];

  if (!gl || !seriesToDisplay) {
    return null;
  }

  return <CandlestickWebGLPlotImpl gl={gl} series={seriesToDisplay} />;
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

  return program;
}

function CandlestickWebGLPlotImpl({
  gl,
  series,
}: {
  gl: WebGL2RenderingContext;
  series: DefaultizedOHLCSeriesType;
}) {
  const drawingArea = useDrawingArea();
  const xScale = useXScale<'band'>();
  const yScale = useYScale<ContinuousScaleName>();
  checkCandlestickScaleErrors(series.id, xScale);

  const [candleProgram] = React.useState<WebGLProgram>(() =>
    initializeProgram(gl, candleVertexShader, candleFragmentShader),
  );
  const [wickProgram] = React.useState<WebGLProgram>(() =>
    initializeProgram(gl, wickVertexShader, wickFragmentShader),
  );
  const dataLength = series.data.length;
  const renderScheduledRef = React.useRef<boolean>(false);
  const candleVaoRef = React.useRef(gl.createVertexArray());
  const wickVaoRef = React.useRef(gl.createVertexArray());
  useRegisterPointerInteractions(selectorCandlestickItemAtPosition);

  const render = React.useCallback(() => {
    renderScheduledRef.current = false;

    // Clear and draw
    gl.clearColor(0, 0, 0, 0.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // This isn't a hook
    // eslint-disable-next-line react-compiler/react-compiler
    gl.useProgram(wickProgram);
    logWebGLErrors(gl);
    gl.bindVertexArray(wickVaoRef.current);
    gl.drawArraysInstanced(gl.LINES, 0, 2, dataLength * 2);

    // This isn't a hook
    // eslint-disable-next-line react-compiler/react-compiler
    gl.useProgram(candleProgram);
    logWebGLErrors(gl);
    gl.bindVertexArray(candleVaoRef.current);
    gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, dataLength);
  }, [dataLength, gl, wickProgram, candleProgram]);

  const scheduleRender = React.useCallback(() => {
    renderScheduledRef.current = true;
  }, []);

  // On resize render directly to avoid a frame where the canvas is blank
  useWebGLResizeObserver(render);

  React.useEffect(() => {
    /* Enable blending for transparency
     * These are global to the WebGL context and need to be set only once */
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  }, [gl]);

  React.useEffect(() => {
    // eslint-disable-next-line react-compiler/react-compiler
    gl.useProgram(candleProgram);
    gl.uniform2f(
      gl.getUniformLocation(candleProgram, 'u_resolution'),
      drawingArea.width,
      drawingArea.height,
    );

    // eslint-disable-next-line react-compiler/react-compiler
    gl.useProgram(wickProgram);
    gl.uniform2f(
      gl.getUniformLocation(wickProgram, 'u_resolution'),
      drawingArea.width,
      drawingArea.height,
    );

    scheduleRender();
  }, [drawingArea.height, drawingArea.width, gl, wickProgram, candleProgram, scheduleRender]);

  const candleWidth = xScale.bandwidth();
  React.useEffect(() => {
    // eslint-disable-next-line react-compiler/react-compiler
    gl.useProgram(candleProgram);
    gl.uniform1f(gl.getUniformLocation(candleProgram, 'u_candle_width'), candleWidth);

    // eslint-disable-next-line react-compiler/react-compiler
    gl.useProgram(wickProgram);
    gl.uniform1f(gl.getUniformLocation(wickProgram, 'u_candle_width'), candleWidth);
  }, [candleWidth, gl, wickProgram, candleProgram]);

  const plotData = useCandlestickPlotData(drawingArea, series, xScale, yScale);
  React.useEffect(() => {
    const { candleCenters, candleHeights, wickCenters, wickHeights, candleColors, wickColors } =
      plotData;

    // Setup candle attributes
    // eslint-disable-next-line react-compiler/react-compiler
    gl.useProgram(candleProgram);
    gl.bindVertexArray(candleVaoRef.current);

    bindQuadBuffer(gl, candleProgram, uploadQuadBuffer(gl));

    // Center attribute
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, candleCenters, gl.STATIC_DRAW);

    const candleCenterLocation = gl.getAttribLocation(candleProgram, 'a_center');
    gl.enableVertexAttribArray(candleCenterLocation);
    gl.vertexAttribPointer(candleCenterLocation, 2, gl.FLOAT, false, 0, 0);
    gl.vertexAttribDivisor(candleCenterLocation, 1); // One per instance

    // Height attribute
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, candleHeights, gl.STATIC_DRAW);

    const candleHeightLocation = gl.getAttribLocation(candleProgram, 'a_height');
    gl.enableVertexAttribArray(candleHeightLocation);
    gl.vertexAttribPointer(candleHeightLocation, 1, gl.FLOAT, false, 0, 0);
    gl.vertexAttribDivisor(candleHeightLocation, 1); // One per instance

    // Color attribute
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, candleColors, gl.STATIC_DRAW);

    const candleColorLocation = gl.getAttribLocation(candleProgram, 'a_color');
    gl.enableVertexAttribArray(candleColorLocation);
    gl.vertexAttribPointer(candleColorLocation, 4, gl.FLOAT, false, 0, 0);
    gl.vertexAttribDivisor(candleColorLocation, 1); // One per instance

    gl.bindVertexArray(null);

    // Setup wick attributes
    // eslint-disable-next-line react-compiler/react-compiler
    gl.useProgram(wickProgram);
    gl.bindVertexArray(wickVaoRef.current);

    const wickVertices = new Float32Array([0, -1, 0, 1]);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, wickVertices, gl.STATIC_DRAW);

    const aPosition = gl.getAttribLocation(wickProgram, 'a_position');
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, wickCenters, gl.STATIC_DRAW);

    const wickCenterLocation = gl.getAttribLocation(wickProgram, 'a_center');
    gl.enableVertexAttribArray(wickCenterLocation);
    gl.vertexAttribPointer(wickCenterLocation, 2, gl.FLOAT, false, 0, 0);
    gl.vertexAttribDivisor(wickCenterLocation, 1); // One per instance

    // Height attribute
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, wickHeights, gl.STATIC_DRAW);

    const wickHeightLocation = gl.getAttribLocation(wickProgram, 'a_height');
    gl.enableVertexAttribArray(wickHeightLocation);
    gl.vertexAttribPointer(wickHeightLocation, 1, gl.FLOAT, false, 0, 0);
    gl.vertexAttribDivisor(wickHeightLocation, 1); // One per instance

    // Color attribute
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, wickColors, gl.STATIC_DRAW);

    const wickColorLocation = gl.getAttribLocation(wickProgram, 'a_wick_color');
    gl.enableVertexAttribArray(wickColorLocation);
    gl.vertexAttribPointer(wickColorLocation, 4, gl.FLOAT, false, 0, 0);
    gl.vertexAttribDivisor(wickColorLocation, 1); // One per instance

    gl.bindVertexArray(null);

    scheduleRender();
  }, [gl, wickProgram, plotData, candleProgram, scheduleRender]);

  React.useEffect(() => {
    if (renderScheduledRef.current) {
      render();
    }
  });

  return null;
}
