'use client';
import * as React from 'react';
import { FormattedSeries } from '../context/SeriesProvider';
import { SeriesId } from '../models/seriesType/common';
import { ChartSeriesDefaultized } from '../models/seriesType/config';
import { useSeries } from './useSeries';

/**
 * Get access to the internal state of bar series.
 * The returned object contains:
 * - series: a mapping from ids to series attributes.
 * - seriesOrder: the array of series ids.
 * @returns {{ series: Record<SeriesId, DefaultizedBarSeriesType>; seriesOrder: SeriesId[]; } | undefined}  barSeries
 */
export function useBarSeries(): FormattedSeries['bar'];
/**
 * Get access to the internal state of bar series.
 *
 * @param {SeriesId} seriesId The id of the series to get.
 * @returns {ChartSeriesDefaultized<'bar'> | undefined}  barSeries
 */
export function useBarSeries(seriesId: SeriesId): ChartSeriesDefaultized<'bar'>;
/**
 * Get access to the internal state of bar series.
 *
 * @param {SeriesId[]} seriesIds The ids of the series to get. Order is preserved.
 * @returns {ChartSeriesDefaultized<'bar'>[] | undefined}  barSeries
 */
export function useBarSeries(...seriesIds: SeriesId[]): ChartSeriesDefaultized<'bar'>[];
export function useBarSeries(...seriesIds: SeriesId[]): any {
  const series = useSeries();

  return React.useMemo(
    () => {
      if (seriesIds.length === 0) {
        return series.bar;
      }

      if (seriesIds.length === 1) {
        return series?.bar?.series[seriesIds[0]];
      }

      return seriesIds.map((id) => series?.bar?.series[id]).filter(Boolean);
    },
    // DANGER: Ensure that the dependencies array is correct.
    // eslint-disable-next-line react-compiler/react-compiler
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [series.bar, ...seriesIds],
  );
}
