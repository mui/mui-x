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
      event.currentTarget.releasePointerCapture(event.pointerId);
      dispatchInteraction({ type: 'leaveItem', data });
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
