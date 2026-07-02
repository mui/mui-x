import type { GeoProjection } from '@mui/x-charts-vendor/d3-geo';
import { geoPath } from '@mui/x-charts-vendor/d3-geo';
import { selectorChartDrawingArea } from '@mui/x-charts/internals';
import type { ChartUsedStore } from '@mui/x-charts/internals';
import { selectorChartGeoData } from '../useGeoProjection/useGeoProjection.selectors';
import type { MapRotationAxis, MapTranslationAxis } from './useGeoProjectionZoom.types';
import { createGetVisibleCoordinate } from '../../createGetVisibleCoordinate';
import type { D3NamedProjection, GeoProjectionInput } from '../useGeoProjection';
import { getLongitudeRotation, getMinimalRollRotation, getNoRollRotation } from './rotationMath';

/** Multiplicative zoom step applied per wheel tick. */
export const WHEEL_ZOOM_STEP = 1.1;
/** Multiplicative zoom step applied per `zoomIn`/`zoomOut` call. */
export const BUTTON_ZOOM_STEP = 1.3;

type ProjectionFamily = 'azimuthal' | 'conic' | 'cylindrical' | 'albersUsa';

const PROJECTION_FAMILY: Record<D3NamedProjection, ProjectionFamily> = {
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

export function getProjectionFamily(projection: GeoProjectionInput | null): ProjectionFamily {
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

export function getDefaultMapInteraction(projection: GeoProjectionInput | null): {
  rotationAllowed: MapRotationAxis;
  translationAllowed: MapTranslationAxis;
} {
  return FAMILY_INTERACTION[getProjectionFamily(projection)];
}

/**
 * For a given projection, apply a zoom factor to the scale and return the rotation that renders
 * `geoPoint` at the `to` pixel coordinates, as `[longitude, latitude, roll]` (the view `center` plus
 * the third d3 rotation angle).
 *
 * - With `rotationAllowed: 'both+roll'`, the roll is free to move but kept as stable as possible: the
 *   shortest-arc rotation dragging `geoPoint` onto `to` is composed with the current orientation, so
 *   the roll only drifts as much as strictly required.
 * - With `rotationAllowed: 'both'`, both longitude and latitude are free but the roll is kept fixed at
 *   the current value.
 * - With `rotationAllowed: 'long'`, only the longitude is solved; the latitude and roll are kept fixed.
 * - With `rotationAllowed: 'none'`, `null` is returned so the caller keeps the current rotation.
 */
export function getRotation(
  projection: GeoProjection,
  geoPoint: [number, number],
  to: [number, number],
  zoomFactor: number = 1,
  rotationAllowed: MapRotationAxis = 'both',
): [number, number, number] | null {
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

  switch (rotationAllowed) {
    case 'both+roll':
      return getMinimalRollRotation(rotate as [number, number, number], geoPoint, q);
    case 'both':
      return getNoRollRotation(rotate as [number, number, number], geoPoint, q);
    case 'long':
      return getLongitudeRotation(rotate as [number, number, number], geoPoint, q);
    case 'none':
    default:
      return null;
  }
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
