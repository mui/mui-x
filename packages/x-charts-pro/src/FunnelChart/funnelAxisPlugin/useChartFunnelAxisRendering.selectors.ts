import { createSelector, createSelectorMemoized } from '@mui/x-internals/store';
import {
  selectorChartSeriesConfig,
  selectorChartSeriesProcessed,
  selectorChartDrawingArea,
  selectorChartRawXAxis,
  selectorChartRawYAxis,
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

  (axis, drawingArea, formattedSeries, seriesConfig, gap) =>
    computeAxisValue({
      drawingArea,
      formattedSeries,
      axis,
      seriesConfig,
      axisDirection: 'x',
      gap,
    }),
);

export const selectorChartYAxis = createSelectorMemoized(
  selectorChartRawYAxis,
  selectorChartDrawingArea,
  selectorChartSeriesProcessed,
  selectorChartSeriesConfig,
  selectorFunnelGap,

  (axis, drawingArea, formattedSeries, seriesConfig, gap) =>
    computeAxisValue({
      drawingArea,
      formattedSeries,
      axis,
      seriesConfig,
      axisDirection: 'y',
      gap,
    }),
);
