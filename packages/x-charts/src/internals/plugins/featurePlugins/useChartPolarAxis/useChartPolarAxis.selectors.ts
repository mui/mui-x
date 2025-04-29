import { selectorChartDrawingArea } from '../../corePlugins/useChartDimensions';
import {
  selectorChartSeriesConfig,
  selectorChartSeriesProcessed,
} from '../../corePlugins/useChartSeries';
import { createSelector } from '../../utils/selectors';
import { UseChartPolarAxisSignature } from './useChartPolarAxis.types';
import { ChartState } from '../../models/chart';
import { computeAxisValue } from './computeAxisValue';

export const selectorChartPolarAxisState = (state: ChartState<[], [UseChartPolarAxisSignature]>) =>
  state.polarAxis;

export const selectorChartRawRotationAxis = createSelector(
  selectorChartPolarAxisState,
  (axis) => axis?.rotation,
);

export const selectorChartRawRadiusAxis = createSelector(
  selectorChartPolarAxisState,
  (axis) => axis?.radius,
);

/**
 * The only interesting selectors that merge axis data and zoom if provided.
 */

export const selectorChartRotationAxis = createSelector(
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

export const selectorChartRadiusAxis = createSelector(
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

export const selectorChartPolarCenter = createSelector(
  [selectorChartDrawingArea],
  (drawingArea) => ({
    cx: drawingArea.left + drawingArea.width / 2,
    cy: drawingArea.top + drawingArea.height / 2,
  }),
);
