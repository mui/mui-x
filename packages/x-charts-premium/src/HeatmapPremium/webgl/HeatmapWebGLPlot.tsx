'use client';
import * as React from 'react';
import { useDrawingArea, useXScale, useYScale } from '@mui/x-charts/hooks';
import { type DefaultizedHeatmapSeriesType } from '@mui/x-charts-pro/models';
import { useWebGLLayer } from '../../ChartsWebGLLayer/ChartsWebGLContext';
import { useHeatmapSeriesContext } from '../../hooks';
import { HeatmapWebGLProgram } from './HeatmapWebGLProgram';
import { useHeatmapPlotData } from './useHeatmapPlotData';

export function HeatmapWebGLPlot({
  borderRadius,
}: {
  borderRadius?: number;
}): React.JSX.Element | null {
  const layer = useWebGLLayer();
  const series = useHeatmapSeriesContext();

  const seriesToDisplay = series?.series[series.seriesOrder[0]];

  if (!layer || !seriesToDisplay) {
    return null;
  }

  return (
    <HeatmapWebGLPlotImpl
      gl={layer.gl}
      registerDraw={layer.registerDraw}
      requestRender={layer.requestRender}
      borderRadius={borderRadius ?? 0}
      series={seriesToDisplay}
    />
  );
}

function HeatmapWebGLPlotImpl(props: {
  gl: WebGL2RenderingContext;
  registerDraw: (drawRef: React.RefObject<(() => void) | null>) => () => void;
  requestRender: () => void;
  borderRadius: number;
  series: DefaultizedHeatmapSeriesType;
}) {
  const { gl, registerDraw, requestRender, borderRadius, series } = props;

  const drawingArea = useDrawingArea();
  const xScale = useXScale<'band'>();
  const yScale = useYScale<'band'>();

  const [program, setProgram] = React.useState<HeatmapWebGLProgram | null>(null);
  const dataLength = series.data.length;

  const drawRef = React.useRef<(() => void) | null>(null);

  React.useEffect(() => {
    drawRef.current = () => {
      program?.render(dataLength);
    };
  }, [program, dataLength]);

  React.useEffect(() => {
    const unregister = registerDraw(drawRef);
    return unregister;
  }, [registerDraw]);

  React.useEffect(() => {
    const prog = new HeatmapWebGLProgram(gl);
    setProgram(prog);
    return () => {
      prog.dispose();
    };
  }, [gl]);

  const width = xScale.bandwidth();
  const height = yScale.bandwidth();
  /* A border radius cannot be larger than half the width or height of the rectangle. */
  const seriesBorderRadius = Math.min(borderRadius ?? 0, width / 2, height / 2);

  React.useEffect(() => {
    program?.setResolution(drawingArea.width, drawingArea.height);
    requestRender();
  }, [drawingArea.height, drawingArea.width, program, requestRender]);

  React.useEffect(() => {
    program?.setRectDimensions(width, height);
    requestRender();
  }, [width, height, program, requestRender]);

  React.useEffect(() => {
    program?.setBorderRadius(seriesBorderRadius);
    requestRender();
  }, [seriesBorderRadius, program, requestRender]);

  const plotData = useHeatmapPlotData(drawingArea, series, xScale, yScale);
  React.useEffect(() => {
    program?.plot(plotData);
    requestRender();
  }, [plotData, program, requestRender]);

  return null;
}
