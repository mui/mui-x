'use client';
import * as React from 'react';
import { useDrawingArea, useScatterSeriesContext, useXAxes, useYAxes } from '@mui/x-charts/hooks';
import { parseColor } from '../../utils/webgl/parseColor';

const DEFAULT_MARKER_SIZE = 4;

export interface ScatterWebGLPlotData {
  centers: Float32Array;
  sizes: Float32Array;
  colors: Float32Array;
  pointCount: number;
}

const EMPTY_DATA: ScatterWebGLPlotData = {
  centers: new Float32Array(0),
  sizes: new Float32Array(0),
  colors: new Float32Array(0),
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
  const cachedStylesRef = React.useRef<{
    seriesData: typeof seriesData;
    sizes: Float32Array;
    colors: Float32Array;
  } | null>(null);

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

    const centers = new Float32Array(maxPoints * 2);
    const sizes = reuseStyles ? cached!.sizes : new Float32Array(maxPoints);
    const colors = reuseStyles ? cached!.colors : new Float32Array(maxPoints * 4);

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

      const [cr, cg, cb, ca] = parseColor(s.color);
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
