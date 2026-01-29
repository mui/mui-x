import {
  cartesianSeriesTypes,
  type ChartSeriesTypeConfig,
  identifierSerializerSeriesIdDataIndex,
  identifierCleanerSeriesIdDataIndex,
  createIsHighlighted,
  createIsFaded,
} from '@mui/x-charts/internals';
import { getBaseExtremum } from './extremums';
import seriesProcessor from './seriesProcessor';
import getColor from './getColor';
import tooltipGetter from './tooltip';
import getSeriesWithDefaultValues from './getSeriesWithDefaultValues';
import tooltipItemPositionGetter from './tooltipPosition';
import getItemAtPosition from './getItemAtPosition';
import keyboardFocusHandler from './keyboardFocusHandler';

cartesianSeriesTypes.addType('heatmap');

export const heatmapSeriesConfig: ChartSeriesTypeConfig<'heatmap'> = {
  seriesProcessor,
  colorProcessor: getColor,
  legendGetter: () => [],
  tooltipGetter,
  tooltipItemPositionGetter,
  xExtremumGetter: getBaseExtremum,
  yExtremumGetter: getBaseExtremum,
  getSeriesWithDefaultValues,
  identifierSerializer: identifierSerializerSeriesIdDataIndex,
  identifierCleaner: identifierCleanerSeriesIdDataIndex,
  getItemAtPosition,
  keyboardFocusHandler,
  isHighlightedCreator: createIsHighlighted,
  isFadedCreator: createIsFaded,
};
