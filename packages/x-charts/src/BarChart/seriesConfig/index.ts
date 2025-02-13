import { ChartSeriesTypeConfig } from '../../internals/plugins/models/seriesConfig';
import { getExtremumX, getExtremumY } from './extremums';
import seriesProcessor from './seriesProcessor';
import legendGetter from './legend';
import getColor from './getColor';
import tooltipGetter from './tooltip';

export const seriesConfig: ChartSeriesTypeConfig<'bar'> = {
  seriesProcessor,
  colorProcessor: getColor,
  legendGetter,
  tooltipGetter,
  xExtremumGetter: getExtremumX,
  yExtremumGetter: getExtremumY,
};
