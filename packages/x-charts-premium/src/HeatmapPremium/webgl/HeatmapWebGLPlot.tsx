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
import { useRerenderWebGLCanvasOnResize } from './useRerenderWebGLCanvasOnResize';
import { WebGLProg } from './WebGLProg';

export function HeatmapWebGLPlot({
  borderRadius,
}: {
  borderRadius?: number;
}): React.JSX.Element | null {
  const drawingArea = useDrawingArea();
  const xScale = useXScale<'band'>();
  const yScale = useYScale<'band'>();
  const colorScale = useZColorScale()!;
  const series = useHeatmapSeriesContext();
  const store = useStore();
  const isHighlighted = store.use(selectorChartsIsHighlightedCallback);
  const isFaded = store.use(selectorChartsIsFadedCallback);

  const gl = useWebGLContext();
  const programRef = React.useRef<WebGLProg | null>(null);
  const dataLengthRef = React.useRef<number>(0);
  const seriesToDisplay = series?.series[series.seriesOrder[0]];
  const renderScheduledRef = React.useRef<boolean>(false);

  const render = React.useCallback(() => {
    renderScheduledRef.current = false;

    if (!gl) {
      return;
    }

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
  useRerenderWebGLCanvasOnResize(render);

  const seriesBorderRadius = borderRadius ?? 0;
  const lastFragmentShaderRef = React.useRef<'no-border-radius' | 'border-radius'>(
    seriesBorderRadius > 0 ? 'border-radius' : 'no-border-radius',
  );
  React.useEffect(() => {
    if (!gl) {
      return;
    }

    const program = new WebGLProg(gl);
    programRef.current = program;

    program.attachVertexShader(heatmapVertexShaderSource);
    program.attachFragmentShader(
      // The border radius shader looks odd when border radius is 0, so we use the shader without border radius in that case
      lastFragmentShaderRef.current === 'border-radius'
        ? heatmapFragmentShaderSourceWithBorderRadius
        : heatmapFragmentShaderSourceNoBorderRadius,
    );
    program.link();
    program.use();

    const quadVertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const quadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, quadVertices, gl.STATIC_DRAW);

    const aPosition = gl.getAttribLocation(program.program, 'a_position');
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
  }, [gl]);

  React.useEffect(() => {
    const program = programRef.current;

    if (!gl || !program) {
      return;
    }

    // Setup resolution uniform
    const uResolution = gl.getUniformLocation(program.program, 'u_resolution');
    gl.uniform2f(uResolution, drawingArea.width, drawingArea.height);
  }, [gl, drawingArea.width, drawingArea.height]);

  React.useEffect(() => {
    const program = programRef.current;

    if (!gl || !program) {
      return;
    }

    if (lastFragmentShaderRef.current === 'no-border-radius' && seriesBorderRadius > 0) {
      program.attachFragmentShader(heatmapFragmentShaderSourceWithBorderRadius);
      lastFragmentShaderRef.current = 'border-radius';
    } else if (lastFragmentShaderRef.current === 'border-radius' && !seriesBorderRadius) {
      program.attachFragmentShader(heatmapFragmentShaderSourceNoBorderRadius);
      lastFragmentShaderRef.current = 'no-border-radius';
    } else {
      return;
    }

    program.link();
    program.use();

    gl.uniform1f(gl.getUniformLocation(program.program, 'u_borderRadius'), seriesBorderRadius);
    scheduleRender();
  }, [gl, scheduleRender, seriesBorderRadius]);

  React.useEffect(() => {
    const program = programRef.current;

    if (!gl || !program || !seriesToDisplay) {
      dataLengthRef.current = 0;
      return;
    }

    dataLengthRef.current = seriesToDisplay.data.length;
    const centers = new Float32Array(seriesToDisplay.data.length * 2);
    const colors = new Float32Array(seriesToDisplay.data.length * 4);
    const saturations = new Float32Array(seriesToDisplay.data.length);

    const xDomain = xScale.domain();
    const yDomain = yScale.domain();
    const width = xScale.bandwidth();
    const height = yScale.bandwidth();

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

    const uDimensions = gl.getUniformLocation(program.program, 'u_dimensions');
    gl.uniform2f(uDimensions, width, height);

    // Upload rectangle centers
    const centerBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, centerBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, centers, gl.STATIC_DRAW);

    const aCenter = gl.getAttribLocation(program.program, 'a_center');
    gl.enableVertexAttribArray(aCenter);
    gl.vertexAttribPointer(aCenter, 2, gl.FLOAT, false, 0, 0);

    // This makes the attribute instanced (one value per rectangle, not per vertex)
    gl.vertexAttribDivisor(aCenter, 1);

    // Upload colors
    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);

    const aColor = gl.getAttribLocation(program.program, 'a_color');
    gl.enableVertexAttribArray(aColor);
    gl.vertexAttribPointer(aColor, 4, gl.FLOAT, false, 0, 0);
    gl.vertexAttribDivisor(aColor, 1);

    // Upload saturations
    const saturationBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, saturationBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, saturations, gl.STATIC_DRAW);

    const aSaturation = gl.getAttribLocation(program.program, 'a_saturation');
    gl.enableVertexAttribArray(aSaturation);
    gl.vertexAttribPointer(aSaturation, 1, gl.FLOAT, false, 0, 0);
    gl.vertexAttribDivisor(aSaturation, 1);

    scheduleRender();
  }, [
    colorScale,
    drawingArea.left,
    drawingArea.top,
    gl,
    isFaded,
    isHighlighted,
    scheduleRender,
    seriesToDisplay,
    xScale,
    yScale,
  ]);

  React.useEffect(() => {
    if (renderScheduledRef.current) {
      render();
    }
  });

  return null;
}
