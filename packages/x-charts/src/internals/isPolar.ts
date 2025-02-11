import {
  ChartSeriesType,
  PolarChartSeriesType,
  ChartSeriesDefaultized,
} from '../models/seriesType/config';
import { polarSeriesTypes } from './configInit';

export function isPolarSeriesType(seriesType: string): seriesType is PolarChartSeriesType {
  return polarSeriesTypes.getTypes().has(seriesType as PolarChartSeriesType);
}

export function isPolarSeries(
  series: ChartSeriesDefaultized<ChartSeriesType> & { getColor: (dataIndex: number) => string },
): series is ChartSeriesDefaultized<PolarChartSeriesType> & {
  getColor: (dataIndex: number) => string;
};
export function isPolarSeries(
  series: ChartSeriesDefaultized<ChartSeriesType>,
): series is ChartSeriesDefaultized<PolarChartSeriesType> {
  return isPolarSeriesType(series.type);
}
