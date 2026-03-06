import * as React from 'react';
import { type ScaleBand } from '@mui/x-charts-vendor/d3-scale';
import {
  type D3ContinuousScale,
  selectorChartsIsFadedCallback,
  selectorChartsIsHighlightedCallback,
  useStore,
} from '@mui/x-charts/internals';
import { type ChartDrawingArea } from '@mui/x-charts/hooks';
import { useTheme } from '@mui/material/styles';
import type { DefaultizedOHLCSeriesType } from '../models';
import { parseColor } from '../utils/webgl/parseColor';

const FADE_OPACITY = 0.3;
const HIGHLIGHT_BRIGHTNESS = 1.2;

export function useCandlestickPlotData(
  drawingArea: ChartDrawingArea,
  series: DefaultizedOHLCSeriesType,
  xScale: ScaleBand<{ toString(): string }>,
  yScale: D3ContinuousScale,
) {
  const theme = useTheme();
  const store = useStore();
  const isHighlighted = store.use(selectorChartsIsHighlightedCallback);
  const isFaded = store.use(selectorChartsIsFadedCallback);

  const lineColor = React.useMemo(
    () => parseColor(theme.palette.text.primary),
    [theme.palette.text.primary],
  );
  const bullishColor = React.useMemo(
    () => parseColor(theme.palette.success.main),
    [theme.palette.success.main],
  );
  const bearishColor = React.useMemo(
    () => parseColor(theme.palette.error.main),
    [theme.palette.error.main],
  );

  return React.useMemo(() => {
    const candleCenters = new Float32Array(series.data.length * 2);
    const candleHeights = new Float32Array(series.data.length);
    const wickCenters = new Float32Array(series.data.length * 2);
    const wickHeights = new Float32Array(series.data.length);
    const candleColors = new Float32Array(series.data.length * 4);
    const wickColors = new Float32Array(series.data.length * 4);
    const xDomain = xScale.domain();

    for (let dataIndex = 0; dataIndex < series.data.length; dataIndex += 1) {
      const datum = series.data[dataIndex];

      if (datum === null) {
        // Set alpha to 0 to hide the candle
        candleColors[dataIndex * 4 + 3] = 0.0;
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

      candleCenters[dataIndex * 2] = x;
      candleCenters[dataIndex * 2 + 1] = (rectTop + rectBottom) / 2;
      candleHeights[dataIndex] = rectTop - rectBottom;

      wickCenters[dataIndex * 2] = candleCenters[dataIndex * 2];
      wickCenters[dataIndex * 2 + 1] = (lineTop + lineBottom) / 2;
      wickHeights[dataIndex] = lineTop - lineBottom;

      if (close >= open) {
        // Bullish - green
        candleColors[dataIndex * 4] = bullishColor[0];
        candleColors[dataIndex * 4 + 1] = bullishColor[1];
        candleColors[dataIndex * 4 + 2] = bullishColor[2];
        candleColors[dataIndex * 4 + 3] = bullishColor[3];
      } else {
        // Bearish - red
        candleColors[dataIndex * 4] = bearishColor[0];
        candleColors[dataIndex * 4 + 1] = bearishColor[1];
        candleColors[dataIndex * 4 + 2] = bearishColor[2];
        candleColors[dataIndex * 4 + 3] = bearishColor[3];
      }

      wickColors[dataIndex * 4] = lineColor[0];
      wickColors[dataIndex * 4 + 1] = lineColor[1];
      wickColors[dataIndex * 4 + 2] = lineColor[2];
      wickColors[dataIndex * 4 + 3] = lineColor[3];

      const identifier = { type: 'ohlc', seriesId: series.id, dataIndex } as const;
      const highlighted = isHighlighted(identifier);
      const faded = isFaded(identifier);

      if (highlighted) {
        // Mimics CSS's filter: brightness(1.2), which multiplies the RGB values by 1.2, without affecting the alpha channel
        candleColors[dataIndex * 4] *= HIGHLIGHT_BRIGHTNESS;
        candleColors[dataIndex * 4 + 1] *= HIGHLIGHT_BRIGHTNESS;
        candleColors[dataIndex * 4 + 2] *= HIGHLIGHT_BRIGHTNESS;

        wickColors[dataIndex * 4] *= HIGHLIGHT_BRIGHTNESS;
        wickColors[dataIndex * 4 + 1] *= HIGHLIGHT_BRIGHTNESS;
        wickColors[dataIndex * 4 + 2] *= HIGHLIGHT_BRIGHTNESS;
      } else if (faded) {
        candleColors[dataIndex * 4 + 3] *= FADE_OPACITY;
        wickColors[dataIndex * 4 + 3] *= FADE_OPACITY;
      }
    }

    return {
      candleCenters,
      candleHeights,
      candleColors,
      wickCenters,
      wickHeights,
      wickColors,
    };
  }, [
    bearishColor,
    bullishColor,
    drawingArea.left,
    drawingArea.top,
    isFaded,
    isHighlighted,
    lineColor,
    series.data,
    series.id,
    xScale,
    yScale,
  ]);
}
