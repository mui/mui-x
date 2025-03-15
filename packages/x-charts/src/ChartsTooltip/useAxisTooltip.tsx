'use client';
import { useSeries } from '../hooks/useSeries';
import { useColorProcessor } from '../internals/plugins/corePlugins/useChartSeries/useColorProcessor';
import { SeriesId } from '../models/seriesType/common';
import { CartesianChartSeriesType, ChartsSeriesConfig } from '../models/seriesType/config';
import { useStore } from '../internals/store/useStore';
import { useSelector } from '../internals/store/useSelector';
import { getLabel } from '../internals/getLabel';
import { isCartesianSeriesType } from '../internals/isCartesian';
import { utcFormatter } from './utils';
import { useXAxes, useXAxis, useYAxes, useYAxis } from '../hooks/useAxis';
import { useZAxes } from '../hooks/useZAxis';
import {
  selectorChartsInteractionXAxis,
  selectorChartsInteractionYAxis,
} from '../internals/plugins/featurePlugins/useChartInteraction';
import { ChartsLabelMarkProps } from '../ChartsLabel';

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
  markType: ChartsLabelMarkProps['type'];
}

export function useAxisTooltip(): UseAxisTooltipReturnValue | null {
  const defaultXAxis = useXAxis();
  const defaultYAxis = useYAxis();

  const xAxisHasData = defaultXAxis.data !== undefined && defaultXAxis.data.length !== 0;

  const store = useStore();
  const axisData = useSelector(
    store,
    xAxisHasData ? selectorChartsInteractionXAxis : selectorChartsInteractionYAxis,
  );

  const series = useSeries();

  const { xAxis } = useXAxes();
  const { yAxis } = useYAxes();

  const { zAxis, zAxisIds } = useZAxes();
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
            markType: seriesToAdd.labelMarkType,
          };
        }
        return undefined;
      });
    })
    .filter(function truthy<T>(
      item: T,
    ): item is T extends false | '' | 0 | null | undefined ? never : T {
      return Boolean(item);
    });

  const axisFormatter =
    usedAxis.valueFormatter ??
    ((v: string | number | Date) =>
      usedAxis.scaleType === 'utc' ? utcFormatter(v) : v.toLocaleString());

  const axisFormattedValue = axisFormatter(axisValue, {
    location: 'tooltip',
    scale: usedAxis.scale,
  });

  return {
    axisDirection: xAxisHasData ? 'x' : 'y',
    dataIndex,
    seriesItems: relevantSeries,
    axisValue,
    axisFormattedValue,
  };
}
