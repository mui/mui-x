import formatter from './formatter';
import getColor from './getColor';
import { radiusExtremumGetter, rotationExtremumGetter } from './extremums';
import { ChartSeriesTypeConfig } from '../../internals/plugins/models/seriesConfig';
import legendGetter from './legend';
import tooltipGetter, { axisTooltipGetter } from './tooltip';
import getSeriesWithDefaultValues from './getSeriesWithDefaultValues';

export const radarSeriesConfig: ChartSeriesTypeConfig<'radar'> = {
  colorProcessor: getColor,
  seriesProcessor: formatter,
  legendGetter,
  tooltipGetter,
  axisTooltipGetter,
  getSeriesWithDefaultValues,
  radiusExtremumGetter,
  rotationExtremumGetter,
};
