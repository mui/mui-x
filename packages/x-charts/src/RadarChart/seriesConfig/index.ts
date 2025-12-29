import seriesProcessor from './seriesProcessor';
import getColor from './getColor';
import { radiusExtremumGetter, rotationExtremumGetter } from './extremums';
import { type ChartSeriesTypeConfig } from '../../internals/plugins/models/seriesConfig';
import legendGetter from './legend';
import tooltipGetter, { axisTooltipGetter } from './tooltip';
import getSeriesWithDefaultValues from './getSeriesWithDefaultValues';
import tooltipItemPositionGetter from './tooltipPosition';
import { identifierSerializerSeriesIdDataIndex } from '../../internals/identifierSerializer';

export const radarSeriesConfig: ChartSeriesTypeConfig<'radar'> = {
  colorProcessor: getColor,
  seriesProcessor,
  legendGetter,
  tooltipGetter,
  tooltipItemPositionGetter,
  axisTooltipGetter,
  getSeriesWithDefaultValues,
  radiusExtremumGetter,
  rotationExtremumGetter,
  identifierSerializer: identifierSerializerSeriesIdDataIndex,
};
