'use client';
import { useSeries } from '../hooks/useSeries';
import { useColorProcessor } from '../internals/plugins/corePlugins/useChartSeries/useColorProcessor';
import { SeriesId } from '../models/seriesType/common';
import { AxisDefaultized, AxisId } from '../models/axis';
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

export interface UseAxisTooltipParams {
  /**
   * If `true`, the hook returns an array with an object per active axis.
   * @deprecated In future version, the `multipleAxes=true` will be the unique behavior
   */
  multipleAxes?: boolean;
  /**
   * The axis directions to consider.
   * If not defined, all directions are considered
   */
  directions?: ('x' | 'y')[];
}

interface SeriesItem<T extends CartesianChartSeriesType> {
  seriesId: SeriesId;
  color: string;
  value: ChartsSeriesConfig[T]['valueType'];
  formattedValue: string;
  formattedLabel: string | null;
  markType: ChartsLabelMarkProps['type'];
}

function defaultAxisTooltipConfig(
  axis: AxisDefaultized,
  dataIndex: number,
  axisDirection: 'x' | 'y',
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
    dataIndex,
    axisValue,
    axisFormattedValue,
    seriesItems: [],
  };
}

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

  const tooltipAxes: UseAxisTooltipReturnValue[] = [];

  if (directions === undefined || directions.includes('x')) {
    tooltipXAxes.forEach(({ axisId, dataIndex }) => {
      if (!multipleAxes && tooltipAxes.length > 1) {
        return;
      }
      const axis = xAxis[axisId];
      tooltipAxes.push(defaultAxisTooltipConfig(axis, dataIndex, 'x'));
    });
  }

  if (directions === undefined || directions.includes('x')) {
    tooltipYAxes.forEach(({ axisId, dataIndex }) => {
      if (!multipleAxes && tooltipAxes.length > 1) {
        return;
      }
      const axis = yAxis[axisId];
      tooltipAxes.push(defaultAxisTooltipConfig(axis, dataIndex, 'y'));
    });
  }

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

  if (!multipleAxes) {
    return tooltipAxes.length === 0 ? tooltipAxes[0] : null;
  }
  return tooltipAxes;
}
