import { type ChartSeriesTypeConfig } from '../../internals/plugins/corePlugins/useChartSeriesConfig';
import { getExtremumX, getExtremumY } from './extremums';
import { getRadiusExtremum, getRotationExtremum } from './polarExtremums';
import seriesProcessor from './seriesProcessor';
import getColor from './getColor';
import legendGetter from './legend';
import tooltipGetter, { axisTooltipGetter } from './tooltip';
import getSeriesWithDefaultValues from './getSeriesWithDefaultValues';
import tooltipItemPositionGetter from './tooltipPosition';
import getItemAtPosition from './getItemAtPosition';
import keyboardFocusHandler from './keyboardFocusHandler';
import { identifierSerializerSeriesIdDataIndex } from '../../internals/identifierSerializer';
import { identifierCleanerSeriesIdDataIndex } from '../../internals/identifierCleaner';
import {
  createIsHighlighted,
  createIsFaded,
} from '../../internals/plugins/featurePlugins/useChartHighlight';
import descriptionGetter from './descriptionGetter';

export const lineSeriesConfig: ChartSeriesTypeConfig<'line'> = {
  colorProcessor: getColor,
  seriesProcessor,
  legendGetter,
  tooltipGetter,
  tooltipItemPositionGetter,
  axisTooltipGetter,
  xExtremumGetter: getExtremumX,
  yExtremumGetter: getExtremumY,
  radiusExtremumGetter: getRadiusExtremum,
  rotationExtremumGetter: getRotationExtremum,
  getSeriesWithDefaultValues,
  getItemAtPosition,
  keyboardFocusHandler,
  identifierSerializer: identifierSerializerSeriesIdDataIndex,
  identifierCleaner: identifierCleanerSeriesIdDataIndex,
  descriptionGetter,
  isHighlightedCreator: createIsHighlighted,
  isFadedCreator: createIsFaded,
};
