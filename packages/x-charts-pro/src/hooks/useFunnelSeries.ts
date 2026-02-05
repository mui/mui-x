'use client';
import {
  useSeriesOfType,
  useAllSeriesOfType,
  type ProcessedSeries,
  type SeriesId,
  type ChartSeriesDefaultized,
} from '@mui/x-charts/internals';

export type UseFunnelSeriesReturnValue = ChartSeriesDefaultized<'funnel'>;
export type UseFunnelSeriesContextReturnValue = ProcessedSeries['funnel'];

/**
 * Get access to the internal state of funnel series.
 *
 * @param {SeriesId} seriesId The id of the series to get.
 * @returns {UseFunnelSeriesReturnValue} the funnel series
 */
export function useFunnelSeries(seriesId: SeriesId): UseFunnelSeriesReturnValue | undefined;
/**
 * Get access to the internal state of funnel series.
 *
 * When called without arguments, it returns all funnel series.
 *
 * @returns {UseFunnelSeriesReturnValue[]} the funnel series
 */
export function useFunnelSeries(seriesId?: undefined): UseFunnelSeriesReturnValue[];
/**
 * Get access to the internal state of funnel series.
 *
 * @param {SeriesId[]} seriesIds The ids of the series to get. Order is preserved.
 * @returns {UseFunnelSeriesReturnValue[]} the funnel series
 */
export function useFunnelSeries(seriesIds: SeriesId[]): UseFunnelSeriesReturnValue[];
export function useFunnelSeries(seriesIds?: SeriesId | SeriesId[] | undefined) {
  return useSeriesOfType('funnel', seriesIds);
}

/**
 * Get access to the internal state of funnel series.
 * The returned object contains:
 * - series: a mapping from ids to series attributes.
 * - seriesOrder: the array of series ids.
 * @returns the funnel series
 */
export function useFunnelSeriesContext(): UseFunnelSeriesContextReturnValue {
  return useAllSeriesOfType('funnel');
}
