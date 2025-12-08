import type { ChartPluginSignature } from '../../models';
import type { UseChartTooltipSignature } from '../useChartTooltip';

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
  setLastUpdate: (interaction: InteractionUpdateSource) => void;
}

export interface UseChartInteractionState {
  interaction: {
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
  optionalDependencies: [UseChartTooltipSignature];
}>;
