import { useAssertModelConsistency } from '@mui/x-internals/useAssertModelConsistency';
import useEventCallback from '@mui/utils/useEventCallback';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import { fastObjectShallowCompare } from '@mui/x-internals/fastObjectShallowCompare';
import type { ChartPlugin, ChartPluginOptions } from '../../models';
import type { UseChartTooltipSignature } from './useChartTooltip.types';
import type { SeriesItemIdentifier, SeriesItemIdentifierWithType } from '../../../../models/seriesType';
import type { ChartSeriesType } from '../../../../models/seriesType/config';
import { createIdentifierWithType } from '../../corePlugins/useChartSeries/useChartSeries';

export const useChartTooltip: ChartPlugin<UseChartTooltipSignature<any>> = <
  SeriesType extends ChartSeriesType = ChartSeriesType,
>({
  store,
  params,
  instance
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
      const newItem = params.tooltipItem ? instance.identifierWithType(params.tooltipItem) as SeriesItemIdentifierWithType<SeriesType> : null

      store.set('tooltip', { ...store.state.tooltip, item: newItem });
    }
  }, [store, instance, params.tooltipItem]);

  const removeTooltipItem = useEventCallback(function removeTooltipItem(
    itemToRemove?: SeriesItemIdentifier<ChartSeriesType>,
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
    newItem: SeriesItemIdentifierWithType<SeriesType>,
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

useChartTooltip.getInitialState = (params, currentState) => ({
  tooltip: {
    itemIsControlled: params.tooltipItem !== undefined,
    // Need some as because the generic SeriesType can't be propagated to plugins methods.
    item: params.tooltipItem == null ? null : createIdentifierWithType(currentState)(params.tooltipItem as SeriesItemIdentifier<ChartSeriesType>) as SeriesItemIdentifierWithType<ChartSeriesType>,
  },
});

useChartTooltip.params = {
  tooltipItem: true,
  onTooltipItemChange: true,
};
