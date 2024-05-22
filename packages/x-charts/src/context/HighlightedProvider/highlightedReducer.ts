import * as React from 'react';
import { HighlightItemData, HighlightedOptions, HighlightedState } from './HighlightedContext';

export type HighlightedActionSetHighlighted = {
  type: 'set-highlighted';
  itemData: NonNullable<HighlightItemData>;
};

export type HighlightedActionSetOptions = {
  type: 'set-options';
  options: Pick<NonNullable<HighlightedOptions>, 'highlighted' | 'faded'>;
};

export type HighlightedActionClearHighlighted = {
  type: 'clear-highlighted';
};

export type HighlightedActionClearOptions = {
  type: 'clear-options';
};

export type HighlightedAction =
  | HighlightedActionSetHighlighted
  | HighlightedActionClearHighlighted
  | HighlightedActionSetOptions
  | HighlightedActionClearOptions;

const createIsHighlighted =
  (highlightedOptions: HighlightedOptions, highlightedItem: HighlightItemData | null) =>
  (input: HighlightItemData): boolean => {
    if (!highlightedOptions) {
      return false;
    }

    if (highlightedOptions.highlighted === 'same-series') {
      return input.seriesId === highlightedItem?.seriesId;
    }

    if (highlightedOptions.highlighted === 'item') {
      return (
        input.itemId === highlightedItem?.itemId && input.seriesId === highlightedItem?.seriesId
      );
    }

    if (highlightedOptions.highlighted === 'same-value') {
      return input.value === highlightedItem?.value;
    }

    return false;
  };

const createIsFaded =
  (highlightedOptions: HighlightedOptions, highlightedItem: HighlightItemData | null) =>
  (input: HighlightItemData): boolean => {
    if (!highlightedOptions) {
      return false;
    }

    if (highlightedOptions.faded === 'same-series') {
      return (
        input.seriesId === highlightedItem?.seriesId && input.itemId !== highlightedItem?.itemId
      );
    }

    if (highlightedOptions.faded === 'other-series') {
      return input.seriesId !== highlightedItem?.seriesId;
    }

    if (highlightedOptions.faded === 'same-value') {
      return input.value === highlightedItem?.value && input.itemId !== highlightedItem?.itemId;
    }

    if (highlightedOptions.faded === 'other-value') {
      return input.value !== highlightedItem?.value;
    }

    if (highlightedOptions.faded === 'global') {
      return (
        input.seriesId !== highlightedItem?.seriesId ||
        input.itemId !== highlightedItem?.itemId ||
        input.value !== highlightedItem?.value
      );
    }

    return false;
  };

export const highlightedReducer: React.Reducer<
  Omit<HighlightedState, 'setHighlighted' | 'clearHighlighted' | 'setOptions' | 'clearOptions'>,
  HighlightedAction
> = (state, action) => {
  switch (action.type) {
    case 'set-options':
      return {
        ...state,
        options: action.options,
        isFaded: createIsFaded(action.options, state.highlightedItem),
        isHighlighted: createIsHighlighted(action.options, state.highlightedItem),
      };

    case 'clear-options':
      return {
        ...state,
        options: null,
        isFaded: createIsFaded(null, state.highlightedItem),
        isHighlighted: createIsHighlighted(null, state.highlightedItem),
      };

    case 'set-highlighted':
      return {
        ...state,
        highlightedItem: action.itemData,
        isFaded: createIsFaded(state.options, action.itemData),
        isHighlighted: createIsHighlighted(state.options, action.itemData),
      };

    case 'clear-highlighted':
      return {
        ...state,
        highlightedItem: null,
        isFaded: createIsFaded(state.options, null),
        isHighlighted: createIsHighlighted(state.options, null),
      };

    default:
      return state;
  }
};
