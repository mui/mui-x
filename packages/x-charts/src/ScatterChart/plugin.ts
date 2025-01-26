import { ChartSeriesTypeConfig } from '../internals/plugins/models/seriesConfig';
import { getExtremumX, getExtremumY } from './extremums';
import formatter from './formatter';
import getColor from './getColor';
import legendGetter from './legend';

export const plugin: ChartSeriesTypeConfig<'scatter'> = {
  seriesProcessor: formatter,
  colorProcessor: getColor,
  legendGetter,
  xExtremumGetter: getExtremumX,
  yExtremumGetter: getExtremumY,
};
