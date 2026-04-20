'use client';
import * as React from 'react';
import { type ContinuousScaleName, useDrawingArea } from '@mui/x-charts/internals';
import { useXScale, useYScale } from '@mui/x-charts/hooks';
import { type DefaultizedOHLCSeriesType } from '../models';
import { useOHLCSeriesContext } from '../hooks/useOHLCSeries';
import { useCandlestickPlotData } from './useCandlestickPlotData';
import { useWebGLLayer } from '../internals/useWebGLLayer';
import { checkCandlestickScaleErrors } from './checkCandlestickScaleErrors';
import { CandlestickWebGLProgram } from './CandlestickWebGLProgram';

export interface CandlestickPlotProps { }

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
      layer.webGLRequestRender();
    }
  }, [layer, isHidden]);

  if (!layer || isHidden) {
    return null;
  }

  return (
    <CandlestickWebGLPlotImpl
      gl={layer.gl}
      webGLRegisterDraw={layer.webGLRegisterDraw}
      webGLRequestRender={layer.webGLRequestRender}
      series={seriesToDisplay}
    />
  );
}

function CandlestickWebGLPlotImpl({
  gl,
  webGLRegisterDraw,
  webGLRequestRender,
  series,
}: {
  gl: WebGL2RenderingContext;
  webGLRegisterDraw: (drawRef: React.RefObject<(() => void) | null>) => () => void;
  webGLRequestRender: () => void;
  series: DefaultizedOHLCSeriesType;
}) {
  const drawingArea = useDrawingArea();
  const xScale = useXScale<'band'>();
  const yScale = useYScale<ContinuousScaleName>();
  checkCandlestickScaleErrors(series.id, xScale);

  const [program, setProgram] = React.useState<CandlestickWebGLProgram | null>(null);
  const dataLength = series.data.length;

  const drawRef = React.useRef<(() => void) | null>(null);

  React.useEffect(() => {
    drawRef.current = () => {
      program?.render(dataLength);
    };
  }, [program, dataLength]);

  React.useEffect(() => {
    return webGLRegisterDraw(drawRef);
  }, [webGLRegisterDraw]);

  React.useEffect(() => {
    const prog = new CandlestickWebGLProgram(gl);
    setProgram(prog);

    return () => {
      prog.dispose();
    };
  }, [gl]);

  React.useEffect(() => {
    program?.setResolution(drawingArea.width, drawingArea.height);

    webGLRequestRender();
  }, [drawingArea.height, drawingArea.width, gl, webGLRequestRender, program]);

  const candleWidth = xScale.bandwidth();
  React.useEffect(() => {
    program?.setCandleWidth(candleWidth);

    webGLRequestRender();
  }, [candleWidth, gl, program, webGLRequestRender]);

  const plotData = useCandlestickPlotData(drawingArea, series, xScale, yScale);
  React.useEffect(() => {
    program?.plot(plotData);

    webGLRequestRender();
  }, [gl, plotData, program, webGLRequestRender]);

  return null;
}
