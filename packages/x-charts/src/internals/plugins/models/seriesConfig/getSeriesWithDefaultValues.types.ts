import type { ChartSeries, ChartSeriesType } from '../../../../models/seriesType/config';
import type { AllSeriesType } from '../../../../models/seriesType';

export type GetSeriesWithDefaultValues<T extends ChartSeriesType> = (
  series: AllSeriesType<T>,
  seriesIndex: number,
  colors: string[],
) => ChartSeries<T>;
