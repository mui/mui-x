import { createSelectorMemoized, createSelector } from '@mui/x-internals/store';
import { type ChartRootSelector } from '../../utils/selectors';
import { type UseChartSeriesSignature } from './useChartSeries.types';
import { applySeriesLayout, applySeriesProcessors } from './processSeries';
import { selectorChartDrawingArea } from '../useChartDimensions';
import { selectorIsItemVisibleGetter } from '../../featurePlugins/useChartVisibilityManager';
import { selectorChartSeriesConfig } from '../useSeriesConfig';

export const selectorChartSeriesState: ChartRootSelector<UseChartSeriesSignature> = (state) =>
  state.series;

export const selectorChartDefaultizedSeries = createSelector(
  selectorChartSeriesState,
  (seriesState) => seriesState.defaultizedSeries,
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
  selectorIsItemVisibleGetter,
  function selectorChartSeriesProcessed(defaultizedSeries, seriesConfig, dataset, isItemVisible) {
    return applySeriesProcessors(defaultizedSeries, seriesConfig, dataset, (identifier) =>
      isItemVisible(seriesConfig, identifier),
    );
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
