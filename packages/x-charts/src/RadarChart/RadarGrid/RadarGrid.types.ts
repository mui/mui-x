export interface RadarGridProps {
  /**
   * The number of divisions in the radar grid.
   * @default 5
   */
  divisions?: number;
  /**
   * The grid shape.
   * @default 'sharp'
   */
  shape?: 'sharp' | 'circular';
}

export interface RadarGridRenderProps {
  center: {
    x: number;
    y: number;
  };
  corners: { x: number; y: number }[];
  divisions: number;
  radius: number;
}
