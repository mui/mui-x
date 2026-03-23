import { createSelectorMemoized, createSelector } from '@mui/x-internals/store';
import { type SeriesId } from '../../../../models';
import { type ChartRootSelector } from '../../utils/selectors';
import { type UseChartSeriesSignature } from './useChartSeries.types';
import { applySeriesLayout, applySeriesProcessors } from './processSeries';
import { selectorChartDrawingArea } from '../useChartDimensions';
import { selectorIsItemVisibleGetter } from '../../featurePlugins/useChartVisibilityManager';
import { selectorChartSeriesConfig } from '../useChartSeriesConfig/useChartSeriesConfig.selectors';

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
export const selectorChartsDataset = createSelector(
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
  selectorChartsDataset,
  selectorIsItemVisibleGetter,
  function selectorChartSeriesProcessed(defaultizedSeries, seriesConfig, dataset, isItemVisible) {
    return applySeriesProcessors(defaultizedSeries, seriesConfig, dataset, isItemVisible);
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

/**
 * Returns a function that returns the series configuration for a given series id.
 */
export const selectorChartSeriesConfigGetter = createSelectorMemoized(
  selectorChartSeriesConfig,
  selectorChartSeriesProcessed,
  (seriesConfig, processedSeries) => {
    return function getSeriesConfigById(seriesId: SeriesId) {
      for (const type in processedSeries) {
        if (!Object.hasOwn(processedSeries, type)) {
          continue;
        }

        const seriesGroup = processedSeries[type as keyof typeof processedSeries];
        if (seriesGroup?.series) {
          const item = seriesGroup.series[seriesId];
          if (item) {
            return seriesConfig[type as keyof typeof processedSeries];
          }
        }
      }

      return null;
    };
  },
);
