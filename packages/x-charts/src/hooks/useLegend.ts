'use client';
import { ChartSeriesType } from '../models/seriesType/config';
import getBarLegend from '../BarChart/legend';
import getScatterLegend from '../ScatterChart/legend';
import getLineLegend from '../LineChart/legend';
import getPieLegend from '../PieChart/legend';
import { ProcessedSeries } from '../internals/plugins/corePlugins/useChartSeries/useChartSeries.types';
import { LegendGetter } from '../internals/plugins/models/seriesConfig/seriesProcessor.types';
import { useSeries } from './useSeries';
import type { LegendItemParams } from '../ChartsLegend';

const legendGetter: { [T in ChartSeriesType]?: LegendGetter<T> } = {
  bar: getBarLegend,
  scatter: getScatterLegend,
  line: getLineLegend,
  pie: getPieLegend,
};

function getSeriesToDisplay(series: ProcessedSeries) {
  return (Object.keys(series) as ChartSeriesType[]).flatMap(
    <T extends ChartSeriesType>(seriesType: T) => {
      const getter = legendGetter[seriesType as T];
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
  return {
    items: getSeriesToDisplay(series),
  };
}
