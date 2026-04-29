import { getLabel } from './getLabel';
import type { ChartSeriesType, ChartsSeriesConfig } from '../models/seriesType/config';
import type { TooltipGetter } from './plugins/corePlugins/useChartSeriesConfig';

/**
 * Series types whose item identifier includes `dataIndex`.
 * Excludes heatmap (xIndex/yIndex) and sankey (nodeId/linkIndex).
 */
type SeriesTypeWithDataIndex = {
  [T in ChartSeriesType]: ChartsSeriesConfig[T]['itemIdentifier'] extends {
    dataIndex?: number;
  }
    ? T
    : never;
}[ChartSeriesType];

export function createLineStyleTooltipGetter<
  T extends SeriesTypeWithDataIndex,
>(): TooltipGetter<T> {
  return ((params: Parameters<TooltipGetter<T>>[0]) => {
    const { series, getColor, identifier } = params;

    if (!identifier || !('dataIndex' in identifier) || identifier.dataIndex === undefined) {
      return null;
    }

    const { dataIndex } = identifier;

    const label = 'label' in series ? getLabel(series.label, 'tooltip') : undefined;
    const value = 'data' in series ? (series.data as readonly unknown[])[dataIndex] : null;
    const formattedValue =
      'valueFormatter' in series
        ? (series.valueFormatter as (v: unknown, ctx: { dataIndex: number }) => string | null)(
            value,
            { dataIndex },
          )
        : null;

    let markShape: string | undefined;
    if ('showMark' in series && series.showMark) {
      markShape = 'shape' in series ? ((series.shape as string) ?? 'circle') : 'circle';
    }

    return {
      identifier,
      color: (getColor as (i: number) => string)(dataIndex),
      label,
      value,
      formattedValue,
      markType: 'labelMarkType' in series ? series.labelMarkType : undefined,
      markShape,
    };
  }) as TooltipGetter<T>;
}
