import { type ChartSeriesTypeConfig } from '../../internals/plugins/models/seriesConfig';
import { identifierCompareSeriesIdDataIndex } from '../../internals/identifierCompare';
import { getExtremumX, getExtremumY } from './bar/extremums';
import seriesProcessor from './bar/seriesProcessor';
import legendGetter from './bar/legend';
import getColor from './bar/getColor';
import keyboardFocusHandler from './bar/keyboardFocusHandler';
import tooltipGetter, { axisTooltipGetter } from './bar/tooltip';
import tooltipItemPositionGetter from './bar/tooltipPosition';
import { getSeriesWithDefaultValues } from './bar/getSeriesWithDefaultValues';

export const barSeriesConfig: ChartSeriesTypeConfig<'bar'> = {
  seriesProcessor,
  colorProcessor: getColor,
  legendGetter,
  tooltipGetter,
  tooltipItemPositionGetter,
  axisTooltipGetter,
  xExtremumGetter: getExtremumX,
  yExtremumGetter: getExtremumY,
  getSeriesWithDefaultValues,
  keyboardFocusHandler,
  identifierCompare: identifierCompareSeriesIdDataIndex,
};
