import { type ScaleBand } from '@mui/x-charts-vendor/d3-scale';
import type { ScaleName, ChartsXAxisProps, ChartsYAxisProps } from '../models';
import type { ComputedAxis, D3Scale } from '../models/axis';
import type { ChartSeriesDefaultized } from '../models/seriesType/config';
import { getBandSize } from './getBandSize';
import { findMinMax } from './findMinMax';

function shouldInvertStartCoordinate(verticalLayout: boolean, baseValue: number, reverse: boolean) {
  const isVerticalAndPositive = verticalLayout && baseValue > 0;
  const isHorizontalAndNegative = !verticalLayout && baseValue < 0;
  const invertStartCoordinate = isVerticalAndPositive || isHorizontalAndNegative;

  return reverse ? !invertStartCoordinate : invertStartCoordinate;
}

export function getBarDimensions(params: {
  verticalLayout: boolean;
  xAxisConfig: ComputedAxis<ScaleName, any, ChartsXAxisProps>;
  yAxisConfig: ComputedAxis<ScaleName, any, ChartsYAxisProps>;
  series: ChartSeriesDefaultized<'bar'>;
  dataIndex: number;
  numberOfGroups: number;
  groupIndex: number;
}) {
  const {
    verticalLayout,
    xAxisConfig,
    yAxisConfig,
    series,
    dataIndex,
    numberOfGroups,
    groupIndex,
  } = params;

  const baseScaleConfig = (verticalLayout ? xAxisConfig : yAxisConfig) as ComputedAxis<'band'>;
  const reverse = (verticalLayout ? yAxisConfig.reverse : xAxisConfig.reverse) ?? false;

  const { barWidth, offset } = getBandSize(
    baseScaleConfig.scale.bandwidth(),
    numberOfGroups,
    baseScaleConfig.barGapRatio,
  );
  const barOffset = groupIndex * (barWidth + offset);

  const xScale = xAxisConfig.scale;
  const yScale = yAxisConfig.scale;

  const baseValue = baseScaleConfig.data![dataIndex];
  const seriesValue = series.data[dataIndex];

  if (seriesValue == null) {
    return null;
  }

  const values = series.stackedData[dataIndex];
  const valueCoordinates = values.map((v) => (verticalLayout ? yScale(v)! : xScale(v)!));

  const minValueCoord = Math.round(Math.min(...valueCoordinates));
  const maxValueCoord = Math.round(Math.max(...valueCoordinates));

  const barSize =
    seriesValue === 0 ? 0 : Math.max(series.minBarSize, maxValueCoord - minValueCoord);
  const startCoordinate = shouldInvertStartCoordinate(verticalLayout, seriesValue, reverse)
    ? maxValueCoord - barSize
    : minValueCoord;

  return {
    x: verticalLayout ? xScale(baseValue)! + barOffset : startCoordinate,
    y: verticalLayout ? startCoordinate : yScale(baseValue)! + barOffset,
    height: verticalLayout ? barSize : barWidth,
    width: verticalLayout ? barWidth : barSize,
  };
}

export function getBarBandDimensions(
  bandScale: ScaleBand<{ toString(): string }>,
  baseValue: any,
  barWidth: number,
  offset: number,
  groupIndex: number,
) {
  const barOffset = groupIndex * (barWidth + offset);

  return {
    start: bandScale(baseValue)! + barOffset,
    size: barWidth,
  };
}

export function getBarContinuousDimensions(
  verticalLayout: boolean,
  xScale: D3Scale,
  yScale: D3Scale,
  series: ChartSeriesDefaultized<'bar'>,
  reverse: boolean,
  dataIndex: number,
) {
  const seriesValue = series.data[dataIndex];

  if (seriesValue == null) {
    return null;
  }

  const values = series.stackedData[dataIndex];
  const valueCoordinates = values.map((v) => (verticalLayout ? yScale(v)! : xScale(v)!));

  const minMax = findMinMax(valueCoordinates);
  const minValueCoord = Math.round(minMax[0]);
  const maxValueCoord = Math.round(minMax[1]);

  const barSize =
    seriesValue === 0 ? 0 : Math.max(series.minBarSize, maxValueCoord - minValueCoord);
  const startCoordinate = shouldInvertStartCoordinate(verticalLayout, seriesValue, reverse)
    ? maxValueCoord - barSize
    : minValueCoord;

  return { start: startCoordinate, size: barSize };
}
