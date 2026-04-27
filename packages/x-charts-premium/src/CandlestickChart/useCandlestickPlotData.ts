'use client';
import * as React from 'react';
import { type ScaleBand } from '@mui/x-charts-vendor/d3-scale';
import { type D3ContinuousScale } from '@mui/x-charts/internals';
import { type ChartDrawingArea } from '@mui/x-charts/hooks';
import { useTheme } from '@mui/material/styles';
import type { DefaultizedOHLCSeriesType } from '../models';
import { parseColor } from '../utils/webgl/parseColor';
import getColor from './seriesConfig/getColor';

export interface CandlestickPlotData {
  candleCenters: Float32Array;
  candleHeights: Float32Array;
  /* RGBA, 1 byte per channel; shader reads normalized [0, 1] floats. */
  candleColors: Uint8Array;
  wickCenters: Float32Array;
  wickHeights: Float32Array;
  wickColors: Uint8Array;
}

type PositionsPool = {
  candleCenters: Float32Array;
  candleHeights: Float32Array;
  wickCenters: Float32Array;
  wickHeights: Float32Array;
};

function ensurePoolFloat32(pool: Float32Array | undefined, n: number) {
  if (pool && pool.length >= n) {
    return pool;
  }
  return new Float32Array(n);
}

export function useCandlestickPlotData(
  drawingArea: ChartDrawingArea,
  series: DefaultizedOHLCSeriesType,
  xScale: ScaleBand<{ toString(): string }>,
  yScale: D3ContinuousScale,
): CandlestickPlotData {
  const theme = useTheme();

  const wickColor = React.useMemo(
    () => parseColor(theme.palette.text.primary),
    [theme.palette.text.primary],
  );
  const colorGetter = React.useMemo(() => getColor(series, undefined), [series]);

  /* Colors only change when the series or color getter changes. Cache them so zoom-only
   * renders return the same Uint8Array refs and the GL upload short-circuit can skip
   * re-uploading colors. `parseColor` returns floats in [0, 1]; scaled to bytes [0, 255]. */
  const colors = React.useMemo(() => {
    const candleColors = new Uint8Array(series.data.length * 4);
    const wickColors = new Uint8Array(series.data.length * 2 * 4);

    const wickR = wickColor[0] * 255;
    const wickG = wickColor[1] * 255;
    const wickB = wickColor[2] * 255;
    const wickA = wickColor[3] * 255;

    for (let dataIndex = 0; dataIndex < series.data.length; dataIndex += 1) {
      const datum = series.data[dataIndex];

      if (datum === null) {
        /* Alpha 0 hides the candle and both wicks; src-alpha blending makes RGB irrelevant. */
        continue;
      }

      const candleColor = parseColor(colorGetter(dataIndex));
      candleColors[dataIndex * 4] = candleColor[0] * 255;
      candleColors[dataIndex * 4 + 1] = candleColor[1] * 255;
      candleColors[dataIndex * 4 + 2] = candleColor[2] * 255;
      candleColors[dataIndex * 4 + 3] = candleColor[3] * 255;

      for (let w = 0; w < 2; w += 1) {
        const wickIdx = (dataIndex * 2 + w) * 4;
        wickColors[wickIdx] = wickR;
        wickColors[wickIdx + 1] = wickG;
        wickColors[wickIdx + 2] = wickB;
        wickColors[wickIdx + 3] = wickA;
      }
    }

    return { candleColors, wickColors };
  }, [colorGetter, wickColor, series.data]);

  /* Positions change every zoom/drag. Pool the typed arrays in a ref so we don't
   * allocate ~1.5 MB per frame at large series sizes; hand out fresh subarray views
   * so the upload short-circuit still fires. */
  const positionsPoolRef = React.useRef<PositionsPool | null>(null);

  const positions = React.useMemo(() => {
    const n = series.data.length;
    const pool = positionsPoolRef.current;
    const candleCenters = ensurePoolFloat32(pool?.candleCenters, n * 2);
    const candleHeights = ensurePoolFloat32(pool?.candleHeights, n);
    const wickCenters = ensurePoolFloat32(pool?.wickCenters, n * 2 * 2);
    const wickHeights = ensurePoolFloat32(pool?.wickHeights, n * 2);
    positionsPoolRef.current = { candleCenters, candleHeights, wickCenters, wickHeights };

    /* Hoist drawing-area offsets into scalars so the loop body doesn't re-read them. */
    const left = drawingArea.left;
    const top = drawingArea.top;
    const xDomain = xScale.domain();

    for (let dataIndex = 0; dataIndex < n; dataIndex += 1) {
      const datum = series.data[dataIndex];

      if (datum === null) {
        /* Pool is reused, so zero out stale values from previous frames. */
        candleHeights[dataIndex] = 0;
        candleCenters[dataIndex * 2] = 0;
        candleCenters[dataIndex * 2 + 1] = 0;
        wickHeights[dataIndex * 2] = 0;
        wickHeights[dataIndex * 2 + 1] = 0;
        wickCenters[dataIndex * 2 * 2] = 0;
        wickCenters[dataIndex * 2 * 2 + 1] = 0;
        wickCenters[(dataIndex * 2 + 1) * 2] = 0;
        wickCenters[(dataIndex * 2 + 1) * 2 + 1] = 0;
        continue;
      }

      const scaledX = xScale(xDomain[dataIndex])!;
      const open = datum[0];
      const high = datum[1];
      const low = datum[2];
      const close = datum[3];

      const x = scaledX - left;
      const scaledOpen = yScale(open);
      const scaledClose = yScale(close);
      const candleBottom = Math.min(scaledOpen, scaledClose) - top;
      const candleTop = Math.max(scaledOpen, scaledClose) - top;
      const wickBottom = yScale(low) - top;
      const wickTop = yScale(high) - top;

      candleCenters[dataIndex * 2] = x;
      candleCenters[dataIndex * 2 + 1] = (candleTop + candleBottom) / 2;
      candleHeights[dataIndex] = candleTop - candleBottom;

      /* Two wicks per candle so a faded candle body doesn't have a wick poking through it. */
      const upperWickIndex = dataIndex * 2;
      wickCenters[upperWickIndex * 2] = x;
      wickCenters[upperWickIndex * 2 + 1] = (wickTop + candleBottom) / 2;
      wickHeights[upperWickIndex] = wickTop - candleBottom;

      const lowerWickIndex = dataIndex * 2 + 1;
      wickCenters[lowerWickIndex * 2] = x;
      wickCenters[lowerWickIndex * 2 + 1] = (candleTop + wickBottom) / 2;
      wickHeights[lowerWickIndex] = candleTop - wickBottom;
    }

    /* Subarrays share the pool's ArrayBuffer but have new identity, which lets the GL
     * upload short-circuit detect that the data has actually changed this frame. */
    return {
      candleCenters: candleCenters.subarray(0, n * 2),
      candleHeights: candleHeights.subarray(0, n),
      wickCenters: wickCenters.subarray(0, n * 2 * 2),
      wickHeights: wickHeights.subarray(0, n * 2),
    };
  }, [drawingArea.left, drawingArea.top, series.data, xScale, yScale]);

  return React.useMemo(
    () => ({
      candleCenters: positions.candleCenters,
      candleHeights: positions.candleHeights,
      candleColors: colors.candleColors,
      wickCenters: positions.wickCenters,
      wickHeights: positions.wickHeights,
      wickColors: colors.wickColors,
    }),
    [positions, colors],
  );
}
