import { ChartSeriesTypeConfig } from '../../internals/plugins/models/seriesConfig';
import seriesProcessor from './seriesProcessor';
import getColor from './getColor';
import legendGetter from './legend';
import tooltipGetter from './tooltip';

export const seriesConfig: ChartSeriesTypeConfig<'pie'> = {
  colorProcessor: getColor,
  seriesProcessor,
  legendGetter,
  tooltipGetter,
};
