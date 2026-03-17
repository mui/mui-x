import { type AxisConfig } from '../../../../models';
import { type CartesianChartSeriesType } from '../../../../models/seriesType/config';
import {
  type ChartSeriesConfig,
  type CartesianExtremumGetter,
  type CartesianExtremumGetterResult,
} from '../../corePlugins/useChartSeriesConfig';
import { type ProcessedSeries } from '../../corePlugins/useChartSeries/useChartSeries.types';
import { type GetZoomAxisFilters } from './zoom.types';
import { isCartesianSeriesType } from '../../../isCartesian';

const axisExtremumCallback = <TSeriesType extends CartesianChartSeriesType>(
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

  return (
    (getter as CartesianExtremumGetter<TSeriesType>)?.({
      series,
      axis,
      axisIndex,
      isDefaultAxis: axisIndex === 0,
      getFilters,
    }) ?? [Infinity, -Infinity]
  );
};

export function getAxisExtrema<T extends CartesianChartSeriesType>(
  axis: AxisConfig,
  axisDirection: 'x' | 'y',
  seriesConfig: ChartSeriesConfig<T>,
  axisIndex: number,
  formattedSeries: ProcessedSeries<T>,
  getFilters?: GetZoomAxisFilters,
): [number, number] {
  const cartesianChartTypes = Object.keys(seriesConfig).filter(isCartesianSeriesType);

  let extrema: [number, number] = [Infinity, -Infinity];

  for (const chartType of cartesianChartTypes) {
    const [min, max] = axisExtremumCallback<T>(
      chartType as T,
      axis,
      axisDirection,
      seriesConfig,
      axisIndex,
      formattedSeries,
      getFilters,
    );

    extrema = [Math.min(extrema[0], min), Math.max(extrema[1], max)];
  }

  if (Number.isNaN(extrema[0]) || Number.isNaN(extrema[1])) {
    return [Infinity, -Infinity];
  }

  return extrema;
}
