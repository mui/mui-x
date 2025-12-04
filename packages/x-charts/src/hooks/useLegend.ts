'use client';
import { ChartSeriesType } from '../models/seriesType/config';
import {
  ProcessedSeries,
  UseChartSeriesSignature,
  selectorChartSeriesConfig,
} from '../internals/plugins/corePlugins/useChartSeries';
import { useSeries } from './useSeries';
import type { LegendItemParams } from '../ChartsLegend';
import { useStore } from '../internals/store/useStore';
import { useSelector } from '../internals/store/useSelector';
import { ChartSeriesConfig } from '../internals/plugins/models/seriesConfig';

function getSeriesToDisplay(
  series: ProcessedSeries,
  seriesConfig: ChartSeriesConfig<ChartSeriesType>,
) {
  return (Object.keys(series) as ChartSeriesType[]).flatMap(
    <T extends ChartSeriesType>(seriesType: T) => {
      const getter = seriesConfig[seriesType as T].legendGetter;
      return getter === undefined ? [] : getter(series[seriesType as T]!);
    },
  );
}

/**
 * Get the legend items to display.
 *
 * This hook is used by the `ChartsLegend` component. And will return the legend items formatted for display.
 *
 * An alternative is to use the `useSeries` hook and format the legend items yourself.
 *
 * @returns legend data
 */
export function useLegend(): { items: LegendItemParams[] } {
  const series = useSeries();
  const store = useStore<[UseChartSeriesSignature]>();
  const seriesConfig = useSelector(store, selectorChartSeriesConfig);

  return {
    items: getSeriesToDisplay(series, seriesConfig),
  };
}
