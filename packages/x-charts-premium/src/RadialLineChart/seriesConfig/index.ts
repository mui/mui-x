import { type ChartSeriesTypeConfig } from '../../../../x-charts/src/internals/plugins/corePlugins/useChartSeriesConfig';

import seriesProcessor from '../../../../x-charts/src/LineChart/seriesConfig/seriesProcessor';
import getColor from '../../../../x-charts/src/LineChart/seriesConfig/getColor';
import legendGetter from './legend';
import getSeriesWithDefaultValues from '../../../../x-charts/src/LineChart/seriesConfig/getSeriesWithDefaultValues';
import tooltipItemPositionGetter from './tooltipPosition';
import keyboardFocusHandler from './keyboardFocusHandler';
import { axisTooltipGetter } from './axisTooltipGetter';
import descriptionGetter from './descriptionGetter';
import { radiusExtremumGetter, rotationExtremumGetter } from './extremums';
import tooltipGetter from './tooltip';
import { identifierSerializerSeriesIdDataIndex } from '../../../../x-charts/src/internals/identifierSerializer';
import { identifierCleanerSeriesIdDataIndex } from '../../../../x-charts/src/internals/identifierCleaner';
import {
  createIsHighlighted,
  createIsFaded,
} from '../../../../x-charts/src/internals/plugins/featurePlugins/useChartHighlight';

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
