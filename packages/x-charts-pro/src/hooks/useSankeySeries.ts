'use client';
import {
  useSeriesOfType,
  useAllSeriesOfType,
  ProcessedSeries,
  SeriesId,
  ChartSeriesDefaultized,
  useSelector,
  selectorSeriesLayoutOfType,
  useStore,
  ChartSeriesLayout,
} from '@mui/x-charts/internals';

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
 * Get access to the layout of the sankey series.
 *
 * @param {SeriesId} seriesId The id of the series to get. By default the first one.
 * @returns {UseSankeySeriesLayoutReturnValue} the sankey series layout
 */

/**
 * Get access to the layout of the sankey series.
 *
 * @param {SeriesId} seriesId The id of the series layout to get.
 * @returns {UseSankeySeriesReturnValue} the sankey series layout
 */
export function useSankeySeriesLayout(
  seriesId: SeriesId,
): UseSankeySeriesLayoutReturnValue | undefined;
/**
 * Get access to the layout of the sankey series.
 *
 * When called without arguments, it returns all sankey series layouts.
 *
 * @returns {UseSankeySeriesLayoutReturnValue[]} the sankey series layouts
 */
export function useSankeySeriesLayout(): UseSankeySeriesLayoutReturnValue[];
/**
 * Get access to the layout of the sankey series.
 *
 * @param {SeriesId[]} seriesIds The ids of the series layouts to get. Order is preserved.
 * @returns {UseSankeySeriesLayoutReturnValue[]} the sankey series layouts
 */
export function useSankeySeriesLayout(seriesId?: SeriesId | SeriesId[]) {
  const store = useStore();
  return useSelector(store, selectorSeriesLayoutOfType, 'sankey', seriesId) as
    | UseSankeySeriesLayoutReturnValue
    | UseSankeySeriesLayoutReturnValue[]
    | undefined;
}
