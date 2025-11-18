import { ChartPluginSignature } from '../../models';
import { SeriesItemIdentifier } from '../../../../models/seriesType';
import { UseChartSeriesSignature } from '../../corePlugins/useChartSeries';

export interface UseChartVisibilityManagerInstance {
  /**
   * Hide an item by its identifier.
   * @param {SeriesItemIdentifier} identifier The identifier of the item to hide.
   */
  hideItem: (identifier: SeriesItemIdentifier) => void;
  /**
   * Show an item by its identifier.
   * @param {SeriesItemIdentifier} identifier The identifier of the item to show.
   */
  showItem: (identifier: SeriesItemIdentifier) => void;
  /**
   * Toggle the visibility of an item by its identifier.
   * @param {SeriesItemIdentifier} identifier The identifier of the item to toggle.
   */
  toggleItem: (identifier: SeriesItemIdentifier) => void;
  /**
   * Check if an item is visible.
   * @param {SeriesItemIdentifier} identifier The identifier of the item to check.
   * @returns {boolean} Whether the item is visible.
   */
  isItemVisible: (identifier: SeriesItemIdentifier) => boolean;
}

export interface UseChartVisibilityManagerParameters {
  /**
   * Callback fired when the visible series change.
   * @param {SeriesItemIdentifier[]} hiddenSeries The ids of the hidden series.
   */
  onVisibilityChange?: (hiddenSeries: SeriesItemIdentifier[]) => void;
}

export type UseChartVisibilityManagerDefaultizedParameters = UseChartVisibilityManagerParameters;

export interface UseChartVisibilityManagerState {
  visibilityManager: {
    /**
     * Set of series ids that are currently hidden.
     */
    hiddenIdentifiers: SeriesItemIdentifier[];
  };
}

export type UseChartVisibilityManagerSignature = ChartPluginSignature<{
  instance: UseChartVisibilityManagerInstance;
  state: UseChartVisibilityManagerState;
  params: UseChartVisibilityManagerParameters;
  defaultizedParams: UseChartVisibilityManagerDefaultizedParameters;
  dependencies: [UseChartSeriesSignature];
}>;
