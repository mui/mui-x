import { createChartSelector } from '../../utils/selectors';
import { UseChartSeriesSignature } from './useChartSeries.types';
import { ChartState } from '../../models';

export const selectorChartSeriesState = (state: ChartState<[UseChartSeriesSignature]>) =>
  state.series;

export const selectorChartSeriesProcessed = createChartSelector(
  [selectorChartSeriesState],
  (seriesState) => seriesState.processedSeries,
);

export const selectorChartSeriesConfig = createChartSelector(
  [selectorChartSeriesState],
  (seriesState) => seriesState.seriesConfig,
);
