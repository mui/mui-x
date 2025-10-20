import { ChartSeriesTypeConfig } from '../../internals/plugins/models/seriesConfig';
import { getExtremumX, getExtremumY } from './extremums';
import {
  getExtremumX as getBarRangeExtremumX,
  getExtremumY as getBarRangeExtremumY,
} from './barRangeExtrema';
import seriesProcessor from './seriesProcessor';
import legendGetter from './legend';
import getColor from './getColor';
import tooltipGetter, { axisTooltipGetter } from './tooltip';
import { getSeriesWithDefaultValues } from './getSeriesWithDefaultValues';
import barRangeSeriesProcessor from './barRangeSeriesProcessor';

export const seriesConfig: ChartSeriesTypeConfig<'bar'> = {
  seriesProcessor,
  colorProcessor: getColor,
  legendGetter,
  tooltipGetter,
  axisTooltipGetter,
  xExtremumGetter: getExtremumX,
  yExtremumGetter: getExtremumY,
  getSeriesWithDefaultValues: (...args) => getSeriesWithDefaultValues<'bar'>(...args),
};

export const barRangeSeriesConfig: ChartSeriesTypeConfig<'barRange'> = {
  seriesProcessor: barRangeSeriesProcessor,
  colorProcessor: getColor,
  legendGetter,
  tooltipGetter,
  axisTooltipGetter,
  xExtremumGetter: getBarRangeExtremumX,
  yExtremumGetter: getBarRangeExtremumY,
  getSeriesWithDefaultValues: (...args) => getSeriesWithDefaultValues<'barRange'>(...args),
};
