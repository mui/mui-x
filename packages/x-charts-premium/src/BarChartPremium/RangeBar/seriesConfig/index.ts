import {
  cartesianSeriesTypes,
  identifierSerializerSeriesIdDataIndex,
  identifierCleanerSeriesIdDataIndex,
  createIsHighlighted,
  createIsFaded,
} from '@mui/x-charts/internals';
import type { ChartSeriesTypeConfig } from '@mui/x-charts/internals';
import { seriesPreviewPlotMap } from '@mui/x-charts-pro/internals';
import { getExtremumX, getExtremumY } from './extrema';
import tooltipGetter, { axisTooltipGetter } from './tooltip';
import seriesProcessor from './seriesProcessor';
import getColor from './getColor';
import legendGetter from './legend';
import keyboardFocusHandler from './keyboardFocusHandler';
import { selectorTooltipItemPosition } from './tooltipPosition';
import { getSeriesWithDefaultValues } from './getSeriesWithDefaultValues';
import descriptionGetter from './descriptionGetter';
import { RangeBarPreviewPlot } from '../../../ChartsZoomSlider/internals/previews/RangeBarPreviewPlot';

export const rangeBarSeriesConfig: ChartSeriesTypeConfig<'rangeBar'> = {
  seriesProcessor,
  colorProcessor: getColor,
  legendGetter,
  tooltipGetter,
  selectorTooltipItemPosition,
  axisTooltipGetter,
  xExtremumGetter: getExtremumX,
  yExtremumGetter: getExtremumY,
  getSeriesWithDefaultValues,
  keyboardFocusHandler,
  identifierSerializer: identifierSerializerSeriesIdDataIndex,
  identifierCleaner: identifierCleanerSeriesIdDataIndex,
  descriptionGetter,
  isHighlightedCreator: createIsHighlighted,
  isFadedCreator: createIsFaded,
};

cartesianSeriesTypes.addType('rangeBar');
seriesPreviewPlotMap.set('rangeBar', RangeBarPreviewPlot);
