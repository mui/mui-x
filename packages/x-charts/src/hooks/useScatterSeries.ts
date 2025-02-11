'use client';
import { ProcessedSeries } from '../internals/plugins/corePlugins/useChartSeries/useChartSeries.types';
import { SeriesId } from '../models/seriesType/common';
import { ChartSeriesDefaultized } from '../models/seriesType/config';
import { createSeriesSelectorsOfType } from '../internals/createSeriesSelectorOfType';

const selectorSeries = createSeriesSelectorsOfType('scatter');

/**
 * Get access to the internal state of scatter series.
 * The returned object contains:
 * - series: a mapping from ids to series attributes.
 * - seriesOrder: the array of series ids.
 * @returns {{ series: Record<SeriesId, DefaultizedScatterSeriesType>; seriesOrder: SeriesId[]; } | undefined}  scatterSeries
 */
export function useScatterSeries(): ProcessedSeries['scatter'];
/**
 * Get access to the internal state of scatter series.
 *
 * @param {SeriesId} seriesId The id of the series to get.
 * @returns {ChartSeriesDefaultized<'scatter'> | undefined}  scatterSeries
 */
export function useScatterSeries(seriesId: SeriesId): ChartSeriesDefaultized<'scatter'> | undefined;
/**
 * Get access to the internal state of scatter series.
 *
 * @param {SeriesId[]} seriesIds The ids of the series to get. Order is preserved.
 * @returns {ChartSeriesDefaultized<'scatter'>[] | undefined}  scatterSeries
 */
export function useScatterSeries(
  seriesIds: SeriesId[],
): (ChartSeriesDefaultized<'scatter'> | undefined)[];
export function useScatterSeries(seriesIds?: SeriesId | SeriesId[]) {
  return selectorSeries(seriesIds);
}
