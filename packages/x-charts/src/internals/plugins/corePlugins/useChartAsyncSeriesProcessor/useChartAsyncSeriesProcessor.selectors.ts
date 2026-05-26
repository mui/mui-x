import { createSelector } from '@mui/x-internals/store';
import { type ChartRootSelector } from '../../utils/selectors';
import { type UseChartAsyncSeriesProcessorSignature } from './useChartAsyncSeriesProcessor.types';

export const selectorChartAsyncSeriesProcessorState: ChartRootSelector<
  UseChartAsyncSeriesProcessorSignature
> = (state) => state.asyncSeriesProcessor;

export const selectorChartIsAsyncProcessing = createSelector(
  selectorChartAsyncSeriesProcessorState,
  (asyncState) => asyncState.enabled && asyncState.isProcessing,
);

export const selectorChartAsyncProcessedSeries = createSelector(
  selectorChartAsyncSeriesProcessorState,
  (asyncState) => (asyncState.enabled ? asyncState.processedSeries : null),
);

export const selectorChartAsyncProcessingEnabled = createSelector(
  selectorChartAsyncSeriesProcessorState,
  (asyncState) => asyncState.enabled,
);
