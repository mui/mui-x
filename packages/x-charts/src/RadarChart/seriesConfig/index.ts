import seriesProcessor from './seriesProcessor';
import getColor from './getColor';
import { radiusExtremumGetter, rotationExtremumGetter } from './extremums';
import { type ChartSeriesTypeConfig } from '../../internals/plugins/corePlugins/useChartSeriesConfig';
import legendGetter from './legend';
import tooltipGetter, { axisTooltipGetter } from './tooltip';
import getSeriesWithDefaultValues from './getSeriesWithDefaultValues';
import tooltipItemPositionGetter from './tooltipPosition';
import keyboardFocusHandler from './keyboardFocusHandler';
import { identifierSerializerSeriesIdDataIndex } from '../../internals/identifierSerializer';
import { identifierCleanerSeriesIdDataIndex } from '../../internals/identifierCleaner';

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
  keyboardFocusHandler,
  identifierSerializer: identifierSerializerSeriesIdDataIndex,
  identifierCleaner: identifierCleanerSeriesIdDataIndex,
};
