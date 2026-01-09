import {
  cartesianSeriesTypes,
  identifierCompareSeriesIdDataIndex,
  identifierSerializerSeriesIdDataIndex,
  type ChartSeriesTypeConfig,
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
  identifierCompare: identifierCompareSeriesIdDataIndex,
  identifierSerializer: identifierSerializerSeriesIdDataIndex,
};

cartesianSeriesTypes.addType('rangeBar');
