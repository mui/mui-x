import {
  CartesianChartSeriesType,
  ChartSeriesDefaultized,
  ChartSeriesType,
} from '../models/seriesType/config';
import { cartesianSeriesTypes } from './configInit';

export function isCartesianSeriesType(seriesType: string): seriesType is CartesianChartSeriesType {
  return cartesianSeriesTypes.getTypes().has(seriesType as CartesianChartSeriesType);
}

export function isCartesianSeries<T extends ChartSeriesType>(
  series: ChartSeriesDefaultized<T>,
): series is T extends CartesianChartSeriesType ? ChartSeriesDefaultized<T> : never {
  return isCartesianSeriesType(series.type);
}
