import { ChartPluginSignature } from '../../models';
import { UseChartSeriesSignature } from '../../corePlugins/useChartSeries';

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
   * The array will be joined using the separator defined in the visibility manager parameters.
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
   * The array will be joined using the separator defined in the visibility manager parameters.
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
   * The array will be joined using the separator defined in the visibility manager parameters.
   *
   * @param { (number | string)[]} identifierArray the identifiers array of the item to toggle.
   */
  toggleItem(identifierArray: (number | string)[]): void;
}

export interface UseChartVisibilityManagerInstance extends UseChartVisibilityManagerPublicAPI {
  /**
   * Build the identifier for a series or item.
   * Automatically joins the ids using the separator.
   * @param {(string|number)[]} ids The ids to join.
   * @returns {string} The joined identifier.
   */
  buildIdentifier: (ids: string | (string | number)[]) => string;
}

export interface UseChartVisibilityManagerParameters {
  /**
   * Callback fired when the visible series change.
   * @param {{ [key: string]: boolean }} hidden The ids of the hidden series.
   */
  onVisibilityChange?: <T extends string = string>(hidden: Record<T, boolean>) => void;
  /**
   * Separator used in constructing visibility identifiers.
   *
   * @default '-'
   *
   * @example
   * // if seriesId is 'series1' and itemId is 'itemA'
   * identifier = ['series1', 'itemA'].join(separator); // 'series1-itemA'
   */
  separator?: string;
  /**
   * Map of the visibility status of series and/or items.
   *
   * Different chart types use different strategies to generate these keys.
   *
   * Generally, the key format is:
   * - For series-level visibility: `${seriesId}`
   * - For item-level visibility: `${seriesId}-${itemId}`
   *
   * If your ids contain the separator character, you might need to customize the separator prop.
   *
   * @example
   * {
   *   "series1": true, // series-level hidden
   *   "series2-itemA": true // item-level hidden
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
    separator: string;
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
