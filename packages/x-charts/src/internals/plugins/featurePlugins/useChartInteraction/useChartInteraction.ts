import useEventCallback from '@mui/utils/useEventCallback';
import { ChartPlugin } from '../../models';
import { AxisInteractionData, UseChartInteractionSignature } from './useChartInteraction.types';
import { ChartItemIdentifier, ChartSeriesType } from '../../../../models/seriesType/config';

export const useChartInteraction: ChartPlugin<UseChartInteractionSignature> = ({ store }) => {
  const cleanInteraction = useEventCallback(() => {
    store.update((prev) => {
      return {
        ...prev,
        interaction: { ...prev.interaction, axis: { x: null, y: null }, item: null },
      };
    });
  });

  const removeItemInteraction = useEventCallback(
    (itemToRemove: ChartItemIdentifier<ChartSeriesType>) => {
      store.update((prev) => {
        const prevItem = prev.interaction.item;
        if (
          prevItem === null ||
          Object.keys(itemToRemove).some(
            (key) =>
              itemToRemove[key as keyof typeof itemToRemove] !==
              prevItem[key as keyof typeof prevItem],
          )
        ) {
          // The item is already something else, no need to clean it.
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

  const setAxisInteraction = useEventCallback(
    ({ x: newStateX, y: newStateY }: Partial<AxisInteractionData>) => {
      store.update((prev) => ({
        ...prev,
        interaction: {
          ...prev.interaction,
          axis: {
            // A bit verbose, but prevent losing the x value if only y got modified.
            ...prev.interaction.axis,
            ...(prev.interaction.axis.x?.index !== newStateX?.index ||
            prev.interaction.axis.x?.value !== newStateX?.value
              ? { x: newStateX }
              : {}),
            ...(prev.interaction.axis.y?.index !== newStateY?.index ||
            prev.interaction.axis.y?.value !== newStateY?.value
              ? { y: newStateY }
              : {}),
          },
        },
      }));
    },
  );

  const enableVoronoid = useEventCallback(() => {
    store.update((prev) => ({
      ...prev,
      interaction: {
        ...prev.interaction,
        isVoronoiEnabled: true,
      },
    }));
  });

  const disableVoronoid = useEventCallback(() => {
    store.update((prev) => ({
      ...prev,
      interaction: {
        ...prev.interaction,
        isVoronoiEnabled: false,
      },
    }));
  });

  return {
    params: {},
    instance: {
      cleanInteraction,
      setItemInteraction,
      removeItemInteraction,
      setAxisInteraction,
      enableVoronoid,
      disableVoronoid,
    },
  };
};

useChartInteraction.getInitialState = () => ({
  interaction: { item: null, axis: { x: null, y: null }, isVoronoiEnabled: false },
});

useChartInteraction.params = {};
