import { type GeoProjection } from '@mui/x-charts-vendor/d3-geo';
import { type ChartUsedStore, selectorChartDrawingArea } from '@mui/x-charts/internals';
import type { MapRotationAxis, MapTranslationAxis } from './useGeoProjectionZoom.types';


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
 *
 * `rotationAllowed` locks the longitude and/or latitude axis: a locked axis keeps the projection's
 * current rotation while the free axis is solved against that locked value. With `'both'` free,
 * `geoPoint` lands exactly on `to`; with one axis locked, the free axis still follows `to` along its
 * direction (the pitch couples the two, so tracking is no longer pixel-exact).
 */
export function getRotation(
  projection: GeoProjection,
  geoPoint: [number, number],
  to: [number, number],
  zoomFactor: number = 1,
  rotationAllowed: MapRotationAxis = 'both',
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
  const allowLon = rotationAllowed === 'both' || rotationAllowed === 'long';
  const allowLat = rotationAllowed === 'both' || rotationAllowed === 'lat';

  // The map's current rotation, used to lock a disallowed axis (`rotate` is `[-c0, -c1, ...]` deg).
  const currentLon = -rotate[0];
  const currentLat = -rotate[1];

  const lonG = geoPoint[0] * DEG;
  const latG = geoPoint[1] * DEG;
  const lonQ = q[0] * DEG;
  const latQ = q[1] * DEG;

  const x = Math.cos(lonQ) * Math.cos(latQ);
  const y = Math.sin(lonQ) * Math.cos(latQ);
  const z = Math.sin(latQ);

  // Pitch: locked to the current latitude when latitude rotation is disallowed, otherwise solved
  // from `A·cos(c1) + B·sin(c1) = sin(latG)` with `A = z`, `B = x`.
  let c1: number;
  if (allowLat) {
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
    c1 = Math.abs(c1a) <= Math.abs(c1b) ? c1a : c1b;
  } else {
    c1 = currentLat * DEG;
  }

  // Yaw: locked to the current longitude when longitude rotation is disallowed, otherwise derived
  // from the pitch so `geoPoint` lands at `to`'s longitude.
  let lon: number;
  if (allowLon) {
    const c0 = lonG - Math.atan2(y, x * Math.cos(c1) - z * Math.sin(c1));
    // Normalize the longitude into `[-180, 180]`.
    lon = (c0 / DEG) % 360;
    if (lon > 180) {
      lon -= 360;
    } else if (lon < -180) {
      lon += 360;
    }
  } else {
    lon = currentLon;
  }

  return [lon, c1 / DEG];
}

export function getTranslation(
  store: ChartUsedStore<any>,
  projection: GeoProjection,
  geoPoint: [number, number],
  to: [number, number],
  translationAllowed: MapTranslationAxis = 'both',
): [number, number] | null {
  if (!projection.invert) {
    return null;
  }
  const q = projection.invert(to);

  if (!geoPoint || !q) {
    return null;
  }

  const allowX = translationAllowed === 'both' || translationAllowed === 'x';
  const allowY = translationAllowed === 'both' || translationAllowed === 'y';

  const projectedGeoPoint = projection(geoPoint) as [number, number];
  const projectedQ = projection(q) as [number, number];

  const deltaX = projectedQ[0] - projectedGeoPoint[0];
  const deltaY = projectedQ[1] - projectedGeoPoint[1];

  const initTranslation = projection.translate();

  const drawingArea = selectorChartDrawingArea(store.state);

  const tx = initTranslation[0] + (allowX ? deltaX : 0);
  const ty = initTranslation[1] + (allowY ? deltaY : 0);

  return [
    (tx - drawingArea.left - drawingArea.width / 2) / drawingArea.width,
    (ty - drawingArea.top - drawingArea.height / 2) / drawingArea.height,
  ];
}
