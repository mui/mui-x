import { createSelectorMemoized } from '@mui/x-internals/store';
import { applySeriesLayout } from './processSeries';
import { selectorChartDrawingArea } from '../useChartDimensions';
import { selectorChartSeriesConfig } from '../useChartSeriesConfig/useChartSeriesConfig.selectors';
import { selectorChartSeriesProcessed } from './useChartSeries.selectors';

/**
 * Get the processed series after applying series layout.
 * This selector computes the series layout on-demand from the processed series.
 * @returns {SeriesLayout} The series with layout applied.
 */
export const selectorChartSeriesLayout = createSelectorMemoized(
  selectorChartSeriesProcessed,
  selectorChartSeriesConfig,
  selectorChartDrawingArea,
  function selectorChartSeriesLayout(processedSeries, seriesConfig, drawingArea) {
    return applySeriesLayout(processedSeries, seriesConfig, drawingArea);
  },
);
