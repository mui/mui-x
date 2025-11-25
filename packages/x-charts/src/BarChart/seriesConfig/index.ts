import { ChartSeriesTypeConfig } from '../../internals/plugins/models/seriesConfig';
import { getExtremumX, getExtremumY } from './bar/extremums';
import seriesProcessorWithoutDimensions from './bar/seriesProcessor';
import legendGetter from './bar/legend';
import getColor from './bar/getColor';
import tooltipGetter, { axisTooltipGetter } from './bar/tooltip';
import tooltipItemPositionGetter from './bar/tooltipPosition';
import getSeriesWithDefaultValues from './bar/getSeriesWithDefaultValues';

export const barSeriesConfig: ChartSeriesTypeConfig<'bar'> = {
  seriesProcessorWithoutDimensions,
  colorProcessor: getColor,
  legendGetter,
  tooltipGetter,
  tooltipItemPositionGetter,
  axisTooltipGetter,
  xExtremumGetter: getExtremumX,
  yExtremumGetter: getExtremumY,
  getSeriesWithDefaultValues,
};
