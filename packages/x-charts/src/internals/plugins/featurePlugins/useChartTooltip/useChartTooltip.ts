import { useAssertModelConsistency } from '@mui/x-internals/useAssertModelConsistency';
import useEventCallback from '@mui/utils/useEventCallback';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import { fastObjectShallowCompare } from '@mui/x-internals/fastObjectShallowCompare';
import type { ChartPlugin, ChartPluginOptions } from '../../models';
import type { UseChartTooltipSignature } from './useChartTooltip.types';
import type { SeriesItemIdentifier } from '../../../../models/seriesType';
import type { ChartSeriesType } from '../../../../models/seriesType/config';

export const useChartTooltip: ChartPlugin<UseChartTooltipSignature<any>> = <
  SeriesType extends ChartSeriesType = ChartSeriesType,
>({
  store,
  params,
}: ChartPluginOptions<UseChartTooltipSignature<SeriesType>>) => {
  useAssertModelConsistency({
    warningPrefix: 'MUI X Charts',
    componentName: 'Chart',
    propName: 'tooltipItem',
    controlled: params.tooltipItem,
    defaultValue: null,
  });

  useEnhancedEffect(() => {
    if (store.state.tooltip.item !== params.tooltipItem) {
      store.set('tooltip', { ...store.state.tooltip, item: params.tooltipItem });
    }
  }, [store, params.tooltipItem]);

  const removeTooltipItem = useEventCallback(function removeTooltipItem(
    itemToRemove?: SeriesItemIdentifier<SeriesType>,
  ) {
    const prevItem = store.state.tooltip.item;

    if (prevItem === null) {
      return; // Already null, nothing to do
    }

    if (!itemToRemove || fastObjectShallowCompare(prevItem, itemToRemove)) {
      // Remove the item is either
      // - no item provided, so we unconditionally remove it
      // - the provided item matches the current one

      params.onTooltipItemChange?.(null);

      if (!store.state.tooltip.itemIsControlled) {
        store.set('tooltip', { ...store.state.tooltip, item: null });
      }
      return;
    }
  });

  const setTooltipItem = useEventCallback(function setTooltipItem(
    newItem: SeriesItemIdentifier<SeriesType>,
  ) {
    if (!fastObjectShallowCompare(store.state.tooltip.item, newItem)) {
      params.onTooltipItemChange?.(newItem);
      if (!store.state.tooltip.itemIsControlled) {
        store.set('tooltip', { ...store.state.tooltip, item: newItem });
      }
    }
  });

  return {
    instance: {
      setTooltipItem,
      removeTooltipItem,
    },
  };
};

useChartTooltip.getInitialState = (params) => ({
  tooltip: {
    itemIsControlled: params.tooltipItem !== undefined,
    item: params.tooltipItem ?? null,
  },
});

useChartTooltip.params = {
  tooltipItem: true,
  onTooltipItemChange: true,
};
