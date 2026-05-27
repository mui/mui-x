import {
  type ChartSeriesType,
  type ChartSeriesDefaultized,
  type PolarChartSeriesType,
} from '../models/seriesType/config';
import { polarSeriesTypes } from './configInit';

export function isPolarSeriesType(seriesType: string): seriesType is PolarChartSeriesType {
  return polarSeriesTypes.getTypes().has(seriesType as PolarChartSeriesType);
}

export function isPolarSeries(
  series: ChartSeriesDefaultized<ChartSeriesType>,
): series is ChartSeriesDefaultized<PolarChartSeriesType> {
  return isPolarSeriesType(series.type);
}
