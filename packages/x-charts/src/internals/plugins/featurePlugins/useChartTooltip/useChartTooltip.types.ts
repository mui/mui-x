import type { ChartPluginSignature } from '../../models';
import type { SeriesItemIdentifier } from '../../../../models/seriesType';
import type { ChartSeriesType } from '../../../../models/seriesType/config';

export interface UseChartTooltipInstance {
  /**
   * Setter for the item the user is pointing at.
   * @param {SeriesItemIdentifier} newItem The identifier of the item.
   */
  setTooltipItem: (newItem: SeriesItemIdentifier<ChartSeriesType>) => void;
  /**
   * Remove the item the user was pointing at.
   * - If `itemToRemove` is provided, it removes the item only if it matches the current one.
   *   Otherwise it assumes the item got already updated and does nothing.
   * - If `itemToRemove` is not provided, it removes the current item unconditionally.
   * @param {SeriesItemIdentifier} itemToRemove The identifier of the item.
   */
  removeTooltipItem: (itemToRemove?: SeriesItemIdentifier<ChartSeriesType>) => void;
}

export interface UseChartTooltipState {
  tooltip: {
    /**
     * The item currently under the pointer.
     */
    item: null | SeriesItemIdentifier<ChartSeriesType>;
  };
}

export type UseChartTooltipSignature = ChartPluginSignature<{
  instance: UseChartTooltipInstance;
  state: UseChartTooltipState;
}>;
