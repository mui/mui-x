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

export const selectorChartPreviewComputedXAxis = createSelector(
  [
    selectorChartRawXAxis,
    selectorChartSeriesProcessed,
    selectorChartSeriesConfig,
    selectorChartZoomOptionsLookup,
    selectorChartZoomAxisFilters,
    selectorChartDrawingArea,
    (_, axisId: AxisId) => axisId,
  ],

  (xAxes, formattedSeries, seriesConfig, zoomOptions, getFilters, chartDrawingArea, axisId) => {
    const hasAxis = xAxes?.some((axis) => axis.id === axisId);
    const drawingArea = createPreviewDrawingArea(hasAxis ? 'x' : 'y', chartDrawingArea);

    const options = zoomOptions[axisId];
    const zoomMap = new Map<AxisId, ZoomData>([
      [axisId, { axisId, start: options.minStart, end: options.maxEnd }],
    ]);

    const computedAxes = computeAxisValue({
      drawingArea,
      formattedSeries,
      axis: xAxes,
      seriesConfig,
      axisDirection: 'x',
      zoomMap,
      zoomOptions,
      getFilters,
    });

    if (computedAxes.axis[axisId]) {
      return { [axisId]: computedAxes.axis[axisId] };
    }

    return computedAxes.axis;
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
    (_, axisId: AxisId) => axisId,
  ],
  (yAxes, formattedSeries, seriesConfig, zoomOptions, getFilters, chartDrawingArea, axisId) => {
    const hasAxis = yAxes?.some((axis) => axis.id === axisId);
    const drawingArea = createPreviewDrawingArea(hasAxis ? 'y' : 'x', chartDrawingArea);

    const options = zoomOptions[axisId];
    const zoomMap = new Map<AxisId, ZoomData>([
      [axisId, { axisId, start: options.minStart, end: options.maxEnd }],
    ]);

    const computedAxes = computeAxisValue({
      drawingArea,
      formattedSeries,
      axis: yAxes,
      seriesConfig,
      axisDirection: 'y',
      zoomMap,
      zoomOptions,
      getFilters,
    });

    if (computedAxes.axis[axisId]) {
      return { [axisId]: computedAxes.axis[axisId] };
    }

    return computedAxes.axis;
  },
);
