import useEventCallback from '@mui/utils/useEventCallback';
import { fastObjectShallowCompare } from '@mui/x-internals/fastObjectShallowCompare';
import type { ChartPlugin } from '../../models';
import type {
  Coordinate,
  InteractionUpdateSource,
  UseChartInteractionSignature,
} from './useChartInteraction.types';
import type { SeriesItemIdentifierWithType } from '../../../../models/seriesType';
import type { ChartSeriesType } from '../../../../models/seriesType/config';

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

  const setHoveredItem = useEventCallback(function setHoveredItem(
    item: SeriesItemIdentifierWithType<ChartSeriesType>,
  ) {
    const previousItem = store.state.interaction.hoveredItem;

    if (previousItem !== null && fastObjectShallowCompare(previousItem, item)) {
      return;
    }

    store.set('interaction', { ...store.state.interaction, hoveredItem: item });
  });

  const clearHoveredItem = useEventCallback(function clearHoveredItem(
    itemToRemove?: SeriesItemIdentifierWithType<ChartSeriesType>,
  ) {
    const previousItem = store.state.interaction.hoveredItem;

    if (previousItem === null) {
      return;
    }

    if (itemToRemove !== undefined && !fastObjectShallowCompare(previousItem, itemToRemove)) {
      // Another item took over already.
      return;
    }

    store.set('interaction', { ...store.state.interaction, hoveredItem: null });
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
      setHoveredItem,
      clearHoveredItem,
      setPointerCoordinate,
      handlePointerEnter,
      handlePointerLeave,
    },
  };
};

useChartInteraction.getInitialState = () => ({
  interaction: {
    item: null,
    pointer: null,
    lastUpdate: 'pointer',
    pointerType: null,
    hoveredItem: null,
  },
});

useChartInteraction.params = {};
