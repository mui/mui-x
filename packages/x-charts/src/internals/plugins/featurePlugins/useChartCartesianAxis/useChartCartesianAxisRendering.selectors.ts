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
import { AxisId, ChartsAxisProps, DefaultedAxis, ScaleName } from '../../../../models/axis';
import {
  selectorChartRawXAxis,
  selectorChartRawYAxis,
} from './useChartCartesianAxisLayout.selectors';
import { selectorPreferStrictDomainInLineCharts } from '../../corePlugins/useChartExperimentalFeature';
import { getDefaultTickNumber } from '../../../ticks';
import { getNormalizedAxisScale, getRange, ScaleDefinition } from './getAxisScale';
import { isOrdinalScale } from '../../../scaleGuards';
import { zoomScaleRange } from './zoom';

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

export const selectorDefaultXAxisTickNumber = createSelector(
  [selectorChartDrawingArea],
  function selectorDefaultXAxisTickNumber(drawingArea) {
    return getDefaultTickNumber(drawingArea.width);
  },
);

export const selectorDefaultYAxisTickNumber = createSelector(
  [selectorChartDrawingArea],
  function selectorDefaultYAxisTickNumber(drawingArea) {
    return getDefaultTickNumber(drawingArea.height);
  },
);

export const selectorChartNormalizedXScales = createSelector(
  [
    selectorChartRawXAxis,
    selectorChartSeriesProcessed,
    selectorChartSeriesConfig,
    selectorPreferStrictDomainInLineCharts,
    selectorDefaultXAxisTickNumber,
  ],
  function selectorChartNormalizedXScales(
    axes,
    formattedSeries,
    seriesConfig,
    preferStrictDomainInLineCharts,
    defaultTickNumber,
  ) {
    const scales: Record<AxisId, ScaleDefinition> = {};

    axes?.forEach((eachAxis, axisIndex) => {
      const axis = eachAxis as Readonly<DefaultedAxis<ScaleName, any, Readonly<ChartsAxisProps>>>;

      scales[axis.id] = getNormalizedAxisScale(
        axis,
        'x',
        seriesConfig,
        axisIndex,
        formattedSeries,
        preferStrictDomainInLineCharts,
        defaultTickNumber,
      );
    });

    return scales;
  },
);

export const selectorChartNormalizedYScales = createSelector(
  [
    selectorChartRawYAxis,
    selectorChartSeriesProcessed,
    selectorChartSeriesConfig,
    selectorPreferStrictDomainInLineCharts,
    selectorDefaultYAxisTickNumber,
  ],
  function selectorChartNormalizedYScales(
    axes,
    formattedSeries,
    seriesConfig,
    preferStrictDomainInLineCharts,
    defaultTickNumber,
  ) {
    const scales: Record<AxisId, ScaleDefinition> = {};

    axes?.forEach((eachAxis, axisIndex) => {
      const axis = eachAxis as Readonly<DefaultedAxis<ScaleName, any, Readonly<ChartsAxisProps>>>;

      scales[axis.id] = getNormalizedAxisScale(
        axis,
        'y',
        seriesConfig,
        axisIndex,
        formattedSeries,
        preferStrictDomainInLineCharts,
        defaultTickNumber,
      );
    });

    return scales;
  },
);

export const selectorChartXScales = createSelector(
  [
    selectorChartRawXAxis,
    selectorChartNormalizedXScales,
    selectorChartDrawingArea,
    selectorChartZoomMap,
  ],
  function selectorChartXScales(axes, normalizedScales, drawingArea, zoomMap) {
    const scales: Record<AxisId, ScaleDefinition> = {};

    axes?.forEach((eachAxis) => {
      const axis = eachAxis as Readonly<DefaultedAxis<ScaleName, any, Readonly<ChartsAxisProps>>>;
      const zoom = zoomMap?.get(axis.id);

      const zoomRange: [number, number] = zoom ? [zoom.start, zoom.end] : [0, 100];
      const range = getRange(drawingArea, 'x', axis);

      const scaleDefinition = normalizedScales[axis.id];
      const scale = scaleDefinition.scale.copy();
      const zoomedRange = zoomScaleRange(range, zoomRange);

      scale.range(zoomedRange);

      scales[axis.id] = { ...scaleDefinition, scale } as ScaleDefinition;
    });

    return scales;
  },
);

export const selectorChartYScales = createSelector(
  [
    selectorChartRawYAxis,
    selectorChartNormalizedYScales,
    selectorChartDrawingArea,
    selectorChartZoomMap,
  ],
  function selectorChartYScales(axes, normalizedScales, drawingArea, zoomMap) {
    const scales: Record<AxisId, ScaleDefinition> = {};

    axes?.forEach((eachAxis) => {
      const axis = eachAxis as Readonly<DefaultedAxis<ScaleName, any, Readonly<ChartsAxisProps>>>;
      const zoom = zoomMap?.get(axis.id);

      const zoomRange: [number, number] = zoom ? [zoom.start, zoom.end] : [0, 100];
      const range = getRange(drawingArea, 'y', axis);

      const scaleDefinition = normalizedScales[axis.id];
      const scale = scaleDefinition.scale.copy();

      const scaleRange = isOrdinalScale(scale) ? range.reverse() : range;
      const zoomedRange = zoomScaleRange(scaleRange, zoomRange);

      scale.range(zoomedRange);

      scales[axis.id] = { ...scaleDefinition, scale } as ScaleDefinition;
    });

    return scales;
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
