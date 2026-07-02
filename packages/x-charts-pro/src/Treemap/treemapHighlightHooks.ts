import { selectorChartsHighlightState, useStore } from '@mui/x-charts/internals';
import type { TreemapItemIdentifier } from './treemap.types';

export function useTreemapItemHighlightState(identifier: TreemapItemIdentifier) {
  const store = useStore();

  return store.use(selectorChartsHighlightState, identifier);
}
