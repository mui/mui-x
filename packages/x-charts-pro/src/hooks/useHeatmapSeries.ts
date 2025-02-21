'use client';
import {
  createAllSeriesSelectorOfType,
  createSeriesSelectorsOfType,
  ProcessedSeries,
  SeriesId,
  ChartSeriesDefaultized,
} from '@mui/x-charts/internals';

const useSelectorSeries = createSeriesSelectorsOfType('heatmap');
const useSelectorSeriesContext = createAllSeriesSelectorOfType('heatmap');

export type UseHeatmapSeriesReturnValue = ChartSeriesDefaultized<'heatmap'>;
export type UseHeatmapSeriesContextReturnValue = ProcessedSeries['heatmap'];

/**
 * Get access to the internal state of heatmap series.
 *
 * @param {SeriesId} seriesId The id of the series to get.
 * @returns {UseHeatmapSeriesReturnValue} the heatmap series
 */
export function useHeatmapSeries(seriesId: SeriesId): UseHeatmapSeriesReturnValue | undefined;
/**
 * Get access to the internal state of heatmap series.
 *
 * When called without arguments, it returns all heatmap series.
 *
 * @returns {UseHeatmapSeriesReturnValue[]} the heatmap series
 */
export function useHeatmapSeries(): UseHeatmapSeriesReturnValue[];
/**
 * Get access to the internal state of heatmap series.
 *
 * @param {SeriesId[]} seriesIds The ids of the series to get. Order is preserved.
 * @returns {UseHeatmapSeriesReturnValue[]} the heatmap series
 */
export function useHeatmapSeries(seriesIds: SeriesId[]): UseHeatmapSeriesReturnValue[];
export function useHeatmapSeries(seriesIds?: SeriesId | SeriesId[]) {
  return useSelectorSeries(seriesIds);
}

/**
 * Get access to the internal state of heatmap series.
 * The returned object contains:
 * - series: a mapping from ids to series attributes.
 * - seriesOrder: the array of series ids.
 * @returns the heatmap series
 */
export function useHeatmapSeriesContext(): UseHeatmapSeriesContextReturnValue {
  return useSelectorSeriesContext();
}
