import { ChartPluginSignature } from '../../models';
import { SeriesItemIdentifier } from '../../../../models/seriesType';
import { UseChartSeriesSignature } from '../../corePlugins/useChartSeries';

export type VisibilityItemIdentifier = Omit<SeriesItemIdentifier, 'type'>;

export interface UseChartVisibilityManagerInstance {
  /**
   * Hide an item by its identifier.
   * @param {VisibilityItemIdentifier} identifier The identifier of the item to hide.
   */
  hideItem: (identifier: VisibilityItemIdentifier) => void;
  /**
   * Show an item by its identifier.
   * @param {VisibilityItemIdentifier} identifier The identifier of the item to show.
   */
  showItem: (identifier: VisibilityItemIdentifier) => void;
  /**
   * Toggle the visibility of an item by its identifier.
   * @param {VisibilityItemIdentifier} identifier The identifier of the item to toggle.
   */
  toggleItem: (identifier: VisibilityItemIdentifier) => void;
  /**
   * Check if an item is visible.
   * @param {VisibilityItemIdentifier} identifier The identifier of the item to check.
   * @returns {boolean} Whether the item is visible.
   */
  isItemVisible: (identifier: VisibilityItemIdentifier) => boolean;
}

export interface UseChartVisibilityManagerParameters {
  /**
   * Callback fired when the visible series change.
   * @param {VisibilityItemIdentifier[]} hiddenSeries The ids of the hidden series.
   */
  onVisibilityChange?: (hiddenSeries: VisibilityItemIdentifier[]) => void;
}

export type UseChartVisibilityManagerDefaultizedParameters = UseChartVisibilityManagerParameters;

export interface UseChartVisibilityManagerState {
  visibilityManager: {
    /**
     * Set of series ids that are currently hidden.
     */
    hiddenIdentifiers: VisibilityItemIdentifier[];
  };
}

export type UseChartVisibilityManagerSignature = ChartPluginSignature<{
  instance: UseChartVisibilityManagerInstance;
  publicAPI: UseChartVisibilityManagerInstance;
  state: UseChartVisibilityManagerState;
  params: UseChartVisibilityManagerParameters;
  defaultizedParams: UseChartVisibilityManagerDefaultizedParameters;
  dependencies: [UseChartSeriesSignature];
}>;
