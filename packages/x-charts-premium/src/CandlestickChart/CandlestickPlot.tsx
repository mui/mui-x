'use client';
import * as React from 'react';
import { type ContinuousScaleName, useDrawingArea } from '@mui/x-charts/internals';
import { useXScale, useYScale } from '@mui/x-charts/hooks';
import { type DefaultizedOHLCSeriesType } from '../models';
import { useOHLCSeriesContext } from '../hooks/useOHLCSeries';
import { useCandlestickPlotData } from './useCandlestickPlotData';
import { useWebGLLayer } from '../ChartsWebGLLayer/ChartsWebGLLayer';
import { checkCandlestickScaleErrors } from './checkCandlestickScaleErrors';
import { CandlestickWebGLProgram } from './CandlestickWebGLProgram';

export interface CandlestickPlotProps {}

export function CandlestickPlot() {
  return <CandlestickWebGLPlot />;
}

function CandlestickWebGLPlot() {
  const layer = useWebGLLayer();
  const series = useOHLCSeriesContext();

  const seriesToDisplay = series?.series[series.seriesOrder[0]];
  const isHidden = !seriesToDisplay || seriesToDisplay.hidden;

  React.useEffect(() => {
    if (layer && isHidden) {
      layer.requestRender();
    }
  }, [layer, isHidden]);

  if (!layer || isHidden) {
    return null;
  }

  return (
    <CandlestickWebGLPlotImpl
      gl={layer.gl}
      registerDraw={layer.registerDraw}
      requestRender={layer.requestRender}
      series={seriesToDisplay}
    />
  );
}

function CandlestickWebGLPlotImpl({
  gl,
  registerDraw,
  requestRender,
  series,
}: {
  gl: WebGL2RenderingContext;
  registerDraw: (drawRef: React.RefObject<(() => void) | null>) => () => void;
  requestRender: () => void;
  series: DefaultizedOHLCSeriesType;
}) {
  const drawingArea = useDrawingArea();
  const xScale = useXScale<'band'>();
  const yScale = useYScale<ContinuousScaleName>();
  checkCandlestickScaleErrors(series.id, xScale);

  const [program, setProgram] = React.useState<CandlestickWebGLProgram | null>(null);
  const dataLength = series.data.length;

  const drawRef = React.useRef<(() => void) | null>(null);
  drawRef.current = () => {
    program?.render(dataLength);
  };

  React.useEffect(() => {
    return registerDraw(drawRef);
  }, [registerDraw]);

  React.useEffect(() => {
    const prog = new CandlestickWebGLProgram(gl);
    setProgram(prog);

    return () => {
      prog.dispose();
    };
  }, [gl]);

  React.useEffect(() => {
    program?.setResolution(drawingArea.width, drawingArea.height);

    requestRender();
  }, [drawingArea.height, drawingArea.width, gl, requestRender, program]);

  const candleWidth = xScale.bandwidth();
  React.useEffect(() => {
    program?.setCandleWidth(candleWidth);

    requestRender();
  }, [candleWidth, gl, program, requestRender]);

  const plotData = useCandlestickPlotData(drawingArea, series, xScale, yScale);
  React.useEffect(() => {
    program?.plot(plotData);

    requestRender();
  }, [gl, plotData, program, requestRender]);

  return null;
}
