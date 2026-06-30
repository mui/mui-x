import type { GeoProjection } from '@mui/x-charts-vendor/d3-geo';
import { geoPath } from '@mui/x-charts-vendor/d3-geo';
import { getProjectionFamily, selectorChartDrawingArea } from '@mui/x-charts/internals';
import type {
  ChartUsedStore,
  ProjectionFamily,
  useGeoProjectionTypes,
} from '@mui/x-charts/internals';
import { selectorChartGeoData } from '../useGeoProjection/useGeoProjection.selectors';
import type { MapRotationAxis, MapTranslationAxis } from './useGeoProjectionZoom.types';

const DEG = Math.PI / 180;
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export { getProjectionFamily };

/**
 * The interaction that feels natural for each projection family, used as the default for
 * `rotationAllowed`/`translationAllowed` when the consumer does not set them explicitly.
 */
const FAMILY_INTERACTION: Record<
  ProjectionFamily,
  { rotationAllowed: MapRotationAxis; translationAllowed: MapTranslationAxis }
> = {
  azimuthal: { rotationAllowed: 'both', translationAllowed: 'none' },
  conic: { rotationAllowed: 'long', translationAllowed: 'y' },
  cylindrical: { rotationAllowed: 'long', translationAllowed: 'y' },
  albersUsa: { rotationAllowed: 'none', translationAllowed: 'both' },
};

export function getDefaultMapInteraction(
  projection: useGeoProjectionTypes.GeoProjectionInput | null,
): { rotationAllowed: MapRotationAxis; translationAllowed: MapTranslationAxis } {
  return FAMILY_INTERACTION[getProjectionFamily(projection)];
}

/**
 * For a given projection,
 * apply a zoom factor to the scale and return
 * the rotation that will allow the `geoPoint` to be rendered at the `to` pixel coordinates.
 */
export function getRotation(
  projection: GeoProjection,
  geoPoint: [number, number],
  to: [number, number],
  zoomFactor: number = 1,
  rotationAllowed: MapRotationAxis = 'both',
): [number, number] | null {
  if (!projection.invert || !projection.rotate) {
    return null;
  }

  const rotate = projection.rotate?.();
  const scale = projection.scale();
  projection.scale(scale * zoomFactor);
  projection.rotate?.([0, 0]);

  const q = projection.invert(to);

  // Reset projection modifications to avoid side effects.
  projection.rotate?.(rotate);
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
    // Two branches solve the equation; pick the one closest to the previous one for drag continuity.
    const base = Math.atan2(x, z);
    const offset = Math.acos(clamp(Math.sin(latG) / hyp, -1, 1));
    const c1a = base - offset;
    const c1b = base + offset;
    const ref = currentLat * DEG;
    c1 = Math.abs(c1a - ref) <= Math.abs(c1b - ref) ? c1a : c1b;
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

export function clampTranslationAxis(
  value: number,
  init: number,
  boundingBox0: number,
  boundingBox1: number,
  areaStart: number,
  areaEnd: number,
  gap: number,
): number {
  // Get min/mas translation allowed
  const max = areaStart - boundingBox0 + init + gap;
  const min = areaEnd - boundingBox1 + init - gap;
  if (min > max) {
    // If not translation accept the movement only if it reduces the gap
    const prevGap0 = boundingBox0 - areaStart;
    const prevGap1 = areaEnd - boundingBox1;

    const gap = value - init;

    const nextGap0 = boundingBox0 + gap - areaStart;
    const nextGap1 = areaEnd - (boundingBox1 + gap);

    if (Math.max(prevGap0, prevGap1) > Math.max(nextGap0, nextGap1)) {
      return value;
    }
    return init;
  }
  return Math.min(max, Math.max(min, value));
}

export function getTranslation(
  store: ChartUsedStore<any>,
  projection: GeoProjection,
  geoPoint: [number, number],
  to: [number, number],
  translationAllowed: MapTranslationAxis = 'both',
  currentTranslation: [number, number] = [0, 0],
): [number, number] | null {
  if (!projection.invert || translationAllowed === 'none') {
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

  let tx = currentTranslation[0];
  let ty = currentTranslation[1];

  // Clamp translation
  // const geoData = Number.isFinite(maxEmptySpace) ? selectorChartGeoData(store.state) : null;
  // if (geoData) {
  //   const [[bx0, by0], [bx1, by1]] = geoPath(projection).bounds(geoData);

  if (allowX) {
    const translationX = initTranslation[0] + deltaX;
    tx = (translationX - drawingArea.left - drawingArea.width / 2) / drawingArea.width;
  }
  if (allowY) {
    const translationY = initTranslation[1] + deltaY;
    ty = (translationY - drawingArea.top - drawingArea.height / 2) / drawingArea.height;
  }
  // }

  return [tx, ty];
}


function rotationAllowed(projectionFamily: ProjectionFamily): MapRotationAxis {
  if (projectionFamily === 'azimuthal') {
    return 'both';
  }
  if (projectionFamily === 'albersUsa') {
    return 'none';
  }
  return 'long';
}

function translationAllowed(projectionFamily: ProjectionFamily): MapTranslationAxis {
  const rotation = rotationAllowed(projectionFamily);
  if (rotation === 'both') {
    return 'none';
  }
  if (rotation === 'long') {
    return 'y';
  }
  if (rotation === 'lat') {
    return 'x';
  }
  return 'both';

}


/**
 * Computes the new view `center` after a pan/zoom gesture that should keep `geoPoint` under the
 * pointer (`to`), at the given zoom factor.
 *
 * The transform is applied to a temporary copy of the live projection (rotation along the allowed
 * axes, then translation along the allowed axes), and the resulting `center` is read back as the
 * geographic coordinate sitting under the drawing-area center — the single source of truth of the
 * view. This unifies both families:
 * - azimuthal: only the rotation moves, so `center` encodes the full `[lon, lat]` orientation.
 * - others: the rotation moves the longitude and the translation moves the latitude, both of which
 *   are folded back into `center`.
 *
 * The live projection is restored before returning: it is the memoized selector instance, so any
 * lingering mutation would leak into the rendered map.
 */
export function getGestureCenter(
  store: ChartUsedStore<any>,
  projection: GeoProjection,
  geoPoint: [number, number],
  to: [number, number],
  zoomFactor: number,
): [number, number] | null {
  if (!projection.invert) {
    return null;
  }


  const projectionFamily = getProjectionFamily(projection);
  const drawingArea = selectorChartDrawingArea(store.state);
  const centerX = drawingArea.left + drawingArea.width / 2;
  const centerY = drawingArea.top + drawingArea.height / 2;

  const savedRotate = projection.rotate?.();
  const savedScale = projection.scale();
  const savedTranslate = projection.translate();

  // Current translation as a ratio of the drawing area, used to keep the locked axes in place.
  const currentTranslation: [number, number] = [
    (savedTranslate[0] - centerX) / drawingArea.width,
    (savedTranslate[1] - centerY) / drawingArea.height,
  ];

  // Apply the zoom factor before solving the rotation/translation so they account for the new scale.
  if (zoomFactor !== 1) {
    projection.scale(savedScale * zoomFactor);
  }

  // Rotation moves `geoPoint` toward `to` along the allowed axes: the full orientation for azimuthal
  // families, the longitude only for the others.
  const rotation = getRotation(projection, geoPoint, to, 1, rotationAllowed(projectionFamily));
  if (rotation && projection.rotate) {
    projection.rotate([-rotation[0], -rotation[1]]);
  }

  // Translation finishes moving `geoPoint` toward `to` for non-azimuthal families (e.g. the latitude).
  const translation = getTranslation(
    store,
    projection,
    geoPoint,
    to,
    translationAllowed(projectionFamily),
    currentTranslation,
  );
  if (translation) {
    projection.translate([
      centerX + translation[0] * drawingArea.width,
      centerY + translation[1] * drawingArea.height,
    ]);
  }

  // By definition, `center` is the geographic coordinate under the drawing-area center.
  const center = projection.invert?.([centerX, centerY]) as [number, number] | null;
  if (!center || !center.every(Number.isFinite)) {
    return null
  }
  const centerBack = projection(center);

  if (!centerBack || centerBack[0] !== centerX || centerBack[1] !== centerY) {
    return null
  }


  // Restore the live (memoized) projection instance.
  if (savedRotate && projection.rotate) {
    projection.rotate(savedRotate);
  }
  projection.scale(savedScale);
  projection.translate(savedTranslate);

  if (!rotation && !translation) {
    return null;
  }

  return center ?? null;
}
