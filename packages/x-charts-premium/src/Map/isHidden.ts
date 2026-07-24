import type { GeoProjection } from '@mui/x-charts-vendor/d3-geo';

export interface ProjectionDrawingArea {
  left: number;
  top: number;
  width: number;
  height: number;
}

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

/**
 * Projects a coordinate and returns its pixel position only when the point is visible:
 * not hidden by the projection and inside the drawing area. The drawing area check
 * mirrors the projection `clipExtent` that clips the shapes when a `scale` is set.
 */
export function projectVisiblePoint(
  projection: GeoProjection,
  coordinates: [number, number],
  drawingArea: ProjectionDrawingArea,
): [number, number] | null {
  if (isCoordinateHidden(projection, coordinates)) {
    return null;
  }
  const point = projection(coordinates);
  if (!point) {
    return null;
  }
  const { left, top, width, height } = drawingArea;
  if (point[0] < left || point[0] > left + width || point[1] < top || point[1] > top + height) {
    return null;
  }
  return point;
}
