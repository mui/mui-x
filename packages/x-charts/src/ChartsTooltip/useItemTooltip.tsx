'use client';
import { useSeries } from '../hooks/useSeries';
import { ChartSeriesDefaultized, ChartSeriesType } from '../models/seriesType/config';
import { selectorChartsTooltipItem } from '../internals/plugins/featurePlugins/useChartInteraction';
import { useSelector } from '../internals/store/useSelector';
import { useStore } from '../internals/store/useStore';
import { useRotationAxes, useXAxes, useYAxes } from '../hooks/useAxis';
import { useZAxes } from '../hooks/useZAxis';
import { selectorChartSeriesConfig } from '../internals/plugins/corePlugins/useChartSeries/useChartSeries.selectors';
import {
  ItemTooltip,
  ItemTooltipWithMultipleValues,
  TooltipGetter,
  TooltipGetterAxesConfig,
} from '../internals/plugins/models/seriesConfig/tooltipGetter.types';
import { ColorProcessor } from '../internals/plugins/models/seriesConfig';
import { isCartesianSeries } from '../internals/isCartesian';
import { AxisId } from '../models/axis';

export type UseItemTooltipReturnValue<T extends ChartSeriesType> = ItemTooltip<T>;
export type UseRadarItemTooltipReturnValue = ItemTooltipWithMultipleValues<'radar'>;

export function useInternalItemTooltip<T extends ChartSeriesType>():
  | (T extends 'radar' ? ItemTooltipWithMultipleValues<T> : ItemTooltip<T>)
  | null {
  const store = useStore();
  const identifier = useSelector(store, selectorChartsTooltipItem);
  const seriesConfig = useSelector(store, selectorChartSeriesConfig);

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
      itemSeries as any,
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
