import {
  cartesianSeriesTypes,
  identifierSerializerSeriesIdDataIndex,
  identifierCleanerSeriesIdDataIndex,
  type ChartSeriesTypeConfig,
  createIsHighlighted,
  createIsFaded,
} from '@mui/x-charts/internals';
import { getExtremumX, getExtremumY } from './extrema';
import tooltipGetter, { axisTooltipGetter } from './tooltip';
import seriesProcessor from './seriesProcessor';
import getColor from './getColor';
import legendGetter from './legend';
import tooltipItemPositionGetter from './tooltipPosition';
import { getSeriesWithDefaultValues } from './getSeriesWithDefaultValues';

export const rangeBarSeriesConfig: ChartSeriesTypeConfig<'rangeBar'> = {
  seriesProcessor,
  colorProcessor: getColor,
  legendGetter,
  tooltipGetter,
  tooltipItemPositionGetter,
  axisTooltipGetter,
  xExtremumGetter: getExtremumX,
  yExtremumGetter: getExtremumY,
  getSeriesWithDefaultValues,
  identifierSerializer: identifierSerializerSeriesIdDataIndex,
  identifierCleaner: identifierCleanerSeriesIdDataIndex,
  isHighlightedCreator: createIsHighlighted,
  isFadedCreator: createIsFaded,
};

cartesianSeriesTypes.addType('rangeBar');
