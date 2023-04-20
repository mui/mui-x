import * as React from 'react';
import { InteractionContext } from '../context/InteractionProvider';
import { BarItemIdentifier } from '../models/seriesType/bar';
import { LineItemIdentifier } from '../models/seriesType/line';
import { ScatterItemIdentifier } from '../models/seriesType/scatter';

export const useInteractionItemProps = () => {
  const { dispatch } = React.useContext(InteractionContext);

  const getInteractionItemProps = (
    data: BarItemIdentifier | LineItemIdentifier | ScatterItemIdentifier,
  ) => {
    const onMouseEnter = (event: React.MouseEvent) => {
      dispatch({
        type: 'enterItem',
        data: { ...data, target: event?.target as SVGElement },
      });
    };
    const onMouseLeave = () => {
      dispatch({ type: 'leaveItem', data });
    };
    return {
      onMouseEnter,
      onMouseLeave,
    };
  };
  return getInteractionItemProps;
};
