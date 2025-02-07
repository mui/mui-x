'use client';
import * as React from 'react';
import { FormattedSeries } from '../context/SeriesProvider';
import { SeriesId } from '../models/seriesType/common';
import { ChartSeriesDefaultized } from '../models/seriesType/config';
import { useSeries } from './useSeries';

/**
 * Get access to the internal state of line series.
 * The returned object contains:
 * - series: a mapping from ids to series attributes.
 * - seriesOrder: the array of series ids.
 * @returns {{ series: Record<SeriesId, DefaultizedLineSeriesType>; seriesOrder: SeriesId[]; } | undefined}  lineSeries
 */
export function useLineSeries(): FormattedSeries['line'];
/**
 * Get access to the internal state of line series.
 *
 * @param {SeriesId} seriesId The id of the series to get.
 * @returns {ChartSeriesDefaultized<'line'> | undefined}  lineSeries
 */
export function useLineSeries(seriesId: SeriesId): ChartSeriesDefaultized<'line'>;
/**
 * Get access to the internal state of line series.
 *
 * @param {SeriesId[]} seriesIds The ids of the series to get. Order is preserved.
 * @returns {ChartSeriesDefaultized<'line'>[] | undefined}  lineSeries
 */
export function useLineSeries(...seriesIds: SeriesId[]): ChartSeriesDefaultized<'line'>[];
export function useLineSeries(...seriesIds: SeriesId[]): any {
  const series = useSeries();

  return React.useMemo(
    () => {
      if (seriesIds.length === 0) {
        return series.line;
      }

      if (seriesIds.length === 1) {
        return series?.line?.series[seriesIds[0]];
      }

      return seriesIds.map((id) => series?.line?.series[id]).filter(Boolean);
    },
    // DANGER: Ensure that the dependencies array is correct.
    // eslint-disable-next-line react-compiler/react-compiler
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [series.line, ...seriesIds],
  );
}
