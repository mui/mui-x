'use client';
import { type ProcessedSeries } from '../internals/plugins/corePlugins/useChartSeries/useChartSeries.types';
import { type SeriesId } from '../models/seriesType/common';
import { type ChartSeriesDefaultized } from '../models/seriesType/config';
import { useSeriesOfType, useAllSeriesOfType } from '../internals/seriesSelectorOfType';

export type UseScatterSeriesReturnValue = ChartSeriesDefaultized<'scatter'>;
export type UseScatterSeriesContextReturnValue = ProcessedSeries['scatter'];

/**
 * Get access to the internal state of scatter series.
 *
 * @param {SeriesId} seriesId The id of the series to get.
 * @returns {UseScatterSeriesReturnValue} the scatter series
 */
export function useScatterSeries(seriesId: SeriesId): UseScatterSeriesReturnValue | undefined;
/**
 * Get access to the internal state of scatter series.
 *
 * When called without arguments, it returns all scatter series.
 *
 * @returns {UseScatterSeriesReturnValue[]} the scatter series
 */
export function useScatterSeries(): UseScatterSeriesReturnValue[];
/**
 * Get access to the internal state of scatter series.
 *
 * @param {SeriesId[]} seriesIds The ids of the series to get. Order is preserved.
 * @returns {UseScatterSeriesReturnValue[]} the scatter series
 */
export function useScatterSeries(seriesIds: SeriesId[]): UseScatterSeriesReturnValue[];
export function useScatterSeries(seriesIds?: SeriesId | SeriesId[]) {
  return useSeriesOfType('scatter', seriesIds);
}

/**
 * Get access to the internal state of scatter series.
 * The returned object contains:
 * - series: a mapping from ids to series attributes.
 * - seriesOrder: the array of series ids.
 * @returns the scatter series
 */
export function useScatterSeriesContext(): UseScatterSeriesContextReturnValue {
  return useAllSeriesOfType('scatter');
}
