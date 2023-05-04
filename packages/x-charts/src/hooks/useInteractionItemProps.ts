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
    const onMouseEnter = () => {
      dispatch({
        type: 'enterItem',
        data,
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
