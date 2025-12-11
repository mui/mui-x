import { type ScaleBand } from '@mui/x-charts-vendor/d3-scale';
import type { ScaleName, ChartsXAxisProps, ChartsYAxisProps, ContinuousScaleName } from '../models';
import type { ComputedAxis, D3ContinuousScale } from '../models/axis';
import type { ChartSeriesDefaultized } from '../models/seriesType/config';
import { getBandSize } from './getBandSize';

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

  const bandAxis = (verticalLayout ? xAxisConfig : yAxisConfig) as ComputedAxis<'band'>;
  const continuousAxis = (
    verticalLayout ? yAxisConfig : xAxisConfig
  ) as ComputedAxis<ContinuousScaleName>;

  const { barWidth, offset } = getBandSize(
    bandAxis.scale.bandwidth(),
    numberOfGroups,
    bandAxis.barGapRatio,
  );

  const seriesValue = series.data[dataIndex];

  if (seriesValue == null) {
    return null;
  }

  const bandDimensions = getBarBandDimensions(
    bandAxis.scale as ScaleBand<{ toString(): string }>,
    bandAxis.data?.[dataIndex],
    barWidth,
    offset,
    groupIndex,
  );
  const continuousDimensions = getBarContinuousDimensions(
    verticalLayout,
    continuousAxis.scale as D3ContinuousScale,
    series,
    continuousAxis.reverse ?? false,
    dataIndex,
  );

  if (bandDimensions == null || continuousDimensions == null) {
    return null;
  }

  return {
    x: verticalLayout ? bandDimensions.start : continuousDimensions.start,
    y: verticalLayout ? continuousDimensions.start : bandDimensions.start,
    width: verticalLayout ? bandDimensions.size : continuousDimensions.size,
    height: verticalLayout ? continuousDimensions.size : bandDimensions.size,
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
  continuousScale: D3ContinuousScale,
  series: ChartSeriesDefaultized<'bar'>,
  reverse: boolean,
  dataIndex: number,
) {
  const seriesValue = series.data[dataIndex];

  if (seriesValue == null) {
    return null;
  }

  const values = series.stackedData[dataIndex];

  let min = Infinity;
  let max = -Infinity;
  for (const value of values) {
    const coord = continuousScale(value)!;

    if (coord < min) {
      min = coord;
    }

    if (coord > max) {
      max = coord;
    }
  }

  const minValueCoord = Math.round(min);
  const maxValueCoord = Math.round(max);

  const barSize =
    seriesValue === 0 ? 0 : Math.max(series.minBarSize, maxValueCoord - minValueCoord);
  const startCoordinate = shouldInvertStartCoordinate(verticalLayout, seriesValue, reverse)
    ? maxValueCoord - barSize
    : minValueCoord;

  return { start: startCoordinate, size: barSize };
}
