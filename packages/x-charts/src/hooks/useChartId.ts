'use client';
import { useStore } from '@mui/x-internals/store';
import { useChartStore } from '../internals/store/useChartStore';

import { selectorChartId } from '../internals/plugins/corePlugins/useChartId/useChartId.selectors';

/**
 * Get the unique identifier of the chart.
 * @returns chartId if it exists.
 */
export function useChartId(): string | undefined {
  const store = useChartStore();
  return useStore(store, selectorChartId);
}
