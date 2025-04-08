'use client';
import { useSeries } from '../hooks/useSeries';
import {
  ChartItemIdentifier,
  ChartSeriesDefaultized,
  ChartSeriesType,
  ChartsSeriesConfig,
} from '../models/seriesType/config';
import { selectorChartsInteractionItem } from '../internals/plugins/featurePlugins/useChartInteraction';
import { useSelector } from '../internals/store/useSelector';
import { useStore } from '../internals/store/useStore';
import { useRadiusAxes, useRotationAxes, useXAxes, useYAxes } from '../hooks/useAxis';
import { useZAxes } from '../hooks/useZAxis';
import { ChartsLabelMarkProps } from '../ChartsLabel';
import { selectorChartSeriesConfig } from '../internals/plugins/corePlugins/useChartSeries/useChartSeries.selectors';
import {
  TooltipGetter,
  TooltipGetterAxesConfig,
} from '../internals/plugins/models/seriesConfig/tooltipGetter.types';

export interface ItemTooltip<T extends ChartSeriesType> {
  identifier: ChartItemIdentifier<T>;
  color: string;
  label: string | undefined;
  value: ChartsSeriesConfig[T]['valueType'];
  formattedValue: string | null;
  markType: ChartsLabelMarkProps['type'];
}

export type UseItemTooltipReturnValue<T extends ChartSeriesType> = ItemTooltip<T>;
export type UseRadarItemTooltipReturnValue<T extends ChartSeriesType> = (ItemTooltip<T> & {
  axisFormattedValue?: string;
})[];

export function useInternalItemTooltip<T extends ChartSeriesType>():
  | (T extends 'radar' ? UseRadarItemTooltipReturnValue<T> : ItemTooltip<T>)
  | null {
  const store = useStore();
  const identifier = useSelector(store, selectorChartsInteractionItem);
  const seriesConfig = useSelector(store, selectorChartSeriesConfig);

  const series = useSeries();

  const { xAxis, xAxisIds } = useXAxes();
  const { yAxis, yAxisIds } = useYAxes();
  const { zAxis, zAxisIds } = useZAxes();
  const { rotationAxis, rotationAxisIds } = useRotationAxes();
  const { radiusAxis, radiusAxisIds } = useRadiusAxes();

  const xAxisId = (series as any).xAxisId ?? xAxisIds[0];
  const yAxisId = (series as any).yAxisId ?? yAxisIds[0];
  const zAxisId = (series as any).zAxisId ?? zAxisIds[0];
  const rotationAxisId = (series as any).rotationAxisId ?? rotationAxisIds[0];
  const radiusAxisId = (series as any).radiusAxisId ?? radiusAxisIds[0];

  if (!identifier) {
    return null;
  }

  const itemSeries = series[identifier.type]?.series[identifier.seriesId] as
    | ChartSeriesDefaultized<T>
    | undefined;

  if (!itemSeries) {
    return null;
  }

  const getColor =
    seriesConfig[itemSeries.type].colorProcessor?.(
      itemSeries as any,
      xAxisId && xAxis[xAxisId],
      yAxisId && yAxis[yAxisId],
      zAxisId && zAxis[zAxisId],
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
  if (radiusAxisId !== undefined) {
    axesConfig.radius = radiusAxis[radiusAxisId];
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
 * Returns an array config object when the tooltip displays a radar series content.
 * COntains an object per value with their content and the label of the associated metric.
 * @returns The tooltip item configs
 */
export const useRadarItemTooltip = () => {
  return useInternalItemTooltip<'radar'>() as UseRadarItemTooltipReturnValue<'radar'> | null;
};
