'use client';
import * as React from 'react';
import { useDrawingArea, useStore, useWebGLContext, WebGLProvider } from '@mui/x-charts/internals';
import { useXScale, useYScale } from '@mui/x-charts/hooks';
import { compileShader, logWebGLErrors, uploadQuadBuffer } from '../HeatmapPremium/webgl/utils';
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

  if (!gl) {
    return null;
  }

  return <CandlestickWebGLPlotImpl gl={gl} />;
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

  gl.useProgram(program);
  logWebGLErrors(gl);

  return program;
}

function CandlestickWebGLPlotImpl({ gl }: { gl: WebGL2RenderingContext }) {
  const drawingArea = useDrawingArea();
  const xScale = useXScale();
  const yScale = useYScale();
  const store = useStore();

  const [program] = React.useState<WebGLProgram>(() => initializeProgram(gl));
  const [quadBuffer] = React.useState(() => uploadQuadBuffer(gl));
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

  const setupResolutionUniform = React.useCallback(() => {
    gl.uniform2f(
      gl.getUniformLocation(program, 'u_resolution'),
      drawingArea.width,
      drawingArea.height,
    );
  }, [drawingArea.height, drawingArea.width, gl, program]);

  const setupAttributes = React.useCallback(() => {}, []);

  React.useEffect(() => {
    setupResolutionUniform();
    scheduleRender();
  }, [setupResolutionUniform, scheduleRender]);

  React.useEffect(() => {
    setupAttributes();
    scheduleRender();
  }, [scheduleRender, setupAttributes]);

  React.useEffect(() => {
    if (renderScheduledRef.current) {
      render();
    }
  });

  return null;
}
