import type { ChartsPlugin } from '../context/PluginProvider';
import { getExtremumX, getExtremumY } from './extremums';
import formatter from './formatter';
import getColor from './getColor';

export const plugin: ChartsPlugin<'line'> = {
  seriesType: 'line',
  colorProcessor: getColor,
  seriesFormatter: formatter,
  xExtremumGetter: getExtremumX,
  yExtremumGetter: getExtremumY,
};
