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
};

export type FunnelCurveType = 'linear' | 'step' | 'bump' | 'pyramid' | 'step-pyramid';

export type Point = {
  x: number;
  y: number;
};
