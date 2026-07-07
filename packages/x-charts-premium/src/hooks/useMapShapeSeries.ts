'use client';

import { useAllSeriesOfType, useSeriesOfType } from '@mui/x-charts/internals';
import type { ChartSeriesDefaultized, ProcessedSeries } from '@mui/x-charts/internals';
import type { SeriesId } from '@mui/x-charts/models';

export type UseMapShapeSeriesReturnValue = ChartSeriesDefaultized<'mapShape'>;
export type UseMapShapeSeriesContextReturnValue = ProcessedSeries['mapShape'];

/**
 * Get access to the internal state of range bar series.
 *
 * @param {SeriesId} seriesId The id of the series to get.
 * @returns {UseMapShapeSeriesReturnValue} the range bar series
 */
export function useMapShapeSeries(seriesId: SeriesId): UseMapShapeSeriesReturnValue | undefined;
/**
 * Get access to the internal state of map shape series.
 *
 * When called without arguments, it returns all map shape series.
 *
 * @returns {UseMapShapeSeriesReturnValue[]} the map shape series
 */
export function useMapShapeSeries(): UseMapShapeSeriesReturnValue[];
/**
 * Get access to the internal state of map shape series.
 *
 * @param {SeriesId[]} seriesIds The ids of the series to get. Order is preserved.
 * @returns {UseMapShapeSeriesReturnValue[]} the map shape series
 */
export function useMapShapeSeries(seriesIds: SeriesId[]): UseMapShapeSeriesReturnValue[];
export function useMapShapeSeries(seriesIds?: SeriesId | SeriesId[]) {
  return useSeriesOfType('mapShape', seriesIds);
}

/**
 * Get access to the internal state of map shape series.
 * The returned object contains:
 * - series: a mapping from ids to series attributes.
 * - seriesOrder: the array of series ids.
 * @returns the map shape series
 */
export function useMapShapeSeriesContext(): UseMapShapeSeriesContextReturnValue {
  return useAllSeriesOfType('mapShape');
}
