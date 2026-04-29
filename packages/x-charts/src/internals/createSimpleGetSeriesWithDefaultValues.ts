import type { ChartSeriesType } from '../models/seriesType/config';
import type { GetSeriesWithDefaultValues } from './plugins/corePlugins/useChartSeriesConfig';

export function createSimpleGetSeriesWithDefaultValues<
  T extends ChartSeriesType,
>(): GetSeriesWithDefaultValues<T> {
  return ((seriesData: any, seriesIndex: number, colors: readonly string[]) => ({
    ...seriesData,
    id: seriesData.id ?? `auto-generated-id-${seriesIndex}`,
    color: seriesData.color ?? colors[seriesIndex % colors.length],
  })) as GetSeriesWithDefaultValues<T>;
}
