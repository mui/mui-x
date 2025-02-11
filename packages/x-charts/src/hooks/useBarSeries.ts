'use client';
import { ProcessedSeries } from '../internals/plugins/corePlugins/useChartSeries/useChartSeries.types';
import { SeriesId } from '../models/seriesType/common';
import { ChartSeriesDefaultized } from '../models/seriesType/config';
import {
  createSeriesSelectorsOfType,
  createAllSeriesSelectorOfType,
} from '../internals/createSeriesSelectorOfType';

const selectorSeries = createSeriesSelectorsOfType('bar');
const selectorSeriesContext = createAllSeriesSelectorOfType('bar');

export type UseBarSeriesReturnValue = ChartSeriesDefaultized<'bar'> | undefined;
export type UseBarSeriesContextReturnValue = ProcessedSeries['bar'];

/**
 * Get access to the internal state of bar series.
 *
 * @param {SeriesId} seriesId The id of the series to get.
 * @returns {UseBarSeriesReturnValue} the bar series
 */
export function useBarSeries(seriesId: SeriesId): UseBarSeriesReturnValue;
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
  return selectorSeries(seriesIds);
}

/**
 * Get access to the internal state of bar series.
 * The returned object contains:
 * - series: a mapping from ids to series attributes.
 * - seriesOrder: the array of series ids.
 * @returns the bar series
 */
export function useBarSeriesContext(): UseBarSeriesContextReturnValue {
  return selectorSeriesContext();
}
