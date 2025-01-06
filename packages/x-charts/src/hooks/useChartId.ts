'use client';
import { useStore } from '../internals/store/useStore';
import { useSelector } from '../internals/store/useSelector';
import { selectorChartId } from '../internals/plugins/corePlugins/useChartId/useChartId.selectors';

export function useChartId() {
  const store = useStore();
  return useSelector(store, selectorChartId);
}
