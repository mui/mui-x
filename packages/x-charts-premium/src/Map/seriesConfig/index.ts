import {
  type ChartSeriesTypeConfig,
  identifierSerializerSeriesIdDataIndex,
  identifierCleanerSeriesIdDataIndex,
  createIsHighlighted,
  createIsFaded,
} from '@mui/x-charts/internals';
import seriesProcessor from './seriesProcessor';
import getColor from './getColor';
import legendGetter from './legend';
import tooltipGetter from './tooltip';
import getSeriesWithDefaultValues from './getSeriesWithDefaultValues';
import descriptionGetter from './descriptionGetter';
import keyboardFocusHandler from './keyboardFocusHandler';
import tooltipItemPositionGetter from './tooltipPosition';

export const mapShapeSeriesConfig: ChartSeriesTypeConfig<'mapShape'> = {
  seriesProcessor,
  colorProcessor: getColor,
  legendGetter,
  tooltipGetter,
  tooltipItemPositionGetter,
  getSeriesWithDefaultValues,
  keyboardFocusHandler,
  identifierSerializer: identifierSerializerSeriesIdDataIndex,
  identifierCleaner: identifierCleanerSeriesIdDataIndex,
  descriptionGetter,
  isHighlightedCreator: createIsHighlighted,
  isFadedCreator: createIsFaded,
};
