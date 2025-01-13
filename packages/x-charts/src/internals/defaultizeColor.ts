import { AllSeriesType } from '../models/seriesType';

const DEFAULT_COLORS = [
  '#1f77b4',
  '#ff7f0e',
  '#2ca02c',
  '#d62728',
  '#9467bd',
  '#8c564b',
  '#e377c2',
  '#7f7f7f',
  '#bcbd22',
  '#17becf',
];

export function defaultizeColor(
  series: AllSeriesType,
  seriesIndex: number,
  colors = DEFAULT_COLORS,
) {
  if (
    series.type === 'pie' ||
    // @ts-expect-error funnel is a pro feature
    series.type === 'funnel'
  ) {
    return {
      ...series,
      data: series.data.map((d, index) => ({ color: colors[index % colors.length], ...d })),
    };
  }
  return { color: colors[seriesIndex % colors.length], ...series };
}
