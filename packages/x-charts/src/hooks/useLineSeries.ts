'use client';
import { ProcessedSeries } from '../internals/plugins/corePlugins/useChartSeries/useChartSeries.types';
import { SeriesId } from '../models/seriesType/common';
import { ChartSeriesDefaultized } from '../models/seriesType/config';
import { createSeriesSelectorsOfType } from '../internals/createSeriesSelectorOfType';

const selectorSeries = createSeriesSelectorsOfType('line');

/**
 * Get access to the internal state of line series.
 * The returned object contains:
 * - series: a mapping from ids to series attributes.
 * - seriesOrder: the array of series ids.
 * @returns {{ series: Record<SeriesId, DefaultizedLineSeriesType>; seriesOrder: SeriesId[]; } | undefined}  lineSeries
 */
export function useLineSeries(): ProcessedSeries['line'];
/**
 * Get access to the internal state of line series.
 *
 * @param {SeriesId} seriesId The id of the series to get.
 * @returns {ChartSeriesDefaultized<'line'> | undefined}  lineSeries
 */
export function useLineSeries(seriesId: SeriesId): ChartSeriesDefaultized<'line'> | undefined;
/**
 * Get access to the internal state of line series.
 *
 * @param {SeriesId[]} seriesIds The ids of the series to get. Order is preserved.
 * @returns {ChartSeriesDefaultized<'line'>[] | undefined}  lineSeries
 */
export function useLineSeries(
  seriesIds: SeriesId[],
): (ChartSeriesDefaultized<'line'> | undefined)[];
export function useLineSeries(seriesIds?: SeriesId | SeriesId[]) {
  return selectorSeries(seriesIds);
}
