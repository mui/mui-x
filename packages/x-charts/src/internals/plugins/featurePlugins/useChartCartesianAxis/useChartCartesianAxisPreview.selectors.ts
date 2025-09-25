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
  selectorChartNormalizedXScales,
  selectorChartNormalizedYScales,
  selectorChartZoomAxisFilters,
  selectorChartZoomOptionsLookup,
} from './useChartCartesianAxisRendering.selectors';
import { AxisId, ChartsAxisProps, DefaultedAxis, ScaleName } from '../../../../models/axis';
import { ZoomData } from './zoom.types';
import { selectorChartDrawingArea } from '../../corePlugins/useChartDimensions';
import { ZOOM_SLIDER_PREVIEW_SIZE } from '../../../constants';
import { selectorPreferStrictDomainInLineCharts } from '../../corePlugins/useChartExperimentalFeature';
import { getRange, ScaleDefinition } from './getAxisScale';
import { zoomScaleRange } from './zoom';
import { isOrdinalScale } from '../../../scaleGuards';

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
    selectorChartZoomOptionsLookup,
    selectorChartNormalizedXScales,
    (_, axisId: AxisId) => axisId,
  ],
  function selectorChartPreviewXScales(
    xAxes,
    chartDrawingArea,
    zoomOptions,
    normalizedXScales,
    axisId,
  ) {
    const hasAxis = xAxes?.some((axis) => axis.id === axisId);
    const drawingArea = createPreviewDrawingArea(hasAxis ? 'x' : 'y', chartDrawingArea);
    const options = zoomOptions[axisId];

    const scales: Record<AxisId, ScaleDefinition> = {};

    xAxes?.forEach((eachAxis) => {
      const axis = eachAxis as Readonly<DefaultedAxis<ScaleName, any, Readonly<ChartsAxisProps>>>;

      const normalizedScaleDefinition = normalizedXScales[axis.id];
      const scale = normalizedScaleDefinition.scale.copy();
      const range = getRange(drawingArea, 'x', axis);
      const zoomedRange = zoomScaleRange(range, [options.minStart, options.maxEnd]);

      scale.range(zoomedRange);

      scales[axis.id] = { ...normalizedScaleDefinition, scale } as ScaleDefinition;
    });

    return scales;
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
    selectorChartZoomOptionsLookup,
    selectorChartNormalizedYScales,
    (_, axisId: AxisId) => axisId,
  ],
  function selectorChartPreviewYScales(
    yAxes,
    chartDrawingArea,
    zoomOptions,
    normalizedYScales,
    axisId,
  ) {
    const hasAxis = yAxes?.some((axis) => axis.id === axisId);
    const drawingArea = createPreviewDrawingArea(hasAxis ? 'y' : 'x', chartDrawingArea);
    const options = zoomOptions[axisId];

    const scales: Record<AxisId, ScaleDefinition> = {};

    yAxes?.forEach((eachAxis) => {
      const axis = eachAxis as Readonly<DefaultedAxis<ScaleName, any, Readonly<ChartsAxisProps>>>;

      const normalizedScaleDefinition = normalizedYScales[axis.id];
      const scale = normalizedScaleDefinition.scale.copy();
      let range = getRange(drawingArea, 'y', axis);

      if (isOrdinalScale(scale)) {
        range = range.reverse() as [number, number];
      }

      const zoomedRange = zoomScaleRange(range, [options.minStart, options.maxEnd]);

      scale.range(zoomedRange);

      scales[axis.id] = { ...normalizedScaleDefinition, scale } as ScaleDefinition;
    });

    return scales;
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
