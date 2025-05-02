export type FunnelCurveOptions = {
  /**
   * The gap between the funnel segments.
   * @default 0
   */
  gap?: number;
};
export type FunnelCurveType = 'linear' | 'step' | 'bump';

export type Point = {
  x: number;
  y: number;
};
