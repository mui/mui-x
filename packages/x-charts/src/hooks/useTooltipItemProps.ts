import * as React from 'react';
import { InteractionContext } from '../context/InteractionProvider';
import { BarItemIdentifier } from '../models/seriesType/bar';
import { LineItemIdentifier } from '../models/seriesType/line';
import { ScatterItemIdentifier } from '../models/seriesType/scatter';

export const useTooltipItemProps = () => {
  const { dispatch } = React.useContext(InteractionContext);

  const getItemProps = (data: BarItemIdentifier | LineItemIdentifier | ScatterItemIdentifier) => {
    const onMouseEnter = (event: React.MouseEvent) => {
      dispatch({
        type: 'enterItem',
        data: { ...data, target: event?.target as SVGElement },
      });
    };
    const onMouseLeave = () => {
      dispatch({ type: 'enterItem', data });
    };
    return {
      onMouseEnter,
      onMouseLeave,
    };
  };
  return getItemProps;
};
