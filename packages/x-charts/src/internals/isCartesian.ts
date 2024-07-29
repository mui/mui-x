import {
  ChartSeriesType,
  CartesianChartSeriesType,
  ChartSeriesDefaultized,
} from '../models/seriesType/config';
import { cartesianSeriesTypes } from './configInit';

export function isCartesianSeriesType(seriesType: string): seriesType is CartesianChartSeriesType {
  return cartesianSeriesTypes.getTypes().has(seriesType as ChartSeriesType);
}

export function isCartesianSeries(
  series: ChartSeriesDefaultized<ChartSeriesType> & { getColor: (dataIndex: number) => string },
): series is ChartSeriesDefaultized<CartesianChartSeriesType> & {
  getColor: (dataIndex: number) => string;
};
export function isCartesianSeries(
  series: ChartSeriesDefaultized<ChartSeriesType>,
): series is ChartSeriesDefaultized<CartesianChartSeriesType> {
  return isCartesianSeriesType(series.type);
}
