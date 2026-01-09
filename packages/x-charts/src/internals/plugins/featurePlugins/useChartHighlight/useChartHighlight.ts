import { warnOnce } from '@mui/x-internals/warning';
import { useAssertModelConsistency } from '@mui/x-internals/useAssertModelConsistency';
import useEventCallback from '@mui/utils/useEventCallback';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import { type ChartPlugin } from '../../models';
import { type HighlightItemData, type UseChartHighlightSignature } from './useChartHighlight.types';

export const useChartHighlight: ChartPlugin<UseChartHighlightSignature> = ({
  store,
  params,
  instance,
}) => {
  useAssertModelConsistency({
    warningPrefix: 'MUI X Charts',
    componentName: 'Chart',
    propName: 'highlightedItem',
    controlled: params.highlightedItem,
    defaultValue: null,
  });

  useEnhancedEffect(() => {
    if (store.state.highlight.item !== params.highlightedItem) {
      store.set('highlight', { ...store.state.highlight, item: params.highlightedItem });
    }
    if (process.env.NODE_ENV !== 'production') {
      if (params.highlightedItem !== undefined && !store.state.highlight.isControlled) {
        warnOnce(
          [
            'MUI X Charts: The `highlightedItem` switched between controlled and uncontrolled state.',
            'To remove the highlight when using controlled state, you must provide `null` to the `highlightedItem` prop instead of `undefined`.',
          ].join('\n'),
        );
      }
    }
  }, [store, params.highlightedItem]);

  const clearHighlight = useEventCallback(() => {
    params.onHighlightChange?.(null);
    const prevHighlight = store.state.highlight;
    if (prevHighlight.item === null || prevHighlight.isControlled) {
      return;
    }

    store.set('highlight', {
      item: null,
      lastUpdate: 'pointer',
      isControlled: false,
    });
  });

  const setHighlight = useEventCallback((newItem: HighlightItemData) => {
    const prevHighlight = store.state.highlight;

    if (instance.isSameIdentifier(prevHighlight.item, newItem)) {
      return;
    }

    params.onHighlightChange?.(newItem);
    if (prevHighlight.isControlled) {
      return;
    }

    store.set('highlight', {
      item: newItem,
      lastUpdate: 'pointer',
      isControlled: false,
    });
  });

  return {
    instance: {
      clearHighlight,
      setHighlight,
    },
  };
};

useChartHighlight.getInitialState = (params) => ({
  highlight: {
    item: params.highlightedItem,
    lastUpdate: 'pointer',
    isControlled: params.highlightedItem !== undefined,
  },
});

useChartHighlight.params = {
  highlightedItem: true,
  onHighlightChange: true,
};
