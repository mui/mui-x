import { ChartSeriesTypeConfig } from '../internals/plugins/models/seriesConfig';
import formatter from './formatter';
import getColor from './getColor';
import legendGetter from './legend';
import tooltipGetter from './tooltip';

export const plugin: ChartSeriesTypeConfig<'pie'> = {
  colorProcessor: getColor,
  seriesProcessor: formatter,
  legendGetter,
  tooltipGetter,
};
