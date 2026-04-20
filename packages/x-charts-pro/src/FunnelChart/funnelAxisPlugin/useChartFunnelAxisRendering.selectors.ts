import { createSelector, createSelectorMemoized } from '@mui/x-internals/store';
import {
  selectorChartSeriesConfig,
  selectorChartSeriesProcessed,
  selectorChartDrawingArea,
  selectorChartRawXAxis,
  selectorChartRawYAxis,
  selectorChartXAxisAutoSizes,
  selectorChartYAxisAutoSizes,
  type ChartState,
} from '@mui/x-charts/internals';
import { computeAxisValue } from './computeAxisValue';
import { type UseChartFunnelAxisSignature } from './useChartFunnelAxis.types';

export const selectorFunnel = (state: ChartState<[], [UseChartFunnelAxisSignature]>) =>
  state.funnel;

export const selectorFunnelGap = createSelector(selectorFunnel, (funnel) => funnel?.gap ?? 0);

export const selectorChartXAxis = createSelectorMemoized(
  selectorChartRawXAxis,
  selectorChartDrawingArea,
  selectorChartSeriesProcessed,
  selectorChartSeriesConfig,
  selectorFunnelGap,
  selectorChartXAxisAutoSizes,

  (axis, drawingArea, formattedSeries, seriesConfig, gap, autoSizes) =>
    computeAxisValue({
      drawingArea,
      formattedSeries,
      axis,
      seriesConfig,
      axisDirection: 'x',
      gap,
      autoSizes,
    }),
);

export const selectorChartYAxis = createSelectorMemoized(
  selectorChartRawYAxis,
  selectorChartDrawingArea,
  selectorChartSeriesProcessed,
  selectorChartSeriesConfig,
  selectorFunnelGap,
  selectorChartYAxisAutoSizes,

  (axis, drawingArea, formattedSeries, seriesConfig, gap, autoSizes) =>
    computeAxisValue({
      drawingArea,
      formattedSeries,
      axis,
      seriesConfig,
      axisDirection: 'y',
      gap,
      autoSizes,
    }),
);
