'use client';
import * as React from 'react';
import { InteractionContext, ItemInteractionData } from '../context/InteractionProvider';
import { useSeries } from '../hooks/useSeries';
import { useCartesianContext } from '../context/CartesianProvider';
import { ZAxisContext } from '../context/ZAxisContextProvider';
import { useColorProcessor } from '../context/PluginProvider/useColorProcessor';
import {
  ChartSeriesDefaultized,
  ChartSeriesType,
  ChartsSeriesConfig,
} from '../models/seriesType/config';
import { getLabel } from '../internals/getLabel';
import { CommonSeriesType } from '../models/seriesType/common';

export interface UseItemTooltipReturnValue<T extends ChartSeriesType> {
  identifier: ItemInteractionData<T>;
  color: string;
  label: string | undefined;
  value: ChartsSeriesConfig[T]['valueType'];
  formattedValue: string | undefined;
}

export function useItemTooltip<T extends ChartSeriesType>(): null | UseItemTooltipReturnValue<T> {
  const { item } = React.useContext(InteractionContext);
  const series = useSeries();

  const { xAxis, yAxis, xAxisIds, yAxisIds } = useCartesianContext();
  const { zAxis, zAxisIds } = React.useContext(ZAxisContext);
  const colorProcessors = useColorProcessor();

  const xAxisId = (series as any).xAxisId ?? (series as any).xAxisKey ?? xAxisIds[0];
  const yAxisId = (series as any).yAxisId ?? (series as any).yAxisKey ?? yAxisIds[0];
  const zAxisId = (series as any).zAxisId ?? (series as any).zAxisKey ?? zAxisIds[0];

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
      identifier: item as ItemInteractionData<T>,
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
    identifier: item as ItemInteractionData<T>,
    color: getColor(item.dataIndex),
    label,
    value,
    formattedValue,
  } as UseItemTooltipReturnValue<T>;
}
