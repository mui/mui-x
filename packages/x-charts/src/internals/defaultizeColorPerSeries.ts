import { AllSeriesType } from '../models/seriesType';
import { ChartSeriesType } from '../models/seriesType/config';

export function defaultizeColorPerSeries<T extends ChartSeriesType>(
  series: AllSeriesType<T>,
  seriesIndex: number,
  colors: string[],
) {
  return { color: colors[seriesIndex % colors.length], ...series };
}
