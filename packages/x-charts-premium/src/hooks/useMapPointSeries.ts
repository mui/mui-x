'use client';

import { useAllSeriesOfType, useSeriesOfType } from '@mui/x-charts/internals';
import type { ChartSeriesDefaultized, ProcessedSeries } from '@mui/x-charts/internals';
import type { SeriesId } from '@mui/x-charts/models';

export type UseMapPointSeriesReturnValue = ChartSeriesDefaultized<'mapPoint'>;
export type UseMapPointSeriesContextReturnValue = ProcessedSeries['mapPoint'];

/**
 * Get access to the internal state of a map point series.
 * @param {SeriesId} seriesId The id of the series to get.
 * @returns {UseMapPointSeriesReturnValue} the map point series
 */
export function useMapPointSeries(seriesId: SeriesId): UseMapPointSeriesReturnValue | undefined;
/**
 * Get access to the internal state of all map point series.
 * @returns {UseMapPointSeriesReturnValue[]} the map point series
 */
export function useMapPointSeries(): UseMapPointSeriesReturnValue[];
/**
 * Get access to the internal state of the requested map point series.
 * @param {SeriesId[]} seriesIds The ids of the series to get. Order is preserved.
 * @returns {UseMapPointSeriesReturnValue[]} the map point series
 */
export function useMapPointSeries(seriesIds: SeriesId[]): UseMapPointSeriesReturnValue[];
export function useMapPointSeries(seriesIds?: SeriesId | SeriesId[]) {
  return useSeriesOfType('mapPoint', seriesIds);
}

/**
 * Get access to the internal state of map point series.
 * The returned object contains:
 * - series: a mapping from ids to series attributes.
 * - seriesOrder: the array of series ids.
 * @returns the map point series
 */
export function useMapPointSeriesContext(): UseMapPointSeriesContextReturnValue {
  return useAllSeriesOfType('mapPoint');
}
