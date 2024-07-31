import { ChartsPluginType } from '../context/PluginProvider';
import formatter from './formatter';
import getColor from './getColor';

export const plugin: ChartsPluginType<'pie'> = {
  seriesType: 'pie',
  colorProcessor: getColor,
  seriesFormatter: formatter,
};
