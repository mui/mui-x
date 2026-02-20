import {
  selectorChartsIsFaded,
  selectorChartsIsHighlighted,
  useStore,
} from '@mui/x-charts/internals';
import type {
  SankeyItemIdentifier,
  SankeyLinkIdentifier,
  SankeyNodeIdentifier,
} from './sankey.types';

type SankeyHighlightSelector = (state: any, identifier: SankeyItemIdentifier) => boolean;

export function useSankeyNodeHighlightState(nodeIdentifier: SankeyNodeIdentifier) {
  const store = useStore();

  const isHighlighted = store.use(
    selectorChartsIsHighlighted as unknown as SankeyHighlightSelector,
    nodeIdentifier,
  );
  const isFaded = store.use(
    selectorChartsIsFaded as unknown as SankeyHighlightSelector,
    nodeIdentifier,
  );

  // eslint-disable-next-line no-nested-ternary
  return isHighlighted ? 'highlighted' : isFaded ? 'faded' : 'none';
}

export function useSankeyLinkHighlightState(linkIdentifier: SankeyLinkIdentifier) {
  const store = useStore();

  const isHighlighted = store.use(
    selectorChartsIsHighlighted as unknown as SankeyHighlightSelector,
    linkIdentifier,
  );
  const isFaded = store.use(
    selectorChartsIsFaded as unknown as SankeyHighlightSelector,
    linkIdentifier,
  );

  // eslint-disable-next-line no-nested-ternary
  return isHighlighted ? 'highlighted' : isFaded ? 'faded' : 'none';
}
