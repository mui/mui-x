import useEventCallback from '@mui/utils/useEventCallback';
import { fastObjectShallowCompare } from '@mui/x-internals/fastObjectShallowCompare';
import { ChartPlugin } from '../../models';
import { Coordinate, UseChartInteractionSignature } from './useChartInteraction.types';
import {
  ChartItemIdentifier,
  ChartSeriesType,
  type ChartItemIdentifierWithData,
} from '../../../../models/seriesType/config';

export const useChartInteraction: ChartPlugin<UseChartInteractionSignature> = ({ store }) => {
  const cleanInteraction = useEventCallback(function cleanInteraction() {
    store.set('interaction', { ...store.state.interaction, pointer: null, item: null });
  });

  const removeItemInteraction = useEventCallback(function removeItemInteraction(
    itemToRemove?: ChartItemIdentifier<ChartSeriesType>,
  ) {
    const prevItem = store.state.interaction.item;

    if (!itemToRemove) {
      // Remove without taking care of the current item
      if (prevItem !== null) {
        store.set('interaction', { ...store.state.interaction, item: null });
      }
      return;
    }

    if (
      prevItem === null ||
      Object.keys(itemToRemove).some(
        (key) =>
          itemToRemove[key as keyof typeof itemToRemove] !== prevItem[key as keyof typeof prevItem],
      )
    ) {
      // The current item is already different from the one to remove. No need to clean it.
      return;
    }

    store.set('interaction', { ...store.state.interaction, item: null });
  });

  const setItemInteraction = useEventCallback(function setItemInteraction(
    newItem: ChartItemIdentifierWithData<ChartSeriesType>,
  ) {
    if (!fastObjectShallowCompare(store.state.interaction.item, newItem)) {
      store.set('interaction', { ...store.state.interaction, item: newItem });
    }
  });

  const setPointerCoordinate = useEventCallback(function setPointerCoordinate(
    coordinate: Coordinate | null,
  ) {
    store.set('interaction', {
      ...store.state.interaction,
      pointer: coordinate,
      lastUpdate: coordinate !== null ? 'pointer' : store.state.interaction.lastUpdate,
    });
  });

  return {
    instance: {
      cleanInteraction,
      setItemInteraction,
      removeItemInteraction,
      setPointerCoordinate,
    },
  };
};

useChartInteraction.getInitialState = () => ({
  interaction: { item: null, pointer: null, lastUpdate: 'pointer' },
});

useChartInteraction.params = {};
