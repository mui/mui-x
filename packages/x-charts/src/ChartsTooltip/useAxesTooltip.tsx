'use client';
import { useSeries } from '../hooks/useSeries';
import { useColorProcessor } from '../internals/plugins/corePlugins/useChartSeries/useColorProcessor';
import { type SeriesId } from '../models/seriesType/common';
import {
  type ChartSeriesDefaultized,
  type CartesianChartSeriesType,
  type ChartsSeriesConfig,
  type PolarChartSeriesType,
} from '../models/seriesType/config';
import { type ComputedAxis, type PolarAxisDefaultized, type AxisId } from '../models/axis';
import { useStore } from '../internals/store/useStore';
import { getLabel } from '../internals/getLabel';
import { utcFormatter } from './utils';
import {
  useRotationAxes,
  useRotationAxis,
  useXAxes,
  useXAxis,
  useYAxes,
  useYAxis,
} from '../hooks/useAxis';
import { useZAxes } from '../hooks/useZAxis';
import {
  selectorChartsInteractionTooltipXAxes,
  selectorChartsInteractionTooltipYAxes,
  type UseChartCartesianAxisSignature,
} from '../internals/plugins/featurePlugins/useChartCartesianAxis';
import { type ChartsLabelMarkProps } from '../ChartsLabel';
import { selectorChartsInteractionTooltipRotationAxes } from '../internals/plugins/featurePlugins/useChartPolarAxis/useChartPolarInteraction.selectors';
import { isPolarSeriesType } from '../internals/isPolar';
import { selectorIsItemVisibleGetter } from '../internals/plugins/featurePlugins/useChartVisibilityManager/useChartVisibilityManager.selectors';
import {
  type ComposableCartesianChartSeriesType,
  composableCartesianSeriesTypes,
} from '../models/seriesType/composition';
import type { ProcessedSeries } from '../internals/plugins/corePlugins/useChartSeries/useChartSeries.types';

export interface UseAxesTooltipReturnValue<
  SeriesType extends CartesianChartSeriesType | PolarChartSeriesType =
    | Exclude<CartesianChartSeriesType, 'ohlc'>
    | PolarChartSeriesType,
  AxisValueT extends string | number | Date = string | number | Date,
> {
  axisDirection: SeriesType extends CartesianChartSeriesType ? 'x' | 'y' : 'rotation' | 'radius';
  mainAxis: SeriesType extends CartesianChartSeriesType ? ComputedAxis : PolarAxisDefaultized;
  axisId: AxisId;
  axisValue: AxisValueT;
  axisFormattedValue: string;
  dataIndex: number;
  seriesItems: SeriesItem<SeriesType>[];
}

export interface UseAxesTooltipParams {
  /**
   * The axis directions to consider.
   * If not defined, all directions are considered
   */
  directions?: ('x' | 'y' | 'rotation')[];
}

export interface SeriesItem<T extends CartesianChartSeriesType | PolarChartSeriesType> {
  seriesId: SeriesId;
  color: string;
  value: T extends 'ohlc'
    ? { open: number; high: number; low: number; close: number } | null
    : ChartsSeriesConfig[T]['valueType'];
  formattedValue: T extends 'ohlc'
    ? { open: string | null; high: string | null; low: string | null; close: string | null }
    : string;
  formattedLabel: string | null;
  markType: ChartsLabelMarkProps['type'];
  markShape: ChartsLabelMarkProps['markShape'];
}

function defaultAxisTooltipConfig(
  axis: ComputedAxis | PolarAxisDefaultized,
  dataIndex: number,
  axisDirection: 'x' | 'y' | 'rotation',
): UseAxesTooltipReturnValue {
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
    axisDirection,
    axisId: axis.id,
    mainAxis: axis,
    dataIndex,
    axisValue,
    axisFormattedValue,
    seriesItems: [],
  };
}

/**
 * Returns the axes to display in the tooltip and the series item related to them.
 */
export function useAxesTooltip<
  SeriesType extends CartesianChartSeriesType | PolarChartSeriesType =
    | Exclude<CartesianChartSeriesType, 'ohlc'>
    | PolarChartSeriesType,
>(params?: UseAxesTooltipParams): UseAxesTooltipReturnValue<SeriesType>[] | null {
  const { directions } = params ?? {};

  const defaultXAxis = useXAxis();
  const defaultYAxis = useYAxis();
  const defaultRotationAxis = useRotationAxis();

  const store = useStore<[UseChartCartesianAxisSignature]>();

  const tooltipXAxes = store.use(selectorChartsInteractionTooltipXAxes);
  const tooltipYAxes = store.use(selectorChartsInteractionTooltipYAxes);

  const tooltipRotationAxes = store.use(selectorChartsInteractionTooltipRotationAxes);

  const series = useSeries();

  const { xAxis } = useXAxes();
  const { yAxis } = useYAxes();
  const { zAxis, zAxisIds } = useZAxes();

  const { rotationAxis } = useRotationAxes();

  const colorProcessors = useColorProcessor();

  const isItemVisible = store.use(selectorIsItemVisibleGetter);

  if (tooltipXAxes.length === 0 && tooltipYAxes.length === 0 && tooltipRotationAxes.length === 0) {
    return null;
  }

  const tooltipAxes: UseAxesTooltipReturnValue[] = [];

  if (directions === undefined || directions.includes('x')) {
    tooltipXAxes.forEach(({ axisId, dataIndex }) => {
      tooltipAxes.push(defaultAxisTooltipConfig(xAxis[axisId], dataIndex, 'x'));
    });
  }

  if (directions === undefined || directions.includes('y')) {
    tooltipYAxes.forEach(({ axisId, dataIndex }) => {
      tooltipAxes.push(defaultAxisTooltipConfig(yAxis[axisId], dataIndex, 'y'));
    });
  }

  if (directions === undefined || directions.includes('rotation')) {
    tooltipRotationAxes.forEach(({ axisId, dataIndex }) => {
      tooltipAxes.push(defaultAxisTooltipConfig(rotationAxis[axisId], dataIndex, 'rotation'));
    });
  }

  const isCartesianContext = xAxis !== undefined || yAxis !== undefined;

  if (isCartesianContext) {
    Object.keys(series)
      .filter((seriesType): seriesType is ComposableCartesianChartSeriesType =>
        composableCartesianSeriesTypes.has(seriesType as ComposableCartesianChartSeriesType),
      )
      .forEach(<Type extends ComposableCartesianChartSeriesType>(seriesType: Type) => {
        const seriesOfType = series[seriesType] as ProcessedSeries<Type, 'cartesian'>[Type];
        if (!seriesOfType) {
          return [];
        }
        return seriesOfType.seriesOrder.forEach((seriesId) => {
          const seriesToAdd = seriesOfType.series[seriesId] as ChartSeriesDefaultized<
            Type,
            'cartesian'
          >;

          // Skip hidden series (only if visibility manager is available)
          if (isItemVisible && !isItemVisible({ type: seriesType, seriesId })) {
            return;
          }

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

            const rawValue = seriesToAdd.data[dataIndex] ?? null;
            const formattedLabel = getLabel(seriesToAdd.label, 'tooltip') ?? null;

            let value: any;
            let formattedValue: any;

            if (seriesType === 'ohlc' && Array.isArray(rawValue)) {
              const [open, high, low, close] = rawValue as [number, number, number, number];
              const formatter = seriesToAdd.valueFormatter as any;
              value = { open, high, low, close };
              formattedValue = {
                open: formatter(open, { dataIndex, field: 'open' }),
                high: formatter(high, { dataIndex, field: 'high' }),
                low: formatter(low, { dataIndex, field: 'low' }),
                close: formatter(close, { dataIndex, field: 'close' }),
              };
            } else {
              value = rawValue;
              formattedValue = (seriesToAdd.valueFormatter as any)(rawValue, {
                dataIndex,
              });
            }

            tooltipAxes[tooltipItemIndex].seriesItems.push({
              seriesId,
              color,
              value,
              formattedValue,
              formattedLabel,
              markType: seriesToAdd.labelMarkType,
              markShape:
                'showMark' in seriesToAdd && seriesToAdd.showMark
                  ? (seriesToAdd.shape ?? 'circle')
                  : undefined,
            });
          }
        });
      });

    return tooltipAxes as UseAxesTooltipReturnValue<SeriesType>[];
  }

  // For polar charts
  Object.keys(series)
    .filter(isPolarSeriesType)
    .forEach(<Type extends PolarChartSeriesType>(seriesType: Type) => {
      const seriesOfType = series[seriesType];
      if (!seriesOfType) {
        return [];
      }
      return seriesOfType.seriesOrder.forEach((seriesId) => {
        const seriesToAdd = seriesOfType.series[seriesId]!;

        // Skip hidden series (only if visibility manager is available)
        if (isItemVisible && !isItemVisible({ type: seriesType, seriesId })) {
          return;
        }

        const providedRotationAxisId: AxisId | undefined =
          // @ts-expect-error Should be fixed when we introduce a polar series with a rotationAxisId
          seriesToAdd.rotationAxisId ?? defaultRotationAxis?.id;

        const tooltipItemIndex = tooltipAxes.findIndex(
          ({ axisDirection, axisId }) =>
            axisDirection === 'rotation' && axisId === providedRotationAxisId,
        );
        // Test if the series uses the default axis
        if (tooltipItemIndex >= 0) {
          const { dataIndex } = tooltipAxes[tooltipItemIndex];
          const color = colorProcessors[seriesType]?.(seriesToAdd)(dataIndex) ?? '';

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
            markShape: 'showMark' in seriesToAdd && seriesToAdd.showMark ? 'circle' : undefined,
          });
        }
      });
    });
  return tooltipAxes as UseAxesTooltipReturnValue<SeriesType>[];
}
