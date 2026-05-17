'use client';
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
  /* RGBA, 1 byte per channel; shader reads normalized [0, 1] floats. Uint8Clamped lets us
   * apply the highlight brightness multiplier without manual saturation. */
  candleColors: Uint8ClampedArray;
  wickCenters: Float32Array;
  wickHeights: Float32Array;
  wickColors: Uint8ClampedArray;
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
  const store = useStore();
  const getHighlightState = store.use(selectorChartsHighlightStateCallback);

  const wickColor = React.useMemo(
    () => parseColor(theme.palette.text.primary),
    [theme.palette.text.primary],
  );
  const colorGetter = React.useMemo(() => getColor(series, undefined), [series]);

  /* Colors only change when the series, color getter, or highlight state changes.
   * Cache them so zoom-only renders return the same Uint8ClampedArray refs and the
   * GL upload short-circuit can skip re-uploading colors.
   * `parseColor` returns bytes in [0, 255]. Uint8Clamped rounds + clamps automatically,
   * so brightness multiplications can't overflow. */
  const colors = React.useMemo(() => {
    const n = series.data.length;
    const candleColors = new Uint8ClampedArray(n * 4);
    const wickColors = new Uint8ClampedArray(n * 2 * 4);

    /* The wick color is theme-derived and identical for every wick. Pre-build an
     * 8-byte template (both wicks for one candle) and copy it in via the typed
     * array memcpy path instead of writing 8 bytes per candle by hand. */
    const [wickR, wickG, wickB, wickA] = wickColor;
    const wickPair = new Uint8ClampedArray([
      wickR,
      wickG,
      wickB,
      wickA,
      wickR,
      wickG,
      wickB,
      wickA,
    ]);

    for (let dataIndex = 0; dataIndex < n; dataIndex += 1) {
      const datum = series.data[dataIndex];
      const candleOffset = dataIndex * 4;
      const wickOffset = dataIndex * 8;

      if (datum === null) {
        /* Alpha 0 hides the candle and both wicks; src-alpha blending makes RGB irrelevant. */
        candleColors[candleOffset + 3] = 0;
        wickColors[wickOffset + 3] = 0;
        wickColors[wickOffset + 7] = 0;
        continue;
      }

      const candleColor = parseColor(colorGetter(dataIndex));
      candleColors[candleOffset] = candleColor[0];
      candleColors[candleOffset + 1] = candleColor[1];
      candleColors[candleOffset + 2] = candleColor[2];
      candleColors[candleOffset + 3] = candleColor[3];

      wickColors.set(wickPair, wickOffset);

      const highlightState = getHighlightState({
        type: 'ohlc',
        seriesId: series.id,
        dataIndex,
      });

      if (highlightState === 'highlighted') {
        /* Mimics CSS's filter: brightness(1.2): multiplies RGB by 1.2 without touching alpha. */
        candleColors[candleOffset] *= HIGHLIGHT_BRIGHTNESS;
        candleColors[candleOffset + 1] *= HIGHLIGHT_BRIGHTNESS;
        candleColors[candleOffset + 2] *= HIGHLIGHT_BRIGHTNESS;
        wickColors[wickOffset] *= HIGHLIGHT_BRIGHTNESS;
        wickColors[wickOffset + 1] *= HIGHLIGHT_BRIGHTNESS;
        wickColors[wickOffset + 2] *= HIGHLIGHT_BRIGHTNESS;
        wickColors[wickOffset + 4] *= HIGHLIGHT_BRIGHTNESS;
        wickColors[wickOffset + 5] *= HIGHLIGHT_BRIGHTNESS;
        wickColors[wickOffset + 6] *= HIGHLIGHT_BRIGHTNESS;
      } else if (highlightState === 'faded') {
        candleColors[candleOffset + 3] *= FADE_OPACITY;
        wickColors[wickOffset + 3] *= FADE_OPACITY;
        wickColors[wickOffset + 7] *= FADE_OPACITY;
      }
    }

    return { candleColors, wickColors };
  }, [colorGetter, wickColor, getHighlightState, series.data, series.id]);

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
    const top = drawingArea.top;
    /* Band scales are linear in domain index, so xScale(domain[i]) = x0 + step*i.
     * Resolving the base position once (and folding in -left) avoids n hashmap
     * lookups in the loop body. */
    const xStep = xScale.step();
    const x0 = n > 0 ? xScale(xScale.domain()[0])! - drawingArea.left : 0;

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

      const open = datum[0];
      const high = datum[1];
      const low = datum[2];
      const close = datum[3];

      const x = x0 + xStep * dataIndex;
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
      ...positions,
      ...colors,
    }),
    [positions, colors],
  );
}
