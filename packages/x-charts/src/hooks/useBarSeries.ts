'use client';
import { type ProcessedSeries } from '../internals/plugins/corePlugins/useChartSeries/useChartSeries.types';
import { type SeriesId } from '../models/seriesType/common';
import { type ChartSeriesDefaultized } from '../models/seriesType/config';
import { useSeriesOfType, useAllSeriesOfType } from '../internals/seriesSelectorOfType';

export type UseBarSeriesReturnValue = ChartSeriesDefaultized<'bar'>;
export type UseBarSeriesContextReturnValue = ProcessedSeries['bar'];

/**
 * Get access to the internal state of bar series.
 *
 * @param {SeriesId} seriesId The id of the series to get.
 * @returns {UseBarSeriesReturnValue} the bar series
 */
export function useBarSeries(seriesId: SeriesId): UseBarSeriesReturnValue | undefined;
/**
 * Get access to the internal state of bar series.
 *
 * When called without arguments, it returns all bar series.
 *
 * @returns {UseBarSeriesReturnValue[]} the bar series
 */
export function useBarSeries(): UseBarSeriesReturnValue[];
/**
 * Get access to the internal state of bar series.
 *
 * @param {SeriesId[]} seriesIds The ids of the series to get. Order is preserved.
 * @returns {UseBarSeriesReturnValue[]} the bar series
 */
export function useBarSeries(seriesIds: SeriesId[]): UseBarSeriesReturnValue[];
export function useBarSeries(seriesIds?: SeriesId | SeriesId[]) {
  return useSeriesOfType('bar', seriesIds);
}

/**
 * Get access to the internal state of bar series.
 * The returned object contains:
 * - series: a mapping from ids to series attributes.
 * - seriesOrder: the array of series ids.
 * - stackingGroups: the array of stacking groups. Each group contains the series ids stacked and the strategy to use.
 * @returns the bar series
 */
export function useBarSeriesContext(): UseBarSeriesContextReturnValue {
  return useAllSeriesOfType('bar');
}
