import { ChartSeriesTypeConfig } from '../../internals/plugins/models/seriesConfig';
import { getExtremumX, getExtremumY } from './extremums';
import seriesProcessor from './seriesProcessor';
import getColor from './getColor';
import legendGetter from './legend';
import tooltipGetter from './tooltip';
import getSeriesWithDefaultValues from './getSeriesWithDefaultValues';

export const seriesConfig: ChartSeriesTypeConfig<'line'> = {
  colorProcessor: getColor,
  seriesProcessor,
  legendGetter,
  tooltipGetter,
  xExtremumGetter: getExtremumX,
  yExtremumGetter: getExtremumY,
  getSeriesWithDefaultValues,
};
