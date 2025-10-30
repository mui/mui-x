import { useAssertModelConsistency } from '@mui/x-internals/useAssertModelConsistency';
import useEventCallback from '@mui/utils/useEventCallback';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import { fastObjectShallowCompare } from '@mui/x-internals/fastObjectShallowCompare';
import { ChartPlugin } from '@mui/x-charts/internals';
import type {
  UseSankeyHighlightSignature,
  SankeyHighlightItemData,
} from './useSankeyHighlight.types';

/**
 * Custom highlight plugin for Sankey charts that uses SankeyItemIdentifier
 * instead of the standard HighlightItemData.
 */
export const useSankeyHighlight: ChartPlugin<UseSankeyHighlightSignature> = ({ store, params }) => {
  useAssertModelConsistency({
    warningPrefix: 'MUI X Charts',
    componentName: 'SankeyChart',
    propName: 'highlightedItem',
    controlled: params.highlightedItem,
    defaultValue: null,
  });

  useEnhancedEffect(() => {
    if (store.state.highlight.item !== params.highlightedItem) {
      store.set('highlight', { ...store.state.highlight, item: params.highlightedItem });
    }
  }, [store, params.highlightedItem]);

  const clearHighlight = useEventCallback(() => {
    params.onHighlightChange?.(null);
    store.set('highlight', { ...store.state.highlight, item: null });
  });

  const setHighlight = useEventCallback((newItem: SankeyHighlightItemData) => {
    const prevItem = store.getSnapshot().highlight.item;

    if (fastObjectShallowCompare(prevItem, newItem)) {
      return;
    }

    params.onHighlightChange?.(newItem);
    store.set('highlight', { ...store.state.highlight, item: newItem });
  });

  return {
    instance: {
      clearHighlight,
      setHighlight,
    },
  };
};

useSankeyHighlight.getDefaultizedParams = ({ params }) => ({
  ...params,
  highlightedItem: params.highlightedItem ?? null,
});

useSankeyHighlight.getInitialState = (params) => ({
  highlight: { item: params.highlightedItem },
});

useSankeyHighlight.params = {
  highlightedItem: true,
  onHighlightChange: true,
};
