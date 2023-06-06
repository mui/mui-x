import * as React from 'react';
import { InteractionContext } from '../context/InteractionProvider';
import { BarItemIdentifier } from '../models/seriesType/bar';
import { LineItemIdentifier } from '../models/seriesType/line';
import { ScatterItemIdentifier } from '../models/seriesType/scatter';
import { HighlighContext } from '../context/HighlightProvider';

export const useInteractionItemProps = (scope) => {
  const { dispatch: dispatchInteraction } = React.useContext(InteractionContext);
  const { dispatch: dispatchHighlight } = React.useContext(HighlighContext);

  const getInteractionItemProps = (
    data: BarItemIdentifier | LineItemIdentifier | ScatterItemIdentifier,
  ) => {
    const onMouseEnter = () => {
      dispatchInteraction({
        type: 'enterItem',
        data,
      });
      dispatchHighlight({
        type: 'enterItem',
        item: data,
        scope,
      });
    };
    const onMouseLeave = () => {
      dispatchInteraction({ type: 'leaveItem', data });

      dispatchHighlight({
        type: 'leaveItem',
        item: data,
      });
    };
    return {
      onMouseEnter,
      onMouseLeave,
    };
  };
  return getInteractionItemProps;
};
