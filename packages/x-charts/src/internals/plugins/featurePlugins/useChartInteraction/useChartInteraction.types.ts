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
   * Set the new axis the user is interacting with.
   * @param {Partial<AxisInteractionData>} newAxis The new axis identifier.
   */
  setAxisInteraction: (newAxis: Partial<AxisInteractionData>) => void;
  /**
   * Enable the voronoi computation.
   */
  enableVoronoid: () => void;
  /**
   * Disable the voronoi computation.
   */
  disableVoronoid: () => void;
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
    /**
     * Set to `true` when `VoronoiHandler` is active.
     * Used to prevent collision with mouseEnter events.
     */
    isVoronoiEnabled?: boolean;
  };
}

export type UseChartInteractionSignature = ChartPluginSignature<{
  instance: UseChartInteractionInstance;
  state: UseChartInteractionState;
}>;
