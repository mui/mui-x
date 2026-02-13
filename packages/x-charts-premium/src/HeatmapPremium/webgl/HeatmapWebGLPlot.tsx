'use client';
import * as React from 'react';
import { useDrawingArea, useXScale, useYScale } from '@mui/x-charts/hooks';
import { useWebGLContext } from '@mui/x-charts/internals';
import useEventCallback from '@mui/utils/useEventCallback';
import { type DefaultizedHeatmapSeriesType } from '@mui/x-charts-pro/models';
import { useHeatmapSeriesContext } from '../../hooks';
import {
  heatmapFragmentShaderSourceNoBorderRadius,
  heatmapFragmentShaderSourceWithBorderRadius,
  heatmapVertexShaderSource,
} from './shaders';
import { useWebGLResizeObserver } from '../../utils/webgl/useWebGLResizeObserver';
import {
  attachShader,
  bindQuadBuffer,
  compileShader,
  logWebGLErrors,
  uploadQuadBuffer,
} from '../../utils/webgl/utils';
import { useHeatmapPlotData } from './useHeatmapPlotData';

export function HeatmapWebGLPlot({
  borderRadius,
}: {
  borderRadius?: number;
}): React.JSX.Element | null {
  const gl = useWebGLContext();
  const series = useHeatmapSeriesContext();

  const seriesToDisplay = series?.series[series.seriesOrder[0]];

  if (!gl || !seriesToDisplay) {
    return null;
  }

  return <HeatmapWebGLPlotImpl gl={gl} borderRadius={borderRadius ?? 0} series={seriesToDisplay} />;
}

function HeatmapWebGLPlotImpl(props: {
  gl: WebGL2RenderingContext;
  borderRadius: number;
  series: DefaultizedHeatmapSeriesType;
}) {
  const { gl, borderRadius, series } = props;

  const drawingArea = useDrawingArea();
  const xScale = useXScale<'band'>();
  const yScale = useYScale<'band'>();

  const [vertexShader] = React.useState<WebGLShader>(() =>
    compileShader(gl, heatmapVertexShaderSource, gl.VERTEX_SHADER),
  );
  const [program] = React.useState<WebGLProgram>(() => {
    const p = gl.createProgram();
    gl.attachShader(p, vertexShader);
    return p;
  });
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

  const width = xScale.bandwidth();
  const height = yScale.bandwidth();

  // A border radius cannot be larger than half the width or height of the rectangle
  const seriesBorderRadius = Math.min(borderRadius ?? 0, width / 2, height / 2);
  const lastSeriesBorderRadiusRef = React.useRef<number>(seriesBorderRadius > 0 ? 0 : 1);

  const setupResolutionUniform = React.useCallback(() => {
    gl.uniform2f(
      gl.getUniformLocation(program, 'u_resolution'),
      drawingArea.width,
      drawingArea.height,
    );
  }, [drawingArea.height, drawingArea.width, gl, program]);

  const setupBorderRadiusUniform = React.useCallback(() => {
    gl.uniform1f(gl.getUniformLocation(program, 'u_borderRadius'), seriesBorderRadius);
  }, [gl, program, seriesBorderRadius]);

  const setupRectDimensionsUniform = React.useCallback(() => {
    gl.uniform2f(gl.getUniformLocation(program, 'u_dimensions'), width, height);
  }, [gl, height, program, width]);

  const setupUniformsEvent = useEventCallback(() => {
    bindQuadBuffer(gl, program, quadBuffer);

    setupBorderRadiusUniform();
    setupResolutionUniform();
    setupRectDimensionsUniform();
  });

  const plotData = useHeatmapPlotData(drawingArea, series, xScale, yScale);
  const setupAttributes = React.useCallback(() => {
    const { centers, colors, saturations } = plotData;

    // Upload rectangle centers
    const centerBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, centerBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, centers, gl.STATIC_DRAW);

    const aCenter = gl.getAttribLocation(program, 'a_center');
    gl.enableVertexAttribArray(aCenter);
    gl.vertexAttribPointer(aCenter, 2, gl.FLOAT, false, 0, 0);

    // This makes the attribute instanced (one value per rectangle, not per vertex)
    gl.vertexAttribDivisor(aCenter, 1);

    // Upload colors
    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);

    const aColor = gl.getAttribLocation(program, 'a_color');
    gl.enableVertexAttribArray(aColor);
    gl.vertexAttribPointer(aColor, 4, gl.FLOAT, false, 0, 0);
    gl.vertexAttribDivisor(aColor, 1);

    // Upload saturations
    const saturationBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, saturationBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, saturations, gl.STATIC_DRAW);

    const aSaturation = gl.getAttribLocation(program, 'a_saturation');
    gl.enableVertexAttribArray(aSaturation);
    gl.vertexAttribPointer(aSaturation, 1, gl.FLOAT, false, 0, 0);
    gl.vertexAttribDivisor(aSaturation, 1);
  }, [gl, plotData, program]);
  const setupAttributesEvent = useEventCallback(() => setupAttributes());

  React.useEffect(() => {
    const shouldAttachNewShader = lastSeriesBorderRadiusRef.current > 0 !== seriesBorderRadius > 0;
    lastSeriesBorderRadiusRef.current = seriesBorderRadius;

    if (shouldAttachNewShader) {
      const shaderSource =
        seriesBorderRadius > 0
          ? heatmapFragmentShaderSourceWithBorderRadius
          : heatmapFragmentShaderSourceNoBorderRadius;

      gl.getAttachedShaders(program)?.forEach((shader) => {
        const shaderType = gl.getShaderParameter(shader, gl.SHADER_TYPE);

        if (shaderType === gl.FRAGMENT_SHADER) {
          gl.detachShader(program, shader);
          gl.deleteShader(shader);
        }
      });

      const fragmentShader = attachShader(gl, program, shaderSource, gl.FRAGMENT_SHADER);

      gl.linkProgram(program);

      // https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices#dont_check_shader_compile_status_unless_linking_fails
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error(`Program linking failed: ${gl.getProgramInfoLog(program)}`);
        console.error(`Vertex shader info-log: ${gl.getShaderInfoLog(vertexShader)}`);
        console.error(`Fragment shader info-log: ${gl.getShaderInfoLog(fragmentShader)}`);
      }

      // Not a hook
      // eslint-disable-next-line react-compiler/react-compiler
      gl.useProgram(program);
      logWebGLErrors(gl);

      setupUniformsEvent();
      setupAttributesEvent();
    } else {
      setupBorderRadiusUniform();
    }

    scheduleRender();
  }, [
    gl,
    program,
    scheduleRender,
    seriesBorderRadius,
    setupBorderRadiusUniform,
    // We use the event callback versions here because we only want this effect to trigger when the border radius changes
    setupAttributesEvent,
    setupUniformsEvent,
    vertexShader,
  ]);

  React.useEffect(() => {
    setupResolutionUniform();
    scheduleRender();
  }, [setupResolutionUniform, scheduleRender]);

  React.useEffect(() => {
    setupRectDimensionsUniform();
    scheduleRender();
  }, [setupRectDimensionsUniform, scheduleRender]);

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
