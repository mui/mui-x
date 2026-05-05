import {
  type ChartSeriesTypeConfig,
  identifierSerializerSeriesIdDataIndex,
  identifierCleanerSeriesIdDataIndex,
  createIsHighlighted,
  createIsFaded,
  polarSeriesTypes,
} from '@mui/x-charts/internals';
import legendGetter from './legend';
import tooltipItemPositionGetter from './tooltipPosition';
import keyboardFocusHandler from './keyboardFocusHandler';
import { axisTooltipGetter } from './axisTooltipGetter';
import colorProcessor from './getColor';
import seriesProcessor from './seriesProcessor';
import getSeriesWithDefaultValues from './getSeriesWithDefaultValues';
import descriptionGetter from './descriptionGetter';
import { radiusExtremumGetter, rotationExtremumGetter } from './extremums';
import tooltipGetter from './tooltip';

polarSeriesTypes.addType('radialBar');

export const radialBarSeriesConfig: ChartSeriesTypeConfig<'radialBar'> = {
  colorProcessor,
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
