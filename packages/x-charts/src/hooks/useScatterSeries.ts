'use client';
import * as React from 'react';
import { FormattedSeries } from '../context/SeriesProvider';
import { SeriesId } from '../models/seriesType/common';
import { ChartSeriesDefaultized } from '../models/seriesType/config';
import { useSeries } from './useSeries';

/**
 * Get access to the internal state of scatter series.
 * The returned object contains:
 * - series: a mapping from ids to series attributes.
 * - seriesOrder: the array of series ids.
 * @returns {{ series: Record<SeriesId, DefaultizedScatterSeriesType>; seriesOrder: SeriesId[]; } | undefined}  scatterSeries
 */
export function useScatterSeries(): FormattedSeries['scatter'];
/**
 * Get access to the internal state of scatter series.
 *
 * @param {SeriesId} seriesId The id of the series to get.
 * @returns {ChartSeriesDefaultized<'scatter'> | undefined}  scatterSeries
 */
export function useScatterSeries(seriesId: SeriesId): ChartSeriesDefaultized<'scatter'>;
/**
 * Get access to the internal state of scatter series.
 *
 * @param {SeriesId[]} seriesIds The ids of the series to get. Order is preserved.
 * @returns {ChartSeriesDefaultized<'scatter'>[] | undefined}  scatterSeries
 */
export function useScatterSeries(...seriesIds: SeriesId[]): ChartSeriesDefaultized<'scatter'>[];
export function useScatterSeries(...seriesIds: SeriesId[]): any {
  const series = useSeries();

  return React.useMemo(
    () => {
      if (seriesIds.length === 0) {
        return series.scatter;
      }

      if (seriesIds.length === 1) {
        return series?.scatter?.series[seriesIds[0]];
      }

      return seriesIds.map((id) => series?.scatter?.series[id]).filter(Boolean);
    },
    // DANGER: Ensure that the dependencies array is correct.
    // eslint-disable-next-line react-compiler/react-compiler
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [series.pie, ...seriesIds],
  );
}
