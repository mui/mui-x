import * as React from 'react';
import { type ScaleBand } from '@mui/x-charts-vendor/d3-scale';
import { type D3ContinuousScale } from '@mui/x-charts/internals';
import { type ChartDrawingArea } from '@mui/x-charts/hooks';
import type { DefaultizedOHLCSeriesType } from '../models';

export function useCandlestickPlotData(
  drawingArea: ChartDrawingArea,
  series: DefaultizedOHLCSeriesType,
  xScale: ScaleBand<{ toString(): string }>,
  yScale: D3ContinuousScale,
) {
  return React.useMemo(() => {
    const rectCenters = new Float32Array(series.data.length * 2);
    const rectHeights = new Float32Array(series.data.length);
    const lineCenters = new Float32Array(series.data.length * 2);
    const lineHeights = new Float32Array(series.data.length);
    const colors = new Float32Array(series.data.length * 4);
    const xDomain = xScale.domain();

    for (let dataIndex = 0; dataIndex < series.data.length; dataIndex += 1) {
      const datum = series.data[dataIndex];

      if (datum === null) {
        // Set alpha to 0 to hide the candle
        colors[dataIndex * 4 + 3] = 0.0;
        continue;
      }

      // Can't return undefined because we're calling it with a value from the domain
      const scaledX = xScale(xDomain[dataIndex])!;

      const [open, high, low, close] = datum;

      const x = scaledX - drawingArea.left;
      const [rectBottom, rectTop] = [
        yScale(open) - drawingArea.top,
        yScale(close) - drawingArea.top,
      ].sort();
      const [lineBottom, lineTop] = [yScale(low) - drawingArea.top, yScale(high) - drawingArea.top];

      rectCenters[dataIndex * 2] = x;
      rectCenters[dataIndex * 2 + 1] = (rectTop + rectBottom) / 2;
      rectHeights[dataIndex] = rectTop - rectBottom;

      lineCenters[dataIndex * 2] = rectCenters[dataIndex * 2];
      lineCenters[dataIndex * 2 + 1] = (lineTop + lineBottom) / 2;
      lineHeights[dataIndex] = lineTop - lineBottom;

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

    return {
      rectCenters,
      rectHeights,
      lineCenters,
      lineHeights,
      colors,
    };
  }, [drawingArea.left, drawingArea.top, series.data, xScale, yScale]);
}
