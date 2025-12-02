import { ChartPluginSignature } from '../../models';
import { UseChartSeriesSignature } from '../../corePlugins/useChartSeries';

export interface UseChartVisibilityManagerPublicAPI {
  /**
   * Hide an item by its identifier.
   * @param {string} identifier The identifier of the item to hide.
   */
  hideItem: (identifier: string) => void;
  /**
   * Show an item by its identifier.
   * @param {string} identifier The identifier of the item to show.
   */
  showItem: (identifier: string) => void;
  /**
   * Toggle the visibility of an item by its identifier.
   * @param {string} identifier The identifier of the item to toggle.
   */
  toggleItem: (identifier: string) => void;
}

export interface UseChartVisibilityManagerInstance extends UseChartVisibilityManagerPublicAPI {
  /**
   * Get the identifier for a series or item.
   * Automatically joins the ids using the separator.
   * @param {(string|number)[]} ids The ids to join.
   * @returns {string} The joined identifier.
   */
  getIdentifier: (ids: (string | number)[]) => string;
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
    visibilityMap: {
      [key: string]: boolean;
    };
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
