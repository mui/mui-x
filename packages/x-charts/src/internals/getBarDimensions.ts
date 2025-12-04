import type { ScaleName, ChartsXAxisProps, ChartsYAxisProps } from '../models';
import type { ComputedAxis } from '../models/axis';
import type { ChartSeriesDefaultized } from '../models/seriesType/config';
import { findMinMax } from './findMinMax';
import { getBandSize } from './getBandSize';
import type { IsIdentifierVisibleFunction } from './plugins/featurePlugins/useChartVisibilityManager';

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
isItemVisible: IsIdentifierVisibleFunction;
}) {
  const {
    verticalLayout,
    xAxisConfig,
    yAxisConfig,
    series,
    dataIndex,
    numberOfGroups,
    groupIndex,
    isItemVisible,
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

  const visibleValues = series.visibleStackedData[dataIndex];
  const visibleValueCoordinates = visibleValues.map((v) =>
    verticalLayout ? yScale(v)! : xScale(v)!,
  );

  const [visibleMinValueCoord, visibleMaxValueCoord] = findMinMax(visibleValueCoordinates);

  const isVisible = isItemVisible(`${series.id}`);

  let barSize = 0;
  if (seriesValue !== 0) {
    if (isVisible) {
      barSize = Math.max(series.minBarSize, visibleMaxValueCoord - visibleMinValueCoord);
    }
  }

  const shouldInvert = shouldInvertStartCoordinate(verticalLayout, seriesValue, reverse);

  let startCoordinate = 0;

  if (shouldInvert) {
    startCoordinate = visibleMaxValueCoord - barSize;
  } else {
    startCoordinate = visibleMinValueCoord;
  }

  return {
    x: verticalLayout ? xScale(baseValue)! + barOffset : startCoordinate,
    y: verticalLayout ? startCoordinate : yScale(baseValue)! + barOffset,
    height: verticalLayout ? barSize : barWidth,
    width: verticalLayout ? barWidth : barSize,
  };
}