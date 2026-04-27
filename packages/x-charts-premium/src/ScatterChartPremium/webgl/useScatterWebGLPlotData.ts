'use client';
import * as React from 'react';
import { useDrawingArea, useScatterSeriesContext, useXAxes, useYAxes } from '@mui/x-charts/hooks';
import { parseColor } from '../../utils/webgl/parseColor';

const DEFAULT_MARKER_SIZE = 4;

export interface ScatterWebGLPlotData {
  centers: Float32Array;
  sizes: Float32Array;
  colors: Uint8Array;
  pointCount: number;
}

const EMPTY_DATA: ScatterWebGLPlotData = {
  centers: new Float32Array(0),
  sizes: new Float32Array(0),
  colors: new Uint8Array(0),
  pointCount: 0,
};

export function useScatterWebGLPlotData(): ScatterWebGLPlotData {
  const seriesData = useScatterSeriesContext();
  const { xAxis: xAxes, xAxisIds } = useXAxes();
  const { yAxis: yAxes, yAxisIds } = useYAxes();
  const drawingArea = useDrawingArea();
  const defaultXAxisId = xAxisIds[0];
  const defaultYAxisId = yAxisIds[0];

  // Colors and sizes depend only on series identity (series color + markerSize).
  // When only the drawing area or axes change we reuse the cached Float32Array
  // references so the WebGL program can skip the GPU upload for them.
  // Caveat: if the axis scale starts producing non-numeric values for some points
  // (e.g. NaN after a config change), those points are skipped from the centers
  // walk while the cached sizes/colors entries for them stay in place — which can
  // desynchronise styles from positions until the cache is invalidated. Acceptable
  // for now since seriesData identity changes on any series mutation.
  const cachedStylesRef = React.useRef<{
    seriesData: typeof seriesData;
    sizes: Float32Array;
    colors: Uint8Array;
  } | null>(null);

  // Centers change on every zoom/axis update, but the underlying ArrayBuffer
  // can be reused to avoid allocating ~1.6 MB per zoom frame at 200k points.
  // We return a fresh Float32Array VIEW over the pooled buffer so the WebGL
  // program's reference-equality short-circuit still treats it as new data.
  const centersPoolRef = React.useRef<Float32Array | null>(null);

  return React.useMemo(() => {
    if (!seriesData) {
      return EMPTY_DATA;
    }

    const { series, seriesOrder } = seriesData;

    let maxPoints = 0;
    for (const seriesId of seriesOrder) {
      const s = series[seriesId];
      if (s.hidden) {
        continue;
      }
      maxPoints += s.data?.length ?? 0;
    }

    if (maxPoints === 0) {
      return EMPTY_DATA;
    }

    const cached = cachedStylesRef.current;
    const reuseStyles =
      cached !== null &&
      cached.seriesData === seriesData &&
      cached.sizes.length === maxPoints &&
      cached.colors.length === maxPoints * 4;

    const centersLength = maxPoints * 2;
    let pool = centersPoolRef.current;
    if (pool === null || pool.length < centersLength) {
      pool = new Float32Array(centersLength);
      centersPoolRef.current = pool;
    }
    // New view over the shared buffer — reference identity differs each call so
    // the GPU upload path treats the centers as dirty, but no heap allocation
    // of the underlying buffer is incurred.
    const centers = new Float32Array(pool.buffer, 0, centersLength);
    const sizes = reuseStyles ? cached!.sizes : new Float32Array(maxPoints);
    const colors = reuseStyles ? cached!.colors : new Uint8Array(maxPoints * 4);

    let pointCount = 0;
    const dx = -drawingArea.left;
    const dy = -drawingArea.top;

    for (const seriesId of seriesOrder) {
      const s = series[seriesId];
      if (s.hidden) {
        continue;
      }

      const xAxisId = s.xAxisId ?? defaultXAxisId;
      const yAxisId = s.yAxisId ?? defaultYAxisId;

      if (!(xAxisId in xAxes) || !(yAxisId in yAxes)) {
        continue;
      }

      const xScale = xAxes[xAxisId].scale as (v: number) => number | undefined;
      const yScale = yAxes[yAxisId].scale as (v: number) => number | undefined;
      const data = s.data;
      if (!data) {
        continue;
      }

      const parsed = parseColor(s.color);
      // parseColor returns 0..1; the GPU sees this back as a vec4 in 0..1 because
      // the attribute is uploaded with normalized=true. Uint8Array assignment
      // truncates non-integers, so round before storing.
      const cr = Math.round(parsed[0] * 255);
      const cg = Math.round(parsed[1] * 255);
      const cb = Math.round(parsed[2] * 255);
      const ca = Math.round(parsed[3] * 255);
      const markerSize = s.markerSize ?? DEFAULT_MARKER_SIZE;

      for (let i = 0; i < data.length; i += 1) {
        const point = data[i];
        if (point == null) {
          continue;
        }
        const sx = xScale(point.x);
        const sy = yScale(point.y);
        if (sx == null || sy == null || Number.isNaN(sx) || Number.isNaN(sy)) {
          continue;
        }

        const offset2 = pointCount * 2;
        centers[offset2] = sx + dx;
        centers[offset2 + 1] = sy + dy;

        if (!reuseStyles) {
          sizes[pointCount] = markerSize;

          const offset4 = pointCount * 4;
          colors[offset4] = cr;
          colors[offset4 + 1] = cg;
          colors[offset4 + 2] = cb;
          colors[offset4 + 3] = ca;
        }

        pointCount += 1;
      }
    }

    if (!reuseStyles) {
      cachedStylesRef.current = { seriesData, sizes, colors };
    }

    return { centers, sizes, colors, pointCount };
  }, [seriesData, xAxes, yAxes, drawingArea, defaultXAxisId, defaultYAxisId]);
}
