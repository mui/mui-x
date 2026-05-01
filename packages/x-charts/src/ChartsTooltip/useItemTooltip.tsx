'use client';
import { useSeries } from '../hooks/useSeries';
import type { ChartSeriesDefaultized, ChartSeriesType } from '../models/seriesType/config';
import { type SeriesItemIdentifierWithType } from '../models/seriesType';
import { selectorChartsTooltipItem } from '../internals/plugins/featurePlugins/useChartTooltip';
import { useStore } from '../internals/store/useStore';
import { useRadiusAxes, useRotationAxes, useXAxes, useYAxes } from '../hooks/useAxis';
import { useZAxes } from '../hooks/useZAxis';
import {
  type ItemTooltip,
  type ItemTooltipWithMultipleValues,
  type TooltipGetter,
  type TooltipGetterAxesConfig,
  type ColorProcessor,
  type ColorGetter,
  selectorChartSeriesConfig,
} from '../internals/plugins/corePlugins/useChartSeriesConfig';
import { isCartesianSeries } from '../internals/isCartesian';
import { type AxisId } from '../models/axis';
import { isPolarSeries } from '../internals/isPolar';

export type UseItemTooltipReturnValue<SeriesType extends ChartSeriesType> = ItemTooltip<SeriesType>;
export type UseRadarItemTooltipReturnValue = ItemTooltipWithMultipleValues<'radar'>;

export function useInternalItemTooltip<SeriesType extends ChartSeriesType>():
  | (SeriesType extends 'radar'
      ? ItemTooltipWithMultipleValues<SeriesType>
      : ItemTooltip<SeriesType>)
  | null {
  const store = useStore();
  const identifier = store.use(
    selectorChartsTooltipItem,
  ) as SeriesItemIdentifierWithType<SeriesType> | null;
  const seriesConfig = store.use(selectorChartSeriesConfig);

  const series = useSeries();

  const { xAxis, xAxisIds } = useXAxes();
  const { yAxis, yAxisIds } = useYAxes();
  const { zAxis, zAxisIds } = useZAxes();

  const { rotationAxis, rotationAxisIds } = useRotationAxes();
  const { radiusAxis, radiusAxisIds } = useRadiusAxes();

  if (!identifier) {
    return null;
  }

  const itemSeries = series[identifier.type]?.series[identifier.seriesId] as
    | ChartSeriesDefaultized<SeriesType>
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
  const radiusAxisId: AxisId | undefined = isPolarSeries(itemSeries)
    ? (('radiusAxisId' in itemSeries ? (itemSeries.radiusAxisId as AxisId) : undefined) ??
      radiusAxisIds[0])
    : undefined;
  const rotationAxisId: AxisId | undefined = isPolarSeries(itemSeries)
    ? (('rotationAxisId' in itemSeries ? (itemSeries.rotationAxisId as AxisId) : undefined) ??
      rotationAxisIds[0])
    : undefined;

  const zAxisId: AxisId | undefined =
    'zAxisId' in itemSeries ? (itemSeries.zAxisId ?? zAxisIds[0]) : zAxisIds[0];

  const mainAxis =
    // eslint-disable-next-line no-nested-ternary
    rotationAxisId !== undefined
      ? rotationAxis[rotationAxisId]
      : xAxisId !== undefined
        ? xAxis[xAxisId]
        : undefined;
  const secondAxis =
    // eslint-disable-next-line no-nested-ternary
    radiusAxisId !== undefined
      ? radiusAxis[radiusAxisId]
      : yAxisId !== undefined
        ? yAxis[yAxisId]
        : undefined;

  const getColor: ColorGetter<SeriesType> = (
    seriesConfig[itemSeries.type].colorProcessor as ColorProcessor<SeriesType>
  )(
    itemSeries,
    mainAxis,
    secondAxis,
    zAxisId !== undefined ? zAxis[zAxisId] : undefined,
  ) as ColorGetter<SeriesType>;

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

  return (seriesConfig[itemSeries.type].tooltipGetter as unknown as TooltipGetter<SeriesType>)({
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
export const useItemTooltip = <
  SeriesType extends Exclude<ChartSeriesType, 'radar'> = Exclude<ChartSeriesType, 'radar' | 'ohlc'>,
>() => {
  return useInternalItemTooltip<SeriesType>() as UseItemTooltipReturnValue<SeriesType> | null;
};

/**
 * Contains an object per value with their content and the label of the associated metric.
 * @returns The tooltip item configs
 */
export const useRadarItemTooltip = () => {
  return useInternalItemTooltip<'radar'>() as UseRadarItemTooltipReturnValue | null;
};
