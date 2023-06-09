import * as React from 'react';
import { InteractionContext } from '../context/InteractionProvider';
import { HighlighContext, HighlightScope } from '../context/HighlightProvider';
import { SeriesItemIdentifier } from '../models';

export const useInteractionItemProps = (scope?: Partial<HighlightScope>) => {
  const { dispatch: dispatchInteraction } = React.useContext(InteractionContext);
  const { dispatch: dispatchHighlight } = React.useContext(HighlighContext);

  const getInteractionItemProps = (data: SeriesItemIdentifier) => {
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

export const getIsHighlighted = (
  selectedItem: SeriesItemIdentifier | null,
  currentItem: SeriesItemIdentifier,
  highlightScope?: Partial<HighlightScope>,
) => {
  if (
    !highlightScope?.highlighted ||
    highlightScope.highlighted === 'none' ||
    selectedItem === null
  ) {
    return false;
  }

  const isSeriesSelected =
    selectedItem.type === currentItem.type && selectedItem.seriesId === currentItem.seriesId;

  if (!isSeriesSelected) {
    return false;
  }

  if (highlightScope.highlighted === 'series') {
    return isSeriesSelected;
  }

  return selectedItem.dataIndex !== undefined && selectedItem.dataIndex === currentItem.dataIndex;
};

export const getIsFaded = (
  selectedItem: SeriesItemIdentifier | null,
  currentItem: SeriesItemIdentifier,
  highlightScope?: Partial<HighlightScope>,
) => {
  if (!highlightScope?.faded || highlightScope.faded === 'none' || selectedItem === null) {
    return false;
  }

  const isSeriesSelected =
    selectedItem.type === currentItem.type && selectedItem.seriesId === currentItem.seriesId;

  if (highlightScope.faded === 'series') {
    return isSeriesSelected && selectedItem.dataIndex !== currentItem.dataIndex;
  }
  if (highlightScope.faded === 'global') {
    if (!isSeriesSelected) {
      return true;
    }
    return selectedItem.dataIndex !== undefined && selectedItem.dataIndex !== currentItem.dataIndex;
  }
  return false;
};
