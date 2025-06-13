import { ChartRootSelector, createSelector } from '../../utils/selectors';
import { UseChartSeriesSignature } from './useChartSeries.types';

export const selectorChartSeriesState: ChartRootSelector<UseChartSeriesSignature> = (state) =>
  state.series;

export const selectorChartSeriesProcessed = createSelector(
  selectorChartSeriesState,
  (seriesState) => seriesState.processedSeries,
);

export const selectorChartSeriesConfig = createSelector(
  selectorChartSeriesState,
  (seriesState) => seriesState.seriesConfig,
);
