import { AxisConfig } from '../../../../models/axis';
import { PolarChartSeriesType } from '../../../../models/seriesType/config';
import { ChartSeriesConfig } from '../../models/seriesConfig';
import { ProcessedSeries } from '../../corePlugins/useChartSeries/useChartSeries.types';
import { PolarExtremumGetterResult } from '../../models/seriesConfig/polarExtremumGetter.types';
import { isPolarSeriesType } from '../../../isPolar';

const axisExtremumCallback = <TSeriesType extends PolarChartSeriesType>(
  acc: PolarExtremumGetterResult,
  chartType: TSeriesType,
  axis: AxisConfig,
  axisDirection: 'rotation' | 'radius',
  seriesConfig: ChartSeriesConfig<TSeriesType>,
  axisIndex: number,
  formattedSeries: ProcessedSeries<TSeriesType>,
): PolarExtremumGetterResult => {
  const getter =
    axisDirection === 'rotation'
      ? seriesConfig[chartType].rotationExtremumGetter
      : seriesConfig[chartType].radiusExtremumGetter;
  const series = formattedSeries[chartType]?.series ?? {};

  const [minChartTypeData, maxChartTypeData] = getter?.({
    series,
    axis,
    axisIndex,
    isDefaultAxis: axisIndex === 0,
  }) ?? [Infinity, -Infinity];

  const [minData, maxData] = acc;

  return [Math.min(minChartTypeData, minData), Math.max(maxChartTypeData, maxData)];
};

export const getAxisExtremum = <TSeriesType extends PolarChartSeriesType>(
  axis: AxisConfig,
  axisDirection: 'rotation' | 'radius',
  seriesConfig: ChartSeriesConfig<TSeriesType>,
  axisIndex: number,
  formattedSeries: ProcessedSeries<TSeriesType>,
) => {
  const polarSeriesTypes = Object.keys(seriesConfig).filter(isPolarSeriesType);

  const extremums = polarSeriesTypes.reduce<PolarExtremumGetterResult>(
    (acc, charType) =>
      axisExtremumCallback(
        acc,
        charType as TSeriesType,
        axis,
        axisDirection,
        seriesConfig,
        axisIndex,
        formattedSeries,
      ),
    [Infinity, -Infinity],
  );

  if (Number.isNaN(extremums[0]) || Number.isNaN(extremums[1])) {
    return [Infinity, -Infinity];
  }

  return extremums;
};
