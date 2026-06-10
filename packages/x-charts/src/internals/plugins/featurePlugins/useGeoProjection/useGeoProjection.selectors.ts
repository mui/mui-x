import { createSelector, createSelectorMemoized } from '@mui/x-internals/store';
import {
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
import { selectorChartDrawingArea } from '../../corePlugins/useChartDimensions/useChartDimensions.selectors';
import { type ChartState } from '../../models/chart';
import { type GeoTooltipPosition } from '../../corePlugins/useChartSeriesConfig';

const isConicProjection = (projection: GeoProjection): projection is GeoConicProjection => {
  return 'parallels' in projection && typeof projection.parallels === 'function';
};
export const selectorChartGeoProjectionState = (
  state: ChartState<[], [UseGeoProjectionSignature]>,
): UseGeoProjectionState['geoProjection'] | undefined => state.geoProjection;

export const selectorChartGeoData: (
  state: ChartState<[], [UseGeoProjectionSignature]>,
) => ExtendedFeatureCollection | null = createSelector(
  selectorChartGeoProjectionState,
  (geoProjection) => geoProjection?.geoData ?? null,
);

export const selectorChartRawProjection = createSelector(
  selectorChartGeoProjectionState,
  (geoProjection): GeoProjectionInput | null => geoProjection?.projection ?? null,
);

export const selectorChartProjectionFactory = createSelector(
  selectorChartGeoProjectionState,
  (geoProjection): Record<D3NamedProjection, (() => GeoProjection) | undefined> | null =>
    geoProjection?.factories ?? null,
);

export const selectorChartRawScale = createSelector(
  selectorChartGeoProjectionState,
  (geoProjection): number | null => geoProjection?.scale ?? null,
);

const selectorChartRotate = createSelectorMemoized(
  selectorChartGeoProjectionState,
  (geoProjection): [number, number] | null => geoProjection?.rotate ?? null,
);

const selectorChartTranslate = createSelectorMemoized(
  selectorChartGeoProjectionState,
  (geoProjection): [number, number] | null => geoProjection?.translate ?? null,
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
  selectorChartGeoData,
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
 * Resolves the raw `projection` input into a ready-to-use `GeoProjection` instance
 * fitted to the chart's drawing area.
 *
 * - String inputs (e.g. `'mercator'`) are mapped to the matching d3-geo factory.
 * - `GeoProjection` instances are used as-is, then fitted.
 * - Returns `null` when no projection is registered or the name is unknown.
 */
export const selectorChartProjection = createSelectorMemoized(
  selectorChartRawProjection,
  selectorChartProjectionFactory,
  selectorChartGeoData,
  selectorChartParallels,
  selectorChartRotate,
  selectorChartTranslate,
  selectorChartRawScale,
  selectorChartDrawingArea,
  (
    projectionInput,
    projectionFactory,
    geoData,
    parallels,
    rotate,
    translate,
    scale,
    drawingArea,
  ): GeoProjection | null => {
    if (!projectionInput || !projectionFactory) {
      return null;
    }
    let projection: GeoProjection;
    if (typeof projectionInput === 'string') {
      const factory = projectionFactory[projectionInput];
      if (!factory) {
        if (process.env.NODE_ENV !== 'production') {
          console.error(
            `MUI X Charts: Unknown projection name '${projectionInput}'. ` +
              `Expected one of: ${Object.keys(projectionFactory).join(', ')}.`,
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
      if (isConicProjection(projection)) {
        if (rotate) {
          projection.rotate?.(rotate);
        }

        if (!scale) {
          const [[x0, y0], [x1, y1]] = geoPath(projection).bounds(geoData);

          const currentScale = projection.scale();

          const fitScale = Math.min(
            currentScale * (drawingArea.width / (x1 - x0)),
            currentScale * (drawingArea.height / (y1 - y0)),
          );
          projection.scale(fitScale);
        } else {
          projection.scale(scale);
        }

        return projection;
      }

      if (rotate) {
        projection.rotate?.(rotate);
      }

      if (scale) {
        projection.scale(scale);
        projection.clipExtent?.([
          [drawingArea.left, drawingArea.top],
          [drawingArea.left + drawingArea.width, drawingArea.top + drawingArea.height],
        ]);
      } else {
        projection.fitExtent?.(
          [
            [drawingArea.left, drawingArea.top],
            [drawingArea.left + drawingArea.width, drawingArea.top + drawingArea.height],
          ],
          geoData,
        );
      }

      projection.translate(
        translate ?? [
          drawingArea.left + drawingArea.width / 2,
          drawingArea.top + drawingArea.height / 2,
        ],
      );
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

export const selectorGeoTooltipPosition = createSelectorMemoized(
  selectorChartGeoData,
  selectorChartProjection,
  selectorChartGeoFeatureIndexesByName,
  (geoData, projection, featureIndexesByName): GeoTooltipPosition => {
    return {
      geoData,
      projection,
      featureIndexesByName,
    };
  },
);
