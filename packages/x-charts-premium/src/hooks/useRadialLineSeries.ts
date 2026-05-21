'use client';

import {
  type ChartSeriesDefaultized,
  type ProcessedSeries,
  useAllSeriesOfType,
  useSeriesOfType,
} from '@mui/x-charts/internals';
import { type SeriesId } from '@mui/x-charts/models';

export type UseRadialLineSeriesReturnValue = ChartSeriesDefaultized<'radialLine'>;
export type UseRadialLineSeriesContextReturnValue = ProcessedSeries['radialLine'];

/**
 * Get access to the internal state of radial line series.
 *
 * @param {SeriesId} seriesId The id of the series to get.
 * @returns {UseRadialLineSeriesReturnValue} the radial line series
 */
export function useRadialLineSeries(seriesId: SeriesId): UseRadialLineSeriesReturnValue | undefined;
/**
 * Get access to the internal state of radial line series.
 *
 * When called without arguments, it returns all radial line series.
 *
 * @returns {UseRadialLineSeriesReturnValue[]} the radial line series
 */
export function useRadialLineSeries(): UseRadialLineSeriesReturnValue[];
/**
 * Get access to the internal state of radial line series.
 *
 * @param {SeriesId[]} seriesIds The ids of the series to get. Order is preserved.
 * @returns {UseRadialLineSeriesReturnValue[]} the radial line series
 */
export function useRadialLineSeries(seriesIds: SeriesId[]): UseRadialLineSeriesReturnValue[];
export function useRadialLineSeries(seriesIds?: SeriesId | SeriesId[]) {
  return useSeriesOfType('radialLine', seriesIds);
}

/**
 * Get access to the internal state of radial line series.
 * The returned object contains:
 * - series: a mapping from ids to series attributes.
 * - seriesOrder: the array of series ids.
 * @returns the radial line series
 */
export function useRadialLineSeriesContext(): UseRadialLineSeriesContextReturnValue {
  return useAllSeriesOfType('radialLine');
}
