'use client';
import { useSeries } from '../hooks/useSeries';
import { useColorProcessor } from '../internals/plugins/corePlugins/useChartSeries/useColorProcessor';
import { type SeriesId } from '../models/seriesType/common';
import {
  type CartesianChartSeriesType,
  type ChartsSeriesConfig,
  type PolarChartSeriesType,
} from '../models/seriesType/config';
import { type ComputedAxis, type PolarAxisDefaultized, type AxisId } from '../models/axis';
import { useStore } from '../internals/store/useStore';
import { getLabel } from '../internals/getLabel';
import { isCartesianSeriesType } from '../internals/isCartesian';
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

export interface UseAxesTooltipReturnValue<
  SeriesT extends CartesianChartSeriesType | PolarChartSeriesType =
    | CartesianChartSeriesType
    | PolarChartSeriesType,
  AxisValueT extends string | number | Date = string | number | Date,
> {
  axisDirection: SeriesT extends CartesianChartSeriesType ? 'x' | 'y' : 'rotation' | 'radius';
  mainAxis: SeriesT extends CartesianChartSeriesType ? ComputedAxis : PolarAxisDefaultized;
  axisId: AxisId;
  axisValue: AxisValueT;
  axisFormattedValue: string;
  dataIndex: number;
  seriesItems: SeriesItem<SeriesT>[];
}

export interface UseAxesTooltipParams {
  /**
   * The axis directions to consider.
   * If not defined, all directions are considered
   */
  directions?: ('x' | 'y' | 'rotation')[];
}

interface SeriesItem<T extends CartesianChartSeriesType | PolarChartSeriesType> {
  seriesId: SeriesId;
  color: string;
  value: ChartsSeriesConfig[T]['valueType'];
  formattedValue: string;
  formattedLabel: string | null;
  markType: ChartsLabelMarkProps['type'];
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
export function useAxesTooltip(params?: UseAxesTooltipParams): UseAxesTooltipReturnValue[] | null {
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

  Object.keys(series)
    .filter(isCartesianSeriesType)
    .forEach(<SeriesT extends CartesianChartSeriesType>(seriesType: SeriesT) => {
      const seriesOfType = series[seriesType];
      if (!seriesOfType) {
        return [];
      }
      return seriesOfType.seriesOrder.forEach((seriesId) => {
        const seriesToAdd = seriesOfType.series[seriesId]!;

        // Skip hidden series
        if (!isItemVisible({ type: seriesType, seriesId })) {
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

  Object.keys(series)
    .filter(isPolarSeriesType)
    .forEach(<SeriesT extends PolarChartSeriesType>(seriesType: SeriesT) => {
      const seriesOfType = series[seriesType];
      if (!seriesOfType) {
        return [];
      }
      return seriesOfType.seriesOrder.forEach((seriesId) => {
        const seriesToAdd = seriesOfType.series[seriesId]!;

        // Skip hidden series
        if (!isItemVisible({ type: seriesType, seriesId })) {
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
          });
        }
      });
    });

  return tooltipAxes;
}
