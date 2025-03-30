import useEventCallback from '@mui/utils/useEventCallback';
import { ChartPlugin } from '../../models';
import { Coordinate, UseChartInteractionSignature } from './useChartInteraction.types';
import { ChartItemIdentifier, ChartSeriesType } from '../../../../models/seriesType/config';

export const useChartInteraction: ChartPlugin<UseChartInteractionSignature> = ({ store }) => {
  const cleanInteraction = useEventCallback(() => {
    store.update((prev) => {
      return {
        ...prev,
        interaction: { pointer: null, item: null },
      };
    });
  });

  const removeItemInteraction = useEventCallback(
    (itemToRemove?: ChartItemIdentifier<ChartSeriesType>) => {
      store.update((prev) => {
        const prevItem = prev.interaction.item;

        if (!itemToRemove) {
          // Remove without taking care of the current item
          return prevItem === null
            ? prev
            : {
                ...prev,
                interaction: {
                  ...prev.interaction,
                  item: null,
                },
              };
        }

        if (
          prevItem === null ||
          Object.keys(itemToRemove).some(
            (key) =>
              itemToRemove[key as keyof typeof itemToRemove] !==
              prevItem[key as keyof typeof prevItem],
          )
        ) {
          // The current item is already different from the one to remove. No need to clean it.
          return prev;
        }

        return {
          ...prev,
          interaction: {
            ...prev.interaction,
            item: null,
          },
        };
      });
    },
  );

  const setItemInteraction = useEventCallback((newItem: ChartItemIdentifier<ChartSeriesType>) => {
    store.update((prev) => ({
      ...prev,
      interaction: {
        ...prev.interaction,
        item: newItem,
      },
    }));
  });

  const setPointerCoordinate = useEventCallback((coordinate: Coordinate | null) => {
    store.update((prev) => ({
      ...prev,
      interaction: {
        ...prev.interaction,
        pointer: coordinate,
      },
    }));
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
  interaction: { item: null, pointer: null },
});

useChartInteraction.params = {};
