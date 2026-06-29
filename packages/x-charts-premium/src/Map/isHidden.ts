import type { GeoProjection } from '@mui/x-charts-vendor/d3-geo';

/**
 * Tells whether a geographic coordinate is hidden by the projection.
 * A coordinate is hidden when it does not round-trip back to itself through the
 * projection, which happens for points on the far side of projections like `orthographic`.
 */
export function isCoordinateHidden(
  projection: GeoProjection,
  coordinates: [number, number],
): boolean {
  const point = projection(coordinates);
  if (!point) {
    return true;
  }
  const back = projection.invert?.(point);
  return (
    !back || Math.abs(back[0] - coordinates[0]) > 1 || Math.abs(back[1] - coordinates[1]) > 1
  );
}
