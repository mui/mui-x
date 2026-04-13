import { type ChartSeriesTypeConfig } from '../../internals/plugins/corePlugins/useChartSeriesConfig';

import seriesProcessor from '../../LineChart/seriesConfig/seriesProcessor';
import getColor from '../../LineChart/seriesConfig/getColor';
import legendGetter from './legend';
import getSeriesWithDefaultValues from '../../LineChart/seriesConfig/getSeriesWithDefaultValues';
import tooltipItemPositionGetter from './tooltipPosition';
import keyboardFocusHandler from './keyboardFocusHandler';
import { axisTooltipGetter } from './axisTooltipGetter';
import descriptionGetter from './descriptionGetter';
import { radiusExtremumGetter, rotationExtremumGetter } from './extremums';
import tooltipGetter from './tooltip';
import { identifierSerializerSeriesIdDataIndex } from '../../internals/identifierSerializer';
import { identifierCleanerSeriesIdDataIndex } from '../../internals/identifierCleaner';
import {
  createIsHighlighted,
  createIsFaded,
} from '../../internals/plugins/featurePlugins/useChartHighlight';

export const radialLineSeriesConfig: ChartSeriesTypeConfig<'radial-line'> = {
  colorProcessor: getColor,
  seriesProcessor,
  legendGetter,
  tooltipGetter,
  tooltipItemPositionGetter,
  axisTooltipGetter,
  rotationExtremumGetter,
  radiusExtremumGetter,
  getSeriesWithDefaultValues,
  // getItemAtPosition,
  keyboardFocusHandler,
  identifierSerializer: identifierSerializerSeriesIdDataIndex,
  identifierCleaner: identifierCleanerSeriesIdDataIndex,
  descriptionGetter,
  isHighlightedCreator: createIsHighlighted,
  isFadedCreator: createIsFaded,
};
