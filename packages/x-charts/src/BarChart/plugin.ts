import { ChartsPluginType } from '../models/plugin';
import { getExtremumX, getExtremumY } from './extremums';
import formatter from './formatter';
import getColor from './getColor';

export const plugin: ChartsPluginType<'bar'> = {
  seriesType: 'bar',
  seriesFormatter: formatter,
  colorProcessor: getColor,
  xExtremumGetter: getExtremumX,
  yExtremumGetter: getExtremumY,
};
