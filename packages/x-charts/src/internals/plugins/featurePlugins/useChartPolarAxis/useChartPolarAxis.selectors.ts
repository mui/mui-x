import { selectorChartDrawingArea } from '../../corePlugins/useChartDimensions';
import {
  selectorChartSeriesConfig,
  selectorChartSeriesProcessed,
} from '../../corePlugins/useChartSeries';
import { createChartSelector } from '../../utils/selectors';
import { UseChartPolarAxisSignature } from './useChartPolarAxis.types';
import { ChartState } from '../../models/chart';
import { computeAxisValue } from './computeAxisValue';

export const selectorChartPolarAxisState = (state: ChartState<[], [UseChartPolarAxisSignature]>) =>
  state.polarAxis;

export const selectorChartRawRotationAxis = createChartSelector(
  [selectorChartPolarAxisState],
  (axis) => axis?.rotation,
);

export const selectorChartRawRadiusAxis = createChartSelector(
  [selectorChartPolarAxisState],
  (axis) => axis?.radius,
);

/**
 * The only interesting selectors that merge axis data and zoom if provided.
 */

export const selectorChartRotationAxis = createChartSelector(
  [
    selectorChartRawRotationAxis,
    selectorChartDrawingArea,
    selectorChartSeriesProcessed,
    selectorChartSeriesConfig,
  ],
  (axis, drawingArea, formattedSeries, seriesConfig) =>
    computeAxisValue({
      drawingArea,
      formattedSeries,
      axis,
      seriesConfig,
      axisDirection: 'rotation',
    }),
);

export const selectorChartRadiusAxis = createChartSelector(
  [
    selectorChartRawRadiusAxis,
    selectorChartDrawingArea,
    selectorChartSeriesProcessed,
    selectorChartSeriesConfig,
  ],
  (axis, drawingArea, formattedSeries, seriesConfig) =>
    computeAxisValue({
      drawingArea,
      formattedSeries,
      axis,
      seriesConfig,
      axisDirection: 'radius',
    }),
);

export const selectorChartPolarCenter = createChartSelector(
  [selectorChartDrawingArea],
  (drawingArea) => ({
    cx: drawingArea.left + drawingArea.width / 2,
    cy: drawingArea.top + drawingArea.height / 2,
  }),
);
