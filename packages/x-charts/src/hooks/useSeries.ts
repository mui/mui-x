'use client';
import { useStore } from '@mui/x-internals/store';
import { useChartStore } from '../internals/store/useChartStore';
import { selectorChartSeriesProcessed } from '../internals/plugins/corePlugins/useChartSeries/useChartSeries.selectors';
import { UseChartSeriesSignature } from '../internals/plugins/corePlugins/useChartSeries';

/**
 * Get access to the internal state of series.
 * Structured by type of series:
 * { seriesType?: { series: { id1: precessedValue, ... }, seriesOrder: [id1, ...] } }
 * @returns FormattedSeries series
 */
export function useSeries() {
  const store = useChartStore<[UseChartSeriesSignature]>();
  return useStore(store, selectorChartSeriesProcessed);
}
