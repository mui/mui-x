import { type ChartPluginSignature } from '../../models';
import { type UseChartSeriesSignature } from '../../corePlugins/useChartSeries';
import { type SeriesItemIdentifier } from '../../../../models';
import { type ChartSeriesType } from '../../../../models/seriesType/config';

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
   * @param {VisibilityIdentifier} identifier The identifier of the item to check.
   * @returns {boolean} Whether the item is visible.
   */
  (identifier: VisibilityIdentifier): boolean;
};

export interface UseChartVisibilityManagerInstance<T extends ChartSeriesType> {
  /**
   * Hide an item by its identifier.
   *
   * @param {VisibilityIdentifier} identifier The identifier of the item to hide.
   */
  hideItem(identifier: VisibilityIdentifier<T>): void;
  /**
   * Show an item by its identifier.
   *
   * @param {VisibilityIdentifier} identifier The identifier of the item to show.
   */
  showItem(identifier: VisibilityIdentifier<T>): void;
  /**
   * Toggle the visibility of an item by its identifier.
   *
   * @param {VisibilityIdentifier} identifier The identifier of the item to toggle.
   */
  toggleItemVisibility(identifier: VisibilityIdentifier<T>): void;
}

export interface UseChartVisibilityManagerParameters<T extends ChartSeriesType> {
  /**
   * Callback fired when any hidden identifiers change.
   * @param {VisibilityIdentifier[]} hiddenItems The new list of hidden identifiers.
   */
  onHiddenItemsChange?: (hiddenItems: VisibilityIdentifier<T>[]) => void;
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
   *     dataIndex: 3,
   *   },
   *   {
   *     type: 'line',
   *     seriesId: 'series-2',
   *   }
   * ]
   * ```
   */
  hiddenItems?: VisibilityIdentifier<T>[];
  /**
   * List of initially hidden series and/or items.
   * Used for uncontrolled state.
   *
   * Different chart types use different keys.
   *
   * @example
   * ```ts
   * [
   *   {
   *     type: 'pie',
   *     seriesId: 'series-1',
   *     dataIndex: 3,
   *   },
   *   {
   *     type: 'line',
   *     seriesId: 'series-2',
   *   }
   * ]
   * ```
   */
  initialHiddenItems?: VisibilityIdentifier<T>[];
}

export type UseChartVisibilityManagerDefaultizedParameters<T extends ChartSeriesType> =
  UseChartVisibilityManagerParameters<T>;

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

export type UseChartVisibilityManagerSignature<T extends ChartSeriesType = ChartSeriesType> =
  ChartPluginSignature<{
    instance: UseChartVisibilityManagerInstance<T>;
    state: UseChartVisibilityManagerState;
    params: UseChartVisibilityManagerParameters<T>;
    defaultizedParams: UseChartVisibilityManagerDefaultizedParameters<T>;
    dependencies: [UseChartSeriesSignature];
  }>;
