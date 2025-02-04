import { ChartSeriesTypeConfig } from '../internals/plugins/models/seriesConfig';
import { getExtremumX, getExtremumY } from './extremums';
import formatter from './formatter';
import legendGetter from './legend';
import getColor from './getColor';
import tooltipGetter from './tooltip';

export const plugin: ChartSeriesTypeConfig<'bar'> = {
  seriesProcessor: formatter,
  colorProcessor: getColor,
  legendGetter,
  tooltipGetter,
  xExtremumGetter: getExtremumX,
  yExtremumGetter: getExtremumY,
};
