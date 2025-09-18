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
import { getXAxesScales, getYAxesScales } from './getAxisScale';
import { SeriesId } from '../../../../models/seriesType/common';
import { Flatbush } from '../../../Flatbush';

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
  [selectorChartZoomMap, selectorChartZoomOptionsLookup],
  (zoomMap, zoomOptions) =>
    zoomMap && zoomOptions && createAxisFilterMapper(zoomMap, zoomOptions, 'x'),
);

const selectorChartYFilter = createSelector(
  [selectorChartZoomMap, selectorChartZoomOptionsLookup],
  (zoomMap, zoomOptions) =>
    zoomMap && zoomOptions && createAxisFilterMapper(zoomMap, zoomOptions, 'y'),
);

export const selectorChartXScales = createSelector(
  [
    selectorChartRawXAxis,
    selectorChartDrawingArea,
    selectorChartSeriesProcessed,
    selectorChartSeriesConfig,
    selectorChartZoomMap,
    selectorChartZoomOptionsLookup,
    selectorPreferStrictDomainInLineCharts,
  ],
  function selectorChartXScales(
    axis,
    drawingArea,
    formattedSeries,
    seriesConfig,
    zoomMap,
    zoomOptions,
    preferStrictDomainInLineCharts,
  ) {
    return getXAxesScales({
      drawingArea,
      formattedSeries,
      axis,
      seriesConfig,
      zoomMap,
      zoomOptions,
      preferStrictDomainInLineCharts,
    });
  },
);

export const selectorChartYScales = createSelector(
  [
    selectorChartRawYAxis,
    selectorChartDrawingArea,
    selectorChartSeriesProcessed,
    selectorChartSeriesConfig,
    selectorChartZoomMap,
    selectorChartZoomOptionsLookup,
    selectorPreferStrictDomainInLineCharts,
  ],
  function selectorChartYScales(
    axis,
    drawingArea,
    formattedSeries,
    seriesConfig,
    zoomMap,
    zoomOptions,
    preferStrictDomainInLineCharts,
  ) {
    return getYAxesScales({
      drawingArea,
      formattedSeries,
      axis,
      seriesConfig,
      zoomMap,
      zoomOptions,
      preferStrictDomainInLineCharts,
    });
  },
);

export const selectorChartZoomAxisFilters = createSelector(
  [
    selectorChartXFilter,
    selectorChartYFilter,
    selectorChartRawXAxis,
    selectorChartRawYAxis,
    selectorChartXScales,
    selectorChartYScales,
  ],
  (xMapper, yMapper, xAxis, yAxis, xScales, yScales) => {
    if (xMapper === undefined || yMapper === undefined) {
      // Early return if there is no zoom.
      return undefined;
    }

    const xFilters = xAxis?.reduce<ZoomAxisFilters>((acc, axis) => {
      const filter = xMapper(axis.id, axis.data, xScales[axis.id].scale);
      if (filter !== null) {
        acc[axis.id] = filter;
      }
      return acc;
    }, {});

    const yFilters = yAxis?.reduce<ZoomAxisFilters>((acc, axis) => {
      const filter = yMapper(axis.id, axis.data, yScales[axis.id].scale);
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
    selectorChartXScales,
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
    scales,
  ) =>
    computeAxisValue({
      scales,
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
    selectorChartYScales,
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
    scales,
  ) =>
    computeAxisValue({
      scales,
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

export const selectorChartDefaultXAxisId = createSelector(
  [selectorChartRawXAxis],
  (xAxes) => xAxes![0].id,
);

export const selectorChartDefaultYAxisId = createSelector(
  [selectorChartRawYAxis],
  (yAxes) => yAxes![0].id,
);

const EMPTY_MAP = new Map<SeriesId, Flatbush>();
export const selectorChartSeriesEmptyFlatbushMap = (
  _: ChartState<[], [UseChartCartesianAxisSignature]>,
) => EMPTY_MAP;

export const selectorChartSeriesFlatbushMap = createSelector(
  [
    selectorChartSeriesProcessed,
    // TODO: I don't think we can use this, we need to normalize the range to [0,1]
    selectorChartXScales,
    selectorChartYScales,
    selectorChartDefaultXAxisId,
    selectorChartDefaultYAxisId,
  ],
  function selectChartSeriesFlatbushMap(
    allSeries,
    xAxesScaleMap,
    yAxesScaleMap,
    defaultXAxisId,
    defaultYAxisId,
  ) {
    // FIXME: Do we want to support non-scatter series here?
    const validSeries = allSeries.scatter;
    const flatbushMap = new Map<SeriesId, Flatbush>();

    if (!validSeries) {
      return flatbushMap;
    }

    validSeries.seriesOrder.forEach((seriesId) => {
      const {
        data,
        xAxisId = defaultXAxisId,
        yAxisId = defaultYAxisId,
      } = validSeries.series[seriesId];

      const start = performance.now();
      const flatbush = new Flatbush(data.length);

      const originalXScale = xAxesScaleMap[xAxisId];
      const originalYScale = yAxesScaleMap[yAxisId];

      for (const datum of data) {
        // Add the points using a [0, 1]. This makes it so that we don't need to recreate the Flatbush structure when zooming.
        flatbush.add(originalXScale.scale(datum.x)!, originalYScale.scale(datum.y)!);
      }

      flatbush.finish();
      flatbushMap.set(seriesId, flatbush);
      performance.measure(`Flatbush for "${seriesId}"`, { start });
    });

    return flatbushMap;
  },
);

export const selectorChartSeriesFlatbush = createSelector(
  [selectorChartSeriesFlatbushMap, (_, seriesId: SeriesId) => seriesId],
  function selectChartSeriesFlatbush(flatbushMap, seriesId) {
    return flatbushMap.get(seriesId);
  },
);
