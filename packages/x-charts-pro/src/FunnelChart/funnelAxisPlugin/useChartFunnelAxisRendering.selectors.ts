import {
  createSelector,
  selectorChartSeriesConfig,
  selectorChartSeriesProcessed,
  selectorChartDrawingArea,
  selectorChartRawXAxis,
  selectorChartRawYAxis,
} from '@mui/x-charts/internals';
import { computeAxisValue } from './computeAxisValue';

/**
 * The only interesting selectors that merge axis data and zoom if provided.
 */

export const selectorChartXAxis = createSelector(
  [
    selectorChartRawXAxis,
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
      axisDirection: 'x',
      gap: 0,
    }),
);

export const selectorChartYAxis = createSelector(
  [
    selectorChartRawYAxis,
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
      axisDirection: 'y',
      gap: 0,
    }),
);
