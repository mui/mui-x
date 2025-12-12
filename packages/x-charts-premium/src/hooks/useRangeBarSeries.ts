'use client';

import {
  type ChartSeriesDefaultized,
  type ProcessedSeries,
  useAllSeriesOfType,
  useSeriesOfType,
} from '@mui/x-charts/internals';
import { type SeriesId } from '@mui/x-charts/models';

export type UseRangeBarSeriesReturnValue = ChartSeriesDefaultized<'rangeBar'>;
export type UseRangeBarSeriesContextReturnValue = ProcessedSeries['rangeBar'];

/**
 * Get access to the internal state of range bar series.
 *
 * @param {SeriesId} seriesId The id of the series to get.
 * @returns {UseRangeBarSeriesReturnValue} the range bar series
 */
export function useRangeBarSeries(seriesId: SeriesId): UseRangeBarSeriesReturnValue | undefined;
/**
 * Get access to the internal state of range bar series.
 *
 * When called without arguments, it returns all range bar series.
 *
 * @returns {UseRangeBarSeriesReturnValue[]} the range bar series
 */
export function useRangeBarSeries(): UseRangeBarSeriesReturnValue[];
/**
 * Get access to the internal state of range bar series.
 *
 * @param {SeriesId[]} seriesIds The ids of the series to get. Order is preserved.
 * @returns {UseRangeBarSeriesReturnValue[]} the range bar series
 */
export function useRangeBarSeries(seriesIds: SeriesId[]): UseRangeBarSeriesReturnValue[];
export function useRangeBarSeries(seriesIds?: SeriesId | SeriesId[]) {
  return useSeriesOfType('rangeBar', seriesIds);
}

/**
 * Get access to the internal state of range bar series.
 * The returned object contains:
 * - series: a mapping from ids to series attributes.
 * - seriesOrder: the array of series ids.
 * @returns the range bar series
 */
export function useRangeBarSeriesContext(): UseRangeBarSeriesContextReturnValue {
  return useAllSeriesOfType('rangeBar');
}
