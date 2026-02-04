import { type ChartSeriesTypeConfig } from '../../internals/plugins/corePlugins/useChartSeriesConfig';
import seriesProcessor from './seriesProcessor';
import getColor from './getColor';
import legendGetter from './legend';
import tooltipGetter from './tooltip';
import seriesLayout from './seriesLayout';
import getSeriesWithDefaultValues from './getSeriesWithDefaultValues';
import tooltipItemPositionGetter from './tooltipPosition';
import keyboardFocusHandler from './keyboardFocusHandler';
import { identifierSerializerSeriesIdDataIndex } from '../../internals/identifierSerializer';
import { identifierCleanerSeriesIdDataIndex } from '../../internals/identifierCleaner';

export const pieSeriesConfig: ChartSeriesTypeConfig<'pie'> = {
  colorProcessor: getColor,
  seriesProcessor,
  seriesLayout,
  legendGetter,
  tooltipGetter,
  tooltipItemPositionGetter,
  getSeriesWithDefaultValues,
  keyboardFocusHandler,
  identifierSerializer: identifierSerializerSeriesIdDataIndex,
  identifierCleaner: identifierCleanerSeriesIdDataIndex,
};
