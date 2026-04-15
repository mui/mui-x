import {
  type ChartSeriesTypeConfig,
  lineSeriesProcessor,
  lineColorProcessor,
  lineGetSeriesWithDefaultValues,
  identifierSerializerSeriesIdDataIndex,
  identifierCleanerSeriesIdDataIndex,
  createIsHighlighted,
  createIsFaded,
} from '@mui/x-charts/internals';
import legendGetter from './legend';
import tooltipItemPositionGetter from './tooltipPosition';
import keyboardFocusHandler from './keyboardFocusHandler';
import { axisTooltipGetter } from './axisTooltipGetter';
import descriptionGetter from './descriptionGetter';
import { radiusExtremumGetter, rotationExtremumGetter } from './extremums';
import tooltipGetter from './tooltip';

export const radialLineSeriesConfig: ChartSeriesTypeConfig<'radial-line'> = {
  colorProcessor: lineColorProcessor,
  seriesProcessor: lineSeriesProcessor,
  legendGetter,
  tooltipGetter,
  tooltipItemPositionGetter,
  axisTooltipGetter,
  rotationExtremumGetter,
  radiusExtremumGetter,
  getSeriesWithDefaultValues: lineGetSeriesWithDefaultValues,
  // getItemAtPosition,
  keyboardFocusHandler,
  identifierSerializer: identifierSerializerSeriesIdDataIndex,
  identifierCleaner: identifierCleanerSeriesIdDataIndex,
  descriptionGetter,
  isHighlightedCreator: createIsHighlighted,
  isFadedCreator: createIsFaded,
};
