import { ChartPluginSignature } from '../../models';

export type BrushCoordinate = { x: number; y: number } | null;

export interface UseChartBrushState {
  brush: {
    /**
     * The starting coordinate of the brush interaction.
     */
    start: BrushCoordinate;
    /**
     * The current coordinate of the brush interaction.
     */
    current: BrushCoordinate;
  };
}

export interface UseChartBrushInstance {
  /**
   * Set the brush coordinates.
   * @param {BrushCoordinate} start The starting coordinate of the brush.
   * @param {BrushCoordinate} current The current coordinate of the brush.
   */
  setBrushCoordinates: (start: BrushCoordinate, current: BrushCoordinate) => void;
  /**
   * Clear the brush coordinates.
   */
  clearBrush: () => void;
}

export interface UseChartBrushParameters {
  /**
   * Callback fired when the brush coordinates change.
   * @param {BrushCoordinate} start The starting coordinate of the brush.
   * @param {BrushCoordinate} current The current coordinate of the brush.
   */
  onBrushChange?: (start: BrushCoordinate, current: BrushCoordinate) => void;
}

export type UseChartBrushDefaultizedParameters = UseChartBrushParameters;

export type UseChartBrushSignature = ChartPluginSignature<{
  params: UseChartBrushParameters;
  defaultizedParams: UseChartBrushDefaultizedParameters;
  state: UseChartBrushState;
  instance: UseChartBrushInstance;
}>;
