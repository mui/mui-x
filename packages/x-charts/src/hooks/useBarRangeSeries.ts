'use client';
import { ProcessedSeries } from '../internals/plugins/corePlugins/useChartSeries/useChartSeries.types';
import { SeriesId } from '../models/seriesType/common';
import { ChartSeriesDefaultized } from '../models/seriesType/config';
import {
  createSeriesSelectorsOfType,
  createAllSeriesSelectorOfType,
} from '../internals/createSeriesSelectorOfType';

const useSelectorSeries = createSeriesSelectorsOfType('barRange');
const useSelectorSeriesContext = createAllSeriesSelectorOfType('barRange');

export type UseBarRangeSeriesReturnValue = ChartSeriesDefaultized<'barRange'>;
export type UseBarRangeSeriesContextReturnValue = ProcessedSeries['barRange'];

/**
 * Get access to the internal state of bar range series.
 *
 * @param {SeriesId} seriesId The id of the series to get.
 * @returns {UseBarRangeSeriesReturnValue} the bar series
 */
export function useBarRangeSeries(seriesId: SeriesId): UseBarRangeSeriesReturnValue | undefined;
/**
 * Get access to the internal state of bar range series.
 *
 * When called without arguments, it returns all bar range series.
 *
 * @returns {UseBarRangeSeriesReturnValue[]} the bar range series
 */
export function useBarRangeSeries(): UseBarRangeSeriesReturnValue[];
/**
 * Get access to the internal state of bar series.
 *
 * @param {SeriesId[]} seriesIds The ids of the series to get. Order is preserved.
 * @returns {UseBarRangeSeriesReturnValue[]} the bar series
 */
export function useBarRangeSeries(seriesIds: SeriesId[]): UseBarRangeSeriesReturnValue[];
export function useBarRangeSeries(seriesIds?: SeriesId | SeriesId[]) {
  return useSelectorSeries(seriesIds);
}

/**
 * Get access to the internal state of bar range series.
 * The returned object contains:
 * - series: a mapping from ids to series attributes.
 * - seriesOrder: the array of series ids.
 * @returns the bar range series
 */
export function useBarRangeSeriesContext(): UseBarRangeSeriesContextReturnValue {
  return useSelectorSeriesContext();
}
