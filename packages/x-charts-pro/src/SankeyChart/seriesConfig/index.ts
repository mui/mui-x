import type { ChartSeriesTypeConfig } from '@mui/x-charts/internals';
import { getSeriesWithDefaultValues } from './getSeriesWithDefaultValues';
import { tooltipGetter } from './tooltipGetter';

// Simple passthrough functions for sankey chart
const seriesProcessor = (series: any) => series;
const colorProcessor = (series: any) => series;
const legendGetter = () => [];

export const seriesConfig: ChartSeriesTypeConfig<'sankey'> = {
  seriesProcessor,
  colorProcessor,
  legendGetter,
  tooltipGetter,
  getSeriesWithDefaultValues,
};
