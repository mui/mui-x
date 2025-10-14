import { ChartPluginSignature } from '../../models';

export type Point = { x: number; y: number };

export interface UseChartBrushState {
  brush: {
    /**
     * Whether the brush interaction is enabled.
     */
    enabled: boolean;
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
}

export interface UseChartBrushParameters {
  /**
   * Enables or disables the brush interaction.
   * @default false
   */
  brushEnabled?: boolean;
}

export type UseChartBrushDefaultizedParameters = {
  brushEnabled: boolean;
};

export type UseChartBrushSignature = ChartPluginSignature<{
  params: UseChartBrushParameters;
  defaultizedParams: UseChartBrushDefaultizedParameters;
  state: UseChartBrushState;
  instance: UseChartBrushInstance;
}>;
