import type { ChartSeriesTypeConfig } from '@mui/x-charts/internals';
import { getExtremumX, getExtremumY } from './extremums';
import formatter from './formatter';
import getColor from './getColor';
import legendGetter from './legend';

export const plugin: ChartSeriesTypeConfig<'funnel'> = {
  seriesProcessor: formatter,
  colorProcessor: getColor,
  legendGetter,
  xExtremumGetter: getExtremumX,
  yExtremumGetter: getExtremumY,
};
