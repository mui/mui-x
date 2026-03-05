import type { SeriesLegendItemParams } from '../ChartsLegend';
import type { ChartSeriesType } from '../models/seriesType/config';
import type { SeriesProcessorResult } from './plugins/corePlugins/useChartSeriesConfig/types/seriesProcessor.types';
import { getLabel } from './getLabel';

type LegendLabel = Parameters<typeof getLabel>[0];

type SeriesWithSeriesLegend = {
  label?: LegendLabel;
  labelMarkType?: SeriesLegendItemParams['markType'];
  color?: string;
};

type DataItemWithLegend = {
  id?: number | string;
  label?: LegendLabel;
  labelMarkType?: SeriesLegendItemParams['markType'];
  color?: string;
};

type SeriesWithDataLegend = {
  data: DataItemWithLegend[];
  labelMarkType?: SeriesLegendItemParams['markType'];
};

function isSeriesWithSeriesLegend(seriesItem: unknown): seriesItem is SeriesWithSeriesLegend {
  return typeof seriesItem === 'object' && seriesItem !== null && 'label' in seriesItem;
}

function isSeriesWithDataLegend(seriesItem: unknown): seriesItem is SeriesWithDataLegend {
  return (
    typeof seriesItem === 'object' &&
    seriesItem !== null &&
    'data' in seriesItem &&
    Array.isArray(seriesItem.data)
  );
}

/** One legend item per series (bar, line, scatter, rangeBar, radar). */
export function getSeriesLegendItems<T extends ChartSeriesType>(
  type: T,
  params: SeriesProcessorResult<T>,
  defaultMarkType?: SeriesLegendItemParams['markType'],
): SeriesLegendItemParams[] {
  const { seriesOrder, series } = params;
  return seriesOrder.reduce((acc, seriesId) => {
    const seriesItem = series[seriesId];
    if (!isSeriesWithSeriesLegend(seriesItem) || typeof seriesItem.color !== 'string') {
      return acc;
    }
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
    const seriesItem = series[seriesId];
    if (!isSeriesWithDataLegend(seriesItem)) {
      return acc;
    }
    seriesItem.data.forEach((item, dataIndex: number) => {
      if (typeof item.color !== 'string') {
        return;
      }
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
