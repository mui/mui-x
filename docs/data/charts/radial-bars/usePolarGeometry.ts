import { useDrawingArea, useRadiusAxis, useRotationAxis } from '@mui/x-charts/hooks';

export interface PolarGeometry {
  cx: number;
  cy: number;
  angleScale: (value: string) => number | undefined;
  bandwidth: number;
  radiusScale: (value: number) => number;
  // Polar (0 = up, clockwise) to local cartesian, relative to the center.
  point: (radius: number, angle: number) => readonly [number, number];
}

/**
 * Reads the polar scales through chart hooks and exposes helpers to place
 * custom SVG relative to the chart center. Returns `null` before the scales
 * are ready.
 */
export function usePolarGeometry(): PolarGeometry | null {
  const { left, top, width, height } = useDrawingArea();
  const rotationAxis = useRotationAxis();
  const radiusAxis = useRadiusAxis();

  if (!rotationAxis || !radiusAxis) {
    return null;
  }

  return {
    cx: left + width / 2,
    cy: top + height / 2,
    angleScale: rotationAxis.scale as (value: string) => number | undefined,
    bandwidth: (rotationAxis.scale as { bandwidth: () => number }).bandwidth(),
    radiusScale: radiusAxis.scale as (value: number) => number,
    point: (radius, angle) => [radius * Math.sin(angle), -radius * Math.cos(angle)],
  };
}
