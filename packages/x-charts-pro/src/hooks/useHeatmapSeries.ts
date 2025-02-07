'use client';
import * as React from 'react';
import {
  useSeries,
  ProcessedSeries,
  SeriesId,
  ChartSeriesDefaultized,
} from '@mui/x-charts/internals';

/**
 * Get access to the internal state of heatmap series.
 * The returned object contains:
 * - series: a mapping from ids to series attributes.
 * - seriesOrder: the array of series ids.
 * @returns { series: Record<SeriesId, DefaultizedHeatmapSeriesType>; seriesOrder: SeriesId[]; } | undefined heatmapSeries
 */
export function useHeatmapSeries(): ProcessedSeries['heatmap'];
/**
 * Get access to the internal state of heatmap series.
 *
 * @param {SeriesId} seriesId The id of the series to get.
 * @returns {ChartSeriesDefaultized<'heatmap'> | undefined}  heatmapSeries
 */
export function useHeatmapSeries(seriesId: SeriesId): ChartSeriesDefaultized<'heatmap'>;
/**
 * Get access to the internal state of heatmap series.
 *
 * @param {SeriesId[]} seriesIds The ids of the series to get. Order is preserved.
 * @returns {ChartSeriesDefaultized<'heatmap'>[] | undefined}  heatmapSeries
 */
export function useHeatmapSeries(...seriesIds: SeriesId[]): ChartSeriesDefaultized<'heatmap'>[];
export function useHeatmapSeries(...seriesIds: SeriesId[]): any {
  const series = useSeries();

  return React.useMemo(
    () => {
      if (seriesIds.length === 0) {
        return series.heatmap;
      }

      if (seriesIds.length === 1) {
        return series?.heatmap?.series[seriesIds[0]];
      }

      return seriesIds.map((id) => series?.heatmap?.series[id]).filter(Boolean);
    },
    // DANGER: Ensure that the dependencies array is correct.
    // eslint-disable-next-line react-compiler/react-compiler
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [series.heatmap, ...seriesIds],
  );
}
