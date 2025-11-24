import { createSelectorMemoized, createSelector } from '@mui/x-internals/store';
import { ChartRootSelector } from '../../utils/selectors';
import { UseChartSeriesSignature } from './useChartSeries.types';
import { applySeriesProcessors, applySeriesProcessorsWithoutDimensions } from './processSeries';
import { selectorChartDrawingArea } from '../useChartDimensions';

export const selectorChartSeriesState: ChartRootSelector<UseChartSeriesSignature> = (state) =>
  state.series;

export const selectorChartDefaultizedSeries = createSelector(
  selectorChartSeriesState,
  (seriesState) => seriesState.defaultizedSeries,
);

export const selectorChartSeriesConfig = createSelector(
  selectorChartSeriesState,
  (seriesState) => seriesState.seriesConfig,
);

/**
 * Get the dataset from the series state.
 * @returns {DatasetType | undefined} The dataset.
 */
export const selectorChartDataset = createSelector(
  selectorChartSeriesState,
  (seriesState) => seriesState.dataset,
);

/**
 * Get the processed series after applying series processors.
 * This selector computes the processed series on-demand from the defaultized series.
 * It's a first step before applying the drawing-area-dependent processors.
 * @returns {ProcessedSeries} The processed series.
 */
export const selectorChartSeriesProcessedWithoutDimensions = createSelectorMemoized(
  selectorChartDefaultizedSeries,
  selectorChartSeriesConfig,
  selectorChartDataset,
  function selectorChartSeriesProcessedWithoutDimensions(defaultizedSeries, seriesConfig, dataset) {
    return applySeriesProcessorsWithoutDimensions(defaultizedSeries, seriesConfig, dataset);
  },
);

/**
 * Get the processed series after applying series processors.
 * This selector computes the processed series on-demand from the defaultized series.
 * @returns {ProcessedSeries} The processed series.
 */
export const selectorChartSeriesProcessed = createSelectorMemoized(
  selectorChartSeriesProcessedWithoutDimensions,
  selectorChartSeriesConfig,
  selectorChartDrawingArea,
  function selectorChartSeriesProcessed(processedSeries, seriesConfig, drawingArea) {
    return applySeriesProcessors(processedSeries, seriesConfig, drawingArea);
  },
);
