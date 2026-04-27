'use client';
import * as React from 'react';
import { type ScaleBand } from '@mui/x-charts-vendor/d3-scale';
import { type DefaultizedHeatmapSeriesType } from '@mui/x-charts-pro/models';
import { type ChartDrawingArea, useZColorScale } from '@mui/x-charts/hooks';
import { parseColor } from '../../utils/webgl/parseColor';

/* Far enough off-canvas that the rect is never visible; used for invalid x/y entries.
 * Avoids coupling the position pass to the color pass. */
const OFFSCREEN = -1e9;

function ensurePoolFloat32(pool: Float32Array | undefined, n: number) {
  if (pool && pool.length >= n) {
    return pool;
  }
  return new Float32Array(n);
}

export function useHeatmapPlotData(
  drawingArea: ChartDrawingArea,
  series: DefaultizedHeatmapSeriesType,
  xScale: ScaleBand<{ toString(): string }>,
  yScale: ScaleBand<{ toString(): string }>,
) {
  const width = xScale.bandwidth();
  const height = yScale.bandwidth();
  const colorScale = useZColorScale()!;

  /* Colors only change when series data or color scale changes. Cached so resize renders
   * don't re-upload the colors buffer.
   * Stored as Uint8 (1 byte per channel) — 4x less GPU traffic than Float32 RGBA. */
  const colors = React.useMemo(() => {
    const out = new Uint8Array(series.data.length * 4);
    for (let dataIndex = 0; dataIndex < series.data.length; dataIndex += 1) {
      const value = series.data[dataIndex][2];
      const color = colorScale?.(value);
      if (!color) {
        /* Alpha 0 hides the rect; src-alpha blending makes RGB irrelevant. */
        continue;
      }
      const rgbColor = parseColor(color);
      out[dataIndex * 4] = rgbColor[0] * 255;
      out[dataIndex * 4 + 1] = rgbColor[1] * 255;
      out[dataIndex * 4 + 2] = rgbColor[2] * 255;
      out[dataIndex * 4 + 3] = 255;
    }
    return out;
  }, [colorScale, series.data]);

  /* Positions change on resize (drawing area / band width). Pooled to avoid per-frame
   * allocation. Subarray view gives a fresh identity each call so the upload still runs. */
  const centersPoolRef = React.useRef<Float32Array | null>(null);
  const centers = React.useMemo(() => {
    const n = series.data.length;
    const pool = ensurePoolFloat32(centersPoolRef.current ?? undefined, n * 2);
    centersPoolRef.current = pool;

    const left = drawingArea.left;
    const top = drawingArea.top;
    const halfWidth = width / 2;
    const halfHeight = height / 2;
    const xDomain = xScale.domain();
    const yDomain = yScale.domain();

    for (let dataIndex = 0; dataIndex < n; dataIndex += 1) {
      const item = series.data[dataIndex];
      const x = xScale(xDomain[item[0]]);
      const y = yScale(yDomain[item[1]]);
      if (x === undefined || y === undefined) {
        pool[dataIndex * 2] = OFFSCREEN;
        pool[dataIndex * 2 + 1] = OFFSCREEN;
        continue;
      }
      pool[dataIndex * 2] = x + halfWidth - left;
      pool[dataIndex * 2 + 1] = y + halfHeight - top;
    }

    return pool.subarray(0, n * 2);
  }, [drawingArea.left, drawingArea.top, height, series.data, width, xScale, yScale]);

  return React.useMemo(() => ({ centers, colors }), [centers, colors]);
}
