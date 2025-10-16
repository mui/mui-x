import type { ChartSeriesTypeConfig } from '@mui/x-charts/internals';
import { getExtremumX, getExtremumY } from './extremums';
import seriesProcessor from './seriesProcessor';
import getColor from './getColor';
import legendGetter from './legend';
import tooltipGetter from './tooltip';
import getSeriesWithDefaultValues from './getSeriesWithDefaultValues';
import tooltipItemPositionGetter from './tooltipPosition';

export const seriesConfig: ChartSeriesTypeConfig<'funnel'> = {
  seriesProcessor,
  colorProcessor: getColor,
  legendGetter,
  tooltipGetter,
  tooltipItemPositionGetter,
  xExtremumGetter: getExtremumX,
  yExtremumGetter: getExtremumY,
  getSeriesWithDefaultValues,
};
