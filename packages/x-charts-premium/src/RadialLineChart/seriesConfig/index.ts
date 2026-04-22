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
import getItemAtPosition from './getItemAtPosition';

polarSeriesTypes.addType('radialLine');

polarSeriesTypes.addType('radialLine');

export const radialLineSeriesConfig: ChartSeriesTypeConfig<'radialLine'> = {
  colorProcessor,
  seriesProcessor,
  legendGetter,
  tooltipGetter,
  tooltipItemPositionGetter,
  axisTooltipGetter,
  rotationExtremumGetter,
  radiusExtremumGetter,
  getSeriesWithDefaultValues,
  getItemAtPosition,
  keyboardFocusHandler,
  identifierSerializer: identifierSerializerSeriesIdDataIndex,
  identifierCleaner: identifierCleanerSeriesIdDataIndex,
  descriptionGetter,
  isHighlightedCreator: createIsHighlighted,
  isFadedCreator: createIsFaded,
};
