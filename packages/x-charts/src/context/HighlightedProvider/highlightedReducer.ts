import * as React from 'react';
import { HighlightItemData, HighlightScope, HighlightedState } from './HighlightedContext';

export type HighlightedActionSetHighlighted = {
  type: 'set-highlighted';
  itemData: NonNullable<HighlightItemData>;
};

export type HighlightedActionSetOptions = {
  type: 'set-options';
  options: NonNullable<HighlightScope>;
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
  (highlightScope: HighlightScope | undefined, highlightedItem: HighlightItemData | null) =>
  (input: HighlightItemData): boolean => {
    if (!highlightScope) {
      return false;
    }

    if (
      highlightScope.highlight === 'same-series' ||
      // @ts-expect-error backward compatibility
      highlightScope.highlight === 'series'
    ) {
      return input.seriesId === highlightedItem?.seriesId;
    }

    if (highlightScope.highlight === 'item') {
      return (
        input.itemId === highlightedItem?.itemId && input.seriesId === highlightedItem?.seriesId
      );
    }

    return false;
  };

const createIsFaded =
  (highlightScope: HighlightScope | undefined, highlightedItem: HighlightItemData | null) =>
  (input: HighlightItemData): boolean => {
    if (!highlightScope) {
      return false;
    }

    if (
      highlightScope.fade === 'same-series' ||
      // @ts-expect-error backward compatibility
      highlightScope.fade === 'series'
    ) {
      return (
        input.seriesId === highlightedItem?.seriesId && input.itemId !== highlightedItem?.itemId
      );
    }

    if (highlightScope.fade === 'global') {
      return (
        input.seriesId !== highlightedItem?.seriesId || input.itemId !== highlightedItem?.itemId
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
        options: undefined,
        isFaded: createIsFaded(undefined, state.highlightedItem),
        isHighlighted: createIsHighlighted(undefined, state.highlightedItem),
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
