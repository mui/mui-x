import { type ChartPluginSignature } from '../../models';
import { type UseChartSeriesSignature } from '../../corePlugins/useChartSeries';
import { type SeriesItemIdentifier } from '../../../../models';
import {
  type ChartSeriesType,
  type ChartsSeriesConfig,
} from '../../../../models/seriesType/config';

export type VisibilityIdentifier<T extends ChartSeriesType = ChartSeriesType> = Partial<
  SeriesItemIdentifier<T>
> &
  // Only type is required. If type has subTypes, subType is required too.
  (SeriesItemIdentifier<T> extends { subType?: infer U } ? { type: T; subType: U } : { type: T });

export type VisibilityMap = Map<string, VisibilityIdentifier>;

export type IsItemVisibleFunction = {
  /**
   * Function to check if an item is visible based on its identifier.
   *
   * If more than one parameter is provided, they will be joined using '-' to form the identifier.
   * Number values will be converted to strings.
   *
   * @param {VisibilityIdentifier} identifier The identifier of the item to check.
   * @returns {boolean} Whether the item is visible.
   */
  (identifier: VisibilityIdentifier): boolean;
};

export interface UseChartVisibilityManagerPublicAPI {
  /**
   * Hide an item by its identifier.
   *
   * If more than one parameter is provided, they will be joined using '-' to form the identifier.
   * Number values will be converted to strings.
   *
   * @param {VisibilityIdentifier} identifier The identifier of the item to hide.
   */
  hideItem(identifier: VisibilityIdentifier): void;
  /**
   * Show an item by its identifier.
   *
   * If more than one parameter is provided, they will be joined using '-' to form the identifier.
   * Number values will be converted to strings.
   *
   * @param {VisibilityIdentifier} identifier The identifier of the item to show.
   */
  showItem(identifier: VisibilityIdentifier): void;
  /**
   * Toggle the visibility of an item by its identifier.
   *
   * If more than one parameter is provided, they will be joined using '-' to form the identifier.
   * Number values will be converted to strings.
   *
   * @param {VisibilityIdentifier} identifier The identifier of the item to toggle.
   */
  toggleItemVisibility(identifier: VisibilityIdentifier): void;
}

export interface UseChartVisibilityManagerInstance extends UseChartVisibilityManagerPublicAPI {}

export interface UseChartVisibilityManagerParameters {
  /**
   * Callback fired when any hidden identifiers change.
   * @param {VisibilityIdentifier[]} hiddenIdentifiers The new list of hidden identifiers.
   */
  onVisibilityChange?: <T extends ChartSeriesType = keyof ChartsSeriesConfig>(
    hiddenIdentifiers: VisibilityIdentifier<T>[],
  ) => void;
  /**
   * List of hidden series and/or items.
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
  hiddenIdentifiers?: VisibilityIdentifier[];
}

export type UseChartVisibilityManagerDefaultizedParameters = UseChartVisibilityManagerParameters;

export interface UseChartVisibilityManagerState {
  visibilityManager: {
    /**
     * Map of hidden identifiers by their serialized form.
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
