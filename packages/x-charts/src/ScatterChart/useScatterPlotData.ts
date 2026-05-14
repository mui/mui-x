'use client';
import * as React from 'react';
import { type SeriesId } from '../models/seriesType/common';
import { type D3Scale } from '../models/axis';
import { getValueToPositionMapper } from '../hooks';
import { type DefaultizedScatterSeriesType, type ScatterValueType } from '../models';

type ScatterPlotPoint = ScatterValueType & {
  dataIndex: number;
  seriesId: SeriesId;
  type: 'scatter';
};

/**
 * Above this many points, position computation is sliced across multiple
 * macrotasks so the main thread can paint and respond to input between
 * chunks. Below the threshold the sync path is faster (no scheduler
 * overhead, no state churn).
 */
const ASYNC_CHUNK_THRESHOLD = 5_000;
const CHUNK_SIZE = 5_000;

const EMPTY_RESULT: readonly ScatterPlotPoint[] = [];

export function useScatterPlotData(
  series: DefaultizedScatterSeriesType,
  xScale: D3Scale,
  yScale: D3Scale,
  isPointInside: (x: number, y: number) => boolean,
) {
  const data = series.data;
  const length = data.length;
  const seriesId = series.id;

  const sync = React.useMemo(() => {
    if (length > ASYNC_CHUNK_THRESHOLD) {
      // Heavy work — defer to the chunked effect path below.
      return null;
    }
    return buildScatterPlotPoints(data, xScale, yScale, isPointInside, seriesId, 0, length);
  }, [xScale, yScale, data, length, seriesId, isPointInside]);

  const [asyncResult, setAsyncResult] =
    React.useState<readonly ScatterPlotPoint[]>(EMPTY_RESULT);

  React.useEffect(() => {
    if (length <= ASYNC_CHUNK_THRESHOLD) {
      // Sync path already produced the result.
      return undefined;
    }

    let cancelled = false;
    let i = 0;
    const acc: ScatterPlotPoint[] = [];
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const processChunk = () => {
      if (cancelled) {
        return;
      }
      const until = Math.min(i + CHUNK_SIZE, length);
      buildScatterPlotPoints(data, xScale, yScale, isPointInside, seriesId, i, until, acc);
      i = until;
      if (i < length) {
        // Yield via macrotask so the browser can paint and process input
        // before the next chunk runs.
        timeoutId = setTimeout(processChunk, 0);
      } else {
        setAsyncResult(acc);
      }
    };
    processChunk();

    return () => {
      cancelled = true;
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
    };
  }, [xScale, yScale, data, length, seriesId, isPointInside]);

  return sync ?? asyncResult;
}

function buildScatterPlotPoints(
  data: DefaultizedScatterSeriesType['data'],
  xScale: D3Scale,
  yScale: D3Scale,
  isPointInside: (x: number, y: number) => boolean,
  seriesId: SeriesId,
  start: number,
  end: number,
  out: ScatterPlotPoint[] = [],
): ScatterPlotPoint[] {
  const getXPosition = getValueToPositionMapper(xScale);
  const getYPosition = getValueToPositionMapper(yScale);

  for (let i = start; i < end; i += 1) {
    const scatterPoint = data[i];
    const x = getXPosition(scatterPoint.x);
    const y = getYPosition(scatterPoint.y);
    if (isPointInside(x, y)) {
      out.push({
        x,
        y,
        id: scatterPoint.id,
        seriesId,
        type: 'scatter',
        dataIndex: i,
      });
    }
  }
  return out;
}
