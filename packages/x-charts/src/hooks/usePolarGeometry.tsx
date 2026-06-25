import { useDrawingArea } from './useDrawingArea';
import { useRotationAxis, useRadiusAxis } from './useAxis';

/**
 * Provides access to the geometry of a polar chart.
 *
 * It can be used to position custom elements, and serves as helper to convert polar coordinates to xartesian coordinates 
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
    bandwidth: 'bandwidth' in angleScale ? angleScale.bandwidth() : 0,
    radiusScale,
    point: (radius, angle) => [radius * Math.sin(angle), -radius * Math.cos(angle)],
  };
}

export interface PolarGeometry {
  cx: number;
  cy: number;
  angleScale: any;
  bandwidth: number;
  radiusScale: any;
  point: (radius: number, angle: number) => [number, number];
}
