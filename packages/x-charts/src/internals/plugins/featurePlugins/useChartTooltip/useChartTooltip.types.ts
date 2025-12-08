import type { ChartPluginSignature } from '../../models';
import type { ChartItemIdentifier, ChartSeriesType } from '../../../../models/seriesType/config';

export interface UseChartTooltipInstance {
  /**
   * Setter for the item the user is interacting with.
   * @param {ChartItemIdentifier} newItem The identifier of the item.
   */
  setItemTooltip: (newItem: ChartItemIdentifier<ChartSeriesType>) => void;
  /**
   * Remove item interaction if the current if the provided item is still the one interacting.
   * @param {ChartItemIdentifier} itemToRemove The identifier of the item.
   */
  removeItemTooltip: (itemToRemove?: ChartItemIdentifier<ChartSeriesType>) => void;
}

export interface UseChartTooltipState {
  tooltip: {
    /**
     * The item currently interacting.
     */
    item: null | ChartItemIdentifier<ChartSeriesType>;
  };
}

export type UseChartTooltipSignature = ChartPluginSignature<{
  instance: UseChartTooltipInstance;
  state: UseChartTooltipState;
}>;
