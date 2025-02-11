'use client';
import { ProcessedSeries } from '../internals/plugins/corePlugins/useChartSeries/useChartSeries.types';
import { SeriesId } from '../models/seriesType/common';
import { ChartSeriesDefaultized } from '../models/seriesType/config';
import { createSeriesSelectorsOfType } from '../internals/createSeriesSelectorOfType';

const selectorSeries = createSeriesSelectorsOfType('pie');

/**
 * Get access to the internal state of pie series.
 * The returned object contains:
 * - series: a mapping from ids to series attributes.
 * - seriesOrder: the array of series ids.
 * @returns {{ series: Record<SeriesId, DefaultizedPieSeriesType>; seriesOrder: SeriesId[]; } | undefined}  pieSeries
 */
export function usePieSeries(): ProcessedSeries['pie'];
/**
 * Get access to the internal state of pie series.
 *
 * @param {SeriesId} seriesId The id of the series to get.
 * @returns {ChartSeriesDefaultized<'pie'> | undefined}  pieSeries
 */
export function usePieSeries(seriesId: SeriesId): ChartSeriesDefaultized<'pie'> | undefined;
/**
 * Get access to the internal state of pie series.
 *
 * @param {SeriesId[]} seriesIds The ids of the series to get. Order is preserved.
 * @returns {ChartSeriesDefaultized<'pie'>[] | undefined}  pieSeries
 */
export function usePieSeries(seriesIds: SeriesId[]): (ChartSeriesDefaultized<'pie'> | undefined)[];
export function usePieSeries(seriesIds?: SeriesId | SeriesId[]) {
  return selectorSeries(seriesIds);
}
