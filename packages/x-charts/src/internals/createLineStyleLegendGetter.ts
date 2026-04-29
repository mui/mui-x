import type { SeriesLegendItemParams } from '../ChartsLegend';
import { getLabel } from './getLabel';
import type { ChartSeriesType } from '../models/seriesType/config';
import type { LegendGetter } from './plugins/corePlugins/useChartSeriesConfig';

export function createLineStyleLegendGetter<
  T extends ChartSeriesType,
>(seriesType: T): LegendGetter<T> {
  const legendGetter: LegendGetter<T> = (params) => {
    const { seriesOrder, series } = params;
    return seriesOrder.reduce((acc, seriesId) => {
      const s = series[seriesId] as any;
      const formattedLabel = getLabel(s.label, 'legend');

      if (formattedLabel === undefined) {
        return acc;
      }

      acc.push({
        type: seriesType,
        markType: s.labelMarkType,
        markShape: s.showMark ? (s.shape ?? 'circle') : undefined,
        seriesId,
        color: s.color,
        label: formattedLabel,
      });
      return acc;
    }, [] as SeriesLegendItemParams[]);
  };
  return legendGetter;
}
