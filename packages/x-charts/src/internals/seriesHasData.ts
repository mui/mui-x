import type { SeriesId } from '../models/seriesType/common';
import type { ChartSeriesType, ChartsSeriesConfig } from '../models/seriesType/config';
import type { ProcessedSeries } from './plugins/corePlugins/useChartSeries';

export function seriesHasData(
  series: ProcessedSeries<keyof ChartsSeriesConfig>,
  type: ChartSeriesType,
  seriesId: SeriesId,
) {
  // @ts-ignore sankey is not in MIT version
  if (type === 'sankey') {
    return false;
  }
  const data = series[type]?.series[seriesId]?.data;
  return data != null && data.length > 0;
}
