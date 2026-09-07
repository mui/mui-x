import type { LegendItemParams, SeriesLegendItemContext } from './legendContext.types';

export const seriesContextBuilder = (context: LegendItemParams): SeriesLegendItemContext =>
  ({
    type: 'series',
    color: context.color,
    label: context.label,
    seriesId: context.seriesId!,
    dataIndex: context.dataIndex,
  }) as const;
