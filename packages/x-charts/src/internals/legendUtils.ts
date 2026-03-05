import type { SeriesLegendItemParams } from '../ChartsLegend';
import type { ChartSeriesType } from '../models/seriesType/config';
import type { SeriesProcessorResult } from './plugins/corePlugins/useChartSeriesConfig/types/seriesProcessor.types';
import { getLabel } from './getLabel';

/** One legend item per series (bar, line, scatter, rangeBar, radar). */
export function getSeriesLegendItems<T extends ChartSeriesType>(
  type: T,
  params: SeriesProcessorResult<T>,
  defaultMarkType?: string,
): SeriesLegendItemParams[] {
  const { seriesOrder, series } = params;
  return seriesOrder.reduce((acc, seriesId) => {
    const seriesItem = series[seriesId] as any;
    const formattedLabel = getLabel(seriesItem.label, 'legend');
    if (formattedLabel === undefined) {
      return acc;
    }
    acc.push({
      type,
      markType: seriesItem.labelMarkType ?? defaultMarkType,
      seriesId,
      color: seriesItem.color,
      label: formattedLabel,
    });
    return acc;
  }, [] as SeriesLegendItemParams[]);
}

/** One legend item per data item (pie, funnel). */
export function getDataItemLegendItems<T extends ChartSeriesType>(
  type: T,
  params: SeriesProcessorResult<T>,
): SeriesLegendItemParams[] {
  const { seriesOrder, series } = params;
  return seriesOrder.reduce((acc, seriesId) => {
    const seriesItem = series[seriesId] as any;
    seriesItem.data.forEach((item: any, dataIndex: number) => {
      const formattedLabel = getLabel(item.label, 'legend');
      if (formattedLabel === undefined) {
        return;
      }
      acc.push({
        type,
        markType: item.labelMarkType ?? seriesItem.labelMarkType,
        seriesId,
        itemId: item.id ?? dataIndex,
        dataIndex,
        color: item.color,
        label: formattedLabel,
      });
    });
    return acc;
  }, [] as SeriesLegendItemParams[]);
}
