import type { ChartsPlugin } from '../context/PluginProvider';
import { getExtremumX, getExtremumY } from './extremums';
import formatter from './formatter';
import getColor from './getColor';

export const plugin: ChartsPlugin<'bar'> = {
  seriesType: 'bar',
  seriesFormatter: formatter,
  colorProcessor: getColor,
  xExtremumGetter: getExtremumX,
  yExtremumGetter: getExtremumY,
};
