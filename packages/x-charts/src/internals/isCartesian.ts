import { CartesianChartSeriesType } from '../models/seriesType/config';
import { cartesianSeriesTypes } from './configInit';

export function isCartesianSeriesType(seriesType: string): seriesType is CartesianChartSeriesType {
  return cartesianSeriesTypes.getTypes().has(seriesType as CartesianChartSeriesType);
}
