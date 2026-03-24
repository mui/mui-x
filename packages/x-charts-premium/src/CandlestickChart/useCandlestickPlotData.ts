import * as React from 'react';
import { type ScaleBand } from '@mui/x-charts-vendor/d3-scale';
import {
  type D3ContinuousScale,
  selectorChartsHighlightStateCallback,
  useStore,
} from '@mui/x-charts/internals';
import { type ChartDrawingArea } from '@mui/x-charts/hooks';
import { useTheme } from '@mui/material/styles';
import type { DefaultizedOHLCSeriesType } from '../models';
import { parseColor } from '../utils/webgl/parseColor';
import getColor from './seriesConfig/getColor';

const FADE_OPACITY = 0.3;
const HIGHLIGHT_BRIGHTNESS = 1.2;

export interface CandlestickPlotData {
  candleCenters: Float32Array;
  candleHeights: Float32Array;
  candleColors: Float32Array;
  wickCenters: Float32Array;
  wickHeights: Float32Array;
  wickColors: Float32Array;
}

export function useCandlestickPlotData(
  drawingArea: ChartDrawingArea,
  series: DefaultizedOHLCSeriesType,
  xScale: ScaleBand<{ toString(): string }>,
  yScale: D3ContinuousScale,
): CandlestickPlotData {
  const theme = useTheme();
  const store = useStore();
  const getHighlightState = store.use(selectorChartsHighlightStateCallback);

  const wickColor = React.useMemo(
    () => parseColor(theme.palette.text.primary),
    [theme.palette.text.primary],
  );
  const colorGetter = React.useMemo(() => getColor(series, undefined), [series]);

  return React.useMemo(() => {
    const candleCenters = new Float32Array(series.data.length * 2);
    const candleHeights = new Float32Array(series.data.length);
    // Two wicks per candle: upper (candle top → high) and lower (candle bottom → low)
    const wickCenters = new Float32Array(series.data.length * 2 * 2);
    const wickHeights = new Float32Array(series.data.length * 2);
    const candleColors = new Float32Array(series.data.length * 4);
    const wickColors = new Float32Array(series.data.length * 2 * 4);
    const xDomain = xScale.domain();

    for (let dataIndex = 0; dataIndex < series.data.length; dataIndex += 1) {
      const datum = series.data[dataIndex];

      if (datum === null) {
        // Set alpha to 0 to hide the candle and both wicks
        candleColors[dataIndex * 4 + 3] = 0.0;
        wickColors[dataIndex * 2 * 4 + 3] = 0.0;
        wickColors[(dataIndex * 2 + 1) * 4 + 3] = 0.0;
        continue;
      }

      // Can't return undefined because we're calling it with a value from the domain
      const scaledX = xScale(xDomain[dataIndex])!;

      const [open, high, low, close] = datum;

      const x = scaledX - drawingArea.left;
      const scaledOpen = yScale(open);
      const scaledClose = yScale(close);
      const candleBottom = Math.min(scaledOpen, scaledClose) - drawingArea.top;
      const candleTop = Math.max(scaledOpen, scaledClose) - drawingArea.top;
      const wickBottom = yScale(low) - drawingArea.top;
      const wickTop = yScale(high) - drawingArea.top;

      candleCenters[dataIndex * 2] = x;
      candleCenters[dataIndex * 2 + 1] = (candleTop + candleBottom) / 2;
      candleHeights[dataIndex] = candleTop - candleBottom;

      // We have two wicks per candle so that when a candle is faded the wick isn't visible behind the candle body.
      const upperWickIndex = dataIndex * 2;
      wickCenters[upperWickIndex * 2] = x;
      wickCenters[upperWickIndex * 2 + 1] = (wickTop + candleBottom) / 2;
      wickHeights[upperWickIndex] = wickTop - candleBottom;

      const lowerWickIndex = dataIndex * 2 + 1;
      wickCenters[lowerWickIndex * 2] = x;
      wickCenters[lowerWickIndex * 2 + 1] = (candleTop + wickBottom) / 2;
      wickHeights[lowerWickIndex] = candleTop - wickBottom;

      const candleColor = parseColor(colorGetter(dataIndex));

      candleColors[dataIndex * 4] = candleColor[0];
      candleColors[dataIndex * 4 + 1] = candleColor[1];
      candleColors[dataIndex * 4 + 2] = candleColor[2];
      candleColors[dataIndex * 4 + 3] = candleColor[3];

      for (let w = 0; w < 2; w += 1) {
        const wickIdx = (dataIndex * 2 + w) * 4;
        wickColors[wickIdx] = wickColor[0];
        wickColors[wickIdx + 1] = wickColor[1];
        wickColors[wickIdx + 2] = wickColor[2];
        wickColors[wickIdx + 3] = wickColor[3];
      }

      const identifier = { type: 'ohlc', seriesId: series.id, dataIndex } as const;
      const highlightState = getHighlightState(identifier);
      const highlighted = highlightState === 'highlighted';
      const faded = highlightState === 'faded';

      if (highlighted) {
        // Mimics CSS's filter: brightness(1.2), which multiplies the RGB values by 1.2, without affecting the alpha channel
        candleColors[dataIndex * 4] *= HIGHLIGHT_BRIGHTNESS;
        candleColors[dataIndex * 4 + 1] *= HIGHLIGHT_BRIGHTNESS;
        candleColors[dataIndex * 4 + 2] *= HIGHLIGHT_BRIGHTNESS;

        for (let w = 0; w < 2; w += 1) {
          const wickIdx = (dataIndex * 2 + w) * 4;
          wickColors[wickIdx] *= HIGHLIGHT_BRIGHTNESS;
          wickColors[wickIdx + 1] *= HIGHLIGHT_BRIGHTNESS;
          wickColors[wickIdx + 2] *= HIGHLIGHT_BRIGHTNESS;
        }
      } else if (faded) {
        candleColors[dataIndex * 4 + 3] *= FADE_OPACITY;
        for (let w = 0; w < 2; w += 1) {
          wickColors[(dataIndex * 2 + w) * 4 + 3] *= FADE_OPACITY;
        }
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
    colorGetter,
    drawingArea.left,
    drawingArea.top,
    getHighlightState,
    wickColor,
    series.data,
    series.id,
    xScale,
    yScale,
  ]);
}
