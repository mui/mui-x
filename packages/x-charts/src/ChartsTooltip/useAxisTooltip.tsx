'use client';
import { useSeries } from '../hooks/useSeries';
import { useColorProcessor } from '../internals/plugins/corePlugins/useChartSeries/useColorProcessor';
import { SeriesId } from '../models/seriesType/common';
import {
  CartesianChartSeriesType,
  ChartsSeriesConfig,
  PolarChartSeriesType,
} from '../models/seriesType/config';
import { AxisDefaultized, PolarAxisDefaultized, AxisId } from '../models/axis';
import { useStore } from '../internals/store/useStore';
import { useSelector } from '../internals/store/useSelector';
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
  UseChartCartesianAxisSignature,
} from '../internals/plugins/featurePlugins/useChartCartesianAxis';
import { ChartsLabelMarkProps } from '../ChartsLabel';
import { selectorChartsInteractionTooltipRotationAxes } from '../internals/plugins/featurePlugins/useChartPolarAxis/useChartPolarInteraction.selectors';
import { isPolarSeriesType } from '../internals/isPolar';

export interface UseAxisTooltipReturnValue<
  SeriesT extends CartesianChartSeriesType | PolarChartSeriesType =
    | CartesianChartSeriesType
    | PolarChartSeriesType,
  AxisValueT extends string | number | Date = string | number | Date,
> {
  axisDirection: SeriesT extends CartesianChartSeriesType ? 'x' | 'y' : 'rotation' | 'radius';
  mainAxis: SeriesT extends CartesianChartSeriesType ? AxisDefaultized : PolarAxisDefaultized;
  axisId: AxisId;
  axisValue: AxisValueT;
  axisFormattedValue: string;
  dataIndex: number;
  seriesItems: SeriesItem<SeriesT>[];
}

export interface UseAxisTooltipParams {
  /**
   * If `true`, the hook returns an array with an object per active axis.
   */
  multipleAxes?: boolean;
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
  axis: AxisDefaultized | PolarAxisDefaultized,
  dataIndex: number,
  axisDirection: 'x' | 'y' | 'rotation',
): UseAxisTooltipReturnValue {
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
 * @deprecated Use `useAxesTooltip` instead.
 */
export function useAxisTooltip(
  params: UseAxisTooltipParams & { multipleAxes: true },
): UseAxisTooltipReturnValue[] | null;
export function useAxisTooltip(
  params?: UseAxisTooltipParams & { multipleAxes?: false },
): UseAxisTooltipReturnValue | null;
export function useAxisTooltip(
  params: UseAxisTooltipParams = {},
): UseAxisTooltipReturnValue | UseAxisTooltipReturnValue[] | null {
  const { multipleAxes, directions } = params;

  const defaultXAxis = useXAxis();
  const defaultYAxis = useYAxis();
  const defaultRotationAxis = useRotationAxis();

  const store = useStore<[UseChartCartesianAxisSignature]>();

  const tooltipXAxes = useSelector(store, selectorChartsInteractionTooltipXAxes);
  const tooltipYAxes = useSelector(store, selectorChartsInteractionTooltipYAxes);

  const tooltipRotationAxes = useSelector(store, selectorChartsInteractionTooltipRotationAxes);

  const series = useSeries();

  const { xAxis } = useXAxes();
  const { yAxis } = useYAxes();
  const { zAxis, zAxisIds } = useZAxes();

  const { rotationAxis } = useRotationAxes();

  const colorProcessors = useColorProcessor();

  if (tooltipXAxes.length === 0 && tooltipYAxes.length === 0 && tooltipRotationAxes.length === 0) {
    return null;
  }

  const tooltipAxes: UseAxisTooltipReturnValue[] = [];

  if (directions === undefined || directions.includes('x')) {
    tooltipXAxes.forEach(({ axisId, dataIndex }) => {
      if (!multipleAxes && tooltipAxes.length > 1) {
        return;
      }
      tooltipAxes.push(defaultAxisTooltipConfig(xAxis[axisId], dataIndex, 'x'));
    });
  }

  if (directions === undefined || directions.includes('y')) {
    tooltipYAxes.forEach(({ axisId, dataIndex }) => {
      if (!multipleAxes && tooltipAxes.length > 1) {
        return;
      }
      tooltipAxes.push(defaultAxisTooltipConfig(yAxis[axisId], dataIndex, 'y'));
    });
  }

  if (directions === undefined || directions.includes('rotation')) {
    tooltipRotationAxes.forEach(({ axisId, dataIndex }) => {
      if (!multipleAxes && tooltipAxes.length > 1) {
        return;
      }
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

  if (!multipleAxes) {
    return tooltipAxes.length === 0 ? tooltipAxes[0] : null;
  }
  return tooltipAxes;
}
