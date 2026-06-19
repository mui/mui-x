import { useDrawingArea } from './useDrawingArea';
import { useRotationAxis, useRadiusAxis } from './useAxis';

/**
 * Provides access to the geometry of a polar chart.
 *
 * Returns the chart center, polar scales, band width, and helpers for
 * positioning custom SVG elements relative to the chart.
 *
 * @returns The polar geometry helpers, or `null` if the chart scales are not ready.
 */
export function usePolarGeometry() {
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
    point: (radius: number, angle: number) => [radius * Math.sin(angle), -radius * Math.cos(angle)],
  };
}
