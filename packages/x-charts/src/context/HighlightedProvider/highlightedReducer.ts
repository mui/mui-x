import * as React from 'react';
import { HighlightItemData, HighlightedOptions, HighlightedState } from './HighlightedContext';

export type HighlightedActionSet = {
  type: 'set-highlighted';
  options: NonNullable<HighlightedOptions>;
};

export type HighlightedActionClear = {
  type: 'clear-highlighted';
};

export type HighlightedAction = HighlightedActionSet | HighlightedActionClear;

const createIsHighlighted =
  (highlightedOptions: HighlightedOptions) =>
  (input: HighlightItemData): boolean => {
    if (!highlightedOptions) {
      return false;
    }

    if (highlightedOptions.highlighted === 'same-series') {
      return input.seriesId === highlightedOptions.seriesId;
    }

    if (highlightedOptions.highlighted === 'item') {
      return (
        input.itemId === highlightedOptions.itemId && input.seriesId === highlightedOptions.seriesId
      );
    }

    if (highlightedOptions.highlighted === 'same-value') {
      return input.value === highlightedOptions.value;
    }

    return false;
  };

const createIsFaded =
  (highlightedOptions: HighlightedOptions) =>
  (input: HighlightItemData): boolean => {
    if (!highlightedOptions) {
      return false;
    }

    if (highlightedOptions.faded === 'same-series') {
      return (
        input.seriesId === highlightedOptions.seriesId && input.itemId !== highlightedOptions.itemId
      );
    }

    if (highlightedOptions.faded === 'other-series') {
      return input.seriesId !== highlightedOptions.seriesId;
    }

    if (highlightedOptions.faded === 'same-value') {
      return input.value === highlightedOptions.value && input.itemId !== highlightedOptions.itemId;
    }
  };

export const highlightedReducer: React.Reducer<
  Omit<HighlightedState, 'setHighlighted' | 'clearHighlighted'>,
  HighlightedAction
> = (state, action) => {
  switch (action.type) {
    case 'set-highlighted':
      return {
        ...state,
        options: action.options,
        isFaded: createIsFaded(action.options),
        isHighlighted: createIsHighlighted(action.options),
      };

    case 'clear-highlighted':
      return {
        ...state,
        options: null,
        isFaded: createIsFaded(null),
        isHighlighted: createIsHighlighted(null),
      };

    default:
      return state;
  }
};
