import {
  type CartesianChartSeriesType,
  type ChartSeriesDefaultized,
  type ChartSeriesType,
} from '../models/seriesType/config';
import { cartesianSeriesTypes } from './configInit';

export function isCartesianSeriesType(seriesType: string): seriesType is CartesianChartSeriesType {
  return cartesianSeriesTypes.getTypes().has(seriesType as CartesianChartSeriesType);
}

export function isCartesianSeries(
  series: ChartSeriesDefaultized<ChartSeriesType>,
): series is ChartSeriesDefaultized<CartesianChartSeriesType> {
  return isCartesianSeriesType(series.type);
}
