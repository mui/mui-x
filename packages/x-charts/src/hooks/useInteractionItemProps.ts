import * as React from 'react';
import { InteractionContext } from '../context/InteractionProvider';
import { SeriesItemIdentifier } from '../models';
import { HighlightScope, HighlightedContext } from '../context';

type UseInteractionItemFunction = (data: SeriesItemIdentifier) => {
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
};
export function useInteractionItemProps(skip?: boolean): UseInteractionItemFunction;
/**
 * @deprecated The `scope` parameter was deprecated and will be removed in the next major version. Simply remove it from the call.
 */
export function useInteractionItemProps(
  scope?: Partial<HighlightScope>,
  skip?: boolean,
): UseInteractionItemFunction;
export function useInteractionItemProps(
  scope?: Partial<HighlightScope> | boolean,
  skip?: boolean,
): UseInteractionItemFunction {
  const { dispatch: dispatchInteraction } = React.useContext(InteractionContext);
  const { setHighlighted, clearHighlighted } = React.useContext(HighlightedContext);

  if (typeof scope === 'boolean') {
    skip = scope;
  }

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
        path: data.dataIndex?.toString(),
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
}
