import { useDrawingArea } from './useDrawingArea';
import { useRotationAxis, useRadiusAxis } from './useAxis';
import type { D3Scale } from '../models/axis';

/**
 * Provides access to the geometry of a polar chart.
 *
 * It can be used to position custom elements and convert between polar and Cartesian coordinates.
 *
 * @example
 * ```tsx
 * const geo = usePolarGeometry();
 *
 * const [x, y] = geo.point(100, Math.PI / 2);
 *
 * return <circle cx={geo.cx + x} cy={geo.cy + y} r={4} />
 * ```
 *
 * @returns The polar geometry helpers, or `null` if the chart scales are not ready.
 */
export function usePolarGeometry(): PolarGeometry | null {
  const { left, top, width, height } = useDrawingArea();
  const rotationAxis = useRotationAxis();
  const radiusAxis = useRadiusAxis();

  if (!rotationAxis || !radiusAxis) {
    return null;
  }

  const angleScale = rotationAxis.scale;
  const radiusScale = radiusAxis.scale;

  return {
    cx: left + width / 2,
    cy: top + height / 2,
    angleScale,
    radiusScale,
    point: (radius, angle) => [radius * Math.sin(angle), -radius * Math.cos(angle)],
    pointInverse: (x, y) => [Math.sqrt(x * x + y * y), Math.atan2(x, -y)],
  };
}

export interface PolarGeometry<
  TAngleScale extends D3Scale = D3Scale,
  TRadiusScale extends D3Scale = D3Scale,
> {
  /**
   * The X coordinate of the chart center within the SVG.
   */
  cx: number;
  /**
   * The Y coordinate of the chart center within the SVG.
   */
  cy: number;
  /**
   * The scale that maps rotation axis values to angles in radians.
   */
  angleScale: TAngleScale;
  /**
   * The scale that maps data values to radii (distance from the chart center).
   */
  radiusScale: TRadiusScale;
  /**
   * Converts polar coordinates to Cartesian offsets relative to the chart center.
   * @param {number} radius - Distance from the center.
   * @param {number} angle - Angle in radians, measured clockwise from the top (12 o'clock).
   * @returns {[number, number]} `[x, y]` offset from `[cx, cy]`.
   */
  point: (radius: number, angle: number) => [number, number];
  /**
   * Converts Cartesian offsets (relative to the chart center) back to polar coordinates.
   * The inverse of `point`.
   * @param {number} x - Horizontal offset from `cx`.
   * @param {number} y - Vertical offset from `cy`.
   * @returns {[number, number]} `[radius, angle]` where angle is in radians within `[-π, π]`.
   */
  pointInverse: (x: number, y: number) => [number, number];
}
