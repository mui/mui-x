import type { ChartSeriesTypeConfig } from '@mui/x-charts/internals';
import seriesProcessor from './seriesProcessor';
import getColor from './getColor';
import legendGetter from './legend';
import tooltipGetter from './tooltip';
import getSeriesWithDefaultValues from './getSeriesWithDefaultValues';
import descriptionGetter from './descriptionGetter';
import keyboardFocusHandler from './keyboardFocusHandler';
import tooltipItemPositionSelector from './tooltipPosition';
import identifierSerializer from './identifierSerializer';
import identifierCleaner from './identifierCleaner';
import { createIsHighlighted, createIsFaded } from './highlight';

export const mapShapeSeriesConfig: ChartSeriesTypeConfig<'mapShape'> = {
  seriesProcessor,
  colorProcessor: getColor,
  legendGetter,
  tooltipGetter,
  tooltipItemPositionSelector,
  getSeriesWithDefaultValues,
  keyboardFocusHandler,
  identifierSerializer,
  identifierCleaner,
  descriptionGetter,
  isHighlightedCreator: createIsHighlighted,
  isFadedCreator: createIsFaded,
};
