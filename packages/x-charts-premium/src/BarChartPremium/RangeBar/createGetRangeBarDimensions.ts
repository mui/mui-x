import {
  getBandSize,
  type ChartSeriesDefaultized,
  type ChartsXAxisProps,
  type ChartsYAxisProps,
  type ComputedAxis,
  type ScaleName,
} from '@mui/x-charts/internals';

export function createGetRangeBarDimensions(params: {
  verticalLayout: boolean;
  xAxisConfig: ComputedAxis<ScaleName, any, ChartsXAxisProps>;
  yAxisConfig: ComputedAxis<ScaleName, any, ChartsYAxisProps>;
  series: ChartSeriesDefaultized<'rangeBar'>;
  numberOfGroups: number;
}) {
  const { verticalLayout, xAxisConfig, yAxisConfig, series, numberOfGroups } = params;

  const baseScaleConfig = (verticalLayout ? xAxisConfig : yAxisConfig) as ComputedAxis<'band'>;

  const xScale = xAxisConfig.scale;
  const yScale = yAxisConfig.scale;

  const bandWidth = baseScaleConfig.scale.bandwidth();

  const { barWidth, offset } = getBandSize(bandWidth, numberOfGroups, baseScaleConfig.barGapRatio);

  return function getBarDimensions(dataIndex: number, groupIndex: number) {
    const barOffset = groupIndex * (barWidth + offset);

    const baseValue = baseScaleConfig.data![dataIndex];
    const seriesValue = series.data[dataIndex];

    if (seriesValue == null) {
      return null;
    }

    const valueCoordinates = seriesValue.map((v) => (verticalLayout ? yScale(v)! : xScale(v)!));

    const minValueCoord = Math.round(Math.min(...valueCoordinates));
    const maxValueCoord = Math.round(Math.max(...valueCoordinates));

    const barSize = maxValueCoord - minValueCoord;

    return {
      x: verticalLayout ? xScale(baseValue)! + barOffset : minValueCoord,
      y: verticalLayout ? minValueCoord : yScale(baseValue)! + barOffset,
      height: verticalLayout ? barSize : barWidth,
      width: verticalLayout ? barWidth : barSize,
    };
  };
}
