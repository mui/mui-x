import { type ChartPluginSignature } from '../../models';
import { type UseChartSeriesSignature } from '../../corePlugins/useChartSeries';

export type VisibilityMap = {
  [key: string]: boolean;
};

export type VisibilityIdentifier = string | number;

export type IsItemVisibleFunction = {
  /**
   * Function to check if an item is visible based on its identifier.
   *
   * If more than one parameter is provided, they will be joined using '-' to form the identifier.
   * Number values will be converted to strings.
   *
   * @param {VisibilityIdentifier} identifiers The identifier of the item to check.
   * @returns {boolean} Whether the item is visible.
   */
  (...identifiers: VisibilityIdentifier[]): boolean;
};

export interface UseChartVisibilityManagerPublicAPI {
  /**
   * Hide an item by its identifier.
   *
   * If more than one parameter is provided, they will be joined using '-' to form the identifier.
   * Number values will be converted to strings.
   *
   * @param {VisibilityIdentifier} identifiers The identifiers of the item to hide.
   */
  hideItem(...identifiers: VisibilityIdentifier[]): void;
  /**
   * Show an item by its identifier.
   *
   * If more than one parameter is provided, they will be joined using '-' to form the identifier.
   * Number values will be converted to strings.
   *
   * @param {VisibilityIdentifier} identifiers The identifiers of the item to show.
   */
  showItem(...identifiers: VisibilityIdentifier[]): void;
  /**
   * Toggle the visibility of an item by its identifier.
   *
   * If more than one parameter is provided, they will be joined using '-' to form the identifier.
   * Number values will be converted to strings.
   *
   * @param {VisibilityIdentifier} identifiers The identifiers of the item to toggle.
   */
  toggleItem(...identifiers: VisibilityIdentifier[]): void;
}

export interface UseChartVisibilityManagerInstance extends UseChartVisibilityManagerPublicAPI {}

export interface UseChartVisibilityManagerParameters {
  /**
   * Callback fired when the visible series change.
   * @param {{ [key: string]: boolean }} visibilityMap The new visibility map.
   */
  onVisibilityChange?: <T extends string = string>(visibilityMap: Record<T, boolean>) => void;
  /**
   * Map of the visibility status of series and/or items.
   *
   * Different chart types use different strategies to generate these keys.
   *
   * Generally, the key format is:
   * - For series-level visibility: `${seriesId}`
   * - For item-level visibility: `${seriesId}-${itemId}`
   *
   * @example
   * {
   *   "series1": false, // series-level hidden
   *   "series2-itemA": false // item-level hidden
   * }
   */
  visibilityMap?: {
    [key: string]: boolean;
  };
}

export type UseChartVisibilityManagerDefaultizedParameters = UseChartVisibilityManagerParameters;

export interface UseChartVisibilityManagerState {
  visibilityManager: {
    /**
     * Map of identifiers visibility status.
     */
    visibilityMap: VisibilityMap;
    /**
     * Internal information to know if the user controls the state or not.
     */
    isControlled: boolean;
  };
}

export type UseChartVisibilityManagerSignature = ChartPluginSignature<{
  instance: UseChartVisibilityManagerInstance;
  publicAPI: UseChartVisibilityManagerPublicAPI;
  state: UseChartVisibilityManagerState;
  params: UseChartVisibilityManagerParameters;
  defaultizedParams: UseChartVisibilityManagerDefaultizedParameters;
  dependencies: [UseChartSeriesSignature];
}>;
