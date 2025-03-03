import { AxisConfig } from '../../../../models';
import { CartesianChartSeriesType } from '../../../../models/seriesType/config';
import { ChartSeriesConfig } from '../../models/seriesConfig';
import { ProcessedSeries } from '../../corePlugins/useChartSeries/useChartSeries.types';
import {
  CartesianExtremumGetter,
  CartesianExtremumGetterResult,
} from '../../models/seriesConfig/cartesianExtremumGetter.types';
import { GetZoomAxisFilters } from './zoom.types';
import { isCartesianSeriesType } from '../../../isCartesian';

const axisExtremumCallback = <TSeriesType extends CartesianChartSeriesType>(
  acc: CartesianExtremumGetterResult,
  chartType: TSeriesType,
  axis: AxisConfig,
  axisDirection: 'x' | 'y',
  seriesConfig: ChartSeriesConfig<TSeriesType>,
  axisIndex: number,
  formattedSeries: ProcessedSeries<TSeriesType>,
  getFilters?: GetZoomAxisFilters,
): CartesianExtremumGetterResult => {
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

export const getAxisExtremum = <T extends CartesianChartSeriesType>(
  axis: AxisConfig,
  axisDirection: 'x' | 'y',
  seriesConfig: ChartSeriesConfig<T>,
  axisIndex: number,
  formattedSeries: ProcessedSeries<T>,
  getFilters?: GetZoomAxisFilters,
) => {
  const charTypes = Object.keys(seriesConfig).filter(isCartesianSeriesType);

  const extremums = charTypes.reduce<CartesianExtremumGetterResult>(
    (acc, charType) =>
      axisExtremumCallback(
        acc,
        charType as T,
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
