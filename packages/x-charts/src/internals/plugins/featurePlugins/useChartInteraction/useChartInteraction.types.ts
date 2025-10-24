import { ChartPluginSignature } from '../../models';
import {
  ChartItemIdentifier,
  ChartSeriesType,
  type ChartItemIdentifierWithData,
} from '../../../../models/seriesType/config';

export type Coordinate = { x: number; y: number };

export type InteractionUpdateSource = 'pointer' | 'keyboard';

export interface UseChartInteractionInstance {
  /**
   * Remove all interaction.
   */
  cleanInteraction: () => void;
  /**
   * Setter for the item the user is interacting with.
   * @param {ChartItemIdentifier} newItem The identifier of the item.
   * @param {{ interaction: InteractionUpdateSource }} context The context of the interaction.
   * @param {InteractionUpdateSource} context.interaction The source of the interaction update (pointer or keyboard).
   */
  setItemInteraction: (
    newItem: ChartItemIdentifierWithData<ChartSeriesType>,
    context: { interaction: InteractionUpdateSource },
  ) => void;
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
    item: null | ChartItemIdentifierWithData<ChartSeriesType>;
    /**
     * The x/y SVG coordinate of the "main" pointer
     */
    pointer: Coordinate | null;
    /**
     * The last interaction highlight update.
     * Used to decide if highlight should be based on pointer position or keyboard navigation.
     */
    lastUpdate: InteractionUpdateSource;
  };
}

export type UseChartInteractionSignature = ChartPluginSignature<{
  instance: UseChartInteractionInstance;
  state: UseChartInteractionState;
}>;
