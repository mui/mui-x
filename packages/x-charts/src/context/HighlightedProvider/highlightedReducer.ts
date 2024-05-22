import * as React from 'react';
import { HighlightedItemData, HighlightedScope, HighlightedState } from './HighlightedContext';

export type HighlightedActionSetHighlighted = {
  type: 'set-highlighted';
  itemData: NonNullable<HighlightedItemData>;
};

export type HighlightedActionSetOptions = {
  type: 'set-options';
  options: NonNullable<HighlightedScope>;
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
  (highlightedScope: HighlightedScope, highlightedItem: HighlightedItemData | null) =>
  (input: HighlightedItemData): boolean => {
    if (!highlightedScope) {
      return false;
    }

    if (
      highlightedScope.highlighted === 'same-series' ||
      highlightedScope.highlighted === 'series'
    ) {
      return input.seriesId === highlightedItem?.seriesId;
    }

    if (highlightedScope.highlighted === 'item') {
      return (
        input.itemId === highlightedItem?.itemId && input.seriesId === highlightedItem?.seriesId
      );
    }

    if (highlightedScope.highlighted === 'same-value') {
      return input.value === highlightedItem?.value;
    }

    return false;
  };

const createIsFaded =
  (highlightedScope: HighlightedScope, highlightedItem: HighlightedItemData | null) =>
  (input: HighlightedItemData): boolean => {
    if (!highlightedScope) {
      return false;
    }

    if (highlightedScope.faded === 'same-series' || highlightedScope.faded === 'series') {
      return (
        input.seriesId === highlightedItem?.seriesId && input.itemId !== highlightedItem?.itemId
      );
    }

    if (highlightedScope.faded === 'other-series') {
      return input.seriesId !== highlightedItem?.seriesId;
    }

    if (highlightedScope.faded === 'same-value') {
      return input.value === highlightedItem?.value && input.itemId !== highlightedItem?.itemId;
    }

    if (highlightedScope.faded === 'other-value') {
      return input.value !== highlightedItem?.value;
    }

    if (highlightedScope.faded === 'global') {
      return (
        input.seriesId !== highlightedItem?.seriesId ||
        input.itemId !== highlightedItem?.itemId ||
        input.value !== highlightedItem?.value
      );
    }

    return false;
  };

export const highlightedReducer: React.Reducer<
  Omit<HighlightedState, 'setHighlighted' | 'clearHighlighted'>,
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
