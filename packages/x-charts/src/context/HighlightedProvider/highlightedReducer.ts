import * as React from 'react';
import { HighlightedOptions, HighlightedState } from './HighlightedContext';

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

    if (highlightedOptions.type === 'series') {
      return input.seriesId === highlightedOptions.seriesId;
    }

    return false;
  };

const createIsFaded =
  (highlightedOptions: HighlightedOptions) =>
  (input: HighlightItemData): boolean => {};

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
