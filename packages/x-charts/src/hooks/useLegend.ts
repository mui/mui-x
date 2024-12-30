'use client';
import { FormattedSeries } from '../context/SeriesProvider';
import { ChartSeriesType } from '../models/seriesType/config';
import { LegendGetter } from '../context/PluginProvider';

import getBarLegend from '../BarChart/legend';
import getScatterLegend from '../ScatterChart/legend';
import getLineLegend from '../LineChart/legend';
import getPieLegend from '../PieChart/legend';
import { useSeries } from './useSeries';
import type { LegendItemParams } from '../ChartsLegend';

const legendGetter: { [T in ChartSeriesType]?: LegendGetter<T> } = {
  bar: getBarLegend,
  scatter: getScatterLegend,
  line: getLineLegend,
  pie: getPieLegend,
};

function getSeriesToDisplay(series: FormattedSeries) {
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
