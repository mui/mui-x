'use client';
import {
  useSeriesOfType,
  useAllSeriesOfType,
  type ProcessedSeries,
  type SeriesId,
  type ChartSeriesDefaultized,
  useStore,
  type ChartSeriesLayout,
  selectorChartSeriesLayout,
} from '@mui/x-charts/internals';
import { type SankeyLayout } from '../SankeyChart';

export type UseSankeySeriesReturnValue = ChartSeriesDefaultized<'sankey'>;
export type UseSankeySeriesContextReturnValue = ProcessedSeries['sankey'];
export type UseSankeySeriesLayoutReturnValue = ChartSeriesLayout<'sankey'>;

/**
 * Get access to the internal state of sankey series.
 *
 * @param {SeriesId} seriesId The id of the series to get.
 * @returns {UseSankeySeriesReturnValue} the sankey series
 */
export function useSankeySeries(seriesId: SeriesId): UseSankeySeriesReturnValue | undefined;
/**
 * Get access to the internal state of sankey series.
 *
 * When called without arguments, it returns all sankey series.
 *
 * @returns {UseSankeySeriesReturnValue[]} the sankey series
 */
export function useSankeySeries(): UseSankeySeriesReturnValue[];
/**
 * Get access to the internal state of sankey series.
 *
 * @param {SeriesId[]} seriesIds The ids of the series to get. Order is preserved.
 * @returns {UseSankeySeriesReturnValue[]} the sankey series
 */
export function useSankeySeries(seriesIds: SeriesId[]): UseSankeySeriesReturnValue[];
export function useSankeySeries(seriesIds?: SeriesId | SeriesId[]) {
  return useSeriesOfType('sankey', seriesIds);
}

/**
 * Get access to the internal state of sankey series.
 * The returned object contains:
 * - series: a mapping from ids to series attributes.
 * - seriesOrder: the array of series ids.
 * @returns the sankey series
 */
export function useSankeySeriesContext(): UseSankeySeriesContextReturnValue {
  return useAllSeriesOfType('sankey');
}

/**
 * Get access to the sankey layout.
 * @returns {SankeyLayout | undefined} the sankey layout
 */
export function useSankeyLayout(): SankeyLayout | undefined {
  const store = useStore();

  const seriesContext = useSankeySeriesContext();
  const seriesId = seriesContext?.seriesOrder?.[0];
  const layout = store.use(selectorChartSeriesLayout);

  if (!seriesId) {
    return undefined;
  }
  return layout?.sankey?.[seriesId]?.sankeyLayout;
}
