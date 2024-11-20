'use client';
import * as React from 'react';
import { useSeries } from '../hooks/useSeries';
import { useCartesianContext } from '../context/CartesianProvider';
import { ZAxisContext } from '../context/ZAxisContextProvider';
import { useColorProcessor } from '../context/PluginProvider/useColorProcessor';
import { SeriesId } from '../models/seriesType/common';
import { CartesianChartSeriesType, ChartsSeriesConfig } from '../models/seriesType/config';
import { useStore } from '../internals/useStore';
import { useSelector } from '../internals/useSelector';
import { getLabel } from '../internals/getLabel';
import { isCartesianSeriesType } from '../internals/isCartesian';
import { utcFormatter } from './utils';
import { useXAxis, useYAxis } from '../hooks/useAxis';
import {
  selectorChartsInteractionXAxis,
  selectorChartsInteractionYAxis,
} from '../context/InteractionSelectors';

export interface UseAxisTooltipReturnValue<
  SeriesT extends CartesianChartSeriesType = CartesianChartSeriesType,
  AxisValueT extends string | number | Date = string | number | Date,
> {
  axisDirection: 'x' | 'y';
  dataIndex: number;
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
  const defaultXAxis = useXAxis();
  const defaultYAxis = useYAxis();

  const xAxisHasData = defaultXAxis.data !== undefined && defaultXAxis.data.length !== 0;

  const store = useStore();
  const axisData = useSelector(
    store,
    xAxisHasData ? selectorChartsInteractionXAxis : selectorChartsInteractionYAxis,
  );

  const series = useSeries();

  const { xAxis, yAxis } = useCartesianContext();

  const { zAxis, zAxisIds } = React.useContext(ZAxisContext);
  const colorProcessors = useColorProcessor();

  if (axisData === null) {
    return null;
  }

  const { index: dataIndex, value: axisValue } = axisData;

  const USED_AXIS_ID = xAxisHasData ? defaultXAxis.id : defaultYAxis.id;
  const usedAxis = xAxisHasData ? defaultXAxis : defaultYAxis;

  const relevantSeries = Object.keys(series)
    .filter(isCartesianSeriesType)
    .flatMap(<SeriesT extends CartesianChartSeriesType>(seriesType: SeriesT) => {
      const seriesOfType = series[seriesType];
      if (!seriesOfType) {
        return [];
      }
      return seriesOfType.seriesOrder.map((seriesId) => {
        const seriesToAdd = seriesOfType.series[seriesId]!;

        const providedXAxisId = seriesToAdd.xAxisId;
        const providedYAxisId = seriesToAdd.yAxisId;

        const axisKey = xAxisHasData ? providedXAxisId : providedYAxisId;

        // Test if the series uses the default axis
        if (axisKey === undefined || axisKey === USED_AXIS_ID) {
          const xAxisId = providedXAxisId ?? defaultXAxis.id;
          const yAxisId = providedYAxisId ?? defaultYAxis.id;
          const zAxisId = 'zAxisId' in seriesToAdd ? seriesToAdd.zAxisId : zAxisIds[0];

          const color =
            colorProcessors[seriesType]?.(
              seriesToAdd,
              xAxis[xAxisId],
              yAxis[yAxisId],
              zAxisId ? zAxis[zAxisId] : undefined,
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
    axisDirection: xAxisHasData ? 'x' : 'y',
    dataIndex,
    seriesItems: relevantSeries,
    axisValue,
    axisFormattedValue,
  };
}
