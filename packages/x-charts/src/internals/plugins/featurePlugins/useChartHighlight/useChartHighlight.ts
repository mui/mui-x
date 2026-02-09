import { warnOnce } from '@mui/x-internals/warning';
import { useAssertModelConsistency } from '@mui/x-internals/useAssertModelConsistency';
import useEventCallback from '@mui/utils/useEventCallback';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import { fastObjectShallowCompare } from '@mui/x-internals/fastObjectShallowCompare';
import type { ChartPluginOptions, ChartResponse, ChartPlugin } from '../../models';
import type { UseChartHighlightSignature } from './useChartHighlight.types';
import type {
  ChartSeriesType,
  HighlightItemIdentifier,
  SeriesItemIdentifier,
} from '../../../../models/seriesType';

export const useChartHighlight: ChartPlugin<UseChartHighlightSignature<any>> = <
  SeriesType extends ChartSeriesType = ChartSeriesType,
>({
  store,
  params,
  instance,
}: ChartPluginOptions<UseChartHighlightSignature<SeriesType>>): ChartResponse<
  UseChartHighlightSignature<SeriesType>
> => {
  useAssertModelConsistency({
    warningPrefix: 'MUI X Charts',
    componentName: 'Chart',
    propName: 'highlightedItem',
    controlled: params.highlightedItem,
    defaultValue: null,
  });

  useEnhancedEffect(() => {
    if (store.state.highlight.item !== params.highlightedItem) {
      store.set('highlight', {
        ...store.state.highlight,
        item:
          params.highlightedItem === null ? null : instance.cleanIdentifier(params.highlightedItem),
      });
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
  }, [store, params.highlightedItem, instance]);

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

  const setHighlight = useEventCallback((newItem: HighlightItemIdentifier<SeriesType>) => {
    const prevHighlight = store.state.highlight;

    const cleanedIdentifier = instance.cleanIdentifier(newItem);
    if (fastObjectShallowCompare(prevHighlight.item, cleanedIdentifier)) {
      return;
    }

    params.onHighlightChange?.(cleanedIdentifier);
    if (prevHighlight.isControlled) {
      return;
    }

    store.set('highlight', {
      item: cleanedIdentifier,
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
