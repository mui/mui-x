import { type ChartPluginSignature } from '../../models';
import { type UseChartSeriesSignature } from '../../corePlugins/useChartSeries';
import { type SeriesItemIdentifier } from '../../../../models';
import { type ChartSeriesType } from '../../../../models/seriesType/config';

export type VisibilityIdentifier<T extends ChartSeriesType = ChartSeriesType> =
  SeriesItemIdentifier<T>;

export type VisibilityMap = Map<string, VisibilityIdentifier>;

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
  toggleItemVisibility(...identifiers: VisibilityIdentifier[]): void;
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
   * Different chart types use different keys.
   *
   * @example
   * ```ts
   * [
   *   {
   *     type: 'pie',
   *     seriesId: 'series-1',
   *     itemId: 'item-3',
   *   },
   *   {
   *     type: 'line',
   *     seriesId: 'series-2',
   *   }
   * ]
   * ```
   */
  visibilityMap?: VisibilityIdentifier[];
}

export type UseChartVisibilityManagerDefaultizedParameters = UseChartVisibilityManagerParameters;

export interface UseChartVisibilityManagerState {
  visibilityManager: {
    /**
     * Map of identifiers visibility status.
     */
    visibilityMap: VisibilityMap;
    computedOutput: VisibilityIdentifier[];
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
