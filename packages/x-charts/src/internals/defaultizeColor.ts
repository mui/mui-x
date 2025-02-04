import { AllSeriesType } from '../models/seriesType';

export function defaultizeColor(series: AllSeriesType, seriesIndex: number, colors: string[]) {
  if (series.type === 'pie') {
    return {
      ...series,
      data: series.data.map((d, index) => ({ color: colors[index % colors.length], ...d })),
    };
  }
  return { color: colors[seriesIndex % colors.length], ...series };
}
