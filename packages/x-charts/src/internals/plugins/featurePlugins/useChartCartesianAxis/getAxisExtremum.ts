import { AxisConfig } from '../../../../models';
import { CartesianChartSeriesType } from '../../../../models/seriesType/config';
import { ChartSeriesConfig } from '../../models/seriesConfig';
import { ProcessedSeries } from '../../corePlugins/useChartSeries/useChartSeries.types';
import { CartesianExtremumGetter } from '../../models/seriesConfig/extremumGetter.types';
import { ExtremumGetterResult, GetZoomAxisFilters } from './useChartCartesianAxis.types';

const axisExtremumCallback = <TSeriesType extends CartesianChartSeriesType>(
  acc: ExtremumGetterResult,
  chartType: TSeriesType,
  axis: AxisConfig,
  axisDirection: 'x' | 'y',
  seriesConfig: ChartSeriesConfig<TSeriesType>,
  axisIndex: number,
  formattedSeries: ProcessedSeries<CartesianChartSeriesType>,
  getFilters?: GetZoomAxisFilters,
): ExtremumGetterResult => {
  const getter =
    axisDirection === 'x'
      ? seriesConfig[chartType].xExtremumGetter
      : seriesConfig[chartType].yExtremumGetter;
  const series = formattedSeries[chartType]?.series ?? {};

  const [minChartTypeData, maxChartTypeData] = (getter as CartesianExtremumGetter<TSeriesType>)?.({
    series,
    axis,
    axisIndex,
    isDefaultAxis: axisIndex === 0,
    getFilters,
  }) ?? [Infinity, -Infinity];

  const [minData, maxData] = acc;

  return [Math.min(minChartTypeData, minData), Math.max(maxChartTypeData, maxData)];
};

export const getAxisExtremum = (
  axis: AxisConfig,
  axisDirection: 'x' | 'y',
  seriesConfig: ChartSeriesConfig<CartesianChartSeriesType>,
  axisIndex: number,
  formattedSeries: ProcessedSeries,
  getFilters?: GetZoomAxisFilters,
) => {
  const charTypes = Object.keys(seriesConfig) as CartesianChartSeriesType[];

  const extremums = charTypes.reduce<ExtremumGetterResult>(
    (acc, charType) =>
      axisExtremumCallback(
        acc,
        charType,
        axis,
        axisDirection,
        seriesConfig,
        axisIndex,
        formattedSeries,
        getFilters,
      ),
    [Infinity, -Infinity],
  );

  if (Number.isNaN(extremums[0]) || Number.isNaN(extremums[1])) {
    return [Infinity, -Infinity];
  }

  return extremums;
};
