'use client';
import { useStore } from '@mui/x-internals/store';
import { ChartSeriesType } from '../models/seriesType/config';
import {
  ProcessedSeries,
  UseChartSeriesSignature,
  selectorChartSeriesConfig,
} from '../internals/plugins/corePlugins/useChartSeries';
import { useSeries } from './useSeries';
import type { LegendItemParams } from '../ChartsLegend';
import { useChartStore } from '../internals/store/useChartStore';

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
  const store = useChartStore<[UseChartSeriesSignature]>();
  const seriesConfig = useStore(store, selectorChartSeriesConfig);

  return {
    items: getSeriesToDisplay(series, seriesConfig),
  };
}
