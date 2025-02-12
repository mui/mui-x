'use client';
import { ProcessedSeries } from '../internals/plugins/corePlugins/useChartSeries/useChartSeries.types';
import { SeriesId } from '../models/seriesType/common';
import { ChartSeriesDefaultized } from '../models/seriesType/config';
import {
  createSeriesSelectorsOfType,
  createAllSeriesSelectorOfType,
} from '../internals/createSeriesSelectorOfType';

const useSelectorSeries = createSeriesSelectorsOfType('pie');
const useSelectorSeriesContext = createAllSeriesSelectorOfType('pie');

export type UsePieSeriesReturnValue = ChartSeriesDefaultized<'pie'>;
export type UsePieSeriesContextReturnValue = ProcessedSeries['pie'];

/**
 * Get access to the internal state of pie series.
 *
 * @param {SeriesId} seriesId The id of the series to get.
 * @returns {UsePieSeriesReturnValue} the pie series
 */
export function usePieSeries(seriesId: SeriesId): UsePieSeriesReturnValue | undefined;
/**
 * Get access to the internal state of pie series.
 *
 * When called without arguments, it returns all pie series.
 *
 * @returns {UsePieSeriesReturnValue[]} the pie series
 */
export function usePieSeries(): UsePieSeriesReturnValue[];
/**
 * Get access to the internal state of pie series.
 *
 * @param {SeriesId[]} seriesIds The ids of the series to get. Order is preserved.
 * @returns {UsePieSeriesReturnValue[]} the pie series
 */
export function usePieSeries(seriesIds: SeriesId[]): UsePieSeriesReturnValue[];
export function usePieSeries(seriesIds?: SeriesId | SeriesId[]) {
  return useSelectorSeries(seriesIds);
}

/**
 * Get access to the internal state of pie series.
 * The returned object contains:
 * - series: a mapping from ids to series attributes.
 * - seriesOrder: the array of series ids.
 * @returns the pie series
 */
export function usePieSeriesContext(): UsePieSeriesContextReturnValue {
  return useSelectorSeriesContext();
}
