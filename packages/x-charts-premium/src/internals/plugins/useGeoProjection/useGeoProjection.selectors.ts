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

const selectorChartRotate = createSelectorMemoized(
  selectorChartGeoProjectionState,
  (geoProjection): [number, number] | null => geoProjection?.rotate ?? null,
);

const selectorChartCenter = createSelectorMemoized(
  selectorChartGeoProjectionZoomState,
  (geoProjectionZoom): [number, number] | null => geoProjectionZoom?.center ?? [0, 0],
);

const selectorChartParallels = createSelectorMemoized(
  selectorChartGeoProjectionState,
  selectorChartRotate,
  (geoProjection, rotate): [number, number] =>
    geoProjection?.parallels ?? (rotate ? [rotate[1] - 15, rotate[1] + 15] : [30, 30]),
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
  selectorChartRotate,
  selectorChartCenter,
  selectorChartZoomLevel,
  selectorChartDrawingArea,
  (
    projectionInput,
    geoData,
    parallels,
    rotate,
    center,
    zoomLevel,
    drawingArea,
  ): GeoProjection | null => {
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

    if (!geoData) {
      return projection;
    }

    if (rotate) {
      projection.rotate?.(rotate);
    }

    const drawingAreaCenter = {
      x: drawingArea.left + drawingArea.width / 2,
      y: drawingArea.top + drawingArea.height / 2,
    };

    // 1. Fit the data to the drawing area — this is the `zoomLevel === 1` reference scale.
    if (isConicProjection(projection)) {
      const [[x0, y0], [x1, y1]] = geoPath(projection).bounds(geoData);
      const currentScale = projection.scale();
      const fitScale = Math.min(
        currentScale * (drawingArea.width / (x1 - x0)),
        currentScale * (drawingArea.height / (y1 - y0)),
      );
      projection.scale(fitScale);
      // Conic projections are positioned via `rotate`; `center` panning is not applied.
      if (zoomLevel != null && zoomLevel !== 1) {
        projection.scale(fitScale * zoomLevel);
      }
      return projection;
    }

    projection.fitExtent?.(
      [
        [drawingArea.left, drawingArea.top],
        [drawingArea.left + drawingArea.width, drawingArea.top + drawingArea.height],
      ],
      geoData,
    );
    const fitScale = projection.scale();

    // The fitted projection centers the data: invert the drawing-area center to get the
    // default geographic center used when `center` is not set.
    const targetCenter =
      center ?? projection.invert?.([drawingAreaCenter.x, drawingAreaCenter.y]) ?? null;

    // 2. Apply the zoom level relative to the fit scale.
    if (zoomLevel != null && zoomLevel !== 1) {
      projection.scale(fitScale * zoomLevel);
    }

    // 3. Offset the translation so `targetCenter` lands at the drawing-area center.
    if (targetCenter && projection.invert) {
      projection.translate([0, 0]);
      const projected = projection(targetCenter);
      if (projected) {
        projection.translate([
          drawingAreaCenter.x - projected[0],
          drawingAreaCenter.y - projected[1],
        ]);
      }
    }

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
