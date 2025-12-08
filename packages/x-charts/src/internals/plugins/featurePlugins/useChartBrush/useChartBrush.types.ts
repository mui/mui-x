import { type ChartPluginSignature } from '../../models';

export type Point = { x: number; y: number };

export interface UseChartBrushState {
  brush: {
    /**
     * Whether the brush interaction is enabled.
     */
    enabled: boolean;
    /**
     * Whether the zoom brush interaction is enabled.
     */
    isZoomBrushEnabled: boolean;
    /**
     * Whether to prevent tooltip from showing during brush interaction.
     */
    preventTooltip: boolean;
    /**
     * Whether to prevent highlighting during brush interaction.
     */
    preventHighlight: boolean;
    /**
     * The starting coordinate of the brush interaction.
     */
    start: Point | null;
    /**
     * The current coordinate of the brush interaction.
     */
    current: Point | null;
  };
}

export interface UseChartBrushInstance {
  /**
   * Set the brush coordinates.
   * @param {Point | null} point The point coordinate, if start value is null, it will set both start and current to this value.
   */
  setBrushCoordinates: (point: Point | null) => void;
  /**
   * Clear the brush coordinates.
   */
  clearBrush: () => void;
  /**
   * Enable or disable the zoom brush interaction.
   * @param {boolean} enabled Whether to enable the zoom brush interaction.
   */
  setZoomBrushEnabled: (enabled: boolean) => void;
}

export interface BrushConfig {
  /**
   * Whether the brush interaction is enabled.
   * @default false
   */
  enabled?: boolean;
  /**
   * Whether to prevent tooltip from showing during brush interaction.
   * @default true
   */
  preventTooltip?: boolean;
  /**
   * Whether to prevent highlighting during brush interaction.
   * @default true
   */
  preventHighlight?: boolean;
}

export interface UseChartBrushParameters {
  /**
   * Configuration for the brush interaction.
   */
  brushConfig?: BrushConfig;
}

export type UseChartBrushDefaultizedParameters = {
  brushConfig: Required<BrushConfig>;
};

export type UseChartBrushSignature = ChartPluginSignature<{
  params: UseChartBrushParameters;
  defaultizedParams: UseChartBrushDefaultizedParameters;
  state: UseChartBrushState;
  instance: UseChartBrushInstance;
}>;
