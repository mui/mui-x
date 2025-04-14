import { PolarChartSeriesType } from '../models/seriesType/config';
import { polarSeriesTypes } from './configInit';

export function isPolarSeriesType(seriesType: string): seriesType is PolarChartSeriesType {
  return polarSeriesTypes.getTypes().has(seriesType as PolarChartSeriesType);
}
