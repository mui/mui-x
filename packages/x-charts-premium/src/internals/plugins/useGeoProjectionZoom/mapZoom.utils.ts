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

const DEG = Math.PI / 180;
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/**
 * The geographic `center` (`[longitude, latitude]`) such that, after scaling the projection by
 * `zoomFactor` and applying `rotate([-center[0], -center[1]])`, the geographic coordinate
 * `geoPoint` is displayed exactly under the pixel `to`.
 *
 * `rotate([-c0, -c1])` is a yaw (longitude) followed by a pitch (latitude) rotation of the sphere,
 * so the relation between `geoPoint`, `to` and `center` is non-linear — a naive additive offset
 * only holds along the central meridian. We solve it exactly: `q` is the geographic point the
 * unrotated (but zoomed) projection shows under `to` (independent of the current rotation, hence
 * computed with `rotate([0, 0])`), then we find the yaw/pitch that maps `geoPoint` onto `q`.
 *
 * The projection is mutated to measure `q` and restored before returning, so this reads as a pure
 * function. Returns `null` when the projection is not invertible or the target latitude is
 * unreachable by a pitch-only rotation of `geoPoint`.
 */
export function getRotation(
  projection: GeoProjection,
  geoPoint: [number, number],
  to: [number, number],
  zoomFactor: number = 1,
): [number, number] | null {
  if (!projection.invert) {
    return null;
  }

  const rotate = projection.rotate();
  const scale = projection.scale();
  projection.scale(scale * zoomFactor);
  projection.rotate([0, 0]);

  const q = projection.invert(to);

  // Reset projection modifications to avoid side effects.
  projection.rotate(rotate);
  projection.scale(scale);

  if (!geoPoint || !q) {
    return null;
  }

  // Solve `geoRotation([-c0, -c1])(geoPoint) === q` for the yaw `c0` and pitch `c1` (radians).
  const lonG = geoPoint[0] * DEG;
  const latG = geoPoint[1] * DEG;
  const lonQ = q[0] * DEG;
  const latQ = q[1] * DEG;

  const x = Math.cos(lonQ) * Math.cos(latQ);
  const y = Math.sin(lonQ) * Math.cos(latQ);
  const z = Math.sin(latQ);

  // Pitch from `A·cos(c1) + B·sin(c1) = sin(latG)` with `A = z`, `B = x`.
  const hyp = Math.hypot(z, x);
  if (hyp === 0 || Math.abs(Math.sin(latG)) > hyp) {
    // Target latitude is out of reach for a pitch-only rotation of `geoPoint`.
    return null;
  }
  // Two branches solve the equation; pick the one closest to no pitch for drag continuity.
  const base = Math.atan2(x, z);
  const offset = Math.acos(clamp(Math.sin(latG) / hyp, -1, 1));
  const c1a = base - offset;
  const c1b = base + offset;
  const c1 = Math.abs(c1a) <= Math.abs(c1b) ? c1a : c1b;

  // Yaw, once the pitch is known.
  const c0 = lonG - Math.atan2(y, x * Math.cos(c1) - z * Math.sin(c1));

  // Normalize the longitude into `[-180, 180]`.
  let lon = (c0 / DEG) % 360;
  if (lon > 180) {
    lon -= 360;
  } else if (lon < -180) {
    lon += 360;
  }

  return [lon, c1 / DEG];
}
