'use client';
import * as React from 'react';
import { InteractionContext } from '../context/InteractionProvider';
import { SeriesItemIdentifier } from '../models';
import { useHighlighted } from '../context';

export const useInteractionItemProps = (skip?: boolean) => {
  const { dispatch: dispatchInteraction } = React.useContext(InteractionContext);
  const { setHighlighted, clearHighlighted } = useHighlighted();

  if (skip) {
    return () => ({});
  }
  const getInteractionItemProps = (data: SeriesItemIdentifier) => {
    const onPointerDown = (event: React.PointerEvent) => {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    };
    const onPointerEnter = () => {
      dispatchInteraction({
        type: 'enterItem',
        data,
      });
      setHighlighted({
        seriesId: data.seriesId,
        dataIndex: data.dataIndex,
      });
    };
    const onPointerLeave = (event: React.PointerEvent) => {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }

      store.update((prev) => {
        const prevItem = prev.interaction.item;
        if (
          prevItem === null ||
          Object.keys(data).some(
            (key) => data[key as keyof typeof data] !== prevItem[key as keyof typeof prevItem],
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
      clearHighlighted();
    };
    return {
      onPointerEnter,
      onPointerLeave,
      onPointerDown,
    };
  };
  return getInteractionItemProps;
};
