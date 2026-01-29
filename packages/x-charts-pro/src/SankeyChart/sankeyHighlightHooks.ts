import { selectorChartsIsFaded, selectorChartsIsHighlighted, useStore } from '@mui/x-charts/internals';
import type { SankeyLinkIdentifier, SankeyNodeIdentifier } from './sankey.types';

export function useSankeyNodeHighlightState(nodeIdentifier: SankeyNodeIdentifier) {
  const store = useStore();

  const isHighlighted = store.use(selectorChartsIsHighlighted, nodeIdentifier);
  const isFaded = store.use(selectorChartsIsFaded, nodeIdentifier);

  // eslint-disable-next-line no-nested-ternary
  return isHighlighted ? 'highlighted' : isFaded ? 'faded' : 'none';
}

export function useSankeyLinkHighlightState(linkIdentifier: SankeyLinkIdentifier) {
  const store = useStore();

  const isHighlighted = store.use(selectorChartsIsHighlighted, linkIdentifier);
  const isFaded = store.use(selectorChartsIsFaded, linkIdentifier);

  // eslint-disable-next-line no-nested-ternary
  return isHighlighted ? 'highlighted' : isFaded ? 'faded' : 'none';
}
