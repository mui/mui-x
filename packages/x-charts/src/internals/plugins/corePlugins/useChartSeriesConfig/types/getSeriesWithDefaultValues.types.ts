import type { ChartSeries, ChartSeriesType } from '../../../../../models/seriesType/config';
import type { AllSeriesType } from '../../../../../models/seriesType';

export type GetSeriesWithDefaultValues<SeriesType extends ChartSeriesType> = (
  series: AllSeriesType<SeriesType>,
  seriesIndex: number,
  colors: readonly string[],
  theme: 'light' | 'dark',
) => ChartSeries<SeriesType>;
