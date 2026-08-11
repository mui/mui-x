import { cartesianSeriesTypes } from '@mui/x-charts/internals';
import type { ChartSeriesTypeConfig } from '@mui/x-charts/internals';
import { getBaseExtremum } from './extremums';
import seriesProcessor from './seriesProcessor';
import getColor from './getColor';
import tooltipGetter from './tooltip';
import getSeriesWithDefaultValues from './getSeriesWithDefaultValues';
import { selectorTooltipItemPosition } from './tooltipPosition';
import getItemAtPosition from './getItemAtPosition';
import getItemWithData from './getItemWithData';
import keyboardFocusHandler from './keyboardFocusHandler';
import { createIsFaded, createIsHighlighted } from './highlight';
import identifierSerializer from './identifierSerializer';
import identifierCleaner from './identifierCleaner';
import descriptionGetter from './descriptionGetter';

cartesianSeriesTypes.addType('heatmap');

export const heatmapSeriesConfig: ChartSeriesTypeConfig<'heatmap'> = {
  seriesProcessor,
  colorProcessor: getColor,
  legendGetter: () => [],
  tooltipGetter,
  selectorTooltipItemPosition,
  xExtremumGetter: getBaseExtremum,
  yExtremumGetter: getBaseExtremum,
  getSeriesWithDefaultValues,
  identifierSerializer,
  identifierCleaner,
  getItemAtPosition,
  getItemWithData,
  keyboardFocusHandler,
  descriptionGetter,
  isHighlightedCreator: createIsHighlighted,
  isFadedCreator: createIsFaded,
};
