import { ChartSeriesTypeConfig } from '../../internals/plugins/models/seriesConfig';
import { getExtremumX, getExtremumY } from './bar/extremums';
import {
  getExtremumX as getRangeBarExtremumX,
  getExtremumY as getRangeBarExtremumY,
} from './rangeBar/extrema';
import seriesProcessor from './bar/seriesProcessor';
import legendGetter from './bar/legend';
import getColor from './bar/getColor';
import tooltipGetter, { axisTooltipGetter } from './bar/tooltip';
import tooltipItemPositionGetter from './bar/tooltipPosition';
import { getSeriesWithDefaultValues } from './bar/getSeriesWithDefaultValues';
import rangeBarTooltipGetter, {
  axisTooltipGetter as rangeBarAxisTooltipGetter,
} from './rangeBar/tooltip';
import rangeBarSeriesProcessor from './rangeBar/seriesProcessor';
import rangeBarGetColor from './rangeBar/getColor';

export const barSeriesConfig: ChartSeriesTypeConfig<'bar'> = {
  seriesProcessor,
  colorProcessor: getColor,
  legendGetter,
  tooltipGetter,
  tooltipItemPositionGetter,
  axisTooltipGetter,
  xExtremumGetter: getExtremumX,
  yExtremumGetter: getExtremumY,
  getSeriesWithDefaultValues: (...args) => getSeriesWithDefaultValues<'bar'>(...args),
};

export const rangeBarSeriesConfig: ChartSeriesTypeConfig<'rangeBar'> = {
  seriesProcessor: rangeBarSeriesProcessor,
  colorProcessor: rangeBarGetColor,
  legendGetter,
  tooltipGetter: rangeBarTooltipGetter,
  tooltipItemPositionGetter,
  axisTooltipGetter: rangeBarAxisTooltipGetter,
  xExtremumGetter: getRangeBarExtremumX,
  yExtremumGetter: getRangeBarExtremumY,
  getSeriesWithDefaultValues: (...args) => getSeriesWithDefaultValues<'rangeBar'>(...args),
};
