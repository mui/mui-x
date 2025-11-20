import { createSelector } from '@mui/x-internals/store';
import { ChartRootSelector } from '../../utils/selectors';
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

/**
 * Get the dataset from the series state.
 * @param {ChartState<[UseChartSeriesSignature]>} state The state of the chart.
 * @returns {DatasetType | undefined} The dataset.
 */
export const selectorChartDataset = createSelector(
  selectorChartSeriesState,
  (seriesState) => seriesState.dataset,
);
