'use client';
import { type ProcessedSeries } from '../internals/plugins/corePlugins/useChartSeries/useChartSeries.types';
import { type SeriesId } from '../models/seriesType/common';
import { type ChartSeriesDefaultized } from '../models/seriesType/config';
import { useSeriesOfType, useAllSeriesOfType } from '../internals/seriesSelectorOfType';

export type UseRadarSeriesReturnValue = ChartSeriesDefaultized<'radar'>;
export type UseRadarSeriesContextReturnValue = ProcessedSeries['radar'];

/**
 * Get access to the internal state of radar series.
 *
 * @param {SeriesId} seriesId The id of the series to get.
 * @returns {UseRadarSeriesReturnValue} the radar series
 */
export function useRadarSeries(seriesId: SeriesId): UseRadarSeriesReturnValue | undefined;
/**
 * Get access to the internal state of radar series.
 *
 * When called without arguments, it returns all radar series.
 *
 * @returns {UseRadarSeriesReturnValue[]} the radar series
 */
export function useRadarSeries(): UseRadarSeriesReturnValue[];
/**
 * Get access to the internal state of radar series.
 *
 * @param {SeriesId[]} seriesIds The ids of the series to get. Order is preserved.
 * @returns {UseRadarSeriesReturnValue[]} the radar series
 */
export function useRadarSeries(seriesIds?: SeriesId[]): UseRadarSeriesReturnValue[];
export function useRadarSeries(seriesIds?: SeriesId | SeriesId[]) {
  return useSeriesOfType('radar', seriesIds);
}

/**
 * Get access to the internal state of radar series.
 * The returned object contains:
 * - series: a mapping from ids to series attributes.
 * - seriesOrder: the array of series ids.
 * @returns the radar series
 */
export function useRadarSeriesContext(): UseRadarSeriesContextReturnValue {
  return useAllSeriesOfType('radar');
}
