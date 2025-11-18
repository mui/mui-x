import type { ChartState } from '../../models';
import type { UseChartVisibilityManagerSignature } from './useChartVisibilityManager.types';
import { SeriesId } from '../../../../models/seriesType/common';

/**
 * Get the set of hidden series IDs.
 * @param {ChartState<[UseChartVisibilityManagerSignature]>} state The state of the chart.
 * @returns {Set<SeriesId>} The set of hidden series IDs.
 */
export const selectorHiddenSeriesIds = (
  state: ChartState<[UseChartVisibilityManagerSignature]>,
): Set<SeriesId> => state.visibilityManager.hiddenSeriesIds;

/**
 * Check if a series is visible.
 * @param {ChartState<[UseChartVisibilityManagerSignature]>} state The state of the chart.
 * @param {SeriesId} seriesId The id of the series to check.
 * @returns {boolean} Whether the series is visible.
 */
export const isSeriesVisible = (
  state: ChartState<[UseChartVisibilityManagerSignature]>,
  seriesId: SeriesId,
): boolean => !state.visibilityManager.hiddenSeriesIds.has(seriesId);
