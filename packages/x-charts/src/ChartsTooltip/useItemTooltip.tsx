'use client';
import { useSeries } from '../hooks/useSeries';
import { useCartesianContext } from '../context/CartesianProvider';
import { useColorProcessor } from '../context/PluginProvider/useColorProcessor';
import {
  ChartItemIdentifier,
  ChartSeriesDefaultized,
  ChartSeriesType,
  ChartsSeriesConfig,
} from '../models/seriesType/config';
import { getLabel } from '../internals/getLabel';
import { CommonSeriesType } from '../models/seriesType/common';
import { selectorChartsInteractionItem } from '../internals/plugins/featurePlugins/useChartInteraction';
import { useSelector } from '../internals/store/useSelector';
import { useStore } from '../internals/store/useStore';
import { useZAxis } from '../hooks/useZAxis';

export interface UseItemTooltipReturnValue<T extends ChartSeriesType> {
  identifier: ChartItemIdentifier<T>;
  color: string;
  label: string | undefined;
  value: ChartsSeriesConfig[T]['valueType'];
  formattedValue: string | undefined;
}

export function useItemTooltip<T extends ChartSeriesType>(): null | UseItemTooltipReturnValue<T> {
  const store = useStore();
  const item = useSelector(store, selectorChartsInteractionItem);

  const series = useSeries();

  const { xAxis, yAxis, xAxisIds, yAxisIds } = useCartesianContext();
  const { zAxis, zAxisIds } = useZAxis();
  const colorProcessors = useColorProcessor();

  const xAxisId = (series as any).xAxisId ?? xAxisIds[0];
  const yAxisId = (series as any).yAxisId ?? yAxisIds[0];
  const zAxisId = (series as any).zAxisId ?? zAxisIds[0];

  if (!item || item.dataIndex === undefined) {
    return null;
  }

  const itemSeries = series[item.type]!.series[item.seriesId] as ChartSeriesDefaultized<T>;
  const getColor =
    colorProcessors[itemSeries.type]?.(
      itemSeries as any,
      xAxisId && xAxis[xAxisId],
      yAxisId && yAxis[yAxisId],
      zAxisId && zAxis[zAxisId],
    ) ?? (() => '');

  if (itemSeries.type === 'pie') {
    const point = itemSeries.data[item.dataIndex];
    const label = getLabel(point.label, 'tooltip');
    const value = { ...point, label };
    const formattedValue = (
      itemSeries.valueFormatter as CommonSeriesType<typeof value>['valueFormatter']
    )?.(value, { dataIndex: item.dataIndex });

    return {
      identifier: item as ChartItemIdentifier<T>,
      color: getColor(item.dataIndex),
      label,
      value,
      formattedValue,
    } as UseItemTooltipReturnValue<T>;
  }

  const label = getLabel(itemSeries.label, 'tooltip');
  const value = itemSeries.data[item.dataIndex];
  const formattedValue = (
    itemSeries.valueFormatter as CommonSeriesType<typeof value>['valueFormatter']
  )?.(value, { dataIndex: item.dataIndex });

  return {
    identifier: item as ChartItemIdentifier<T>,
    color: getColor(item.dataIndex),
    label,
    value,
    formattedValue,
  } as UseItemTooltipReturnValue<T>;
}
