import { ChartPluginSignature } from '../../models';
import { SeriesId } from '../../../../models/seriesType/common';
import { UseChartSeriesSignature } from '../../corePlugins/useChartSeries';

export interface UseChartVisibleSeriesInstance {
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

export interface UseChartVisibleSeriesParameters {
  /**
   * Callback fired when the visible series change.
   * @param {SeriesId[]} hiddenSeries The ids of the hidden series.
   */
  onVisibleSeriesChange?: (hiddenSeries: SeriesId[]) => void;
}

export type UseChartVisibleSeriesDefaultizedParameters = UseChartVisibleSeriesParameters;

export interface UseChartVisibleSeriesState {
  visibleSeries: {
    /**
     * Set of series ids that are currently hidden.
     */
    hiddenSeriesIds: Set<SeriesId>;
  };
}

export type UseChartVisibleSeriesSignature = ChartPluginSignature<{
  instance: UseChartVisibleSeriesInstance;
  state: UseChartVisibleSeriesState;
  params: UseChartVisibleSeriesParameters;
  defaultizedParams: UseChartVisibleSeriesDefaultizedParameters;
  dependencies: [UseChartSeriesSignature];
}>;
