'use client';
import * as React from 'react';
import { FormattedSeries } from '../context/SeriesProvider';
import { SeriesId } from '../models/seriesType/common';
import { ChartSeriesDefaultized } from '../models/seriesType/config';
import { useSeries } from './useSeries';

/**
 * Get access to the internal state of pie series.
 * The returned object contains:
 * - series: a mapping from ids to series attributes.
 * - seriesOrder: the array of series ids.
 * @returns {{ series: Record<SeriesId, DefaultizedPieSeriesType>; seriesOrder: SeriesId[]; } | undefined}  pieSeries
 */
export function usePieSeries(): FormattedSeries['pie'];
/**
 * Get access to the internal state of pie series.
 *
 * @param {SeriesId} seriesId The id of the series to get.
 * @returns {ChartSeriesDefaultized<'pie'> | undefined}  pieSeries
 */
export function usePieSeries(seriesId: SeriesId): ChartSeriesDefaultized<'pie'>;
/**
 * Get access to the internal state of pie series.
 *
 * @param {SeriesId[]} seriesIds The ids of the series to get. Order is preserved.
 * @returns {ChartSeriesDefaultized<'pie'>[] | undefined}  pieSeries
 */
export function usePieSeries(...seriesIds: SeriesId[]): ChartSeriesDefaultized<'pie'>[];
export function usePieSeries(...seriesIds: SeriesId[]): any {
  const series = useSeries();

  return React.useMemo(
    () => {
      if (seriesIds.length === 0) {
        return series.pie;
      }

      if (seriesIds.length === 1) {
        return series?.pie?.series[seriesIds[0]];
      }

      return seriesIds.map((id) => series?.pie?.series[id]).filter(Boolean);
    },
    // DANGER: Ensure that the dependencies array is correct.
    // eslint-disable-next-line react-compiler/react-compiler
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [series.pie, ...seriesIds],
  );
}
