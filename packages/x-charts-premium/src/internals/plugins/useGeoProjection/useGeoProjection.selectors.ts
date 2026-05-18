import { createSelector, createSelectorMemoized } from '@mui/x-internals/store';
import { type ChartState, selectorChartDrawingArea } from '@mui/x-charts/internals';
import {
  geoAlbers,
  geoAlbersUsa,
  geoAzimuthalEqualArea,
  geoAzimuthalEquidistant,
  geoConicConformal,
  geoConicEqualArea,
  geoConicEquidistant,
  geoEqualEarth,
  geoEquirectangular,
  geoGnomonic,
  geoMercator,
  geoNaturalEarth1,
  geoOrthographic,
  geoStereographic,
  geoTransverseMercator,
  type ExtendedFeatureCollection,
  type GeoProjection,
} from '@mui/x-charts-vendor/d3-geo';
import type {
  D3NamedProjection,
  GeoProjectionInput,
  UseGeoProjectionSignature,
  UseGeoProjectionState,
} from './useGeoProjection.types';

const PROJECTION_FACTORIES: Record<D3NamedProjection, (() => GeoProjection) | undefined> = {
  // Azimuthal projections (https://d3js.org/d3-geo/azimuthal)
  azimuthalEqualArea: geoAzimuthalEqualArea,
  azimuthalEquidistant: geoAzimuthalEquidistant,
  gnomonic: geoGnomonic,
  orthographic: geoOrthographic,
  stereographic: geoStereographic,

  // Conic projections (https://d3js.org/d3-geo/conic)
  conicConformal: geoConicConformal,
  conicEqualArea: geoConicEqualArea,
  conicEquidistant: geoConicEquidistant,
  albers: geoAlbers,
  albersUsa: geoAlbersUsa, // Special composition for the USA with an edge case for Alaska and Hawaii.

  // Cylindrical projections (https://d3js.org/d3-geo/cylindrical)
  equirectangular: geoEquirectangular,
  mercator: geoMercator,
  transverseMercator: geoTransverseMercator,
  equalEarth: geoEqualEarth,
  naturalEarth1: geoNaturalEarth1,
};

const isConicProjection = (
  projection: GeoProjection,
): projection is GeoProjection & { parallels(parallels: [number, number]): GeoProjection } => {
  return 'parallels' in projection && typeof projection.parallels === 'function';
};
export const selectorChartGeoProjectionState = (
  state: ChartState<[], [UseGeoProjectionSignature]>,
): UseGeoProjectionState['geoProjection'] | undefined => state.geoProjection;

export const selectorChartRawGeoData: (
  state: ChartState<[], [UseGeoProjectionSignature]>,
) => ExtendedFeatureCollection | null = createSelector(
  selectorChartGeoProjectionState,
  (geoProjection) => geoProjection?.geoData ?? null,
);

export const selectorChartRawProjection = createSelector(
  selectorChartGeoProjectionState,
  (geoProjection): GeoProjectionInput | null => geoProjection?.projection ?? null,
);

const selectorChartParallels = createSelector(
  selectorChartGeoProjectionState,
  (geoProjection): [number, number] => geoProjection?.parallels ?? [30, 60],
);
/**
 * Map a feature's `properties.name` to its index in `geoData.features`,
 * for fast lookup by name when joining series rows to features.
 *
 * Features without a string `properties.name` are skipped; on duplicates,
 * the first occurrence wins.
 */
export const selectorChartGeoFeatureIndexByName = createSelectorMemoized(
  selectorChartRawGeoData,
  (geoData): ReadonlyMap<string, number> => {
    const map = new Map<string, number>();
    if (!geoData) {
      return map;
    }
    geoData.features.forEach((feature, index) => {
      const name = feature.properties?.name;
      if (typeof name !== 'string' || map.has(name)) {
        return;
      }
      map.set(name, index);
    });
    return map;
  },
);

/**
 * Resolves the raw `projection` input into a ready-to-use `GeoProjection` instance
 * fitted to the chart's drawing area.
 *
 * - String inputs (e.g. `'mercator'`) are mapped to the matching d3-geo factory.
 * - `GeoProjection` instances are used as-is, then fitted.
 * - Returns `null` when no projection is registered or the name is unknown.
 */
export const selectorChartProjection = createSelectorMemoized(
  selectorChartRawProjection,
  selectorChartRawGeoData,
  selectorChartParallels,
  selectorChartDrawingArea,
  (projectionInput, geoData, parallels, drawingArea): GeoProjection | null => {
    if (!projectionInput) {
      return null;
    }
    let projection: GeoProjection;
    if (typeof projectionInput === 'string') {
      const factory = PROJECTION_FACTORIES[projectionInput];
      if (!factory) {
        if (process.env.NODE_ENV !== 'production') {
          console.error(
            `MUI X Charts: Unknown projection name '${projectionInput}'. ` +
              `Expected one of: ${Object.keys(PROJECTION_FACTORIES).join(', ')}.`,
          );
        }
        return null;
      }
      projection = factory();
      if (isConicProjection(projection)) {
        projection.parallels(parallels);
      }
    } else {
      projection = projectionInput;
    }
    if (geoData) {
      projection.fitExtent(
        [
          [drawingArea.left, drawingArea.top],
          [drawingArea.left + drawingArea.width, drawingArea.top + drawingArea.height],
        ],
        geoData,
      );
    }
    return projection;
  },
);
