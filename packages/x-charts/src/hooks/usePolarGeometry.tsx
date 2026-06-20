import { useDrawingArea } from './useDrawingArea';
import { useRotationAxis, useRadiusAxis } from './useAxis';

/**
 * Provides access to the geometry of a polar chart.
 *
 * Returns the chart center coordinates, polar scales, band width
 * information, and helper utilities for positioning custom SVG
 * elements such as markers, reference lines, rings, and annotations.
 *
 * Example:
 *
 * ```tsx
 * const geometry = usePolarGeometry();
 *
 * if (!geometry) {
 *   return null;
 * }
 *
 * const [x, y] = geometry.point(100, Math.PI / 2);
 *
 * return (
 *   <circle
 *     cx={geometry.cx + x}
 *     cy={geometry.cy + y}
 *     r={4}
 *   />
 * );
 * ```
 *
 * @returns The polar geometry helpers, or `null` if the chart scales are
 * not ready, the rotation axis is not a band or point scale, or the
 * radius axis is not a continuous scale.
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

  if (!('bandwidth' in angleScale)) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('usePolarGeometry: rotation axis must use a band or point scale.');
    }
    return null;
  }

  if ('bandwidth' in radiusScale) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('usePolarGeometry: radius axis must use a continuous scale.');
    }
    return null;
  }

  return {
    cx: left + width / 2,
    cy: top + height / 2,
    angleScale,
    bandwidth: angleScale.bandwidth(),
    radiusScale,
    point: (radius, angle) => [radius * Math.sin(angle), -radius * Math.cos(angle)],
  };
}

export interface PolarGeometry {
  cx: number;
  cy: number;
  angleScale: (rotationAxis: string) => number | undefined;
  bandwidth: number;
  radiusScale: (radius: number) => number;
  point: (radius: number, angle: number) => [number, number];
}
