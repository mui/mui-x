'use client';
import * as React from 'react';
import {
  type ContinuousScaleName,
  useDrawingArea,
  useWebGLContext,
  WebGLProvider,
} from '@mui/x-charts/internals';
import { useXScale, useYScale } from '@mui/x-charts/hooks';
import { type DefaultizedOHLCSeriesType } from '../models';
import { useOHLCSeriesContext } from '../hooks/useOHLCSeries';
import {
  bindQuadBuffer,
  compileShader,
  logWebGLErrors,
  uploadQuadBuffer,
} from '../HeatmapPremium/webgl/utils';
import { useWebGLResizeObserver } from '../HeatmapPremium/webgl/useWebGLResizeObserver';
import { candlestickFragmentShader, candlestickVertexShader } from './shaders';

export interface CandlestickPlotProps {}

export function CandlestickPlot() {
  return (
    <WebGLProvider>
      <CandlestickWebGLPlot />
    </WebGLProvider>
  );
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

function initializeProgram(gl: WebGL2RenderingContext) {
  const program = gl.createProgram();
  const vertexShader = compileShader(gl, candlestickVertexShader, gl.VERTEX_SHADER);
  const fragmentShader = compileShader(gl, candlestickFragmentShader, gl.FRAGMENT_SHADER);
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

const CANDLESTICK_WIDTH = 10;

function CandlestickWebGLPlotImpl({
  gl,
  series,
}: {
  gl: WebGL2RenderingContext;
  series: DefaultizedOHLCSeriesType;
}) {
  const drawingArea = useDrawingArea();
  // TODO: Validate this earlier in the processing pipeline
  const xScale = useXScale<ContinuousScaleName>();
  const yScale = useYScale<ContinuousScaleName>();

  const [program] = React.useState<WebGLProgram>(() => initializeProgram(gl));
  const dataLength = series.data.length;
  const renderScheduledRef = React.useRef<boolean>(false);

  const render = React.useCallback(() => {
    renderScheduledRef.current = false;

    // Clear and draw
    gl.clearColor(0, 0, 0, 0.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, dataLength);
  }, [dataLength, gl]);

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
    // This isn't a hook
    // eslint-disable-next-line react-compiler/react-compiler
    gl.useProgram(program);
    logWebGLErrors(gl);
  }, [gl, program]);

  React.useEffect(() => {
    // Setup constants
    bindQuadBuffer(gl, program, uploadQuadBuffer(gl));

    gl.uniform1f(gl.getUniformLocation(program, 'u_width'), CANDLESTICK_WIDTH);
  }, [gl, program]);

  React.useEffect(() => {
    gl.uniform2f(
      gl.getUniformLocation(program, 'u_resolution'),
      drawingArea.width,
      drawingArea.height,
    );

    scheduleRender();
  }, [drawingArea.height, drawingArea.width, gl, program, scheduleRender]);

  React.useEffect(() => {
    const centers = new Float32Array(series.data.length * 2);
    const heights = new Float32Array(series.data.length);
    const colors = new Float32Array(series.data.length * 4);

    for (let dataIndex = 0; dataIndex < series.data.length; dataIndex += 1) {
      const [xValue, open, high, low, close] = series.data[dataIndex];
      const x = xScale(xValue);
      const [bottom, top] = [yScale(open), yScale(close)].sort();

      centers[dataIndex * 2] = x + CANDLESTICK_WIDTH / 2;
      centers[dataIndex * 2 + 1] = (top + bottom) / 2;
      heights[dataIndex] = top - bottom;

      if (close >= open) {
        // Bullish - green
        colors[dataIndex * 4] = 0.0;
        colors[dataIndex * 4 + 1] = 1.0;
        colors[dataIndex * 4 + 2] = 0.0;
        colors[dataIndex * 4 + 3] = 1.0;
      } else {
        // Bearish - red
        colors[dataIndex * 4] = 1.0;
        colors[dataIndex * 4 + 1] = 0.0;
        colors[dataIndex * 4 + 2] = 0.0;
        colors[dataIndex * 4 + 3] = 1.0;
      }
    }

    // Setup center attribute
    const centerBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, centerBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, centers, gl.STATIC_DRAW);

    const centerLocation = gl.getAttribLocation(program, 'a_center');
    gl.enableVertexAttribArray(centerLocation);
    gl.vertexAttribPointer(centerLocation, 2, gl.FLOAT, false, 0, 0);
    gl.vertexAttribDivisor(centerLocation, 1); // One per instance

    // Setup height attribute
    const heightBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, heightBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, heights, gl.STATIC_DRAW);

    const heightLocation = gl.getAttribLocation(program, 'a_height');
    gl.enableVertexAttribArray(heightLocation);
    gl.vertexAttribPointer(heightLocation, 1, gl.FLOAT, false, 0, 0);
    gl.vertexAttribDivisor(heightLocation, 1); // One per instance

    // Setup color attribute
    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);

    const colorLocation = gl.getAttribLocation(program, 'a_color');
    gl.enableVertexAttribArray(colorLocation);
    gl.vertexAttribPointer(colorLocation, 4, gl.FLOAT, false, 0, 0);
    gl.vertexAttribDivisor(colorLocation, 1); // One per instance

    scheduleRender();
  }, [gl, program, scheduleRender, series.data, xScale, yScale]);

  React.useEffect(() => {
    if (renderScheduledRef.current) {
      render();
    }
  });

  return null;
}
