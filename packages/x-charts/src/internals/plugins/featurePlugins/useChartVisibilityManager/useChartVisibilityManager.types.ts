import { type ChartPluginSignature } from '../../models';
import { type UseChartSeriesSignature } from '../../corePlugins/useChartSeries';
import { type SeriesId, type SeriesItemIdentifierWithType } from '../../../../models';
import { type ChartSeriesType } from '../../../../models/seriesType/config';

export type VisibilityIdentifier<SeriesType extends ChartSeriesType = ChartSeriesType> = Partial<
  SeriesItemIdentifierWithType<SeriesType>
> &
  // If type has subTypes, subType is required too.
  (SeriesItemIdentifierWithType<SeriesType> extends { subType?: infer U }
    ? { subType: U; seriesId: SeriesId }
    : { seriesId: SeriesId });

export type VisibilityIdentifierWithType<SeriesType extends ChartSeriesType = ChartSeriesType> =
  SeriesType extends any ? VisibilityIdentifier<SeriesType> & { type: SeriesType } : never;

export type VisibilityMap = Map<string, VisibilityIdentifierWithType>;

export type IsItemVisibleFunction = {
  /**
   * Function to check if an item is visible based on its identifier.
   *
   * @param {VisibilityIdentifierWithType} identifier The identifier of the item to check.
   * @returns {boolean} Whether the item is visible.
   */
  (identifier: VisibilityIdentifierWithType): boolean;
};

export interface UseChartVisibilityManagerInstance<SeriesType extends ChartSeriesType> {
  /**
   * Hide an item by its identifier.
   *
   * @param {VisibilityIdentifier} identifier The identifier of the item to hide.
   */
  hideItem(identifier: VisibilityIdentifier<SeriesType>): void;
  /**
   * Show an item by its identifier.
   *
   * @param {VisibilityIdentifier} identifier The identifier of the item to show.
   */
  showItem(identifier: VisibilityIdentifier<SeriesType>): void;
  /**
   * Toggle the visibility of an item by its identifier.
   *
   * @param {VisibilityIdentifier} identifier The identifier of the item to toggle.
   */
  toggleItemVisibility(
    identifier: VisibilityIdentifier<SeriesType> | VisibilityIdentifierWithType<SeriesType>,
  ): void;
}

export interface UseChartVisibilityManagerParameters<SeriesType extends ChartSeriesType> {
  /**
   * Callback fired when any hidden identifiers change.
   * @param {VisibilityIdentifierWithType[]} hiddenItems The new list of hidden identifiers.
   */
  onHiddenItemsChange?: (hiddenItems: VisibilityIdentifierWithType<SeriesType>[]) => void;
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
  hiddenItems?: (VisibilityIdentifier<SeriesType> | VisibilityIdentifierWithType<SeriesType>)[];
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
  initialHiddenItems?: (
    | VisibilityIdentifier<SeriesType>
    | VisibilityIdentifierWithType<SeriesType>
  )[];
}

export type UseChartVisibilityManagerDefaultizedParameters<SeriesType extends ChartSeriesType> =
  UseChartVisibilityManagerParameters<SeriesType>;

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

export type UseChartVisibilityManagerSignature<
  SeriesType extends ChartSeriesType = ChartSeriesType,
> = ChartPluginSignature<{
  instance: UseChartVisibilityManagerInstance<SeriesType>;
  state: UseChartVisibilityManagerState;
  params: UseChartVisibilityManagerParameters<SeriesType>;
  defaultizedParams: UseChartVisibilityManagerDefaultizedParameters<SeriesType>;
  dependencies: [UseChartSeriesSignature];
}>;
