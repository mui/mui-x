import { createSelectorMemoized } from '@mui/x-internals/store';
import type { ChartDrawingArea } from '../../../../hooks/useDrawingArea';
import {
  selectorChartRawXAxis,
  selectorChartRawYAxis,
} from './useChartCartesianAxisLayout.selectors';
import { selectorChartSeriesProcessed } from '../../corePlugins/useChartSeries';
import { computeAxisValue } from './computeAxisValue';
import {
  selectorChartNormalizedXScales,
  selectorChartNormalizedYScales,
  selectorChartXAxisWithDomains,
  selectorChartYAxisWithDomains,
  selectorChartZoomOptionsLookup,
} from './useChartCartesianAxisRendering.selectors';
import {
  type AxisId,
  type ChartsAxisProps,
  type D3Scale,
  type DefaultedAxis,
  type ScaleName,
} from '../../../../models/axis';
import { type ZoomData } from './zoom.types';
import { selectorChartDrawingArea } from '../../corePlugins/useChartDimensions';
import { ZOOM_SLIDER_PREVIEW_SIZE } from '../../../constants';
import { getRange } from './getAxisScale';
import { zoomScaleRange } from './zoom';
import { isOrdinalScale } from '../../../scaleGuards';
import { selectorChartSeriesConfig } from '../../corePlugins/useSeriesConfig';

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

export const selectorChartPreviewXScales = createSelectorMemoized(
  selectorChartRawXAxis,
  selectorChartDrawingArea,
  selectorChartZoomOptionsLookup,
  selectorChartNormalizedXScales,
  function selectorChartPreviewXScales(
    xAxes,
    chartDrawingArea,
    zoomOptions,
    normalizedXScales,
    axisId: AxisId,
  ) {
    const hasAxis = xAxes?.some((axis) => axis.id === axisId);
    const drawingArea = createPreviewDrawingArea(hasAxis ? 'x' : 'y', chartDrawingArea);
    const options = zoomOptions[axisId];

    const scales: Record<AxisId, D3Scale> = {};

    xAxes?.forEach((eachAxis) => {
      const axis = eachAxis as Readonly<DefaultedAxis<ScaleName, any, Readonly<ChartsAxisProps>>>;

      const scale = normalizedXScales[axis.id].copy();
      const range = getRange(drawingArea, 'x', axis);
      const zoomedRange = zoomScaleRange(range, [options.minStart, options.maxEnd]);

      scale.range(zoomedRange);

      scales[axis.id] = scale;
    });

    return scales;
  },
);

export const selectorChartPreviewComputedXAxis = createSelectorMemoized(
  selectorChartSeriesProcessed,
  selectorChartSeriesConfig,
  selectorChartZoomOptionsLookup,
  selectorChartDrawingArea,
  selectorChartPreviewXScales,
  selectorChartXAxisWithDomains,
  (
    formattedSeries,
    seriesConfig,
    zoomOptions,
    chartDrawingArea,
    scales,
    { axes, domains },
    axisId: AxisId,
  ) => {
    const hasAxis = axes?.some((axis) => axis.id === axisId);
    const drawingArea = createPreviewDrawingArea(hasAxis ? 'x' : 'y', chartDrawingArea);

    const options = zoomOptions[axisId];
    const zoomMap = new Map<AxisId, ZoomData>([
      [axisId, { axisId, start: options.minStart, end: options.maxEnd }],
    ]);

    const computedAxes = computeAxisValue({
      scales,
      drawingArea,
      formattedSeries,
      axis: axes,
      seriesConfig,
      axisDirection: 'x',
      zoomMap,
      domains,
    });

    if (computedAxes.axis[axisId]) {
      return { [axisId]: computedAxes.axis[axisId] };
    }

    return computedAxes.axis;
  },
);

export const selectorChartPreviewYScales = createSelectorMemoized(
  selectorChartRawYAxis,
  selectorChartDrawingArea,
  selectorChartZoomOptionsLookup,
  selectorChartNormalizedYScales,
  function selectorChartPreviewYScales(
    yAxes,
    chartDrawingArea,
    zoomOptions,
    normalizedYScales,
    axisId: AxisId,
  ) {
    const hasAxis = yAxes?.some((axis) => axis.id === axisId);
    const drawingArea = createPreviewDrawingArea(hasAxis ? 'y' : 'x', chartDrawingArea);
    const options = zoomOptions[axisId];

    const scales: Record<AxisId, D3Scale> = {};

    yAxes?.forEach((eachAxis) => {
      const axis = eachAxis as Readonly<DefaultedAxis<ScaleName, any, Readonly<ChartsAxisProps>>>;

      const scale = normalizedYScales[axis.id].copy();
      let range = getRange(drawingArea, 'y', axis);

      if (isOrdinalScale(scale)) {
        range = range.reverse() as [number, number];
      }

      const zoomedRange = zoomScaleRange(range, [options.minStart, options.maxEnd]);

      scale.range(zoomedRange);

      scales[axis.id] = scale;
    });

    return scales;
  },
);

export const selectorChartPreviewComputedYAxis = createSelectorMemoized(
  selectorChartSeriesProcessed,
  selectorChartSeriesConfig,
  selectorChartZoomOptionsLookup,
  selectorChartDrawingArea,
  selectorChartPreviewYScales,
  selectorChartYAxisWithDomains,
  (
    formattedSeries,
    seriesConfig,
    zoomOptions,
    chartDrawingArea,
    scales,
    { axes, domains },
    axisId: AxisId,
  ) => {
    const hasAxis = axes?.some((axis) => axis.id === axisId);
    const drawingArea = createPreviewDrawingArea(hasAxis ? 'y' : 'x', chartDrawingArea);

    const options = zoomOptions[axisId];
    const zoomMap = new Map<AxisId, ZoomData>([
      [axisId, { axisId, start: options.minStart, end: options.maxEnd }],
    ]);

    const computedAxes = computeAxisValue({
      scales,
      drawingArea,
      formattedSeries,
      axis: axes,
      seriesConfig,
      axisDirection: 'y',
      zoomMap,
      domains,
    });

    if (computedAxes.axis[axisId]) {
      return { [axisId]: computedAxes.axis[axisId] };
    }

    return computedAxes.axis;
  },
);
