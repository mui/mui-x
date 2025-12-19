'use client';
import { useStore } from '../internals/store/useStore';
import { selectorChartSeriesProcessed } from '../internals/plugins/corePlugins/useChartSeries/useChartSeries.selectors';
import { type UseChartSeriesSignature } from '../internals/plugins/corePlugins/useChartSeries';

/**
 * Get access to the internal state of series.
 * Structured by type of series:
 * { seriesType?: { series: { id1: precessedValue, ... }, seriesOrder: [id1, ...] } }
 * @returns FormattedSeries series
 */
export function useSeries() {
  const store = useStore<[UseChartSeriesSignature]>();
  return store.use(selectorChartSeriesProcessed);
}
