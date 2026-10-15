'use client';
import {
  useSeriesOfType,
  useAllSeriesOfType,
  useStore,
  selectorChartSeriesLayout,
} from '@mui/x-charts/internals';
import type {
  ProcessedSeries,
  SeriesId,
  ChartSeriesDefaultized,
  ChartSeriesLayout,
} from '@mui/x-charts/internals';
import type { TreemapLayout } from '../Treemap/treemap.types';

export type UseTreemapSeriesReturnValue = ChartSeriesDefaultized<'treemap'>;
export type UseTreemapSeriesContextReturnValue = ProcessedSeries['treemap'];
export type UseTreemapSeriesLayoutReturnValue = ChartSeriesLayout<'treemap'>;

/**
 * Get access to the internal state of treemap series.
 *
 * @param {SeriesId} seriesId The id of the series to get.
 * @returns {UseTreemapSeriesReturnValue} the treemap series
 */
export function useTreemapSeries(seriesId: SeriesId): UseTreemapSeriesReturnValue | undefined;
/**
 * Get access to the internal state of treemap series.
 *
 * When called without arguments, it returns all treemap series.
 *
 * @returns {UseTreemapSeriesReturnValue[]} the treemap series
 */
export function useTreemapSeries(): UseTreemapSeriesReturnValue[];
/**
 * Get access to the internal state of treemap series.
 *
 * @param {SeriesId[]} seriesIds The ids of the series to get. Order is preserved.
 * @returns {UseTreemapSeriesReturnValue[]} the treemap series
 */
export function useTreemapSeries(seriesIds: SeriesId[]): UseTreemapSeriesReturnValue[];
export function useTreemapSeries(seriesIds?: SeriesId | SeriesId[]) {
  return useSeriesOfType('treemap', seriesIds);
}

/**
 * Get access to the internal state of treemap series.
 * The returned object contains:
 * - series: a mapping from ids to series attributes.
 * - seriesOrder: the array of series ids.
 * @returns the treemap series
 */
export function useTreemapSeriesContext(): UseTreemapSeriesContextReturnValue {
  return useAllSeriesOfType('treemap');
}

/**
 * Get access to the treemap layout.
 * @returns {TreemapLayout | undefined} the treemap layout
 */
export function useTreemapLayout(): TreemapLayout | undefined {
  const store = useStore();

  const seriesContext = useTreemapSeriesContext();
  const seriesId = seriesContext?.seriesOrder?.[0];
  const layout = store.use(selectorChartSeriesLayout);

  if (!seriesId) {
    return undefined;
  }
  return layout?.treemap?.[seriesId]?.treemapLayout;
}
