import type { ChartSeriesTypeConfig } from '../../internals/plugins/corePlugins/useChartSeriesConfig';
import { getExtremumX, getExtremumY } from './bar/extremums';
import { getRadiusExtremum, getRotationExtremum } from './bar/polarExtremums';
import seriesProcessor from './bar/seriesProcessor';
import legendGetter from './bar/legend';
import getColor from './bar/getColor';
import keyboardFocusHandler from './bar/keyboardFocusHandler';
import tooltipGetter, { axisTooltipGetter } from './bar/tooltip';
import tooltipItemPositionGetter from './bar/tooltipPosition';
import { getSeriesWithDefaultValues } from './bar/getSeriesWithDefaultValues';
import { selectorBarItemAtPosition } from '../../internals/plugins/featurePlugins/useChartCartesianAxis/useChartCartesianAxisPosition.selectors';
import { identifierSerializerSeriesIdDataIndex } from '../../internals/identifierSerializer';
import { identifierCleanerSeriesIdDataIndex } from '../../internals/identifierCleaner';
import descriptionGetter from './bar/descriptionGetter';
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
  radiusExtremumGetter: getRadiusExtremum,
  rotationExtremumGetter: getRotationExtremum,
  getSeriesWithDefaultValues,
  getItemAtPosition: selectorBarItemAtPosition,
  identifierSerializer: identifierSerializerSeriesIdDataIndex,
  identifierCleaner: identifierCleanerSeriesIdDataIndex,
  descriptionGetter,
  keyboardFocusHandler,
  isHighlightedCreator: createIsHighlighted,
  isFadedCreator: createIsFaded,
};
