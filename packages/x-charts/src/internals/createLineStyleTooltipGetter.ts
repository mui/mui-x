import { getLabel } from './getLabel';
import type { ChartSeriesType } from '../models/seriesType/config';
import type { TooltipGetter } from './plugins/corePlugins/useChartSeriesConfig';

export function createLineStyleTooltipGetter<
  T extends ChartSeriesType,
>(): TooltipGetter<T> {
  return ((params: any) => {
    const { series, getColor, identifier } = params;

    if (!identifier || identifier.dataIndex === undefined) {
      return null;
    }

    const label = getLabel(series.label, 'tooltip');
    const value = series.data[identifier.dataIndex];
    const formattedValue = series.valueFormatter(value, { dataIndex: identifier.dataIndex });

    return {
      identifier,
      color: getColor(identifier.dataIndex),
      label,
      value,
      formattedValue,
      markType: series.labelMarkType,
      markShape: series.showMark ? series.shape : undefined,
    };
  }) as TooltipGetter<T>;
}
