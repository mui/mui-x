import type { SeriesId } from '../models/seriesType/common';
import type { ChartSeriesType, ChartsSeriesConfig } from '../models/seriesType/config';
import type { ProcessedSeries } from './plugins/corePlugins/useChartSeries';

export function seriesHasData(
  series: ProcessedSeries<keyof ChartsSeriesConfig>,
  type: ChartSeriesType,
  seriesId: SeriesId,
) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment -- Sankey is added by Premium augmentation, absent in the community build.
  // @ts-ignore Sankey is added by Premium augmentation, absent in the community build.
  if (type === 'sankey') {
    return false;
  }
  const data = series[type]?.series[seriesId]?.data;
  return data != null && data.length > 0;
}
