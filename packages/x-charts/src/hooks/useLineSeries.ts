'use client';
import { type ProcessedSeries } from '../internals/plugins/corePlugins/useChartSeries/useChartSeries.types';
import { type SeriesId } from '../models/seriesType/common';
import { type ChartSeriesDefaultized } from '../models/seriesType/config';
import { useSeriesOfType, useAllSeriesOfType } from '../internals/seriesSelectorOfType';

export type UseLineSeriesReturnValue<AxisType extends 'cartesian' | 'polar'> =
  ChartSeriesDefaultized<'line', AxisType>;
export type UseLineSeriesContextReturnValue<AxisType extends 'cartesian' | 'polar'> =
  ProcessedSeries<'line', AxisType>['line'];

/**
 * Get access to the internal state of line series.
 *
 * @param {SeriesId} seriesId The id of the series to get.
 * @returns {UseLineSeriesReturnValue} the line series
 */
export function useLineSeries<AxisType extends 'cartesian' | 'polar' = 'cartesian'>(
  seriesId: SeriesId,
): UseLineSeriesReturnValue<AxisType> | undefined;
/**
 * Get access to the internal state of line series.
 *
 * When called without arguments, it returns all line series.
 *
 * @returns {UseLineSeriesReturnValue[]} the line series
 */
export function useLineSeries<
  AxisType extends 'cartesian' | 'polar' = 'cartesian',
>(): UseLineSeriesReturnValue<AxisType>[];
/**
 * Get access to the internal state of line series.
 *
 * @param {SeriesId[]} seriesIds The ids of the series to get. Order is preserved.
 * @returns {UseLineSeriesReturnValue[]} the line series
 */
export function useLineSeries<AxisType extends 'cartesian' | 'polar' = 'cartesian'>(
  seriesIds: SeriesId[],
): UseLineSeriesReturnValue<AxisType>[];
export function useLineSeries(seriesIds?: SeriesId | SeriesId[]) {
  return useSeriesOfType('line', seriesIds);
}

/**
 * Get access to the internal state of line series.
 * The returned object contains:
 * - series: a mapping from ids to series attributes.
 * - seriesOrder: the array of series ids.
 * - stackingGroups: the array of stacking groups. Each group contains the series ids stacked and the strategy to use.
 * @returns the line series
 */
export function useLineSeriesContext<
  AxisType extends 'cartesian' | 'polar' = 'cartesian',
>(): UseLineSeriesContextReturnValue<AxisType> {
  return useAllSeriesOfType('line');
}
