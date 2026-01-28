import { type LegendItemParams, type SeriesLegendItemContext } from './legendContext.types';

export const seriesContextBuilder = (context: LegendItemParams): SeriesLegendItemContext =>
  ({
    type: 'series',
    color: context.color,
    label: context.label,
    seriesId: context.seriesId!,
    itemId: context.itemId,
    dataIndex: context.dataIndex,
  }) as const;
