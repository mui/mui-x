import { ChartSeriesTypeConfig } from '../internals/plugins/models/seriesConfig';
import formatter from './formatter';
import getColor from './getColor';
import legendGetter from './legend';

export const plugin: ChartSeriesTypeConfig<'pie'> = {
  colorProcessor: getColor,
  seriesProcessor: formatter,
  legendGetter,
};
