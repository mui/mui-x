import { ChartSeriesTypeConfig } from '@mui/x-charts/internals';
import { getBaseExtremum } from './extremums';
import seriesProcessor from './seriesProcessor';
import getColor from './getColor';
import tooltipGetter from './tooltip';
import getSeriesWithDefaultValues from './getSeriesWithDefaultValues';

export const seriesConfig: ChartSeriesTypeConfig<'heatmap'> = {
  seriesProcessor,
  colorProcessor: getColor,
  legendGetter: () => [],
  tooltipGetter,
  xExtremumGetter: getBaseExtremum,
  yExtremumGetter: getBaseExtremum,
  getSeriesWithDefaultValues
};
