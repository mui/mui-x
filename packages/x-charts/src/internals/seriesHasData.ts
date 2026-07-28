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
  // @ts-ignore treemap is not in MIT version
  if (type === 'treemap') {
    // The layout always emits the root node, so root-only (length 1) counts as empty.
    // @ts-ignore treemap data is a layout object, not an array
    return (series[type]?.series[seriesId]?.data?.nodes?.length ?? 0) > 1;
  }
  const data = series[type]?.series[seriesId]?.data;
  return data != null && data.length > 0;
}
