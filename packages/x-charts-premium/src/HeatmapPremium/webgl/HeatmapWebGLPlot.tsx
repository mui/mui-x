'use client';
import * as React from 'react';
import { useDrawingArea, useXScale, useYScale, useZColorScale } from '@mui/x-charts/hooks';
import {
  selectorChartsIsFadedCallback,
  selectorChartsIsHighlightedCallback,
  useStore,
  useWebGLContext,
} from '@mui/x-charts/internals';
import { useHeatmapSeriesContext } from '../../hooks';
import { parseColor } from './parseColor';
import {
  heatmapFragmentShaderSourceNoBorderRadius,
  heatmapFragmentShaderSourceWithBorderRadius,
  heatmapVertexShaderSource,
} from './shaders';
import { useWebGLResizeObserver } from './useWebGLResizeObserver';
import {
  attachShader,
  bindQuadBuffer,
  compileShader,
  logWebGLErrors,
  uploadQuadBuffer,
} from './utils';

export function HeatmapWebGLPlot({
  borderRadius,
}: {
  borderRadius?: number;
}): React.JSX.Element | null {
  const gl = useWebGLContext();

  if (!gl) {
    return null;
  }

  return <HeatmapWebGLPlotImpl gl={gl} borderRadius={borderRadius ?? 0} />;
}

function HeatmapWebGLPlotImpl(props: { gl: WebGL2RenderingContext; borderRadius: number }) {
  const { gl, borderRadius } = props;

  const drawingArea = useDrawingArea();
  const xScale = useXScale<'band'>();
  const yScale = useYScale<'band'>();
  const colorScale = useZColorScale()!;
  const series = useHeatmapSeriesContext();
  const store = useStore();
  const isHighlighted = store.use(selectorChartsIsHighlightedCallback);
  const isFaded = store.use(selectorChartsIsFadedCallback);

  const [vertexShader] = React.useState<WebGLShader>(() =>
    compileShader(gl, heatmapVertexShaderSource, gl.VERTEX_SHADER),
  );
  const [program] = React.useState<WebGLProgram>(() => {
    const p = gl.createProgram();
    gl.attachShader(p, vertexShader);
    return p;
  });
  const [quadBuffer] = React.useState(() => uploadQuadBuffer(gl));
  const dataLengthRef = React.useRef<number>(0);
  const seriesToDisplay = series?.series[series.seriesOrder[0]];
  const renderScheduledRef = React.useRef<boolean>(false);

  const render = React.useCallback(() => {
    renderScheduledRef.current = false;

    // Clear and draw
    gl.clearColor(0, 0, 0, 0.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    if (dataLengthRef.current > 0) {
      // Draw all rectangles with one instanced draw call
      gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, dataLengthRef.current);
    }
  }, [gl]);

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

  React.useEffect(() => {
    const shouldAttachNewShader = lastSeriesBorderRadiusRef.current > 0 !== seriesBorderRadius > 0;
    lastSeriesBorderRadiusRef.current = seriesBorderRadius;

    if (shouldAttachNewShader) {
      const shaderSource =
        seriesBorderRadius > 0
          ? heatmapFragmentShaderSourceWithBorderRadius
          : heatmapFragmentShaderSourceNoBorderRadius;

      gl.getAttachedShaders(program)?.forEach((shader) => {
        if (shader === vertexShader) {
          return;
        }
        gl.detachShader(program, shader);
        gl.deleteShader(shader);
      });

      attachShader(gl, program, shaderSource, gl.FRAGMENT_SHADER);

      gl.linkProgram(program);

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Program linking error:', gl.getProgramInfoLog(program));
      }

      // Not a hook
      // eslint-disable-next-line react-compiler/react-compiler
      gl.useProgram(program);
      logWebGLErrors(gl);
    }

    bindQuadBuffer(gl, program, quadBuffer);

    gl.uniform1f(gl.getUniformLocation(program, 'u_borderRadius'), seriesBorderRadius);
    scheduleRender();
  }, [gl, program, quadBuffer, scheduleRender, seriesBorderRadius, vertexShader]);

  React.useEffect(() => {
    // Setup resolution uniform
    const uResolution = gl.getUniformLocation(program, 'u_resolution');
    gl.uniform2f(uResolution, drawingArea.width, drawingArea.height);
  }, [gl, drawingArea.width, drawingArea.height, program, seriesBorderRadius]);

  React.useEffect(() => {
    if (!seriesToDisplay) {
      dataLengthRef.current = 0;
      return;
    }

    dataLengthRef.current = seriesToDisplay.data.length;
    const centers = new Float32Array(seriesToDisplay.data.length * 2);
    const colors = new Float32Array(seriesToDisplay.data.length * 4);
    const saturations = new Float32Array(seriesToDisplay.data.length);

    const xDomain = xScale.domain();
    const yDomain = yScale.domain();

    for (let dataIndex = 0; dataIndex < seriesToDisplay.data.length; dataIndex += 1) {
      const [xIndex, yIndex, value] = seriesToDisplay.data[dataIndex];

      const x = xScale(xDomain[xIndex]);
      const y = yScale(yDomain[yIndex]);
      const color = colorScale?.(value);

      if (x === undefined || y === undefined || !color) {
        continue;
      }

      centers[dataIndex * 2] = x + width / 2 - drawingArea.left;
      centers[dataIndex * 2 + 1] = y + height / 2 - drawingArea.top;

      const rgbColor = parseColor(color);

      colors[dataIndex * 4] = rgbColor[0];
      colors[dataIndex * 4 + 1] = rgbColor[1];
      colors[dataIndex * 4 + 2] = rgbColor[2];
      colors[dataIndex * 4 + 3] = 1.0;

      if (isHighlighted({ seriesId: seriesToDisplay.id, dataIndex })) {
        saturations[dataIndex] = 0.2;
      } else if (isFaded({ seriesId: seriesToDisplay.id, dataIndex })) {
        saturations[dataIndex] = -0.2;
      }
    }

    const uDimensions = gl.getUniformLocation(program, 'u_dimensions');
    gl.uniform2f(uDimensions, width, height);

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

    scheduleRender();
  }, [
    colorScale,
    drawingArea.left,
    drawingArea.top,
    gl,
    height,
    isFaded,
    isHighlighted,
    program,
    scheduleRender,
    seriesToDisplay,
    width,
    xScale,
    yScale,
    /* This must re-render when seriesBorderRadius changes so the correct buffers are bound and uploaded */
    seriesBorderRadius,
  ]);

  React.useEffect(() => {
    if (renderScheduledRef.current) {
      render();
    }
  });

  return null;
}
