import type { ChartSeriesTypeConfig } from '@mui/x-charts/internals';

// Simple passthrough functions for sankey chart
const seriesProcessor = (series: any) => series;
const getColor = (series: any) => series;
const legendGetter = () => [];
const tooltipGetter = () => ({});
const getExtremumX = () => ({ min: 0, max: 1 });
const getExtremumY = () => ({ min: 0, max: 1 });
const getSeriesWithDefaultValues = (series: any) => series;

export const seriesConfig: ChartSeriesTypeConfig<'sankey'> = {
  seriesProcessor,
  colorProcessor: getColor,
  legendGetter,
  tooltipGetter,
  xExtremumGetter: getExtremumX,
  yExtremumGetter: getExtremumY,
  getSeriesWithDefaultValues,
};
