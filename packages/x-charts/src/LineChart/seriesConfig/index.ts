import { type ChartSeriesTypeConfig } from '../../internals/plugins/models/seriesConfig';
import { identifierCompareSeriesIdDataIndex } from '../../internals/identifierCompare';
import { getExtremumX, getExtremumY } from './extremums';
import seriesProcessor from './seriesProcessor';
import getColor from './getColor';
import legendGetter from './legend';
import tooltipGetter, { axisTooltipGetter } from './tooltip';
import getSeriesWithDefaultValues from './getSeriesWithDefaultValues';
import tooltipItemPositionGetter from './tooltipPosition';
import keyboardFocusHandler from './keyboardFocusHandler';
import { identifierSerializerSeriesIdDataIndex } from '../../internals/identifierSerializer';

export const lineSeriesConfig: ChartSeriesTypeConfig<'line'> = {
  colorProcessor: getColor,
  seriesProcessor,
  legendGetter,
  tooltipGetter,
  tooltipItemPositionGetter,
  axisTooltipGetter,
  xExtremumGetter: getExtremumX,
  yExtremumGetter: getExtremumY,
  getSeriesWithDefaultValues,
  keyboardFocusHandler,
  identifierCompare: identifierCompareSeriesIdDataIndex,
  identifierSerializer: identifierSerializerSeriesIdDataIndex,
};
