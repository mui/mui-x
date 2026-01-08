import { type ChartSeriesTypeConfig } from '../../internals/plugins/models/seriesConfig';
import { identifierCompareSeriesIdDataIndex } from '../../internals/identifierCompare';
import seriesProcessor from './seriesProcessor';
import getColor from './getColor';
import legendGetter from './legend';
import tooltipGetter from './tooltip';
import seriesLayout from './seriesLayout';
import getSeriesWithDefaultValues from './getSeriesWithDefaultValues';
import tooltipItemPositionGetter from './tooltipPosition';
import keyboardFocusHandler from './keyboardFocusHandler';
import { identifierSerializerSeriesIdDataIndex } from '../../internals/identifierSerializer';

export const pieSeriesConfig: ChartSeriesTypeConfig<'pie'> = {
  colorProcessor: getColor,
  seriesProcessor,
  seriesLayout,
  legendGetter,
  tooltipGetter,
  tooltipItemPositionGetter,
  getSeriesWithDefaultValues,
  keyboardFocusHandler,
  identifierCompare: identifierCompareSeriesIdDataIndex,
  identifierSerializer: identifierSerializerSeriesIdDataIndex,
};
