import { selectorChartDrawingArea } from '../../corePlugins/useChartDimensions';
import {
  selectorChartSeriesConfig,
  selectorChartSeriesProcessed,
} from '../../corePlugins/useChartSeries';
import { ChartsSelector, createSelector } from '../../utils/selectors';
import { computeAxisValue, ComputeResult } from './computeAxisValue';
import {
  DefaultizedZoomOptions,
  ExtremumFilter,
  UseChartCartesianAxisSignature,
} from './useChartCartesianAxis.types';
import { ChartState } from '../../models/chart';
import { createAxisFilterMapper, createGetAxisFilters } from './createAxisFilterMapper';
import { ZoomAxisFilters, ZoomData } from './zoom.types';
import { createZoomLookup } from './createZoomLookup';
import {
  AxisConfig,
  AxisId,
  AxisScaleConfig,
  ChartsAxisProps,
  ChartsXAxisProps,
  ChartsYAxisProps,
  DefaultedXAxis,
  DefaultedYAxis,
} from '../../../../models/axis';
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

export const selectorChartZoomMap = createSelector(
  selectorChartZoomState,
  (zoom) => zoom?.zoomData && createZoomMap(zoom?.zoomData),
);

export const selectorChartZoomOptionsLookup: ChartsSelector<
  ChartState<any>,
  any,
  Record<AxisId, DefaultizedZoomOptions>
> = createSelector([selectorChartRawXAxis, selectorChartRawYAxis], (xAxis, yAxis) => ({
  ...createZoomLookup('x')(xAxis),
  ...createZoomLookup('y')(yAxis),
}));

export const selectorChartAxisZoomOptionsLookup = createSelector(
  [selectorChartZoomOptionsLookup, (_, axisId: AxisId) => axisId],
  (axisLookup, axisId) => axisLookup[axisId],
);

type AxisFilterMapper<Axis extends ChartsAxisProps> =
  | ((
      axis: AxisConfig<keyof AxisScaleConfig, any, Axis>,
      axisIndex: number,
    ) => ExtremumFilter | null)
  | undefined;
const getZoomAxisFilters = (
  xMapper: AxisFilterMapper<ChartsXAxisProps>,
  yMapper: AxisFilterMapper<ChartsYAxisProps>,
  xAxis: DefaultedXAxis[] | undefined,
  yAxis: DefaultedYAxis[] | undefined,
) => {
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
};

/**
 * The only interesting selectors that merge axis data and zoom if provided.
 */

export const selectorChartXAxis: ChartsSelector<
  ChartState<any>,
  any,
  ComputeResult<ChartsXAxisProps>
> = createSelector(
  [
    selectorChartRawXAxis,
    selectorChartRawYAxis,
    selectorChartDrawingArea,
    selectorChartSeriesProcessed,
    selectorChartSeriesConfig,
    selectorChartZoomMap,
    selectorChartZoomOptionsLookup,
  ],
  (xAxis, yAxis, drawingArea, formattedSeries, seriesConfig, zoomMap, zoomOptions) => {
    const xAxisFilter =
      zoomMap &&
      zoomOptions &&
      createAxisFilterMapper({
        zoomMap,
        zoomOptions,
        seriesConfig,
        formattedSeries,
        direction: 'x',
      });
    const yAxisFilter =
      zoomMap &&
      zoomOptions &&
      createAxisFilterMapper({
        zoomMap,
        zoomOptions,
        seriesConfig,
        formattedSeries,
        direction: 'y',
      });

    const getFilters = getZoomAxisFilters(xAxisFilter, yAxisFilter, xAxis, yAxis);
    return computeAxisValue({
      drawingArea,
      formattedSeries,
      axis: xAxis,
      seriesConfig,
      axisDirection: 'x',
      zoomMap,
      zoomOptions,
      getFilters,
    });
  },
);

export const selectorChartYAxis: ChartsSelector<
  ChartState<any>,
  any,
  ComputeResult<ChartsYAxisProps>
> = createSelector(
  [
    selectorChartRawXAxis,
    selectorChartRawYAxis,
    selectorChartDrawingArea,
    selectorChartSeriesProcessed,
    selectorChartSeriesConfig,
    selectorChartZoomMap,
    selectorChartZoomOptionsLookup,
  ],
  (xAxis, yAxis, drawingArea, formattedSeries, seriesConfig, zoomMap, zoomOptions) => {
    const xAxisFilter =
      zoomMap &&
      zoomOptions &&
      createAxisFilterMapper({
        zoomMap,
        zoomOptions,
        seriesConfig,
        formattedSeries,
        direction: 'x',
      });
    const yAxisFilter =
      zoomMap &&
      zoomOptions &&
      createAxisFilterMapper({
        zoomMap,
        zoomOptions,
        seriesConfig,
        formattedSeries,
        direction: 'y',
      });

    const getFilters = getZoomAxisFilters(xAxisFilter, yAxisFilter, xAxis, yAxis);
    return computeAxisValue({
      drawingArea,
      formattedSeries,
      axis: yAxis,
      seriesConfig,
      axisDirection: 'y',
      zoomMap,
      zoomOptions,
      getFilters,
    });
  },
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
