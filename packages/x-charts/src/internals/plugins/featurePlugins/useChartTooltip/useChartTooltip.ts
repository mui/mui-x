import useEventCallback from '@mui/utils/useEventCallback';
import { fastObjectShallowCompare } from '@mui/x-internals/fastObjectShallowCompare';
import type { ChartPlugin } from '../../models';
import type { UseChartTooltipSignature } from './useChartTooltip.types';
import type { ChartItemIdentifier, ChartSeriesType } from '../../../../models/seriesType/config';

export const useChartTooltip: ChartPlugin<UseChartTooltipSignature> = ({ store }) => {
  const removeItemTooltip = useEventCallback(function removeItemTooltip(
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

    if (
      prevItem === null ||
      (Object.keys(itemToRemove) as Array<keyof ChartItemIdentifier<ChartSeriesType>>).some(
        (key) => itemToRemove[key] !== prevItem[key],
      )
    ) {
      // The current item is already different from the one to remove. No need to clean it.
      return;
    }

    store.set('tooltip', { item: null });
  });

  const setItemTooltip = useEventCallback(function setItemTooltip(
    newItem: ChartItemIdentifier<ChartSeriesType>,
  ) {
    if (!fastObjectShallowCompare(store.state.tooltip.item, newItem)) {
      store.set('tooltip', { item: newItem });
    }
  });

  return {
    instance: {
      setItemTooltip,
      removeItemTooltip,
    },
  };
};

useChartTooltip.getInitialState = () => ({
  tooltip: { item: null },
});

useChartTooltip.params = {};
