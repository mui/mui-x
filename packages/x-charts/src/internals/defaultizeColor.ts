import { AllSeriesType } from '../models/seriesType';

export function defaultizeColor<T extends AllSeriesType>(
  series: T,
  seriesIndex: number,
  colors: string[],
): T {
  if (
    series.type === 'pie' ||
    // @ts-ignore funnel is a pro feature
    series.type === 'funnel'
  ) {
    return {
      ...series,
      // @ts-ignore it complains on pro package that it might be undefined
      data: series.data.map((d, index) => ({ color: colors[index % colors.length], ...d })),
    };
  }
  return { color: colors[seriesIndex % colors.length], ...series };
}
