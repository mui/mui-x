import Flatbush from 'flatbush';
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
import { selectorPreferStrictDomainInLineCharts } from '../../corePlugins/useChartExperimentalFeature';
import { SeriesId } from '../../../../models/seriesType/common';

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
  [selectorChartZoomState],
  (zoom) => zoom?.isInteracting,
);

export const selectorChartZoomMap = createSelector(
  [selectorChartZoomState],
  (zoom) => zoom?.zoomData && createZoomMap(zoom?.zoomData),
);

export const selectorChartZoomOptionsLookup = createSelector(
  [selectorChartRawXAxis, selectorChartRawYAxis],
  (xAxis, yAxis) => ({
    ...createZoomLookup('x')(xAxis),
    ...createZoomLookup('y')(yAxis),
  }),
);

export const selectorChartAxisZoomOptionsLookup = createSelector(
  [selectorChartZoomOptionsLookup, (_, axisId: AxisId) => axisId],
  (axisLookup, axisId) => axisLookup[axisId],
);

export const selectorChartAxisZoomData = createSelector(
  [selectorChartZoomMap, (_, axisId: AxisId) => axisId],
  (zoomMap, axisId) => zoomMap?.get(axisId),
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

export const selectorChartZoomAxisFilters = createSelector(
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
    selectorPreferStrictDomainInLineCharts,
  ],
  (
    axis,
    drawingArea,
    formattedSeries,
    seriesConfig,
    zoomMap,
    zoomOptions,
    getFilters,
    preferStrictDomainInLineCharts,
  ) =>
    computeAxisValue({
      drawingArea,
      formattedSeries,
      axis,
      seriesConfig,
      axisDirection: 'x',
      zoomMap,
      zoomOptions,
      getFilters,
      preferStrictDomainInLineCharts,
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
    selectorPreferStrictDomainInLineCharts,
  ],
  (
    axis,
    drawingArea,
    formattedSeries,
    seriesConfig,
    zoomMap,
    zoomOptions,
    getFilters,
    preferStrictDomainInLineCharts,
  ) =>
    computeAxisValue({
      drawingArea,
      formattedSeries,
      axis,
      seriesConfig,
      axisDirection: 'y',
      zoomMap,
      zoomOptions,
      getFilters,
      preferStrictDomainInLineCharts,
    }),
);

export const selectorChartAxis = createSelector(
  [selectorChartXAxis, selectorChartYAxis, (_, axisId: AxisId) => axisId],
  (xAxes, yAxes, axisId) => xAxes?.axis[axisId] ?? yAxes?.axis[axisId],
);

export const selectorChartRawAxis = createSelector(
  [selectorChartRawXAxis, selectorChartRawYAxis, (state, axisId: AxisId) => axisId],
  (xAxes, yAxes, axisId) => {
    const axis = xAxes?.find((a) => a.id === axisId) ?? yAxes?.find((a) => a.id === axisId) ?? null;

    if (!axis) {
      return undefined;
    }

    return axis;
  },
);

export const selectorChartSeriesFlatbushMap = createSelector(
  [selectorChartSeriesProcessed, selectorChartXAxis, selectorChartYAxis],
  function selectChartSeriesFlatbushMap(
    allSeries,
    { axis: xAxes, axisIds: xAxesIds },
    { axis: yAxes, axisIds: yAxesIds },
  ) {
    // FIXME: Do we want to support non-scatter series here?
    const validSeries = allSeries.scatter;
    const flatbushMap = new Map<SeriesId, Flatbush>();

    if (!validSeries) {
      return flatbushMap;
    }

    const defaultXAxisId = xAxesIds[0];
    const defaultYAxisId = yAxesIds[0];

    validSeries.seriesOrder.forEach((seriesId) => {
      const {
        data,
        xAxisId = defaultXAxisId,
        yAxisId = defaultYAxisId,
      } = validSeries.series[seriesId];

      const flatbush = new Flatbush(data.length);

      const xScale = xAxes[xAxisId].scale;
      const yScale = yAxes[yAxisId].scale;
      const originalXScale = xScale.copy();
      const originalYScale = yScale.copy();
      originalXScale.range([0, 1]);
      originalYScale.range([0, 1]);

      for (const datum of data) {
        // Add the points using a [0, 1]. This makes it so that we don't need to recreate the Flatbush structure when zooming.
        flatbush.add(originalXScale(datum.x)!, originalYScale(datum.y)!);
      }

      flatbush.finish();
      flatbushMap.set(seriesId, flatbush);
    });

    console.log('new Flatbush for series', Array.from(flatbushMap.keys()));
    return flatbushMap;
  },
);

export const selectorChartSeriesFlatbush = createSelector(
  [selectorChartSeriesFlatbushMap, (_, seriesId: SeriesId) => seriesId],
  function selectChartSeriesFlatbush(flatbushMap, seriesId) {
    return flatbushMap.get(seriesId);
  },
);
