import useEventCallback from '@mui/utils/useEventCallback';
import type { ChartPlugin } from '../../models';
import type { UseChartTooltipSignature } from './useChartTooltip.types';
import type { SeriesItemIdentifier } from '../../../../models/seriesType';
import type { ChartSeriesType } from '../../../../models/seriesType/config';

export const useChartTooltip: ChartPlugin<UseChartTooltipSignature> = ({ store, instance }) => {
  const removeTooltipItem = useEventCallback(function removeTooltipItem(
    itemToRemove?: SeriesItemIdentifier<ChartSeriesType>,
  ) {
    const prevItem = store.state.tooltip.item;

    if (!itemToRemove) {
      // Remove without taking care of the current item
      if (prevItem !== null) {
        store.set('tooltip', { item: null });
      }
      return;
    }

    if (!instance.isSameIdentifier(prevItem, itemToRemove)) {
      // The current item is already different from the one to remove. No need to clean it.
      return;
    }

    store.set('tooltip', { item: null });
  });

  const setTooltipItem = useEventCallback(function setTooltipItem(
    newItem: SeriesItemIdentifier<ChartSeriesType>,
  ) {
    if (!instance.isSameIdentifier(store.state.tooltip.item, newItem)) {
      store.set('tooltip', { item: newItem });
    }
  });

  return {
    instance: {
      setTooltipItem,
      removeTooltipItem,
    },
  };
};

useChartTooltip.getInitialState = () => ({
  tooltip: { item: null },
});

useChartTooltip.params = {};
