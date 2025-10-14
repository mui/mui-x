import { ChartPluginSignature } from '../../models';

export type Point = { x: number; y: number };

export interface UseChartBrushState {
  brush: {
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
   * Callback fired when the brush coordinates change.
   * @param {object} brush The brush coordinates.
   * @param {Point | null} brush.start The starting coordinate of the brush.
   * @param {Point | null} brush.current The current coordinate of the brush.
   */
  onBrushChange?: (brush: { start: Point | null; current: Point | null }) => void;
}

export type UseChartBrushDefaultizedParameters = UseChartBrushParameters;

export type UseChartBrushSignature = ChartPluginSignature<{
  params: UseChartBrushParameters;
  defaultizedParams: UseChartBrushDefaultizedParameters;
  state: UseChartBrushState;
  instance: UseChartBrushInstance;
}>;
