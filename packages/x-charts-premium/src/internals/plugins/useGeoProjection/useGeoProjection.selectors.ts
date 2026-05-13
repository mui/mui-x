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
  type GeoProjection,
} from '@mui/x-charts-vendor/d3-geo';
import { type UseGeoProjectionSignature } from './useGeoProjection.types';

const PROJECTION_FACTORIES: Record<string, (() => GeoProjection) | undefined> = {
  albers: geoAlbers,
  albersUsa: geoAlbersUsa,
  azimuthalEqualArea: geoAzimuthalEqualArea,
  azimuthalEquidistant: geoAzimuthalEquidistant,
  conicConformal: geoConicConformal,
  conicEqualArea: geoConicEqualArea,
  conicEquidistant: geoConicEquidistant,
  equalEarth: geoEqualEarth,
  equirectangular: geoEquirectangular,
  gnomonic: geoGnomonic,
  mercator: geoMercator,
  naturalEarth1: geoNaturalEarth1,
  orthographic: geoOrthographic,
  stereographic: geoStereographic,
  transverseMercator: geoTransverseMercator,
};

export const selectorChartGeoProjectionState = (
  state: ChartState<[], [UseGeoProjectionSignature]>,
) => state.geoProjection;

export const selectorChartRawGeoData = createSelector(
  selectorChartGeoProjectionState,
  (geoProjection) => geoProjection?.geoData ?? null,
);

export const selectorChartRawProjection = createSelector(
  selectorChartGeoProjectionState,
  (geoProjection) => geoProjection?.projection ?? null,
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
  selectorChartDrawingArea,
  (projectionInput, geoData, drawingArea): GeoProjection | null => {
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
