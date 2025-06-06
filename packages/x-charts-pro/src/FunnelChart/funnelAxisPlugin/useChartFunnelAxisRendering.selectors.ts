import {
  createSelector,
  selectorChartSeriesConfig,
  selectorChartSeriesProcessed,
  selectorChartDrawingArea,
  selectorChartRawXAxis,
  selectorChartRawYAxis,
  ChartState,
} from '@mui/x-charts/internals';
import { computeAxisValue } from './computeAxisValue';
import { UseChartFunnelAxisSignature } from './useChartFunnelAxis.types';

export const selectorFunnel = (state: ChartState<[], [UseChartFunnelAxisSignature]>) =>
  state.funnel;

export const selectorFunnelGap = createSelector([selectorFunnel], (funnel) => funnel?.gap ?? 0);

export const selectorChartXAxis = createSelector(
  [
    selectorChartRawXAxis,
    selectorChartDrawingArea,
    selectorChartSeriesProcessed,
    selectorChartSeriesConfig,
    selectorFunnelGap,
  ],
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

export const selectorChartYAxis = createSelector(
  [
    selectorChartRawYAxis,
    selectorChartDrawingArea,
    selectorChartSeriesProcessed,
    selectorChartSeriesConfig,
    selectorFunnelGap,
  ],
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
