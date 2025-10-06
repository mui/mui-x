import { selectorChartDrawingArea } from '../../corePlugins/useChartDimensions';
import {
  selectorChartSeriesConfig,
  selectorChartSeriesProcessed,
} from '../../corePlugins/useChartSeries';
import { createSelector } from '../../utils/selectors';
import { computeAxisValue } from './computeAxisValue';
import { ExtremumFilter, UseChartCartesianAxisSignature } from './useChartCartesianAxis.types';
import { ChartState } from '../../models/chart';
import {
  createContinuousScaleGetAxisFilter,
  createDiscreteScaleGetAxisFilter,
  createGetAxisFilters,
} from './createAxisFilterMapper';
import { ZoomData } from './zoom.types';
import { createZoomLookup } from './createZoomLookup';
import { AxisId } from '../../../../models/axis';
import {
  selectorChartRawXAxis,
  selectorChartRawYAxis,
} from './useChartCartesianAxisLayout.selectors';
import { selectorPreferStrictDomainInLineCharts } from '../../corePlugins/useChartExperimentalFeature';
import { getXAxesScales, getYAxesScales } from './getAxisScale';
import { getDefaultTickNumber } from '../../../ticks';
import { isOrdinalScale } from '../../../scaleGuards';

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

export const selectorChartXScales = createSelector(
  [
    selectorChartRawXAxis,
    selectorChartDrawingArea,
    selectorChartSeriesProcessed,
    selectorChartSeriesConfig,
    selectorChartZoomMap,
    selectorPreferStrictDomainInLineCharts,
    selectorDefaultXAxisTickNumber,
  ],
  function selectorChartXScales(
    axis,
    drawingArea,
    formattedSeries,
    seriesConfig,
    zoomMap,
    preferStrictDomainInLineCharts,
    defaultTickNumber,
  ) {
    return getXAxesScales({
      drawingArea,
      formattedSeries,
      axis,
      seriesConfig,
      zoomMap,
      preferStrictDomainInLineCharts,
      defaultTickNumber,
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
    selectorPreferStrictDomainInLineCharts,
    selectorDefaultYAxisTickNumber,
  ],
  function selectorChartYScales(
    axis,
    drawingArea,
    formattedSeries,
    seriesConfig,
    zoomMap,
    preferStrictDomainInLineCharts,
    defaultTickNumber,
  ) {
    return getYAxesScales({
      drawingArea,
      formattedSeries,
      axis,
      seriesConfig,
      zoomMap,
      preferStrictDomainInLineCharts,
      defaultTickNumber,
    });
  },
);

export const selectorChartZoomAxisFilters = createSelector(
  [
    selectorChartZoomMap,
    selectorChartZoomOptionsLookup,
    selectorChartRawXAxis,
    selectorChartRawYAxis,
    selectorChartXScales,
    selectorChartYScales,
  ],
  (zoomMap, zoomOptions, xAxis, yAxis, xScales, yScales) => {
    if (!zoomMap || !zoomOptions) {
      return undefined;
    }

    let hasFilter = false;
    const filters: Record<AxisId, ExtremumFilter> = {};
    const axes = [...(xAxis ?? []), ...(yAxis ?? [])];

    for (let i = 0; i < axes.length; i += 1) {
      const axis = axes[i];

      if (!zoomOptions[axis.id] || zoomOptions[axis.id].filterMode !== 'discard') {
        continue;
      }

      const zoom = zoomMap.get(axis.id);
      if (zoom === undefined || (zoom.start <= 0 && zoom.end >= 100)) {
        // No zoom, or zoom with all data visible
        continue;
      }

      const axisDirection = i < (xAxis?.length ?? 0) ? 'x' : 'y';
      const scale = axisDirection === 'x' ? xScales[axis.id].scale : yScales[axis.id].scale;

      if (isOrdinalScale(scale)) {
        filters[axis.id] = createDiscreteScaleGetAxisFilter(
          axis.data,
          zoom.start,
          zoom.end,
          axisDirection,
        );
      } else {
        filters[axis.id] = createContinuousScaleGetAxisFilter(
          scale.domain(),
          zoom.start,
          zoom.end,
          axisDirection,
          axis.data,
        );
      }

      hasFilter = true;
    }

    if (!hasFilter) {
      return undefined;
    }

    return createGetAxisFilters(filters);
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
