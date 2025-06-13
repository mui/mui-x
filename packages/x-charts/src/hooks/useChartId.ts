'use client';
import { useStore } from '../internals/store/useStore';
import { useSelector } from '../internals/store/useSelector';
import { selectorChartId } from '../internals/plugins/corePlugins/useChartId/useChartId.selectors';

/**
 * Get the unique identifier of the chart.
 * @returns chartId if it exists.
 */
export function useChartId(): string | undefined {
  const store = useStore();
  return useSelector(store, selectorChartId);
}
