import { createSelectorMemoized, createSelector } from '@mui/x-internals/store';
import { ChartRootSelector } from '../../utils/selectors';
import { UseChartSeriesSignature } from './useChartSeries.types';
import { applySeriesLayout, applySeriesProcessors } from './processSeries';
import { selectorHiddenIdentifiers } from '../../featurePlugins/useChartVisibilityManager/useChartVisibilityManager.selectors';
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
 * @returns {ProcessedSeries} The processed series.
 */
export const selectorChartSeriesProcessed = createSelectorMemoized(
  selectorChartDefaultizedSeries,
  selectorChartSeriesConfig,
  selectorChartDataset,
  selectorHiddenIdentifiers,
  function selectorChartSeriesProcessed(
    defaultizedSeries,
    seriesConfig,
    dataset,
    hiddenIdentifiers,
  ) {
    return applySeriesProcessors(defaultizedSeries, seriesConfig, dataset, hiddenIdentifiers);
  },
);

/**
 * Get the processed series after applying series processors.
 * This selector computes the processed series on-demand from the defaultized series.
 * @returns {ProcessedSeries} The processed series.
 */
export const selectorChartSeriesLayout = createSelectorMemoized(
  selectorChartSeriesProcessed,
  selectorChartSeriesConfig,
  selectorChartDrawingArea,
  function selectorChartSeriesLayout(processedSeries, seriesConfig, drawingArea) {
    return applySeriesLayout(processedSeries, seriesConfig, drawingArea);
  },
);
