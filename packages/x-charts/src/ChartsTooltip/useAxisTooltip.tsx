'use client';
import { useSeries } from '../hooks/useSeries';
import { useColorProcessor } from '../internals/plugins/corePlugins/useChartSeries/useColorProcessor';
import { SeriesId } from '../models/seriesType/common';
import { AxisId } from '../models/axis';
import { CartesianChartSeriesType, ChartsSeriesConfig } from '../models/seriesType/config';
import { useStore } from '../internals/store/useStore';
import { useSelector } from '../internals/store/useSelector';
import { getLabel } from '../internals/getLabel';
import { isCartesianSeriesType } from '../internals/isCartesian';
import { utcFormatter } from './utils';
import { useXAxes, useXAxis, useYAxes, useYAxis } from '../hooks/useAxis';
import { useZAxes } from '../hooks/useZAxis';
import {
  selectorChartsInteractionTooltipXAxes,
  selectorChartsInteractionTooltipYAxes,
  UseChartCartesianAxisSignature,
} from '../internals/plugins/featurePlugins/useChartCartesianAxis';
import { ChartsLabelMarkProps } from '../ChartsLabel';

export interface UseAxisTooltipReturnValue<
  SeriesT extends CartesianChartSeriesType = CartesianChartSeriesType,
  AxisValueT extends string | number | Date = string | number | Date,
> {
  axisDirection: 'x' | 'y';
  axisId: AxisId;
  axisValue: AxisValueT;
  axisFormattedValue: string;
  dataIndex: number;
  seriesItems: SeriesItem<SeriesT>[];
}

interface SeriesItem<T extends CartesianChartSeriesType> {
  seriesId: SeriesId;
  color: string;
  value: ChartsSeriesConfig[T]['valueType'];
  formattedValue: string;
  formattedLabel: string | null;
  markType: ChartsLabelMarkProps['type'];
}

export function useAxisTooltip(): UseAxisTooltipReturnValue[] | null {
  const defaultXAxis = useXAxis();
  const defaultYAxis = useYAxis();

  const store = useStore<[UseChartCartesianAxisSignature]>();

  const tooltipXAxes = useSelector(store, selectorChartsInteractionTooltipXAxes);
  const tooltipYAxes = useSelector(store, selectorChartsInteractionTooltipYAxes);

  const series = useSeries();

  const { xAxis } = useXAxes();
  const { yAxis } = useYAxes();

  const { zAxis, zAxisIds } = useZAxes();
  const colorProcessors = useColorProcessor();

  if (tooltipXAxes.length === 0 && tooltipYAxes.length === 0) {
    return null;
  }

  const tooltipAxes: UseAxisTooltipReturnValue[] = [
    ...tooltipXAxes.map(({ axisId, dataIndex }) => {
      const axis = xAxis[axisId];

      const axisValue = axis.data?.[dataIndex] ?? null;

      const axisFormatter =
        axis.valueFormatter ??
        ((v: string | number | Date) =>
          axis.scaleType === 'utc' ? utcFormatter(v) : v.toLocaleString());

      const axisFormattedValue = axisFormatter(axisValue, {
        location: 'tooltip',
        scale: axis.scale,
      });

      return {
        axisDirection: 'x' as const,
        axisId,
        dataIndex,
        axisValue,
        axisFormattedValue,
        seriesItems: [],
      };
    }),

    ...tooltipYAxes.map(({ axisId, dataIndex }) => {
      const axis = yAxis[axisId];

      const axisValue = axis.data?.[dataIndex] ?? null;

      const axisFormatter =
        axis.valueFormatter ??
        ((v: string | number | Date) =>
          axis.scaleType === 'utc' ? utcFormatter(v) : v.toLocaleString());

      const axisFormattedValue = axisFormatter(axisValue, {
        location: 'tooltip',
        scale: axis.scale,
      });

      return {
        axisDirection: 'y' as const,
        axisId,
        dataIndex,
        axisValue,
        axisFormattedValue,
        seriesItems: [],
      };
    }),
  ];

  Object.keys(series)
    .filter(isCartesianSeriesType)
    .flatMap(<SeriesT extends CartesianChartSeriesType>(seriesType: SeriesT) => {
      const seriesOfType = series[seriesType];
      if (!seriesOfType) {
        return [];
      }
      return seriesOfType.seriesOrder.forEach((seriesId) => {
        const seriesToAdd = seriesOfType.series[seriesId]!;

        const providedXAxisId = seriesToAdd.xAxisId ?? defaultXAxis.id;
        const providedYAxisId = seriesToAdd.yAxisId ?? defaultYAxis.id;

        const tooltipItemIndex = tooltipAxes.findIndex(
          ({ axisDirection, axisId }) =>
            (axisDirection === 'x' && axisId === providedXAxisId) ||
            (axisDirection === 'y' && axisId === providedYAxisId),
        );
        // Test if the series uses the default axis
        if (tooltipItemIndex >= 0) {
          const zAxisId = 'zAxisId' in seriesToAdd ? seriesToAdd.zAxisId : zAxisIds[0];
          const { dataIndex } = tooltipAxes[tooltipItemIndex];
          const color =
            colorProcessors[seriesType]?.(
              seriesToAdd,
              xAxis[providedXAxisId],
              yAxis[providedYAxisId],
              zAxisId ? zAxis[zAxisId] : undefined,
            )(dataIndex) ?? '';

          const value = seriesToAdd.data[dataIndex] ?? null;
          const formattedValue = (seriesToAdd.valueFormatter as any)(value, {
            dataIndex,
          });
          const formattedLabel = getLabel(seriesToAdd.label, 'tooltip') ?? null;

          tooltipAxes[tooltipItemIndex].seriesItems.push({
            seriesId,
            color,
            value,
            formattedValue,
            formattedLabel,
            markType: seriesToAdd.labelMarkType,
          });
        }
      });
    });

  return tooltipAxes;
}
