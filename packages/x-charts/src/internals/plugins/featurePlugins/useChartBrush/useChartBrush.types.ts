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
   * @param {BrushCoordinate} point The point coordinate, if start value is null, it will set both start and current to this value.
   */
  setBrushCoordinates: (point: BrushCoordinate) => void;
  /**
   * Clear the brush coordinates.
   */
  clearBrush: () => void;
}

export interface UseChartBrushParameters {
  /**
   * Callback fired when the brush coordinates change.
   * @param {object} brush The brush coordinates.
   * @param {BrushCoordinate} brush.start The starting coordinate of the brush.
   * @param {BrushCoordinate} brush.current The current coordinate of the brush.
   */
  onBrushChange?: (brush: { start: BrushCoordinate; current: BrushCoordinate }) => void;
}

export type UseChartBrushDefaultizedParameters = UseChartBrushParameters;

export type UseChartBrushSignature = ChartPluginSignature<{
  params: UseChartBrushParameters;
  defaultizedParams: UseChartBrushDefaultizedParameters;
  state: UseChartBrushState;
  instance: UseChartBrushInstance;
}>;
