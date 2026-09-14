import type { ChartPluginSignature } from '../../models';
import type { SeriesItemIdentifierWithType } from '../../../../models/seriesType';
import type { ChartSeriesType } from '../../../../models/seriesType/config';

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
   * Set the item the pointer is over.
   * @param {SeriesItemIdentifierWithType} item The item under the pointer.
   */
  setHoveredItem: (item: SeriesItemIdentifierWithType<ChartSeriesType>) => void;
  /**
   * Remove the item the pointer was over.
   * @param {SeriesItemIdentifierWithType} itemToRemove Only clears the item when it is the current
   * one. Omit to clear unconditionally.
   */
  clearHoveredItem: (itemToRemove?: SeriesItemIdentifierWithType<ChartSeriesType>) => void;
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
    /**
     * The item the pointer is currently over.
     *
     * Unlike the highlighted and the tooltip items, this one is never controlled, so it always
     * reflects the pointer. That is what makes it usable to resolve what a click landed on.
     */
    hoveredItem: SeriesItemIdentifierWithType<ChartSeriesType> | null;
  };
}

export type UseChartInteractionSignature = ChartPluginSignature<{
  instance: UseChartInteractionInstance;
  state: UseChartInteractionState;
}>;
