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
  geoPath,
  type ExtendedFeatureCollection,
  type GeoProjection,
  type GeoPath,
  type GeoConicProjection,
} from '@mui/x-charts-vendor/d3-geo';
import type {
  D3NamedProjection,
  GeoProjectionInput,
  UseGeoProjectionSignature,
  UseGeoProjectionState,
} from './useGeoProjection.types';
import type { UseGeoProjectionZoomSignature } from '../useGeoProjectionZoom/useGeoProjectionZoom.types';

/**
 * The projection lives in `useGeoProjection`, while its zoom state (`zoomLevel`/`center`) lives in
 * the optional `useGeoProjectionZoom` plugin. The projection selector reads both, so its state is
 * typed with the zoom signature as an optional dependency.
 */
type GeoChartState = ChartState<[], [UseGeoProjectionSignature, UseGeoProjectionZoomSignature]>;

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

const isConicProjection = (projection: GeoProjection): projection is GeoConicProjection => {
  return 'parallels' in projection && typeof projection.parallels === 'function';
};

/**
 * Resolves a raw projection input (a d3-geo name like `'mercator'`, or a `GeoProjection` instance)
 * into a usable `GeoProjection`. Named projections are instantiated from their factory and, when
 * conic, configured with `parallels`. Returns `null` for an unknown name.
 */
const resolveProjection = (
  projectionInput: GeoProjectionInput,
  parallels: [number, number],
): GeoProjection | null => {
  if (typeof projectionInput !== 'string') {
    return projectionInput;
  }
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
  const projection = factory();
  if (isConicProjection(projection)) {
    projection.parallels(parallels);
  }
  return projection;
};
export const selectorChartGeoProjectionState = (
  state: GeoChartState,
): UseGeoProjectionState['geoProjection'] | undefined => state.geoProjection;

const selectorChartGeoProjectionZoomState = (state: GeoChartState) => state.geoProjectionZoom;

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

export const selectorChartZoomLevel = createSelector(
  selectorChartGeoProjectionZoomState,
  (geoProjectionZoom): number | null => geoProjectionZoom?.zoomLevel ?? 1,
);
const selectorChartCenter = createSelectorMemoized(
  selectorChartGeoProjectionZoomState,
  (geoProjectionZoom): [number, number] | null => geoProjectionZoom?.center ?? [0, 0],
);

const selectorChartParallels = createSelectorMemoized(
  selectorChartGeoProjectionState,
  selectorChartCenter,
  (geoProjection, center): [number, number] =>
    geoProjection?.parallels ?? (center ? [-center[1] - 15, -center[1] + 15] : [30, 30]),
);
/**
 * Map a feature's `properties.name` to its index in `geoData.features`,
 * for fast lookup by name when joining series rows to features.
 *
 * Features without a string `properties.name` are skipped; on duplicates,
 * the first occurrence wins.
 */
export const selectorChartGeoFeatureIndexesByName = createSelectorMemoized(
  selectorChartRawGeoData,
  (geoData): ReadonlyMap<string, number[]> => {
    const map = new Map<string, number[]>();
    if (!geoData) {
      return map;
    }
    geoData.features.forEach((feature, index) => {
      const name = feature.properties?.name;
      if (typeof name !== 'string') {
        return;
      }
      if (map.has(name)) {
        map.get(name)!.push(index);
        return;
      }
      map.set(name, [index]);
    });
    return map;
  },
);

const selectorFitScale = createSelector(
  selectorChartRawGeoData,
  selectorChartDrawingArea,
  selectorChartRawProjection,
  selectorChartParallels,
  (geoData, drawingArea, projectionInput, parallels): number | null => {
    if (!geoData || !projectionInput) {
      return null;
    }
    const projection = resolveProjection(projectionInput, parallels);
    if (!projection) {
      return null;
    }
    const [[x0, y0], [x1, y1]] = geoPath(projection).bounds(geoData);
    const currentScale = projection.scale();
    return Math.min(
      currentScale * (drawingArea.width / (x1 - x0)),
      currentScale * (drawingArea.height / (y1 - y0)),
    );
  },
);

/**
 * Resolves the raw `projection` input into a ready-to-use `GeoProjection` instance,
 * fitted to the chart's drawing area then zoomed/panned according to the current view.
 *
 * - String inputs (e.g. `'mercator'`) are mapped to the matching d3-geo factory.
 * - `GeoProjection` instances are used as-is, then fitted.
 * - The projection is first fitted to the data (the `zoomLevel === 1` baseline), then its
 *   scale is multiplied by `zoomLevel` and its translation is offset so `center` lands at the
 *   center of the drawing area. Keeping the view as `{ zoomLevel, center }` means the absolute
 *   scale/translation are derived here, never stored — so they stay correct across resizes.
 * - Returns `null` when no projection is registered or the name is unknown.
 */
export const selectorChartProjection = createSelectorMemoized(
  selectorChartRawProjection,
  selectorChartRawGeoData,
  selectorChartParallels,
  selectorChartCenter,
  selectorChartZoomLevel,
  selectorChartDrawingArea,
  selectorFitScale,
  (
    projectionInput,
    geoData,
    parallels,
    center,
    zoomLevel,
    drawingArea,
    fitScale,
  ): GeoProjection | null => {
    if (!projectionInput) {
      return null;
    }
    const projection = resolveProjection(projectionInput, parallels);
    if (!projection) {
      return null;
    }

    if (!geoData || fitScale == null) {
      return projection;
    }

    if (center) {
      projection.rotate?.([-center[0], -center[1]]);
    }

    // `fitScale` is the `zoomLevel === 1` reference scale, computed independently in
    // `selectorFitScale` so it stays stable across pan/zoom transforms.
    projection.scale(zoomLevel != null && zoomLevel !== 1 ? fitScale * zoomLevel : fitScale);

    // Conic projections are positioned via `rotate`; `center` panning is not applied.
    if (isConicProjection(projection)) {
      return projection;
    }
    projection.translate([
      drawingArea.left + drawingArea.width / 2,
      drawingArea.top + drawingArea.height / 2,
    ]);

    return projection;
  },
);

/**
 * Resolves the raw `projection` input into a ready-to-use `GeoPath` instance
 * fitted to the chart's drawing area.
 */
export const selectorChartGeoPath = createSelectorMemoized(
  selectorChartProjection,
  (projection): GeoPath | null => {
    if (!projection) {
      return null;
    }
    return geoPath(projection);
  },
);
