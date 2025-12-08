import useEventCallback from '@mui/utils/useEventCallback';
import { type ChartPlugin } from '../../models';
import {
  type Coordinate,
  type InteractionUpdateSource,
  type UseChartInteractionSignature,
} from './useChartInteraction.types';

export const useChartInteraction: ChartPlugin<UseChartInteractionSignature> = ({ store }) => {
  const cleanInteraction = useEventCallback(function cleanInteraction() {
    store.update({
      interaction: { ...store.state.interaction, pointer: null },
    });
  });

  const setLastUpdate = useEventCallback(function setLastUpdate(
    interaction: InteractionUpdateSource,
  ) {
    if (store.state.interaction.lastUpdate !== interaction) {
      store.set('interaction', { ...store.state.interaction, lastUpdate: interaction });
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
      setLastUpdate,
      setPointerCoordinate,
    },
  };
};

useChartInteraction.getInitialState = () => ({
  interaction: { item: null, pointer: null, lastUpdate: 'pointer' },
});

useChartInteraction.params = {};
