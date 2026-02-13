'use client';
import * as React from 'react';
import {
  type ContinuousScaleName,
  useDrawingArea,
  useRegisterPointerInteractions,
  useWebGLContext,
} from '@mui/x-charts/internals';
import { useXScale, useYScale } from '@mui/x-charts/hooks';
import { useTheme } from '@mui/material/styles';
import { type DefaultizedOHLCSeriesType } from '../models';
import { useOHLCSeriesContext } from '../hooks/useOHLCSeries';
import {
  bindQuadBuffer,
  compileShader,
  logWebGLErrors,
  uploadQuadBuffer,
} from '../utils/webgl/utils';
import { candlestickRectFragmentShader, candlestickRectVertexShader } from './rectShaders';
import { candlestickLineFragmentShader, candlestickLineVertexShader } from './lineShaders';
import { selectorCandlestickItemAtPosition } from '../plugins/selectors/useChartCandlestickPosition.selectors';
import { useCandlestickPlotData } from './useCandlestickPlotData';
import { parseColor } from '../utils/webgl/parseColor';
import { useWebGLResizeObserver } from '../utils/webgl/useWebGLResizeObserver';

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
  // TODO: Validate this earlier in the processing pipeline
  const xScale = useXScale<'band'>();
  const yScale = useYScale<ContinuousScaleName>();
  const [rectProgram] = React.useState<WebGLProgram>(() =>
    initializeProgram(gl, candlestickRectVertexShader, candlestickRectFragmentShader),
  );
  const [lineProgram] = React.useState<WebGLProgram>(() =>
    initializeProgram(gl, candlestickLineVertexShader, candlestickLineFragmentShader),
  );
  const dataLength = series.data.length;
  const renderScheduledRef = React.useRef<boolean>(false);
  const rectVaoRef = React.useRef(gl.createVertexArray());
  const lineVaoRef = React.useRef(gl.createVertexArray());
  useRegisterPointerInteractions(selectorCandlestickItemAtPosition);

  const render = React.useCallback(() => {
    renderScheduledRef.current = false;

    // Clear and draw
    gl.clearColor(0, 0, 0, 0.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // This isn't a hook
    // eslint-disable-next-line react-compiler/react-compiler
    gl.useProgram(lineProgram);
    logWebGLErrors(gl);
    gl.bindVertexArray(lineVaoRef.current);
    gl.drawArraysInstanced(gl.LINES, 0, 2, dataLength);

    // This isn't a hook
    // eslint-disable-next-line react-compiler/react-compiler
    gl.useProgram(rectProgram);
    logWebGLErrors(gl);
    gl.bindVertexArray(rectVaoRef.current);
    gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, dataLength);
  }, [dataLength, gl, lineProgram, rectProgram]);

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
    gl.useProgram(rectProgram);
    gl.uniform2f(
      gl.getUniformLocation(rectProgram, 'u_resolution'),
      drawingArea.width,
      drawingArea.height,
    );

    // eslint-disable-next-line react-compiler/react-compiler
    gl.useProgram(lineProgram);
    gl.uniform2f(
      gl.getUniformLocation(lineProgram, 'u_resolution'),
      drawingArea.width,
      drawingArea.height,
    );

    scheduleRender();
  }, [drawingArea.height, drawingArea.width, gl, lineProgram, rectProgram, scheduleRender]);

  const candleWidth = xScale.bandwidth();
  React.useEffect(() => {
    // eslint-disable-next-line react-compiler/react-compiler
    gl.useProgram(rectProgram);
    gl.uniform1f(gl.getUniformLocation(rectProgram, 'u_candle_width'), candleWidth);

    // eslint-disable-next-line react-compiler/react-compiler
    gl.useProgram(lineProgram);
    gl.uniform1f(gl.getUniformLocation(lineProgram, 'u_candle_width'), candleWidth);
  }, [candleWidth, gl, lineProgram, rectProgram]);

  const theme = useTheme();
  const lineColor = theme.palette.text.primary;
  React.useEffect(() => {
    const lineColorComponents = parseColor(lineColor);

    // eslint-disable-next-line react-compiler/react-compiler
    gl.useProgram(lineProgram);
    gl.uniform4f(gl.getUniformLocation(lineProgram, 'u_color'), ...lineColorComponents);
  }, [gl, lineProgram, lineColor]);

  const plotData = useCandlestickPlotData(drawingArea, series, xScale, yScale);
  React.useEffect(() => {
    const { rectCenters, rectHeights, lineCenters, lineHeights, colors } = plotData;

    // Setup rect attributes
    // eslint-disable-next-line react-compiler/react-compiler
    gl.useProgram(rectProgram);
    gl.bindVertexArray(rectVaoRef.current);

    bindQuadBuffer(gl, rectProgram, uploadQuadBuffer(gl));

    // Center attribute
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, rectCenters, gl.STATIC_DRAW);

    const rectCenterLocation = gl.getAttribLocation(rectProgram, 'a_center');
    gl.enableVertexAttribArray(rectCenterLocation);
    gl.vertexAttribPointer(rectCenterLocation, 2, gl.FLOAT, false, 0, 0);
    gl.vertexAttribDivisor(rectCenterLocation, 1); // One per instance

    // Height attribute
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, rectHeights, gl.STATIC_DRAW);

    const rectHeightLocation = gl.getAttribLocation(rectProgram, 'a_height');
    gl.enableVertexAttribArray(rectHeightLocation);
    gl.vertexAttribPointer(rectHeightLocation, 1, gl.FLOAT, false, 0, 0);
    gl.vertexAttribDivisor(rectHeightLocation, 1); // One per instance

    // Color attribute
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);

    const colorLocation = gl.getAttribLocation(rectProgram, 'a_color');
    gl.enableVertexAttribArray(colorLocation);
    gl.vertexAttribPointer(colorLocation, 4, gl.FLOAT, false, 0, 0);
    gl.vertexAttribDivisor(colorLocation, 1); // One per instance

    gl.bindVertexArray(null);

    // Setup line attributes
    // eslint-disable-next-line react-compiler/react-compiler
    gl.useProgram(lineProgram);
    gl.bindVertexArray(lineVaoRef.current);

    const lineVertices = new Float32Array([0, -1, 0, 1]);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, lineVertices, gl.STATIC_DRAW);

    const aPosition = gl.getAttribLocation(lineProgram, 'a_position');
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, lineCenters, gl.STATIC_DRAW);

    const lineCenterLocation = gl.getAttribLocation(lineProgram, 'a_center');
    gl.enableVertexAttribArray(lineCenterLocation);
    gl.vertexAttribPointer(lineCenterLocation, 2, gl.FLOAT, false, 0, 0);
    gl.vertexAttribDivisor(lineCenterLocation, 1); // One per instance

    // Height attribute
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, lineHeights, gl.STATIC_DRAW);

    const lineHeightLocation = gl.getAttribLocation(lineProgram, 'a_height');
    gl.enableVertexAttribArray(lineHeightLocation);
    gl.vertexAttribPointer(lineHeightLocation, 1, gl.FLOAT, false, 0, 0);
    gl.vertexAttribDivisor(lineHeightLocation, 1); // One per instance

    gl.bindVertexArray(null);

    scheduleRender();
  }, [gl, lineProgram, plotData, rectProgram, scheduleRender]);

  React.useEffect(() => {
    if (renderScheduledRef.current) {
      render();
    }
  });

  return null;
}
