'use client';
import { useStore } from '../internals/store/useStore';
import { selectorChartId } from '../internals/plugins/corePlugins/useChartId/useChartId.selectors';

/**
 * Get the unique identifier of the chart.
 * @returns chartId if it exists.
 */
export function useChartId(): string | undefined {
  const store = useStore();
  return store.use(selectorChartId);
}
