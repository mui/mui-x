import { warnOnce } from '@mui/x-internals/warning';
import type { ChartsXAxisProps, ChartsYAxisProps, ComputedAxis, ScaleName } from '../models/axis';
import type { BarSeriesType } from '../models/seriesType/bar';
import type { ChartSeriesDefaultized } from '../models/seriesType/config';
import { findMinMax } from './findMinMax';
import { getBandSize } from './getBandSize';
import { getSampledBucketRegion } from './getSampledBucketRegion';

/** Minimum on-screen gap (px) kept between merged (sampled) bars so they stay distinguishable. */
const MIN_SAMPLED_BAR_GAP_PX = 2;

function shouldInvertStartCoordinate(verticalLayout: boolean, baseValue: number, reverse: boolean) {
  const isVerticalAndPositive = verticalLayout && baseValue > 0;
  const isHorizontalAndNegative = !verticalLayout && baseValue < 0;
  const invertStartCoordinate = isVerticalAndPositive || isHorizontalAndNegative;

  return reverse ? !invertStartCoordinate : invertStartCoordinate;
}

/**
 * Resolves a bar series `baseline` to a value-axis value.
 * Without `domain`, `'min'` and `'max'` resolve to `-Infinity` and `Infinity`.
 */
export function getBarBaselineValue(
  baseline: BarSeriesType['baseline'],
  domain?: readonly unknown[],
): number {
  if (baseline === 'min') {
    return domain ? Number(domain[0]) : -Infinity;
  }
  if (baseline === 'max') {
    return domain ? Number(domain[1]) : Infinity;
  }
  return baseline ?? 0;
}

/**
 * The `[start, end]` values of a bar. Bars at the stack origin (0) start at `baselineValue`.
 * In a stack, that start is clamped between 0 and the bar end so stacked bars never overlap.
 * @param {number | null} value The series value, `null` when missing or hidden.
 */
export function getBarExtent(
  stacked: readonly [number, number],
  value: number | null,
  baselineValue: number,
  isStacked: boolean,
): [number, number] {
  const low = Math.min(stacked[0], stacked[1]);
  const high = Math.max(stacked[0], stacked[1]);
  const start = value !== null && value < 0 ? high : low;
  const end = start === low ? high : low;

  if (start !== 0) {
    return [start, end];
  }
  // The diverging stack offset puts zero values at [0, 0] anywhere in the stack.
  if (value === null || (isStacked && end === 0)) {
    return [baselineValue, baselineValue];
  }
  if (!isStacked || !Number.isFinite(baselineValue)) {
    return [baselineValue, end];
  }

  const clamped = Math.min(Math.max(baselineValue, Math.min(0, end)), Math.max(0, end));
  if (process.env.NODE_ENV !== 'production' && clamped !== baselineValue) {
    warnOnce(
      [
        'MUI X Charts: A stacked bar series has a `baseline` outside the range between 0 and the value of a bar at the bottom of the stack.',
        'The bar start is clamped to that range so stacked bars do not overlap.',
        'Use a baseline between 0 and the values at the bottom of the stack, or remove the `stack` property.',
      ].join('\n'),
    );
  }
  return [clamped, end];
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
  const valueScale = verticalLayout ? yScale : xScale;
  const baselineValue = getBarBaselineValue(series.baseline, valueScale.domain());

  return function getBarDimensions(dataIndex: number, groupIndex: number) {
    const barOffset = groupIndex * (barWidth + offset);
    const baseValue = baseScaleConfig.data![dataIndex];
    const seriesValue = series.data[dataIndex];

    if (seriesValue == null) {
      return null;
    }

    const [start, end] = getBarExtent(
      series.visibleStackedData[dataIndex],
      series.hidden ? null : seriesValue,
      baselineValue,
      series.stack !== undefined,
    );
    const valueCoordinates = [valueScale(start) ?? NaN, valueScale(end) ?? NaN];

    // For example a value of 0 on a log scale.
    if (!valueCoordinates.every(Number.isFinite)) {
      return null;
    }

    const [minValueCoord, maxValueCoord] = findMinMax(valueCoordinates).map((v) => Math.round(v));

    let barSize = 0;
    if (start !== end) {
      if (!series.hidden) {
        barSize = Math.max(series.minBarSize, maxValueCoord - minValueCoord);
      }
    }

    const shouldInvert = shouldInvertStartCoordinate(
      verticalLayout,
      end - start || seriesValue,
      reverse,
    );

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

/** Like {@link createGetBarDimensions}, but for a sampled bucket spanning several categories. */
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
  const step = baseScale.step();
  const valueScale = verticalLayout ? yAxisConfig.scale : xAxisConfig.scale;

  return function getBucketBarDimensions(
    startIndex: number,
    endIndex: number,
    min: number,
    max: number,
    groupIndex: number,
  ) {
    // Region matches the axis highlight (see `getSampledBandHighlight`) so bar and highlight stay in sync.
    const { regionStart, regionSize: bucketStride } = getSampledBucketRegion(
      baseScale,
      baseScaleConfig.data!,
      startIndex,
      endIndex,
    );
    const bucketCount = endIndex - startIndex + 1;

    // Keep the gap between buckets proportional to the bucket (same ratio as an unsampled chart),
    // but never thinner than MIN_SAMPLED_BAR_GAP_PX so it stays visible at every level and zoom.
    const gap = Math.min(
      bucketStride / 2,
      Math.max(bucketCount * (step - bandwidth), MIN_SAMPLED_BAR_GAP_PX),
    );
    const { barWidth, offset } = getBandSize(
      bucketStride - gap,
      numberOfGroups,
      baseScaleConfig.barGapRatio,
    );
    // Center the bars in the region (split the gap to both sides) so they sit under the highlight.
    const barOffset = gap / 2 + groupIndex * (barWidth + offset);

    const valueCoordinates = [valueScale(min)!, valueScale(max)!];
    const [minValueCoord, maxValueCoord] = findMinMax(valueCoordinates).map((v) => Math.round(v));

    let barSize = maxValueCoord - minValueCoord;
    if (!series.hidden && barSize > 0) {
      barSize = Math.max(series.minBarSize, barSize);
    }

    return {
      x: verticalLayout ? regionStart + barOffset : minValueCoord,
      y: verticalLayout ? minValueCoord : regionStart + barOffset,
      height: verticalLayout ? barSize : barWidth,
      width: verticalLayout ? barWidth : barSize,
    };
  };
}
