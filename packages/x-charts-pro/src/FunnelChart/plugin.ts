import type { ChartSeriesTypeConfig } from '@mui/x-charts/internals';
import { getExtremumX, getExtremumY } from './extremums';
import formatter from './formatter';
import getColor from './getColor';

export const plugin: ChartSeriesTypeConfig<'funnel'> = {
  seriesProcessor: formatter,
  colorProcessor: getColor,
  xExtremumGetter: getExtremumX,
  yExtremumGetter: getExtremumY,
};
