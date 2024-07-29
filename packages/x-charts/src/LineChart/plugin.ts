import { ChartsPluginType } from '../models/plugin';
import { getExtremumX, getExtremumY } from './extremums';
import formatter from './formatter';
import getColor from './getColor';

export const plugin: ChartsPluginType<'line'> = {
  seriesType: 'line',
  colorProcessor: getColor,
  seriesFormatter: formatter,
  xExtremumGetter: getExtremumX,
  yExtremumGetter: getExtremumY,
};
