import { useDrawingArea, useRadiusAxis, useRotationAxis } from '@mui/x-charts/hooks';

/**
 * Reads the polar scales through chart hooks and exposes helpers to place
 * custom SVG relative to the chart center. Returns `null` before the scales
 * are ready.
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
    angleScale: rotationAxis.scale,
    bandwidth: rotationAxis.scale.bandwidth(),
    radiusScale: radiusAxis.scale,
    point: (radius, angle) => [radius * Math.sin(angle), -radius * Math.cos(angle)],
  };
}
