import { geoPath } from '@mui/x-charts-vendor/d3-geo';
import type {
  ExtendedFeatureCollection,
  GeoProjection,
  GeoConicProjection,
} from '@mui/x-charts-vendor/d3-geo';
import type { D3NamedProjection, GeoProjectionInput } from './useGeoProjection.types';

const isConicProjection = (projection: GeoProjection): projection is GeoConicProjection => {
  return 'parallels' in projection && typeof projection.parallels === 'function';
};

/**
 * Families of d3-geo projections that share the same panning/zooming behavior.
 * - `azimuthal`: the sphere is rotated freely; `center` maps to a rotation `[-lon, -lat]`.
 * - `conic` / `cylindrical`: the sphere is rotated along the longitude only, the latitude is placed
 *   at the drawing-area center through a translation.
 * - `albersUsa`: a composite projection with no `rotate`; `center` maps to a translation only.
 */
export type ProjectionFamily = 'azimuthal' | 'conic' | 'cylindrical' | 'albersUsa';

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

export function getProjectionFamily(projection: GeoProjectionInput | null): ProjectionFamily {
  if (projection == null) {
    return 'cylindrical'; // fallback to avoid useless edge cases
  }
  if (typeof projection === 'string') {
    return PROJECTION_FAMILY[projection] ?? 'cylindrical';
  }

  // Try to guess if users provided a custom projection.

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

const DEFAULT_PARALLELS: [number, number] = [30, 30];
export function getParallels(
  parallels: [number, number] | null | undefined,
  center: [number, number] | null,
): [number, number] {
  if (parallels) {
    return parallels;
  }
  if (center) {
    return [-center[1] - 15, -center[1] + 15];
  }
  return DEFAULT_PARALLELS;
}

/**
 * Builds a *fresh* `GeoProjection` instance from the raw projection input.
 *
 * This is intentionally not a memoized selector: callers mutate the returned projection (to fit,
 * scale, translate, rotate it). Returning a shared instance would mean mutations leak between
 * consumers and, worse, that a recomputed view keeps the same object reference — so store
 * subscribers comparing with `Object.is` would not detect the change and the map would render one
 * update behind.
 */
export function resolveProjectionInstance(
  projectionInput: GeoProjectionInput | null,
  projectionFactory: Record<D3NamedProjection, (() => GeoProjection) | undefined> | null,
  parallels: [number, number],
): GeoProjection | null {
  if (projectionInput === null) {
    return null;
  }
  if (typeof projectionInput !== 'string') {
    return projectionInput;
  }
  const factory = projectionFactory?.[projectionInput];
  if (!factory) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(
        `MUI X Charts: Unknown projection name '${projectionInput}'. ` +
        `Expected one of: ${Object.keys(projectionFactory ?? {}).join(', ')}.`,
      );
    }
    return null;
  }
  const projection = factory();
  if (isConicProjection(projection)) {
    projection.parallels(parallels);
  }
  return projection;
}

/**
 * Computes the default view `center`: the geographic coordinate that, once placed at the
 * drawing-area center, leaves the data centered in the drawing area.
 *
 * It is the inverse projection of the data's bounding-box center, so it works for every projection
 * family: the selector then realizes it as a rotation (azimuthal) or a translation (other families).
 */
export function getDefaultCenter(
  projectionInput: GeoProjectionInput | null | undefined,
  projectionFactory: Record<D3NamedProjection, (() => GeoProjection) | undefined> | null,
  geoData: ExtendedFeatureCollection | null | undefined,
  parallels: [number, number] | null | undefined,
): [number, number] | null {
  if (!projectionInput || !geoData) {
    return null;
  }

  const projection = resolveProjectionInstance(
    projectionInput,
    projectionFactory,
    getParallels(parallels, null),
  );
  if (!projection || !projection.invert) {
    return null;
  }

  const [[ux0, uy0], [ux1, uy1]] = geoPath(projection).bounds(geoData);

  const center = projection.invert([(ux0 + ux1) / 2, (uy0 + uy1) / 2]);

  return (center as [number, number]) ?? null;
}
