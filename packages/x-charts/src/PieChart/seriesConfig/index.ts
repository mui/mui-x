import { ChartSeriesTypeConfig } from '../../internals/plugins/models/seriesConfig';
import seriesProcessor from './seriesProcessor';
import getColor from './getColor';
import legendGetter from './legend';
import tooltipGetter from './tooltip';
import getSeriesWithDefaultValues from './getSeriesWithDefaultValues';
import tooltipItemPositionGetter from './tooltipPosition';

export const seriesConfig: ChartSeriesTypeConfig<'pie'> = {
  colorProcessor: getColor,
  seriesProcessor,
  legendGetter,
  tooltipGetter,
  tooltipItemPositionGetter,
  getSeriesWithDefaultValues,
};
