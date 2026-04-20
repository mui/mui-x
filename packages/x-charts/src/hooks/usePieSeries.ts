'use client';
import type { ProcessedSeries } from '../internals/plugins/corePlugins/useChartSeries/useChartSeries.types';
import type { SeriesId } from '../models/seriesType/common';
import type { ChartSeriesDefaultized } from '../models/seriesType/config';
import type { PieSeriesLayout } from '../models/seriesType/pie';
import { useSeriesOfType, useAllSeriesOfType } from '../internals/seriesSelectorOfType';
import { useStore } from '../internals/store/useStore';
import { selectorChartSeriesLayout } from '../internals/plugins/corePlugins/useChartSeries';

export type UsePieSeriesReturnValue = ChartSeriesDefaultized<'pie'>;
export type UsePieSeriesContextReturnValue = ProcessedSeries['pie'];

/**
 * Get access to the internal state of pie series.
 *
 * @param {SeriesId} seriesId The id of the series to get.
 * @returns {UsePieSeriesReturnValue} the pie series
 */
export function usePieSeries(seriesId: SeriesId): UsePieSeriesReturnValue | undefined;
/**
 * Get access to the internal state of pie series.
 *
 * When called without arguments, it returns all pie series.
 *
 * @returns {UsePieSeriesReturnValue[]} the pie series
 */
export function usePieSeries(): UsePieSeriesReturnValue[];
/**
 * Get access to the internal state of pie series.
 *
 * @param {SeriesId[]} seriesIds The ids of the series to get. Order is preserved.
 * @returns {UsePieSeriesReturnValue[]} the pie series
 */
export function usePieSeries(seriesIds: SeriesId[]): UsePieSeriesReturnValue[];
export function usePieSeries(seriesIds?: SeriesId | SeriesId[]) {
  return useSeriesOfType('pie', seriesIds);
}

/**
 * Get access to the internal state of pie series.
 * The returned object contains:
 * - series: a mapping from ids to series attributes.
 * - seriesOrder: the array of series ids.
 * @returns the pie series
 */
export function usePieSeriesContext(): UsePieSeriesContextReturnValue {
  return useAllSeriesOfType('pie');
}

/**
 * Get access to the pie layout.
 * @returns {Record<SeriesId, PieSeriesLayout>} the pie layout
 */
export function usePieSeriesLayout(): Record<SeriesId, PieSeriesLayout> {
  const store = useStore();

  const seriesLayout = store.use(selectorChartSeriesLayout);

  return seriesLayout.pie ?? {};
}
