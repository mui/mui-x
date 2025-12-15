import type { ChartPluginSignature } from '../../models';
import type { ChartItemIdentifier, ChartSeriesType } from '../../../../models/seriesType/config';

export interface UseChartTooltipInstance {
  /**
   * Setter for the item the user is pointing at.
   * @param {ChartItemIdentifier} newItem The identifier of the item.
   */
  setTooltipItem: (newItem: ChartItemIdentifier<ChartSeriesType>) => void;
  /**
   * Remove the item the user was pointing at.
   * - If `itemToRemove` is provided, it removes the item only if it matches the current one.
   *   Otherwise it assumes the item got already updated and does nothing.
   * - If `itemToRemove` is not provided, it removes the current item unconditionally.
   * @param {ChartItemIdentifier} itemToRemove The identifier of the item.
   */
  removeTooltipItem: (itemToRemove?: ChartItemIdentifier<ChartSeriesType>) => void;
}

export interface UseChartTooltipState {
  tooltip: {
    /**
     * The item currently under the pointer.
     */
    item: null | ChartItemIdentifier<ChartSeriesType>;
  };
}

export type UseChartTooltipSignature = ChartPluginSignature<{
  instance: UseChartTooltipInstance;
  state: UseChartTooltipState;
}>;
