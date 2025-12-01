import { cartesianSeriesTypes, ChartSeriesTypeConfig } from '@mui/x-charts/internals';
import {
  getExtremumX as getRangeBarExtremumX,
  getExtremumY as getRangeBarExtremumY,
} from './extrema';
import rangeBarTooltipGetter, { axisTooltipGetter as rangeBarAxisTooltipGetter } from './tooltip';
import rangeBarSeriesProcessor from './seriesProcessor';
import rangeBarGetColor from './getColor';
import legendGetter from './legend';
import tooltipItemPositionGetter from './tooltipPosition';
import { getSeriesWithDefaultValues } from './getSeriesWithDefaultValues';

export const rangeBarSeriesConfig: ChartSeriesTypeConfig<'rangeBar'> = {
  seriesProcessor: rangeBarSeriesProcessor,
  colorProcessor: rangeBarGetColor,
  legendGetter,
  tooltipGetter: rangeBarTooltipGetter,
  tooltipItemPositionGetter,
  axisTooltipGetter: rangeBarAxisTooltipGetter,
  xExtremumGetter: getRangeBarExtremumX,
  yExtremumGetter: getRangeBarExtremumY,
  getSeriesWithDefaultValues,
};

cartesianSeriesTypes.addType('rangeBar');
