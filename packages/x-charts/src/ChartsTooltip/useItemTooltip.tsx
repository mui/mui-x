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
import { useXAxes, useYAxes } from '../hooks/useAxis';
import { useZAxes } from '../hooks/useZAxis';
import { ChartsLabelMarkProps } from '../ChartsLabel';
import { selectorChartSeriesConfig } from '../internals/plugins/corePlugins/useChartSeries/useChartSeries.selectors';
import { TooltipGetter } from '../internals/plugins/models/seriesConfig/tooltipGetter.types';

export interface ItemTooltip<T extends ChartSeriesType> {
  identifier: ChartItemIdentifier<T>;
  color: string;
  label: string | undefined;
  value: ChartsSeriesConfig[T]['valueType'];
  formattedValue: string | null;
  markType: ChartsLabelMarkProps['type'];
}

export type UseItemTooltipReturnValue<T extends ChartSeriesType> = ItemTooltip<T>;

export function useItemTooltip<T extends ChartSeriesType>(): UseItemTooltipReturnValue<T> | null {
  const store = useStore();
  const identifier = useSelector(store, selectorChartsInteractionItem);
  const seriesConfig = useSelector(store, selectorChartSeriesConfig);

  const series = useSeries();

  const { xAxis, xAxisIds } = useXAxes();
  const { yAxis, yAxisIds } = useYAxes();
  const { zAxis, zAxisIds } = useZAxes();

  const xAxisId = (series as any).xAxisId ?? xAxisIds[0];
  const yAxisId = (series as any).yAxisId ?? yAxisIds[0];
  const zAxisId = (series as any).zAxisId ?? zAxisIds[0];

  if (!identifier || identifier.dataIndex === undefined) {
    return null;
  }

  const itemSeries = series[identifier.type]!.series[
    identifier.seriesId
  ] as ChartSeriesDefaultized<T>;
  const getColor =
    seriesConfig[itemSeries.type].colorProcessor?.(
      itemSeries as any,
      xAxisId && xAxis[xAxisId],
      yAxisId && yAxis[yAxisId],
      zAxisId && zAxis[zAxisId],
    ) ?? (() => '');

  return (seriesConfig[itemSeries.type].tooltipGetter as unknown as TooltipGetter<T>)({
    series: itemSeries,
    getColor,
    identifier,
  });
}
