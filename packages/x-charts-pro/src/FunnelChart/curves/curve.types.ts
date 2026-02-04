import { type CurveGenerator } from '@mui/x-charts-vendor/d3-shape';

export type CurveOptions = {
  /**
   * The gap between each segment.
   * @default 0
   */
  gap?: number;
  /**
   * Indicates if the main axis of the visualization.
   */
  isHorizontal?: boolean;
  /**
   * Indicates if the segments values are increasing or decreasing.
   */
  isIncreasing?: boolean;
  /**
   * The order position of the segment.
   */
  position?: number;
  /**
   * The total number of segments that will be drawn.
   * @default 1
   */
  sections?: number;
  /**
   * The border radius of the segments.
   * @default 0
   */
  borderRadius?: number;
  /**
   * The minimum point for all the segments.
   */
  min?: Point;
  /**
   * The maximum point for all the segments.
   */
  max?: Point;
  /**
   * The shape of the point of the funnel for the curves that support it.
   */
  pointShape?: FunnelPointShape;
};

export type FunnelCurveType =
  | 'linear'
  | 'linear-sharp'
  | 'step'
  | 'bump'
  | 'pyramid'
  | 'step-pyramid';

export type FunnelPointShape = 'square' | 'sharp';

export type Point = {
  x: number;
  y: number;
};

export interface FunnelCurveGenerator extends CurveGenerator {
  /**
   * Processes the points to create a curve based on the provided options.
   * This does not draw the curve but prepares the points for rendering.
   *
   * @param points The points to process.
   * @param options The options for the curve.
   * @returns The processed points.
   */
  processPoints(points: Point[], xPosition: PositionGetter, yPosition: PositionGetter): Point[];
}
export type PositionGetter = (
  value: number,
  bandIndex: number,
  stackOffset?: number,
  useBand?: boolean,
) => number;
