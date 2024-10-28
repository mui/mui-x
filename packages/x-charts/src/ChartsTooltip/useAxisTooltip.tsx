'use client';
import * as React from 'react';
import { AxisInteractionData, InteractionContext } from '../context/InteractionProvider';
import { useSeries } from '../hooks/useSeries';
import { useCartesianContext } from '../context/CartesianProvider';
import { ZAxisContext } from '../context/ZAxisContextProvider';
import { useColorProcessor } from '../context/PluginProvider/useColorProcessor';
import { SeriesId } from '../models/seriesType/common';
import { CartesianChartSeriesType, ChartsSeriesConfig } from '../models/seriesType/config';
import { getLabel } from '../internals/getLabel';
import { isCartesianSeriesType } from '../internals/isCartesian';
import { utcFormatter } from './utils';

export interface UseAxisTooltipReturnValue<
  SeriesT extends CartesianChartSeriesType = CartesianChartSeriesType,
  AxisValueT extends string | number | Date = string | number | Date,
> {
  identifier: AxisInteractionData;
  seriesItems: SeriesItem<SeriesT>[];
  axisValue: AxisValueT;
  axisFormattedValue: string;
}

interface SeriesItem<T extends CartesianChartSeriesType> {
  seriesId: SeriesId;
  color: string;
  value: ChartsSeriesConfig[T]['valueType'];
  formattedValue: string;
  formattedLabel: string | null;
}

export function useAxisTooltip(): null | UseAxisTooltipReturnValue {
  const { axis } = React.useContext(InteractionContext);
  const series = useSeries();

  const { xAxis, yAxis, xAxisIds, yAxisIds } = useCartesianContext();
  const { zAxis, zAxisIds } = React.useContext(ZAxisContext);
  const colorProcessors = useColorProcessor();

  // By default use the x-axis
  const isXaxis = axis.x !== null && axis.x.index !== -1;

  const axisData = isXaxis ? axis.x && axis.x : axis.y && axis.y;

  if (axisData === null) {
    return null;
  }

  const { index: dataIndex, value: axisValue } = axisData;

  const USED_AXIS_ID = isXaxis ? xAxisIds[0] : yAxisIds[0];
  const usedAxis = isXaxis ? xAxis[USED_AXIS_ID] : yAxis[USED_AXIS_ID];

  const relevantSeries = Object.keys(series)
    .filter(isCartesianSeriesType)
    .flatMap(<SeriesT extends CartesianChartSeriesType>(seriesType: SeriesT) => {
      const seriesOfType = series[seriesType];
      if (!seriesOfType) {
        return [];
      }
      return seriesOfType.seriesOrder.map((seriesId) => {
        const seriesToAdd = seriesOfType.series[seriesId]!;

        const providedXAxisId = seriesToAdd.xAxisId ?? seriesToAdd.xAxisKey;
        const providedYAxisId = seriesToAdd.yAxisId ?? seriesToAdd.yAxisKey;

        const axisKey = isXaxis ? providedXAxisId : providedYAxisId;

        // Test if the series uses the default axis
        if (axisKey === undefined || axisKey === USED_AXIS_ID) {
          const xAxisId = providedXAxisId ?? xAxisIds[0];
          const yAxisId = providedYAxisId ?? yAxisIds[0];
          const zAxisId =
            (seriesToAdd as any).zAxisId ?? (seriesToAdd as any).zAxisKey ?? zAxisIds[0];

          const color =
            colorProcessors[seriesType]?.(
              seriesToAdd,
              xAxis[xAxisId],
              yAxis[yAxisId],
              zAxisId && zAxis[zAxisId],
            )(dataIndex) ?? '';

          const value = seriesToAdd.data[dataIndex] ?? null;
          const formattedValue = (seriesToAdd.valueFormatter as any)(value, {
            dataIndex,
          });
          const formattedLabel = getLabel(seriesToAdd.label, 'tooltip') ?? null;

          return {
            seriesId,
            color,
            value,
            formattedValue,
            formattedLabel,
          } as SeriesItem<SeriesT>;
        }
        return undefined;
      });
    })
    .filter((item) => item != null);

  const axisFormatter =
    usedAxis.valueFormatter ??
    ((v: string | number | Date) =>
      usedAxis.scaleType === 'utc' ? utcFormatter(v) : v.toLocaleString());

  const axisFormattedValue = axisFormatter(axisValue, { location: 'tooltip' });

  return {
    identifier: axis as AxisInteractionData,
    seriesItems: relevantSeries,
    axisValue,
    axisFormattedValue,
  };
}
