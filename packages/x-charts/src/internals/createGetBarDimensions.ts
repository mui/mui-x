import type { ChartsXAxisProps, ChartsYAxisProps, ComputedAxis, ScaleName } from '../models/axis';
import type { ChartSeriesDefaultized } from '../models/seriesType/config';
import type { SamplingBucket } from './plugins/featurePlugins/useChartCartesianAxis/sampling.types';
import { findMinMax } from './findMinMax';
import { getBandSize } from './getBandSize';

function shouldInvertStartCoordinate(verticalLayout: boolean, baseValue: number, reverse: boolean) {
  const isVerticalAndPositive = verticalLayout && baseValue > 0;
  const isHorizontalAndNegative = !verticalLayout && baseValue < 0;
  const invertStartCoordinate = isVerticalAndPositive || isHorizontalAndNegative;

  return reverse ? !invertStartCoordinate : invertStartCoordinate;
}

export function createGetBarDimensions(params: {
  verticalLayout: boolean;
  xAxisConfig: ComputedAxis<ScaleName, any, ChartsXAxisProps>;
  yAxisConfig: ComputedAxis<ScaleName, any, ChartsYAxisProps>;
  series: ChartSeriesDefaultized<'bar'>;
  numberOfGroups: number;
}) {
  const { verticalLayout, xAxisConfig, yAxisConfig, series, numberOfGroups } = params;

  const baseScaleConfig = (verticalLayout ? xAxisConfig : yAxisConfig) as ComputedAxis<'band'>;
  const reverse = (verticalLayout ? yAxisConfig.reverse : xAxisConfig.reverse) ?? false;

  const { barWidth, offset } = getBandSize(
    baseScaleConfig.scale.bandwidth(),
    numberOfGroups,
    baseScaleConfig.barGapRatio,
  );

  const xScale = xAxisConfig.scale;
  const yScale = yAxisConfig.scale;

  return function getBarDimensions(dataIndex: number, groupIndex: number) {
    const barOffset = groupIndex * (barWidth + offset);
    const baseValue = baseScaleConfig.data![dataIndex];
    const seriesValue = series.data[dataIndex];

    if (seriesValue == null) {
      return null;
    }

    const values = series.visibleStackedData[dataIndex];
    const valueCoordinates = values.map((v) => (verticalLayout ? yScale(v)! : xScale(v)!));

    const [minValueCoord, maxValueCoord] = findMinMax(valueCoordinates).map((v) => Math.round(v));

    let barSize = 0;
    if (seriesValue !== 0) {
      if (!series.hidden) {
        barSize = Math.max(series.minBarSize, maxValueCoord - minValueCoord);
      }
    }

    const shouldInvert = shouldInvertStartCoordinate(verticalLayout, seriesValue, reverse);

    let startCoordinate = 0;

    if (shouldInvert) {
      startCoordinate = maxValueCoord - barSize;
    } else {
      startCoordinate = minValueCoord;
    }

    return {
      x: verticalLayout ? xScale(baseValue)! + barOffset : startCoordinate,
      y: verticalLayout ? startCoordinate : yScale(baseValue)! + barOffset,
      height: verticalLayout ? barSize : barWidth,
      width: verticalLayout ? barWidth : barSize,
    };
  };
}

/** Like {@link createGetBarDimensions}, but for a subsampled bucket spanning several categories. */
export function createGetBucketBarDimensions(params: {
  verticalLayout: boolean;
  xAxisConfig: ComputedAxis<ScaleName, any, ChartsXAxisProps>;
  yAxisConfig: ComputedAxis<ScaleName, any, ChartsYAxisProps>;
  series: ChartSeriesDefaultized<'bar'>;
  numberOfGroups: number;
}) {
  const { verticalLayout, xAxisConfig, yAxisConfig, series, numberOfGroups } = params;

  const baseScaleConfig = (verticalLayout ? xAxisConfig : yAxisConfig) as ComputedAxis<'band'>;
  const baseScale = baseScaleConfig.scale;
  const bandwidth = baseScale.bandwidth();
  const valueScale = verticalLayout ? yAxisConfig.scale : xAxisConfig.scale;

  return function getBucketBarDimensions(bucket: SamplingBucket, groupIndex: number) {
    const spanStart = baseScale(baseScaleConfig.data![bucket.startIndex])!;
    const spanEnd = baseScale(baseScaleConfig.data![bucket.endIndex])! + bandwidth;

    const { barWidth, offset } = getBandSize(
      spanEnd - spanStart,
      numberOfGroups,
      baseScaleConfig.barGapRatio,
    );
    const barOffset = groupIndex * (barWidth + offset);

    const valueCoordinates = [valueScale(bucket.low)!, valueScale(bucket.high)!];
    const [minValueCoord, maxValueCoord] = findMinMax(valueCoordinates).map((v) => Math.round(v));

    let barSize = maxValueCoord - minValueCoord;
    if (!series.hidden && barSize > 0) {
      barSize = Math.max(series.minBarSize, barSize);
    }

    return {
      x: verticalLayout ? spanStart + barOffset : minValueCoord,
      y: verticalLayout ? minValueCoord : spanStart + barOffset,
      height: verticalLayout ? barSize : barWidth,
      width: verticalLayout ? barWidth : barSize,
    };
  };
}
