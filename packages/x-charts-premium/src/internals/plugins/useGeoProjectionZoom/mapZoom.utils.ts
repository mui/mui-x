import { type GeoProjection } from '@mui/x-charts-vendor/d3-geo';

/**
 * Public, resolution-independent representation of the map view.
 *
 * Unlike the raw projection `scale`/`translate` (both in SVG pixels, tied to the drawing-area
 * size), a view survives a resize: `zoomLevel` is a ratio and `center` is a geographic coordinate.
 */
export interface MapZoomView {
  /**
   * The zoom level, as a multiple of the scale that fits the data in the drawing area.
   * `1` means the whole dataset fits the drawing area; `2` means twice as close.
   */
  zoomLevel: number;
  /**
   * The geographic coordinate `[longitude, latitude]` displayed at the center of the drawing area.
   */
  center: [number, number];
}

/**
 * The geographic coordinate shown at the drawing-area center after scaling the projection by
 * `factor` about a focal point (in SVG pixels) that must stay fixed on screen.
 *
 * Gestures are inherently pixel-space, so the new translation is computed in pixels (keeping the
 * focal point fixed), then inverted back to a geographic center. The projection is mutated to
 * measure that point and restored before returning, so this reads as a pure function.
 */
export function centerAfterZoom(
  projection: GeoProjection,
  factor: number,
  focal: { x: number; y: number },
  drawingAreaCenter: { x: number; y: number },
): [number, number] | null {
  if (!projection.invert) {
    return null;
  }
  const scale = projection.scale();
  const [tx, ty] = projection.translate();

  projection
    .scale(scale * factor)
    .translate([factor * tx + (1 - factor) * focal.x, factor * ty + (1 - factor) * focal.y]);
  const center = projection.invert([drawingAreaCenter.x, drawingAreaCenter.y]);

  projection.scale(scale).translate([tx, ty]);
  return center as [number, number] | null;
}

/**
 * The geographic coordinate shown at the drawing-area center after panning the projection by a
 * screen-space pixel delta. Panning content by `(dx, dy)` moves the center to the point that was
 * previously at `drawingAreaCenter - delta`.
 */
export function centerAfterPan(
  projection: GeoProjection,
  dx: number,
  dy: number,
  drawingAreaCenter: { x: number; y: number },
): [number, number] | null {
  if (!projection.invert) {
    return null;
  }
  const center = projection.invert([drawingAreaCenter.x - dx, drawingAreaCenter.y - dy]);
  return center as [number, number] | null;
}
