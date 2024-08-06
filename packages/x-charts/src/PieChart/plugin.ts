import type { ChartsPlugin } from '../context/PluginProvider';
import formatter from './formatter';
import getColor from './getColor';

export const plugin: ChartsPlugin<'pie'> = {
  seriesType: 'pie',
  colorProcessor: getColor,
  seriesFormatter: formatter,
};
