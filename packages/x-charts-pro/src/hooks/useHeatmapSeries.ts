'use client';
import {
  createSeriesSelectorsOfType,
  ProcessedSeries,
  SeriesId,
  ChartSeriesDefaultized,
} from '@mui/x-charts/internals';

const selectorSeries = createSeriesSelectorsOfType('heatmap');

/**
 * Get access to the internal state of heatmap series.
 * The returned object contains:
 * - series: a mapping from ids to series attributes.
 * - seriesOrder: the array of series ids.
 * @returns {{ series: Record<SeriesId, DefaultizedHeatmapSeriesType>; seriesOrder: SeriesId[]; } | undefined} heatmapSeries
 */
export function useHeatmapSeries(): ProcessedSeries['heatmap'];
/**
 * Get access to the internal state of heatmap series.
 *
 * @param {SeriesId} seriesId The id of the series to get.
 * @returns {ChartSeriesDefaultized<'heatmap'> | undefined}  heatmapSeries
 */
export function useHeatmapSeries(seriesId: SeriesId): ChartSeriesDefaultized<'heatmap'> | undefined;
/**
 * Get access to the internal state of heatmap series.
 *
 * @param {SeriesId[]} seriesIds The ids of the series to get. Order is preserved.
 * @returns {ChartSeriesDefaultized<'heatmap'>[] | undefined}  heatmapSeries
 */
export function useHeatmapSeries(
  seriesIds: SeriesId[],
): (ChartSeriesDefaultized<'heatmap'> | undefined)[];
export function useHeatmapSeries(seriesIds?: SeriesId | SeriesId[]) {
  return selectorSeries(seriesIds);
}
