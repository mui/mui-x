import { geoPath } from '@mui/x-charts-vendor/d3-geo';
import type {
  ExtendedFeatureCollection,
  GeoProjection,
  GeoConicProjection,
} from '@mui/x-charts-vendor/d3-geo';
import type { D3NamedProjection, GeoProjectionInput } from './useGeoProjection.types';

export const isConicProjection = (projection: GeoProjection): projection is GeoConicProjection => {
  return 'parallels' in projection && typeof projection.parallels === 'function';
};

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
 * Helper function to compute the translation needed to fit the map in the drawing area at zoomLevel=1
 */
export function getDefaultTranslation(
  projectionInput: GeoProjectionInput | null | undefined,
  projectionFactory: Record<D3NamedProjection, (() => GeoProjection) | undefined> | null,
  geoData: ExtendedFeatureCollection | null | undefined,
  parallels: [number, number] | null | undefined,
  center: [number, number],
): [number, number] | null {
  if (!projectionInput || !geoData) {
    return null;
  }

  const projection = resolveProjectionInstance(
    projectionInput,
    projectionFactory,
    getParallels(parallels, center),
  );
  if (!projection) {
    return null;
  }

  projection.rotate([-center[0], -center[1]]);

  const [[ux0, uy0], [ux1, uy1]] = geoPath(projection).bounds(geoData);

  const centerPoint = projection(center);

  if (!centerPoint) {
    return null;
  }

  return [
    (centerPoint[0] - (ux0 + ux1) / 2) / (ux1 - ux0),
    (centerPoint[1] - (uy0 + uy1) / 2) / (uy1 - uy0),
  ];
}
