import { AllSeriesType } from '../models/seriesType';
import { ChartSeriesType } from '../models/seriesType/config';

export function defaultizeColorPerSeries<T extends ChartSeriesType>(
  series: AllSeriesType<T>,
  seriesIndex: number,
  colors: string[],
) {
  return { color: colors[seriesIndex % colors.length], ...series };
}

export function defaultizeColorPerSeriesItem<T extends 'pie'>(
  series: AllSeriesType<T>,
  colors: string[],
) {
  return {
    ...series,
    data: series.data?.map((d, index) => ({ color: colors[index % colors.length], ...d })),
  };
}
