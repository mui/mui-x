import { useStore } from '@mui/x-charts/internals';
import {
  selectorIsLinkHighlighted,
  selectorIsNodeHighlighted,
  selectorIsSankeyItemFaded,
} from './plugins/useSankeyHighlight.selectors';
import type { SankeyLayoutLink, SankeyNodeId } from './sankey.types';

export function useSankeyNodeHighlightState(nodeId: SankeyNodeId) {
  const store = useStore();

  const isHighlighted = store.use(selectorIsNodeHighlighted, nodeId);
  const isFaded = store.use(selectorIsSankeyItemFaded, isHighlighted);

  // eslint-disable-next-line no-nested-ternary
  return isHighlighted ? 'highlighted' : isFaded ? 'faded' : 'none';
}

export function useSankeyLinkHighlightState(link: SankeyLayoutLink) {
  const store = useStore();

  const isHighlighted = store.use(selectorIsLinkHighlighted, link);
  const isFaded = store.use(selectorIsSankeyItemFaded, isHighlighted);

  // eslint-disable-next-line no-nested-ternary
  return isHighlighted ? 'highlighted' : isFaded ? 'faded' : 'none';
}
