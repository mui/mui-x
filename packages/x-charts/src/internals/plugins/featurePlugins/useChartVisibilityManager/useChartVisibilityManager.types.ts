import { type ChartPluginSignature } from '../../models';
import { type UseChartSeriesSignature } from '../../corePlugins/useChartSeries';

export type VisibilityMap = {
  [key: string]: boolean;
};

export type IsIdentifierVisibleFunction = {
  /**
   * Function to check if an item is visible based on its identifier.
   * @param {string | (string | number)[]} identifier The identifier of the item.
   * @returns {boolean} Whether the item is visible.
   */
  (identifier: string): boolean;
  /**
   * Function overload to check if an item is visible based on its identifier array.
   * @param {(string | number)[]} identifierArray The identifier array of the item.
   * @returns {boolean} Whether the item is visible.
   */
  (identifierArray: (string | number)[]): boolean;
};

export interface UseChartVisibilityManagerPublicAPI {
  /**
   * Hide an item by its identifier.
   *
   * @param {string} identifier The identifier of the item to hide.
   */
  hideItem(identifier: string): void;
  /**
   * Hide an item by providing an array of identifiers to join.
   *
   * The array will be joined using '-'.
   *
   * @param {(number | string)[]} identifierArray The identifiers array of the item to hide.
   */
  hideItem(identifierArray: (number | string)[]): void;
  /**
   * Show an item by its identifier.
   *
   * @param {string} identifier The identifier of the item to show.
   */
  showItem(identifier: string): void;
  /**
   * Show an item by providing an array of identifiers to join.
   *
   * The array will be joined using '-'.
   *
   * @param {(number | string)[]} identifierArray The identifiers array of the item to show.
   */
  showItem(identifierArray: (number | string)[]): void;
  /**
   * Toggle the visibility of an item by its identifier.
   *
   * @param {string | (number | string)[]} identifier The identifier of the item to toggle.
   */
  toggleItem(identifier: string): void;
  /**
   * Toggle the visibility of an item by providing an array of identifiers to join.
   *
   * The array will be joined using '-'.
   *
   * @param { (number | string)[]} identifierArray the identifiers array of the item to toggle.
   */
  toggleItem(identifierArray: (number | string)[]): void;
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
