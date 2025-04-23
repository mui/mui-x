import { isDeepEqual } from '@mui/x-internals/isDeepEqual';
import { selectorChartDrawingArea } from '../../corePlugins/useChartDimensions';
import {
  selectorChartSeriesConfig,
  selectorChartSeriesProcessed,
} from '../../corePlugins/useChartSeries';
import { createSelector } from '../../utils/selectors';
import { computeAxisValue } from './computeAxisValue';
import { UseChartCartesianAxisSignature } from './useChartCartesianAxis.types';
import { ChartState } from '../../models/chart';
import { createAxisFilterMapper, createGetAxisFilters } from './createAxisFilterMapper';
import { ZoomAxisFilters, ZoomData } from './zoom.types';
import { createZoomLookup } from './createZoomLookup';
import { AxisId } from '../../../../models/axis';
import {
  selectorChartRawXAxis,
  selectorChartRawYAxis,
} from './useChartCartesianAxisLayout.selectors';

export const createZoomMap = (zoom: readonly ZoomData[]) => {
  const zoomItemMap = new Map<AxisId, ZoomData>();
  zoom.forEach((zoomItem) => {
    zoomItemMap.set(zoomItem.axisId, zoomItem);
  });
  return zoomItemMap;
};

const selectorChartZoomState = (state: ChartState<[], [UseChartCartesianAxisSignature]>) =>
  state.zoom;

/**
 * Following selectors are not exported because they exist in the MIT chart only to ba able to reuse the Zoom state from the pro.
 */

export const selectorChartZoomIsInteracting = createSelector(
  selectorChartZoomState,
  (zoom) => zoom?.isInteracting,
);

const selectorChartZoomMap = createSelector(
  selectorChartZoomState,
  (zoom) => zoom?.zoomData && createZoomMap(zoom?.zoomData),
);

const selectorChartXZoomOptionsLookup = createSelector(
  selectorChartRawXAxis,
  createZoomLookup('x'),
);

const selectorChartYZoomOptionsLookup = createSelector(
  selectorChartRawYAxis,
  createZoomLookup('y'),
);

export const selectorChartZoomOptionsLookup = createSelector(
  [selectorChartXZoomOptionsLookup, selectorChartYZoomOptionsLookup],
  (xLookup, yLookup) => ({ ...xLookup, ...yLookup }),
  {
    memoizeOptions: {
      // This selector returns Record<AxisId, DefaultizedZoomOptions> which is a map.
      // Whenever the component re-renders, the axis is often a new object, which makes this a new instance.
      // We need to use a custom equality check to avoid re-rendering the chart.
      resultEqualityCheck: isDeepEqual,
    },
  },
);

const selectorChartXFilter = createSelector(
  [
    selectorChartZoomMap,
    selectorChartZoomOptionsLookup,
    selectorChartSeriesConfig,
    selectorChartSeriesProcessed,
  ],
  (zoomMap, zoomOptions, seriesConfig, formattedSeries) =>
    zoomMap &&
    zoomOptions &&
    createAxisFilterMapper({
      zoomMap,
      zoomOptions,
      seriesConfig,
      formattedSeries,
      direction: 'x',
    }),
);

const selectorChartYFilter = createSelector(
  [
    selectorChartZoomMap,
    selectorChartZoomOptionsLookup,
    selectorChartSeriesConfig,
    selectorChartSeriesProcessed,
  ],
  (zoomMap, zoomOptions, seriesConfig, formattedSeries) =>
    zoomMap &&
    zoomOptions &&
    createAxisFilterMapper({
      zoomMap,
      zoomOptions,
      seriesConfig,
      formattedSeries,
      direction: 'y',
    }),
);

const selectorChartZoomAxisFilters = createSelector(
  [selectorChartXFilter, selectorChartYFilter, selectorChartRawXAxis, selectorChartRawYAxis],
  (xMapper, yMapper, xAxis, yAxis) => {
    if (xMapper === undefined || yMapper === undefined) {
      // Early return if there is no zoom.
      return undefined;
    }

    const xFilters = xAxis?.reduce<ZoomAxisFilters>((acc, axis, index) => {
      const filter = xMapper(axis, index);
      if (filter !== null) {
        acc[axis.id] = filter;
      }
      return acc;
    }, {});

    const yFilters = yAxis?.reduce<ZoomAxisFilters>((acc, axis, index) => {
      const filter = yMapper(axis, index);
      if (filter !== null) {
        acc[axis.id] = filter;
      }
      return acc;
    }, {} as ZoomAxisFilters);

    if (Object.keys(xFilters ?? {}).length === 0 && Object.keys(yFilters ?? {}).length === 0) {
      return undefined;
    }

    return createGetAxisFilters({ ...xFilters, ...yFilters });
  },
);

/**
 * The only interesting selectors that merge axis data and zoom if provided.
 */

export const selectorChartXAxis = createSelector(
  [
    selectorChartRawXAxis,
    selectorChartDrawingArea,
    selectorChartSeriesProcessed,
    selectorChartSeriesConfig,
    selectorChartZoomMap,
    selectorChartZoomOptionsLookup,
    selectorChartZoomAxisFilters,
  ],
  (axis, drawingArea, formattedSeries, seriesConfig, zoomMap, zoomOptions, getFilters) =>
    computeAxisValue({
      drawingArea,
      formattedSeries,
      axis,
      seriesConfig,
      axisDirection: 'x',
      zoomMap,
      zoomOptions,
      getFilters,
    }),
);

export const selectorChartYAxis = createSelector(
  [
    selectorChartRawYAxis,
    selectorChartDrawingArea,
    selectorChartSeriesProcessed,
    selectorChartSeriesConfig,
    selectorChartZoomMap,
    selectorChartZoomOptionsLookup,
    selectorChartZoomAxisFilters,
  ],
  (axis, drawingArea, formattedSeries, seriesConfig, zoomMap, zoomOptions, getFilters) =>
    computeAxisValue({
      drawingArea,
      formattedSeries,
      axis,
      seriesConfig,
      axisDirection: 'y',
      zoomMap,
      zoomOptions,
      getFilters,
    }),
);
