import { ChartSeriesTypeConfig } from '../../internals/plugins/models/seriesConfig';
import { getExtremumX, getExtremumY } from './bar/extremums';
import {
  getExtremumX as getBarRangeExtremumX,
  getExtremumY as getBarRangeExtremumY,
} from './barRangeExtrema';
import seriesProcessor from './bar/seriesProcessor';
import legendGetter from './bar/legend';
import getColor from './bar/getColor';
import tooltipGetter, { axisTooltipGetter } from './bar/tooltip';
import tooltipItemPositionGetter from './bar/tooltipPosition';
import { getSeriesWithDefaultValues } from './bar/getSeriesWithDefaultValues';
import barRangeTooltipGetter, {
  axisTooltipGetter as barRangeAxisTooltipGetter,
} from './barRangeTooltip';
import barRangeSeriesProcessor from './barRangeSeriesProcessor';
import barRangeGetColor from './barRangeGetColor';

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

export const barRangeSeriesConfig: ChartSeriesTypeConfig<'barRange'> = {
  seriesProcessor: barRangeSeriesProcessor,
  colorProcessor: barRangeGetColor,
  legendGetter,
  tooltipGetter: barRangeTooltipGetter,
  tooltipItemPositionGetter,
  axisTooltipGetter: barRangeAxisTooltipGetter,
  xExtremumGetter: getBarRangeExtremumX,
  yExtremumGetter: getBarRangeExtremumY,
  getSeriesWithDefaultValues: (...args) => getSeriesWithDefaultValues<'barRange'>(...args),
};
