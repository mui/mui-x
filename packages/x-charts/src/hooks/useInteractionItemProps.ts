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
    const onMouseEnter = () => {
      dispatchInteraction({
        type: 'enterItem',
        data,
      });
      setHighlighted({
        seriesId: data.seriesId,
        dataIndex: data.dataIndex,
      });
    };
    const onMouseLeave = () => {
      dispatchInteraction({ type: 'leaveItem', data });
      clearHighlighted();
    };
    return {
      onMouseEnter,
      onMouseLeave,
    };
  };
  return getInteractionItemProps;
};
