import {
  ChartSeriesType,
  PolarChartSeriesType,
  ChartSeriesDefaultized,
} from '../models/seriesType/config';
import { polarSeriesTypes } from './configInit';
import { ColorGetter } from './plugins/models/seriesConfig/colorProcessor.types';

export function isPolarSeriesType(seriesType: string): seriesType is PolarChartSeriesType {
  return polarSeriesTypes.getTypes().has(seriesType as PolarChartSeriesType);
}

export function isPolarSeries(
  series: ChartSeriesDefaultized<ChartSeriesType> & { getColor: ColorGetter<ChartSeriesType> },
): series is ChartSeriesDefaultized<PolarChartSeriesType> & {
  getColor: ColorGetter<ChartSeriesType>;
};
export function isPolarSeries(
  series: ChartSeriesDefaultized<ChartSeriesType>,
): series is ChartSeriesDefaultized<PolarChartSeriesType> {
  return isPolarSeriesType(series.type);
}
