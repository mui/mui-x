import useEventCallback from '@mui/utils/useEventCallback';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import { ChartPlugin } from '../../models';
import { HighlightItemData, UseChartHighlightSignature } from './useChartHighlight.types';

export const useChartHighlight: ChartPlugin<UseChartHighlightSignature> = ({
  store,
  params,
  models,
}) => {
  useEnhancedEffect(() => {
    store.update((prevState) => ({
      ...prevState,
      highlight: {
        ...prevState.highlight,
        item: models.highlightedItem.value,
      },
    }));
  }, [store, models.highlightedItem.value]);

  const clearHighlight = useEventCallback(() => {
    params.onHighlightChange?.(null);
    models.highlightedItem.setControlledValue(null);
  });

  const setHighlight = useEventCallback((newItem: HighlightItemData) => {
    params.onHighlightChange?.(newItem);
    models.highlightedItem.setControlledValue(newItem);
  });

  return {
    instance: {
      clearHighlight,
      setHighlight,
    },
  };
};

useChartHighlight.models = {
  highlightedItem: {
    getDefaultValue: () => null,
  },
};

useChartHighlight.getInitialState = (params) => ({
  highlight: { item: params.highlightedItem ?? null },
});

useChartHighlight.params = {
  highlightedItem: true,
  onHighlightChange: true,
};
