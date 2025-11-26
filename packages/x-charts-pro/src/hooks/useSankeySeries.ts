'use client';
import {
  useSeriesOfType,
  useAllSeriesOfType,
  ProcessedSeries,
  SeriesWithPositions,
  SeriesId,
  ChartSeriesDefaultized,
  useSelector,
  selectorAllSeriesOfTypeWithPositions,
  useStore,
} from '@mui/x-charts/internals';

export type UseSankeySeriesReturnValue = ChartSeriesDefaultized<'sankey'>;
export type UseSankeySeriesContextReturnValue = ProcessedSeries['sankey'];
export type UseSankeySeriesWithPositionsContextReturnValue = SeriesWithPositions['sankey'];

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
 * Get access to the internal state of sankey series.
 * The returned object contains:
 * - series: a mapping from ids to series attributes.
 * - seriesOrder: the array of series ids.
 * @returns the sankey series
 */
export function useSankeySeriesWithPositionsContext(): UseSankeySeriesWithPositionsContextReturnValue {
  const store = useStore();
  return useSelector(
    store,
    selectorAllSeriesOfTypeWithPositions,
    'sankey',
  ) as SeriesWithPositions['sankey'];
}
