import { ChartPluginSignature } from '../../models';
import { ChartItemIdentifier, ChartSeriesType } from '../../../../models/seriesType/config';

export interface UseChartInteractionInstance {
  /**
   * Remove all interaction.
   */
  cleanInteraction: () => void;
  /**
   * Setter for the item the user is interacting with.
   * @param {ChartItemIdentifier} newItem The identifier of the item.
   */
  setItemInteraction: (newItem: ChartItemIdentifier<ChartSeriesType>) => void;
  /**
   * Remove item interaction if the current if the provided item is still the one interacting.
   * @param {ChartItemIdentifier} itemToRemove The identifier of the item.
   */
  removeItemInteraction: (itemToRemove?: ChartItemIdentifier<ChartSeriesType>) => void;
  /**
   * Set the new axis the user is interacting with.
   * @param {Partial<AxisInteractionData>} newAxis The new axis identifier.
   */
  setAxisInteraction: (newAxis: Partial<AxisInteractionData>) => void;
}

export type AxisInteractionData = {
  x: null | {
    value: number | Date | string;
    // Set to -1 if no index.
    index: number;
  };
  y: null | {
    value: number | Date | string;
    // Set to -1 if no index.
    index: number;
  };
};

export interface UseChartInteractionState {
  interaction: {
    /**
     * The item currently interacting.
     */
    item: null | ChartItemIdentifier<ChartSeriesType>;
    /**
     * The x- and y-axes currently interacting.
     */
    axis: AxisInteractionData;
  };
}

export type UseChartInteractionSignature = ChartPluginSignature<{
  instance: UseChartInteractionInstance;
  state: UseChartInteractionState;
}>;
