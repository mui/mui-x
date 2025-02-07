import type { ChartSeriesTypeConfig } from '@mui/x-charts/internals';
import { getExtremumX, getExtremumY } from './extremums';
import formatter from './formatter';
import getColor from './getColor';
import legendGetter from './legend';
import tooltipGetter from './tooltip';

export const plugin: ChartSeriesTypeConfig<'funnel'> = {
  seriesProcessor: formatter,
  colorProcessor: getColor,
  legendGetter,
  tooltipGetter,
  xExtremumGetter: getExtremumX,
  yExtremumGetter: getExtremumY,
};
