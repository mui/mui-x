'use client';
import { ProcessedSeries } from '../internals/plugins/corePlugins/useChartSeries/useChartSeries.types';
import { SeriesId } from '../models/seriesType/common';
import { ChartSeriesDefaultized } from '../models/seriesType/config';
import {
  createSeriesSelectorsOfType,
  createAllSeriesSelectorOfType,
} from '../internals/createSeriesSelectorOfType';

const useSelectorSeries = createSeriesSelectorsOfType('rangeBar');
const useSelectorSeriesContext = createAllSeriesSelectorOfType('rangeBar');

export type UseRangeBarSeriesReturnValue = ChartSeriesDefaultized<'rangeBar'>;
export type UseRangeBarSeriesContextReturnValue = ProcessedSeries['rangeBar'];

/**
 * Get access to the internal state of bar range series.
 *
 * @param {SeriesId} seriesId The id of the series to get.
 * @returns {UseRangeBarSeriesReturnValue} the bar series
 */
export function useRangeBarSeries(seriesId: SeriesId): UseRangeBarSeriesReturnValue | undefined;
/**
 * Get access to the internal state of bar range series.
 *
 * When called without arguments, it returns all bar range series.
 *
 * @returns {UseRangeBarSeriesReturnValue[]} the bar range series
 */
export function useRangeBarSeries(): UseRangeBarSeriesReturnValue[];
/**
 * Get access to the internal state of bar series.
 *
 * @param {SeriesId[]} seriesIds The ids of the series to get. Order is preserved.
 * @returns {UseRangeBarSeriesReturnValue[]} the bar series
 */
export function useRangeBarSeries(seriesIds: SeriesId[]): UseRangeBarSeriesReturnValue[];
export function useRangeBarSeries(seriesIds?: SeriesId | SeriesId[]) {
  return useSelectorSeries(seriesIds);
}

/**
 * Get access to the internal state of bar range series.
 * The returned object contains:
 * - series: a mapping from ids to series attributes.
 * - seriesOrder: the array of series ids.
 * @returns the bar range series
 */
export function useRangeBarSeriesContext(): UseRangeBarSeriesContextReturnValue {
  return useSelectorSeriesContext();
}
