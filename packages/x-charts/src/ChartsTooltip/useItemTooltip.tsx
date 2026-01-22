'use client';
import { useSeries } from '../hooks/useSeries';
import { type ChartSeriesDefaultized, type ChartSeriesType } from '../models/seriesType/config';
import { selectorChartsTooltipItem } from '../internals/plugins/featurePlugins/useChartTooltip';
import { useStore } from '../internals/store/useStore';
import { useRotationAxes, useXAxes, useYAxes } from '../hooks/useAxis';
import { useZAxes } from '../hooks/useZAxis';
import { selectorChartSeriesConfig } from '../internals/plugins/corePlugins/useChartSeriesConfig';
import {
  type ItemTooltip,
  type ItemTooltipWithMultipleValues,
  type TooltipGetter,
  type TooltipGetterAxesConfig,
  type ColorProcessor,
} from '../internals/plugins/models';
import { isCartesianSeries } from '../internals/isCartesian';
import { type AxisId } from '../models/axis';

export type UseItemTooltipReturnValue<T extends ChartSeriesType> = ItemTooltip<T>;
export type UseRadarItemTooltipReturnValue = ItemTooltipWithMultipleValues<'radar'>;

export function useInternalItemTooltip<T extends ChartSeriesType>():
  | (T extends 'radar' ? ItemTooltipWithMultipleValues<T> : ItemTooltip<T>)
  | null {
  const store = useStore();
  const identifier = store.use(selectorChartsTooltipItem);
  const seriesConfig = store.use(selectorChartSeriesConfig);

  const series = useSeries();

  const { xAxis, xAxisIds } = useXAxes();
  const { yAxis, yAxisIds } = useYAxes();
  const { zAxis, zAxisIds } = useZAxes();
  const { rotationAxis, rotationAxisIds } = useRotationAxes();

  if (!identifier) {
    return null;
  }

  const itemSeries = series[identifier.type]?.series[identifier.seriesId] as
    | ChartSeriesDefaultized<T>
    | undefined;

  if (!itemSeries) {
    return null;
  }

  const xAxisId: AxisId | undefined = isCartesianSeries(itemSeries)
    ? (itemSeries.xAxisId ?? xAxisIds[0])
    : undefined;
  const yAxisId: AxisId | undefined = isCartesianSeries(itemSeries)
    ? (itemSeries.yAxisId ?? yAxisIds[0])
    : undefined;
  const zAxisId: AxisId | undefined =
    'zAxisId' in itemSeries ? (itemSeries.zAxisId ?? zAxisIds[0]) : zAxisIds[0];

  const rotationAxisId: AxisId | undefined = rotationAxisIds[0];

  const getColor =
    (seriesConfig[itemSeries.type].colorProcessor as ColorProcessor<T>)?.(
      itemSeries,
      xAxisId !== undefined ? xAxis[xAxisId] : undefined,
      yAxisId !== undefined ? yAxis[yAxisId] : undefined,
      zAxisId !== undefined ? zAxis[zAxisId] : undefined,
    ) ?? (() => '');

  const axesConfig: TooltipGetterAxesConfig = {};

  if (xAxisId !== undefined) {
    axesConfig.x = xAxis[xAxisId];
  }
  if (yAxisId !== undefined) {
    axesConfig.y = yAxis[yAxisId];
  }

  if (rotationAxisId !== undefined) {
    axesConfig.rotation = rotationAxis[rotationAxisId];
  }

  return (seriesConfig[itemSeries.type].tooltipGetter as unknown as TooltipGetter<T>)({
    series: itemSeries,
    axesConfig,
    getColor,
    identifier,
  });
}

/**
 * Returns a config object when the tooltip contains a single item to display.
 * Some specific charts like radar need more complex structure. Use specific hook like `useRadarItemTooltip` for them.
 * @returns The tooltip item config
 */
export const useItemTooltip = <T extends Exclude<ChartSeriesType, 'radar'>>() => {
  return useInternalItemTooltip<T>() as UseItemTooltipReturnValue<T> | null;
};

/**
 * Contains an object per value with their content and the label of the associated metric.
 * @returns The tooltip item configs
 */
export const useRadarItemTooltip = () => {
  return useInternalItemTooltip<'radar'>() as UseRadarItemTooltipReturnValue | null;
};
