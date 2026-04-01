import { selectorChartsHighlightState, useStore } from '@mui/x-charts/internals';
import type { SankeyLinkIdentifier, SankeyNodeIdentifier } from './sankey.types';

export function useSankeyNodeHighlightState(nodeIdentifier: SankeyNodeIdentifier) {
  const store = useStore();

  return store.use(selectorChartsHighlightState, nodeIdentifier);
}

export function useSankeyLinkHighlightState(linkIdentifier: SankeyLinkIdentifier) {
  const store = useStore();

  return store.use(selectorChartsHighlightState, linkIdentifier);
}
