'use client';

import {
  type ChartSeriesDefaultized,
  type ProcessedSeries,
  useAllSeriesOfType,
  useSeriesOfType,
} from '@mui/x-charts/internals';
import { type SeriesId } from '@mui/x-charts/models';

export type UseOHLCSeriesReturnValue = ChartSeriesDefaultized<'ohlc'>;
export type UseOHLCSeriesContextReturnValue = ProcessedSeries['ohlc'];

/**
 * Get access to the internal state of OHLC series.
 *
 * @param {SeriesId} seriesId The id of the series to get.
 * @returns {UseOHLCSeriesReturnValue} the OHLC series
 */
export function useOHLCSeries(seriesId: SeriesId): UseOHLCSeriesReturnValue | undefined;
/**
 * Get access to the internal state of OHLC series.
 *
 * When called without arguments, it returns all OHLC series.
 *
 * @returns {UseOHLCSeriesReturnValue[]} the OHLC series
 */
export function useOHLCSeries(): UseOHLCSeriesReturnValue[];
/**
 * Get access to the internal state of OHLC series.
 *
 * @param {SeriesId[]} seriesIds The ids of the series to get. Order is preserved.
 * @returns {UseOHLCSeriesReturnValue[]} the OHLC series
 */
export function useOHLCSeries(seriesIds: SeriesId[]): UseOHLCSeriesReturnValue[];
export function useOHLCSeries(seriesIds?: SeriesId | SeriesId[]) {
  return useSeriesOfType('ohlc', seriesIds);
}

/**
 * Get access to the internal state of OHLC series.
 * The returned object contains:
 * - series: a mapping from ids to series attributes.
 * - seriesOrder: the array of series ids.
 * @returns the OHLC series
 */
export function useOHLCSeriesContext(): UseOHLCSeriesContextReturnValue {
  return useAllSeriesOfType('ohlc');
}
