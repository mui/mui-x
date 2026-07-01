import {
  identifierSerializerSeriesIdDataIndex,
  identifierCleanerSeriesIdDataIndex,
  createIsHighlighted,
  createIsFaded,
} from '@mui/x-charts/internals';
import type { ChartSeriesTypeConfig } from '@mui/x-charts/internals';
import seriesProcessor from './seriesProcessor';
import getColor from './getColor';
import legendGetter from './legend';
import tooltipGetter from './tooltip';
import getSeriesWithDefaultValues from './getSeriesWithDefaultValues';
import descriptionGetter from './descriptionGetter';
import keyboardFocusHandler from './keyboardFocusHandler';
import selectorTooltipItemPosition from './tooltipPosition';

export const mapPointSeriesConfig: ChartSeriesTypeConfig<'mapPoint'> = {
  seriesProcessor,
  colorProcessor: getColor,
  legendGetter,
  tooltipGetter,
  selectorTooltipItemPosition,
  getSeriesWithDefaultValues,
  keyboardFocusHandler,
  identifierSerializer: identifierSerializerSeriesIdDataIndex,
  identifierCleaner: identifierCleanerSeriesIdDataIndex,
  descriptionGetter,
  isHighlightedCreator: createIsHighlighted,
  isFadedCreator: createIsFaded,
};
