import {
  ChartSeriesType,
  CartesianChartSeriesType,
  ChartSeriesDefaultized,
} from '../models/seriesType/config';
import { cartesianSeriesTypes } from './configInit';
import { ColorGetter } from './plugins/models/seriesConfig/colorProcessor.types';

export function isCartesianSeriesType(seriesType: string): seriesType is CartesianChartSeriesType {
  return cartesianSeriesTypes.getTypes().has(seriesType as CartesianChartSeriesType);
}

export function isCartesianSeries(
  series: ChartSeriesDefaultized<ChartSeriesType> & { getColor: ColorGetter<ChartSeriesType> },
): series is ChartSeriesDefaultized<CartesianChartSeriesType> & {
  getColor: ColorGetter<ChartSeriesType>;
};
export function isCartesianSeries(
  series: ChartSeriesDefaultized<ChartSeriesType>,
): series is ChartSeriesDefaultized<CartesianChartSeriesType> {
  return isCartesianSeriesType(series.type);
}
