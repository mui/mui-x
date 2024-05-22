import * as React from 'react';

export type HighlightedItemData = {
  seriesId: string;
  itemId: string;
  value: string;
};

export type HighlightedScope = {
  highlighted?: 'same-series' | 'same-value' | 'item' | 'none';
  faded?: 'same-series' | 'other-series' | 'same-value' | 'other-value' | 'global' | 'none';
} | null;

export type HighlightedState = {
  options: HighlightedScope | null;
  highlightedItem: HighlightedItemData | null;
  setOptions: (options: Omit<HighlightedScope, 'itemData'>) => void;
  clearOptions: () => void;
  setHighlighted: (options: NonNullable<HighlightedItemData>) => void;
  clearHighlighted: () => void;
  isHighlighted: (input: HighlightedItemData) => boolean;
  isFaded: (input: HighlightedItemData) => boolean;
};

export const HighlightedContext = React.createContext<HighlightedState>({
  options: null,
  highlightedItem: null,
  setOptions: () => {},
  clearOptions: () => {},
  setHighlighted: () => {},
  clearHighlighted: () => {},
  isHighlighted: () => false,
  isFaded: () => false,
});

if (process.env.NODE_ENV !== 'production') {
  HighlightedContext.displayName = 'HighlightContext';
}
