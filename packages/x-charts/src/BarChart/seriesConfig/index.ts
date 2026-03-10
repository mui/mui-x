import type { ChartSeriesTypeConfig } from '../../internals/plugins/corePlugins/useChartSeriesConfig';
import { getExtremumX, getExtremumY } from './bar/extremums';
import seriesProcessor from './bar/seriesProcessor';
import legendGetter from './bar/legend';
import getColor from './bar/getColor';
import keyboardFocusHandler from './bar/keyboardFocusHandler';
import tooltipGetter, { axisTooltipGetter } from './bar/tooltip';
import tooltipItemPositionGetter from './bar/tooltipPosition';
import { getSeriesWithDefaultValues } from './bar/getSeriesWithDefaultValues';
import { identifierSerializerSeriesIdDataIndex } from '../../internals/identifierSerializer';
import { identifierCleanerSeriesIdDataIndex } from '../../internals/identifierCleaner';
import {
  createIsHighlighted,
  createIsFaded,
} from '../../internals/plugins/featurePlugins/useChartHighlight';

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
  identifierSerializer: identifierSerializerSeriesIdDataIndex,
  identifierCleaner: identifierCleanerSeriesIdDataIndex,
  isHighlightedCreator: createIsHighlighted,
  isFadedCreator: createIsFaded,
};
