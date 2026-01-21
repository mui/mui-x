import { createSelector, createSelectorMemoized } from '@mui/x-internals/store';
import { selectorChartDrawingArea } from '../../corePlugins/useChartDimensions';
import { selectorChartSeriesProcessed } from '../../corePlugins/useChartSeries';
import { type UseChartPolarAxisSignature } from './useChartPolarAxis.types';
import { type ChartState } from '../../models/chart';
import { computeAxisValue } from './computeAxisValue';
import type { ChartDrawingArea } from '../../../../hooks/useDrawingArea';
import { selectorChartSeriesConfig } from '../../corePlugins/useSeriesConfig';

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

export const selectorChartRotationAxis = createSelectorMemoized(
  selectorChartRawRotationAxis,
  selectorChartDrawingArea,
  selectorChartSeriesProcessed,
  selectorChartSeriesConfig,
  (axis, drawingArea, formattedSeries, seriesConfig) =>
    computeAxisValue({
      drawingArea,
      formattedSeries,
      axis,
      seriesConfig,
      axisDirection: 'rotation',
    }),
);

export const selectorChartRadiusAxis = createSelectorMemoized(
  selectorChartRawRadiusAxis,
  selectorChartDrawingArea,
  selectorChartSeriesProcessed,
  selectorChartSeriesConfig,
  (axis, drawingArea, formattedSeries, seriesConfig) =>
    computeAxisValue({
      drawingArea,
      formattedSeries,
      axis,
      seriesConfig,
      axisDirection: 'radius',
    }),
);

export function getDrawingAreaCenter(drawingArea: ChartDrawingArea) {
  return {
    cx: drawingArea.left + drawingArea.width / 2,
    cy: drawingArea.top + drawingArea.height / 2,
  };
}
export const selectorChartPolarCenter = createSelectorMemoized(
  selectorChartDrawingArea,
  getDrawingAreaCenter,
);
