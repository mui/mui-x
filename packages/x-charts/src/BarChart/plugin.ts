import { ChartSeriesTypeConfig } from '../internals/plugins/models/seriesConfig';
import { getExtremumX, getExtremumY } from './extremums';
import formatter from './formatter';
import legendGetter from './legend';
import getColor from './getColor';

export const plugin: ChartSeriesTypeConfig<'bar'> = {
  seriesProcessor: formatter,
  colorProcessor: getColor,
  legendGetter,
  xExtremumGetter: getExtremumX,
  yExtremumGetter: getExtremumY,
};
