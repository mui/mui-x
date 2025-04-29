import { useAssertModelConsistency } from '@mui/x-internals/useAssertModelConsistency';
import useEventCallback from '@mui/utils/useEventCallback';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import { ChartPlugin } from '../../models';
import { HighlightItemData, UseChartHighlightSignature } from './useChartHighlight.types';

export const useChartHighlight: ChartPlugin<UseChartHighlightSignature> = ({ store, params }) => {
  useAssertModelConsistency({
    componentName: 'Chart',
    propName: 'highlightedItem',
    controlled: params.highlightedItem,
    defaultValue: null,
  });

  useEnhancedEffect(() => {
    store.update((prevState) =>
      prevState.highlight.item === params.highlightedItem
        ? prevState
        : {
            ...prevState,
            highlight: {
              ...prevState.highlight,
              item: params.highlightedItem,
            },
          },
    );
  }, [store, params.highlightedItem]);

  const clearHighlight = useEventCallback(() => {
    params.onHighlightChange?.(null);
    store.update((prev) => ({ ...prev, highlight: { item: null } }));
  });

  const setHighlight = useEventCallback((newItem: HighlightItemData) => {
    params.onHighlightChange?.(newItem);
    store.update((prev) => ({ ...prev, highlight: { item: newItem } }));
  });

  return {
    instance: {
      clearHighlight,
      setHighlight,
    },
  };
};

useChartHighlight.getDefaultizedParams = ({ params }) => ({
  highlightedItem: params.highlightedItem ?? null,
});

useChartHighlight.getInitialState = (params) => ({
  highlight: { item: params.highlightedItem },
});

useChartHighlight.params = {
  highlightedItem: true,
  onHighlightChange: true,
};
