import {
  createChartSelector,
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

export const selectorFunnelGap = createChartSelector(
  [selectorFunnel],
  (funnel) => funnel?.gap ?? 0,
);

export const selectorChartXAxis = createChartSelector(
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

export const selectorChartYAxis = createChartSelector(
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
