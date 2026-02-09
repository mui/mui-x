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

  const setLastUpdateSource = useEventCallback(function setLastUpdateSource(
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

  const handlePointerEnter = useEventCallback(function handlePointerEnter(
    event: React.PointerEvent,
  ) {
    store.set('interaction', {
      ...store.state.interaction,
      pointerType: event.pointerType,
    });
  });
  const handlePointerLeave = useEventCallback(function handlePointerLeave() {
    store.set('interaction', {
      ...store.state.interaction,
      pointerType: null,
    });
  });

  return {
    instance: {
      cleanInteraction,
      setLastUpdateSource,
      setPointerCoordinate,
      handlePointerEnter,
      handlePointerLeave,
    },
  };
};

useChartInteraction.getInitialState = () => ({
  interaction: { item: null, pointer: null, lastUpdate: 'pointer', pointerType: null },
});

useChartInteraction.params = {};
