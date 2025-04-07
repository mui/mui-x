import { ChartSeriesTypeConfig } from '../../internals/plugins/models/seriesConfig';
import { getExtremumX, getExtremumY } from './extremums';
import seriesProcessor from './seriesProcessor';
import legendGetter from './legend';
import getColor from './getColor';
import tooltipGetter, { axisTooltipGetter } from './tooltip';
import getSeriesWithDefaultValues from './getSeriesWithDefaultValues';

export const seriesConfig: ChartSeriesTypeConfig<'bar'> = {
  seriesProcessor,
  colorProcessor: getColor,
  legendGetter,
  tooltipGetter,
  axisTooltipGetter,
  xExtremumGetter: getExtremumX,
  yExtremumGetter: getExtremumY,
  getSeriesWithDefaultValues,
};
