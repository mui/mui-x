import { createSelector, createSelectorMemoized } from '@mui/x-internals/store';
import { geoPath } from '@mui/x-charts-vendor/d3-geo';
import type {
  ExtendedFeatureCollection,
  GeoProjection,
  GeoPath,
} from '@mui/x-charts-vendor/d3-geo';
import { selectorChartDrawingArea } from '@mui/x-charts/internals';
import type { ChartState } from '@mui/x-charts/internals';
import type {
  D3NamedProjection,
  GeoProjectionInput,
  GeoTooltipPosition,
  UseGeoProjectionSignature,
  UseGeoProjectionState,
} from './useGeoProjection.types';
import type { UseGeoProjectionZoomSignature } from '../useGeoProjectionZoom/useGeoProjectionZoom.types';
import { getParallels, resolveProjectionInstance } from './projection.utils';

const ZERO_COORDINATES: [number, number] = [0, 0];

export const selectorChartGeoProjectionState = (
  state: ChartState<[], [UseGeoProjectionSignature]>,
): UseGeoProjectionState['geoProjection'] | undefined => state.geoProjection;

const selectorChartGeoProjectionZoomState = (
  state: ChartState<[], [UseGeoProjectionZoomSignature]>,
) => state.geoProjectionZoom;

export const selectorChartGeoData: (
  state: ChartState<[], [UseGeoProjectionSignature]>,
) => ExtendedFeatureCollection | null = createSelector(
  selectorChartGeoProjectionState,
  (geoProjection) => geoProjection?.geoData ?? null,
);

export const selectorChartGeoFeatureKey = createSelector(
  selectorChartGeoProjectionState,
  function selectorChartGeoFeatureKey(geoProjection) {
    return geoProjection?.geoFeatureKey ?? 'name';
  },
);

export const selectorChartRawProjection = createSelector(
  selectorChartGeoProjectionState,
  function selectorChartRawProjection(geoProjection): GeoProjectionInput | null {
    return geoProjection?.projection ?? null;
  },
);

export const selectorChartProjectionFactory = createSelector(
  selectorChartGeoProjectionState,
  function selectorChartProjectionFactory(
    geoProjection,
  ): Record<D3NamedProjection, (() => GeoProjection) | undefined> | null {
    return geoProjection?.factories ?? null;
  },
);

export const selectorChartZoomLevel = createSelector(
  selectorChartGeoProjectionZoomState,
  function selectorChartZoomLevel(geoProjectionZoom): number {
    return geoProjectionZoom?.zoomLevel ?? 1;
  },
);
const selectorChartCenter = createSelectorMemoized(
  selectorChartGeoProjectionZoomState,
  function selectorChartCenter(geoProjectionZoom): [number, number] {
    return geoProjectionZoom?.center ?? ZERO_COORDINATES;
  },
);
const selectorChartTranslation = createSelectorMemoized(
  selectorChartGeoProjectionZoomState,
  function selectorChartTranslation(geoProjectionZoom): [number, number] | null {
    return geoProjectionZoom?.translation ?? null;
  },
);
const selectorChartRoll = createSelector(
  selectorChartGeoProjectionZoomState,
  function selectorChartRoll(geoProjectionZoom): number {
    return geoProjectionZoom?.roll ?? 0;
  },
);

const selectorChartInitialCenter = createSelectorMemoized(
  selectorChartGeoProjectionZoomState,
  function selectorChartInitialCenter(geoProjectionZoom): [number, number] | null {
    return geoProjectionZoom?.initialCenter ?? ZERO_COORDINATES;
  },
);

const selectorChartParallels = createSelectorMemoized(
  selectorChartGeoProjectionState,
  function selectorChartParallels(geoProjection): [number, number] {
    return getParallels(geoProjection?.parallels);
  },
);
/**
 * Map a feature's `properties.name` to its index in `geoData.features`,
 * for fast lookup by name when joining series rows to features.
 *
 * Features without a string `properties.name` are skipped; on duplicates,
 * the first occurrence wins.
 */
export const selectorChartGeoFeatureIndexesByName = createSelectorMemoized(
  selectorChartGeoData,
  selectorChartGeoFeatureKey,
  function selectorChartGeoFeatureIndexesByName(
    geoData: ExtendedFeatureCollection | null,
    geoFeatureKey:
      | string
      | ((feature: ExtendedFeatureCollection['features'][number]) => string | null),
  ): ReadonlyMap<string, number[]> {
    const map = new Map<string, number[]>();
    if (!geoData) {
      return map;
    }
    geoData.features.forEach((feature, index) => {
      const name =
        typeof geoFeatureKey === 'function'
          ? geoFeatureKey(feature)
          : feature.properties?.[geoFeatureKey];
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

export const selectorFitScale = createSelector(
  selectorChartRawProjection,
  selectorChartProjectionFactory,
  selectorChartParallels,
  selectorChartInitialCenter,
  selectorChartGeoData,
  selectorChartDrawingArea,

  function selectorFitScale(
    projectionInput,
    projectionFactory,
    parallels,
    initialCenter,
    geoData,
    drawingArea,
  ): number | null {
    if (!geoData || projectionInput === null || initialCenter === null) {
      return null;
    }

    const projection = resolveProjectionInstance(projectionInput, projectionFactory, parallels);
    if (projection === null) {
      return null;
    }
    projection.rotate?.([-initialCenter[0], -initialCenter[1]]);

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
  selectorChartProjectionFactory,
  selectorChartParallels,
  selectorChartGeoData,
  selectorChartCenter,
  selectorChartTranslation,
  selectorChartRoll,
  selectorChartZoomLevel,
  selectorChartDrawingArea,
  selectorFitScale,
  function selectorChartProjection(
    projectionInput,
    projectionFactory,
    parallels,
    geoData,
    center,
    translation,
    roll,
    zoomLevel,
    drawingArea,
    fitScale,
  ): GeoProjection | null {
    // A fresh projection is built on every recompute (i.e. whenever any input below changes). The
    // view transform mutates it in place, so reusing a shared instance would return the same object
    // reference and store subscribers would render one update behind.
    const projection = resolveProjectionInstance(projectionInput, projectionFactory, parallels);
    if (!projection) {
      return null;
    }

    if (!geoData || fitScale == null) {
      return projection;
    }

    projection.rotate?.([-center[0], -center[1], roll]);
    // Edge case with conic conformal and albers:
    // rotate impacts the center of the projection, so we need to reset it.
    projection.center?.([0, 0]);

    // `fitScale` is the `zoomLevel === 1` reference scale, computed independently in
    // `selectorFitScale` so it stays stable across pan/zoom transforms.
    projection.scale(zoomLevel != null && zoomLevel !== 1 ? fitScale * zoomLevel : fitScale);
    projection.translate([
      drawingArea.left + drawingArea.width / 2 + (translation?.[0] ?? 0) * drawingArea.width,
      drawingArea.top + drawingArea.height / 2 + (translation?.[1] ?? 0) * drawingArea.height,
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
  function selectorChartGeoPath(projection): GeoPath | null {
    if (!projection) {
      return null;
    }
    return geoPath(projection);
  },
);

export const selectorGeoTooltipPosition = createSelectorMemoized(
  selectorChartGeoData,
  selectorChartProjection,
  selectorChartGeoFeatureIndexesByName,
  function selectorGeoTooltipPosition(
    geoData,
    projection,
    featureIndexesByName,
  ): GeoTooltipPosition {
    return {
      geoData,
      projection,
      featureIndexesByName,
    };
  },
);
