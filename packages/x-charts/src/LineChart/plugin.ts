import { ChartSeriesTypeConfig } from '../internals/plugins/models/seriesConfig';
import { getExtremumX, getExtremumY } from './extremums';
import formatter from './formatter';
import getColor from './getColor';

export const plugin: ChartSeriesTypeConfig<'line'> = {
  colorProcessor: getColor,
  seriesProcessor: formatter,
  xExtremumGetter: getExtremumX,
  yExtremumGetter: getExtremumY,
};
