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
import { selectorCandlestickItemAtPosition } from '../plugins/selectors/useChartCandlestickPosition.selectors';
import { useCandlestickPlotData } from './useCandlestickPlotData';
import { useWebGLResizeObserver } from '../utils/webgl/useWebGLResizeObserver';
import { useWebGLContext } from '../ChartsWebGLLayer/ChartsWebGLLayer';
import { checkCandlestickScaleErrors } from './checkCandlestickScaleErrors';
import { CandlestickWebGLProgram } from './CandlestickWebGLProgram';

export interface CandlestickPlotProps {}

export function CandlestickPlot() {
  return <CandlestickWebGLPlot />;
}

function CandlestickWebGLPlot() {
  const gl = useWebGLContext();
  const series = useOHLCSeriesContext();

  const seriesToDisplay = series?.series[series.seriesOrder[0]];

  if (!gl || !seriesToDisplay || seriesToDisplay.hidden) {
    return null;
  }

  return <CandlestickWebGLPlotImpl gl={gl} series={seriesToDisplay} />;
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

  const [program, setProgram] = React.useState<CandlestickWebGLProgram | null>(null);
  const dataLength = series.data.length;
  const renderScheduledRef = React.useRef<boolean>(false);
  useRegisterPointerInteractions(selectorCandlestickItemAtPosition);

  React.useEffect(() => {
    const prog = new CandlestickWebGLProgram(gl);
    setProgram(prog);

    return () => {
      prog.dispose();
    };
  }, [gl]);

  const render = React.useCallback(() => {
    renderScheduledRef.current = false;

    program?.render(dataLength);
  }, [program, dataLength]);

  const scheduleRender = React.useCallback(() => {
    renderScheduledRef.current = true;
  }, []);

  // On resize render directly to avoid a frame where the canvas is blank
  useWebGLResizeObserver(render);

  React.useEffect(() => {
    program?.setResolution(drawingArea.width, drawingArea.height);

    scheduleRender();
  }, [drawingArea.height, drawingArea.width, gl, scheduleRender, program]);

  const candleWidth = xScale.bandwidth();
  React.useEffect(() => {
    program?.setCandleWidth(candleWidth);

    scheduleRender();
  }, [candleWidth, gl, program, scheduleRender]);

  const plotData = useCandlestickPlotData(drawingArea, series, xScale, yScale);
  React.useEffect(() => {
    program?.plot(plotData);

    scheduleRender();
  }, [gl, plotData, program, scheduleRender]);

  React.useEffect(() => {
    if (renderScheduledRef.current) {
      render();
    }
  });

  return null;
}
