import type { ChartPluginSignature } from '../../models';

export type Coordinate = { x: number; y: number };

export type InteractionUpdateSource = 'pointer' | 'keyboard';

export interface UseChartInteractionInstance {
  /**
   * Remove all interaction.
   */
  cleanInteraction: () => void;
  /**
   * Set the new pointer coordinate.
   * @param {Coordinate | null} newCoordinate The new pointer coordinate.
   */
  setPointerCoordinate: (newCoordinate: Coordinate | null) => void;
  /**
   * Set the last interaction update source.
   * Used to determine if tooltip of highlight should use the keyboard or pointer items.
   * @param {InteractionUpdateSource} interaction The source of the last interaction update (pointer or keyboard)
   * @returns {void}
   */
  setLastUpdateSource: (interaction: InteractionUpdateSource) => void;
  /**
   * Handle pointer enter event on the chart Surface.
   */
  handlePointerEnter: React.PointerEventHandler;
  /**
   * Handle pointer leave event on the chart Surface.
   */
  handlePointerLeave: React.PointerEventHandler;
}

export interface UseChartInteractionState {
  interaction: {
    /**
     * The x/y SVG coordinate of the "main" pointer
     */
    pointer: Coordinate | null;
    /**
     * The type of pointer on the SVG.
     * Is null if there is no pointer on the SVG.
     */
    pointerType: React.PointerEvent['pointerType'] | null;
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
