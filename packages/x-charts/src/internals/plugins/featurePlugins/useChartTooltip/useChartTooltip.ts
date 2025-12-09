import useEventCallback from '@mui/utils/useEventCallback';
import { fastObjectShallowCompare } from '@mui/x-internals/fastObjectShallowCompare';
import type { ChartPlugin } from '../../models';
import type { UseChartTooltipSignature } from './useChartTooltip.types';
import type { ChartItemIdentifier, ChartSeriesType } from '../../../../models/seriesType/config';

export const useChartTooltip: ChartPlugin<UseChartTooltipSignature> = ({ store }) => {
  const removeTooltipItem = useEventCallback(function removeTooltipItem(
    itemToRemove?: ChartItemIdentifier<ChartSeriesType>,
  ) {
    const prevItem = store.state.tooltip.item;

    if (!itemToRemove) {
      // Remove without taking care of the current item
      if (prevItem !== null) {
        store.set('tooltip', { item: null });
      }
      return;
    }

    if (prevItem === null || !fastObjectShallowCompare(prevItem, itemToRemove)) {
      // The current item is already different from the one to remove. No need to clean it.
      return;
    }

    store.set('tooltip', { item: null });
  });

  const setTooltipItem = useEventCallback(function setTooltipItem(
    newItem: ChartItemIdentifier<ChartSeriesType>,
  ) {
    if (!fastObjectShallowCompare(store.state.tooltip.item, newItem)) {
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
