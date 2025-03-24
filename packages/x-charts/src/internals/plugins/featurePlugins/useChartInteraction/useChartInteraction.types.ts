import { ChartPluginSignature } from '../../models';
import { ChartItemIdentifier, ChartSeriesType } from '../../../../models/seriesType/config';

export type Coordinate = { x: number; y: number };

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
   * Set the new pointer coordinate.
   * @param {Coordinate | null} newCoordinate The new pointer coordinate.
   */
  setPointerCoordinate: (newCoordinate: Coordinate | null) => void;
}

export interface UseChartInteractionState {
  interaction: {
    /**
     * The item currently interacting.
     */
    item: null | ChartItemIdentifier<ChartSeriesType>;
    /**
     * The x/y SVG coordinate of the "main" pointer
     */
    pointer: Coordinate | null;
  };
}

export type UseChartInteractionSignature = ChartPluginSignature<{
  instance: UseChartInteractionInstance;
  state: UseChartInteractionState;
}>;
