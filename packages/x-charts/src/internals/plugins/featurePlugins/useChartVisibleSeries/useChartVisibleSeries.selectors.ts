import type { ChartState } from '../../models';
import type { UseChartVisibleSeriesSignature } from './useChartVisibleSeries.types';
import { SeriesId } from '../../../../models/seriesType/common';

/**
 * Get the set of hidden series IDs.
 * @param {ChartState<[UseChartVisibleSeriesSignature]>} state The state of the chart.
 * @returns {Set<SeriesId>} The set of hidden series IDs.
 */
export const selectorHiddenSeriesIds = (
  state: ChartState<[UseChartVisibleSeriesSignature]>,
): Set<SeriesId> => state.visibleSeries.hiddenSeriesIds;

/**
 * Check if a series is visible.
 * @param {ChartState<[UseChartVisibleSeriesSignature]>} state The state of the chart.
 * @param {SeriesId} seriesId The id of the series to check.
 * @returns {boolean} Whether the series is visible.
 */
export const isSeriesVisible = (
  state: ChartState<[UseChartVisibleSeriesSignature]>,
  seriesId: SeriesId,
): boolean => !state.visibleSeries.hiddenSeriesIds.has(seriesId);
