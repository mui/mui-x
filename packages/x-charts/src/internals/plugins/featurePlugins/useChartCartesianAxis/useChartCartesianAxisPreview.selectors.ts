import type { ChartDrawingArea } from '../../../../hooks/useDrawingArea';
import { createSelector } from '../../utils/selectors';
import {
  selectorChartRawXAxis,
  selectorChartRawYAxis,
} from './useChartCartesianAxisLayout.selectors';
import {
  selectorChartSeriesConfig,
  selectorChartSeriesProcessed,
} from '../../corePlugins/useChartSeries';
import { computeAxisValue } from './computeAxisValue';
import {
  selectorChartZoomAxisFilters,
  selectorChartZoomOptionsLookup,
} from './useChartCartesianAxisRendering.selectors';
import { AxisId } from '../../../../models/axis';
import { ZoomData } from './zoom.types';
import { selectorChartDrawingArea } from '../../corePlugins/useChartDimensions';
import { ZOOM_SLIDER_PREVIEW_SIZE } from '../../../constants';
import { selectorPreferStrictDomainInLineCharts } from '../../corePlugins/useChartExperimentalFeature';
import { getXAxesScales, getYAxesScales } from './getAxisScale';

function createPreviewDrawingArea(
  axisDirection: 'x' | 'y',
  mainChartDrawingArea: ChartDrawingArea,
): ChartDrawingArea {
  return axisDirection === 'x'
    ? {
        left: 0,
        top: 0,
        width: mainChartDrawingArea.width,
        height: ZOOM_SLIDER_PREVIEW_SIZE,
        right: mainChartDrawingArea.width,
        bottom: ZOOM_SLIDER_PREVIEW_SIZE,
      }
    : {
        left: 0,
        top: 0,
        width: ZOOM_SLIDER_PREVIEW_SIZE,
        height: mainChartDrawingArea.height,
        right: ZOOM_SLIDER_PREVIEW_SIZE,
        bottom: mainChartDrawingArea.height,
      };
}

export const selectorChartPreviewXScales = createSelector(
  [
    selectorChartRawXAxis,
    selectorChartDrawingArea,
    selectorChartSeriesProcessed,
    selectorChartSeriesConfig,
    selectorChartZoomOptionsLookup,
    selectorPreferStrictDomainInLineCharts,
    (_, axisId: AxisId) => axisId,
  ],
  function selectorChartPreviewXScales(
    xAxes,
    chartDrawingArea,
    formattedSeries,
    seriesConfig,
    zoomOptions,
    preferStrictDomainInLineCharts,
    axisId,
  ) {
    const hasAxis = xAxes?.some((axis) => axis.id === axisId);
    const drawingArea = createPreviewDrawingArea(hasAxis ? 'x' : 'y', chartDrawingArea);

    const options = zoomOptions[axisId];
    const zoomMap = new Map<AxisId, ZoomData>([
      [axisId, { axisId, start: options.minStart, end: options.maxEnd }],
    ]);

    return getXAxesScales({
      drawingArea,
      formattedSeries,
      axis: xAxes,
      seriesConfig,
      zoomMap,
      zoomOptions,
      preferStrictDomainInLineCharts,
    });
  },
);

export const selectorChartPreviewComputedXAxis = createSelector(
  [
    selectorChartRawXAxis,
    selectorChartSeriesProcessed,
    selectorChartSeriesConfig,
    selectorChartZoomOptionsLookup,
    selectorChartZoomAxisFilters,
    selectorChartDrawingArea,
    selectorPreferStrictDomainInLineCharts,
    selectorChartPreviewXScales,
    (_, axisId: AxisId) => axisId,
  ],

  (
    xAxes,
    formattedSeries,
    seriesConfig,
    zoomOptions,
    getFilters,
    chartDrawingArea,
    preferStrictDomainInLineCharts,
    scales,
    axisId,
  ) => {
    const hasAxis = xAxes?.some((axis) => axis.id === axisId);
    const drawingArea = createPreviewDrawingArea(hasAxis ? 'x' : 'y', chartDrawingArea);

    const options = zoomOptions[axisId];
    const zoomMap = new Map<AxisId, ZoomData>([
      [axisId, { axisId, start: options.minStart, end: options.maxEnd }],
    ]);

    const computedAxes = computeAxisValue({
      scales,
      drawingArea,
      formattedSeries,
      axis: xAxes,
      seriesConfig,
      axisDirection: 'x',
      zoomMap,
      zoomOptions,
      getFilters,
      preferStrictDomainInLineCharts,
    });

    if (computedAxes.axis[axisId]) {
      return { [axisId]: computedAxes.axis[axisId] };
    }

    return computedAxes.axis;
  },
);

export const selectorChartPreviewYScales = createSelector(
  [
    selectorChartRawYAxis,
    selectorChartDrawingArea,
    selectorChartSeriesProcessed,
    selectorChartSeriesConfig,
    selectorChartZoomOptionsLookup,
    selectorPreferStrictDomainInLineCharts,
    (_, axisId: AxisId) => axisId,
  ],
  function selectorChartPreviewYScales(
    yAxes,
    chartDrawingArea,
    formattedSeries,
    seriesConfig,
    zoomOptions,
    preferStrictDomainInLineCharts,
    axisId,
  ) {
    const hasAxis = yAxes?.some((axis) => axis.id === axisId);
    const drawingArea = createPreviewDrawingArea(hasAxis ? 'y' : 'x', chartDrawingArea);

    const options = zoomOptions[axisId];
    const zoomMap = new Map<AxisId, ZoomData>([
      [axisId, { axisId, start: options.minStart, end: options.maxEnd }],
    ]);

    return getYAxesScales({
      drawingArea,
      formattedSeries,
      axis: yAxes,
      seriesConfig,
      zoomMap,
      zoomOptions,
      preferStrictDomainInLineCharts,
    });
  },
);

export const selectorChartPreviewComputedYAxis = createSelector(
  [
    selectorChartRawYAxis,
    selectorChartSeriesProcessed,
    selectorChartSeriesConfig,
    selectorChartZoomOptionsLookup,
    selectorChartZoomAxisFilters,
    selectorChartDrawingArea,
    selectorPreferStrictDomainInLineCharts,
    selectorChartPreviewYScales,
    (_, axisId: AxisId) => axisId,
  ],
  (
    yAxes,
    formattedSeries,
    seriesConfig,
    zoomOptions,
    getFilters,
    chartDrawingArea,
    preferStrictDomainInLineCharts,
    scales,
    axisId,
  ) => {
    const hasAxis = yAxes?.some((axis) => axis.id === axisId);
    const drawingArea = createPreviewDrawingArea(hasAxis ? 'y' : 'x', chartDrawingArea);

    const options = zoomOptions[axisId];
    const zoomMap = new Map<AxisId, ZoomData>([
      [axisId, { axisId, start: options.minStart, end: options.maxEnd }],
    ]);

    const computedAxes = computeAxisValue({
      scales,
      drawingArea,
      formattedSeries,
      axis: yAxes,
      seriesConfig,
      axisDirection: 'y',
      zoomMap,
      zoomOptions,
      getFilters,
      preferStrictDomainInLineCharts,
    });

    if (computedAxes.axis[axisId]) {
      return { [axisId]: computedAxes.axis[axisId] };
    }

    return computedAxes.axis;
  },
);
