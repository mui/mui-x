'use client';
import { ProcessedSeries } from '../internals/plugins/corePlugins/useChartSeries/useChartSeries.types';
import { SeriesId } from '../models/seriesType/common';
import { ChartSeriesDefaultized } from '../models/seriesType/config';
import { useSeriesOfType } from '../internals/useSeriesOfType';

/**
 * Get access to the internal state of bar series.
 * The returned object contains:
 * - series: a mapping from ids to series attributes.
 * - seriesOrder: the array of series ids.
 * @returns {{ series: Record<SeriesId, DefaultizedBarSeriesType>; seriesOrder: SeriesId[]; } | undefined}  barSeries
 */
export function useBarSeries(): ProcessedSeries['bar'];
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
  return useSeriesOfType('bar', ...seriesIds);
}
