import type { GeoProjection } from '@mui/x-charts-vendor/d3-geo';
import { geoPath } from '@mui/x-charts-vendor/d3-geo';
import { selectorChartDrawingArea } from '@mui/x-charts/internals';
import type { ChartUsedStore, useGeoProjectionTypes } from '@mui/x-charts/internals';
import { selectorChartGeoData } from '../useGeoProjection/useGeoProjection.selectors';
import type { MapRotationAxis, MapTranslationAxis } from './useGeoProjectionZoom.types';
import { createGetVisibleCoordinate } from '../../createGetVisibleCoordinate';

const DEG = Math.PI / 180;
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

type ProjectionFamily = 'azimuthal' | 'conic' | 'cylindrical' | 'albersUsa';

const PROJECTION_FAMILY: Record<useGeoProjectionTypes.D3NamedProjection, ProjectionFamily> = {
  azimuthalEqualArea: 'azimuthal',
  azimuthalEquidistant: 'azimuthal',
  gnomonic: 'azimuthal',
  orthographic: 'azimuthal',
  stereographic: 'azimuthal',
  conicConformal: 'conic',
  conicEqualArea: 'conic',
  conicEquidistant: 'conic',
  albers: 'conic',
  albersUsa: 'albersUsa',
  equirectangular: 'cylindrical',
  mercator: 'cylindrical',
  transverseMercator: 'cylindrical',
  equalEarth: 'cylindrical',
  naturalEarth1: 'cylindrical',
};

/**
 * The interaction that feels natural for each projection family, used as the default for
 * `rotationAllowed`/`translationAllowed` when the consumer does not set them explicitly.
 */
const FAMILY_INTERACTION: Record<
  ProjectionFamily,
  { rotationAllowed: MapRotationAxis; translationAllowed: MapTranslationAxis }
> = {
  azimuthal: { rotationAllowed: 'both', translationAllowed: 'none' },
  cylindrical: { rotationAllowed: 'long', translationAllowed: 'y' },
  conic: { rotationAllowed: 'none', translationAllowed: 'both' },
  albersUsa: { rotationAllowed: 'none', translationAllowed: 'both' },
};

export function getProjectionFamily(
  projection: useGeoProjectionTypes.GeoProjectionInput | null,
): ProjectionFamily {
  if (projection == null) {
    return 'cylindrical'; // fallback to avoid useless edge cases
  }
  if (typeof projection === 'string') {
    return PROJECTION_FAMILY[projection] ?? 'cylindrical';
  }

  // Try to guess if users provided custom projection

  // Conic projections expose the `parallels` accessor (e.g. conicConformal, albers).
  if ('parallels' in projection) {
    return 'conic';
  }
  // Composite projections such as `albersUsa` stitch several conics together and so drop `rotate`
  // (there is no single sphere to spin). Treat them like the conic family they are built from.
  if (typeof projection.rotate !== 'function') {
    return 'conic';
  }
  // Azimuthal projections clip the sphere to a disc, so their clip angle sits strictly between 0 and
  // 180° (e.g. 90° for orthographic). Flat projections leave it at 0° (no clipping).
  const clipAngle = projection.clipAngle?.();
  if (typeof clipAngle === 'number' && clipAngle > 0 && clipAngle < 180) {
    return 'azimuthal';
  }
  return 'cylindrical';
}

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

  const q = createGetVisibleCoordinate(projection)(to);

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
  maxEmptySpace: number = 0,
  currentTranslation: [number, number] = [0, 0],
): [number, number] | null {
  if (!projection.invert || translationAllowed === 'none') {
    return null;
  }
  const q = createGetVisibleCoordinate(projection)(to);

  if (!geoPoint || !q) {
    return null;
  }

  const allowX = translationAllowed === 'both' || translationAllowed === 'x';
  const allowY = translationAllowed === 'both' || translationAllowed === 'y';

  const projectedGeoPoint = projection(geoPoint);
  const projectedQ = projection(q);

  if (!projectedGeoPoint || !projectedQ) {
    return null;
  }

  const deltaX = projectedQ[0] - projectedGeoPoint[0];
  const deltaY = projectedQ[1] - projectedGeoPoint[1];

  const initTranslation = projection.translate();

  const drawingArea = selectorChartDrawingArea(store.state);

  let tx = currentTranslation[0];
  let ty = currentTranslation[1];

  // Clamp translation
  const geoData = Number.isFinite(maxEmptySpace) ? selectorChartGeoData(store.state) : null;
  if (geoData) {
    const [[bx0, by0], [bx1, by1]] = geoPath(projection).bounds(geoData);

    if (allowX) {
      const translationX = clampTranslationAxis(
        initTranslation[0] + deltaX,
        initTranslation[0],
        bx0,
        bx1,
        drawingArea.left,
        drawingArea.left + drawingArea.width,
        maxEmptySpace * drawingArea.width,
      );
      tx = (translationX - drawingArea.left - drawingArea.width / 2) / drawingArea.width;
    }
    if (allowY) {
      const translationY = clampTranslationAxis(
        initTranslation[1] + deltaY,
        initTranslation[1],
        by0,
        by1,
        drawingArea.top,
        drawingArea.top + drawingArea.height,
        maxEmptySpace * drawingArea.height,
      );
      ty = (translationY - drawingArea.top - drawingArea.height / 2) / drawingArea.height;
    }
  }

  return [tx, ty];
}
