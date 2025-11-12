import { ComputedAxis, D3Scale } from '../models/axis';
import { ChartSeriesDefaultized } from '../models/seriesType/config';
import { getBandSize } from '../internals/getBandSize';

export function getBarDimensions(params: {
  verticalLayout: boolean;
  reverse: boolean;
  bandAxis: ComputedAxis<'band'>;
  xScale: D3Scale;
  yScale: D3Scale;
  series: ChartSeriesDefaultized<'bar'>;
  dataIndex: number;
  numberOfGroups: number;
  groupIndex: number;
}) {
  const {
    verticalLayout,
    reverse,
    bandAxis,
    xScale,
    yScale,
    series,
    dataIndex,
    numberOfGroups,
    groupIndex,
  } = params;

  const { barWidth, offset } = getBandSize(
    bandAxis.scale.bandwidth(),
    numberOfGroups,
    bandAxis.barGapRatio,
  );
  const barOffset = groupIndex * (barWidth + offset);

  const baseValue = bandAxis.data![dataIndex];
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

function shouldInvertStartCoordinate(verticalLayout: boolean, baseValue: number, reverse: boolean) {
  const isVerticalAndPositive = verticalLayout && baseValue > 0;
  const isHorizontalAndNegative = !verticalLayout && baseValue < 0;
  const invertStartCoordinate = isVerticalAndPositive || isHorizontalAndNegative;

  return reverse ? !invertStartCoordinate : invertStartCoordinate;
}
