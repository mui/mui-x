import { ChartPluginSignature } from '../../models';
import { SeriesId } from '../../../../models/seriesType/common';
import { UseChartSeriesSignature } from '../../corePlugins/useChartSeries';

export interface UseChartVisibilityManagerInstance {
  /**
   * Hide a series by its id.
   * @param {SeriesId} seriesId The id of the series to hide.
   */
  hideItem: (seriesId: SeriesId) => void;
  /**
   * Show a series by its id.
   * @param {SeriesId} seriesId The id of the series to show.
   */
  showItem: (seriesId: SeriesId) => void;
  /**
   * Toggle the visibility of a series by its id.
   * @param {SeriesId} seriesId The id of the series to toggle.
   */
  toggleItem: (seriesId: SeriesId) => void;
  /**
   * Check if a series is visible.
   * @param {SeriesId} seriesId The id of the series to check.
   * @returns {boolean} Whether the series is visible.
   */
  isItemVisible: (seriesId: SeriesId) => boolean;
}

export interface UseChartVisibilityManagerParameters {
  /**
   * Callback fired when the visible series change.
   * @param {SeriesId[]} hiddenSeries The ids of the hidden series.
   */
  onVisibilityChange?: (hiddenSeries: SeriesId[]) => void;
}

export type UseChartVisibilityManagerDefaultizedParameters = UseChartVisibilityManagerParameters;

export interface UseChartVisibilityManagerState {
  visibilityManager: {
    /**
     * Set of series ids that are currently hidden.
     */
    hiddenSeriesIds: Set<SeriesId>;
  };
}

export type UseChartVisibilityManagerSignature = ChartPluginSignature<{
  instance: UseChartVisibilityManagerInstance;
  state: UseChartVisibilityManagerState;
  params: UseChartVisibilityManagerParameters;
  defaultizedParams: UseChartVisibilityManagerDefaultizedParameters;
  dependencies: [UseChartSeriesSignature];
}>;
