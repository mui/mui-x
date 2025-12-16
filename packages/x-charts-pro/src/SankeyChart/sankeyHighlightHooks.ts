import { useSelector, useStore } from '@mui/x-charts/internals';
import {
  selectorIsLinkHighlighted,
  selectorIsNodeHighlighted,
  selectorIsSankeyItemFaded,
} from './plugins/useSankeyHighlight.selectors';
import type { SankeyLayoutLink, SankeyNodeId } from './sankey.types';

export function useSankeyNodeHighlightState(nodeId: SankeyNodeId) {
  const store = useStore();

  const isHighlighted = useSelector(store, selectorIsNodeHighlighted, nodeId);
  const isFaded = useSelector(store, selectorIsSankeyItemFaded, isHighlighted);

  // eslint-disable-next-line no-nested-ternary
  return isHighlighted ? 'highlighted' : isFaded ? 'faded' : 'none';
}

export function useSankeyLinkHighlightState(link: SankeyLayoutLink) {
  const store = useStore();

  const isHighlighted = useSelector(store, selectorIsLinkHighlighted, link);
  const isFaded = useSelector(store, selectorIsSankeyItemFaded, isHighlighted);

  // eslint-disable-next-line no-nested-ternary
  return isHighlighted ? 'highlighted' : isFaded ? 'faded' : 'none';
}
