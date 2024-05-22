import * as React from 'react';
import { SeriesId } from '../../models/seriesType/common';

export type HighlightedItemData = {
  seriesId: SeriesId;
  itemId?: number;
  value?: string;
};

export type HighlightedScope = {
  highlighted?: 'series' | 'same-series' | 'same-value' | 'item' | 'none';
  faded?:
    | 'series'
    | 'same-series'
    | 'other-series'
    | 'same-value'
    | 'other-value'
    | 'global'
    | 'none';
} | null;

export type HighlightedState = {
  options: HighlightedScope | null;
  highlightedItem: HighlightedItemData | null;
  setHighlighted: (options: NonNullable<HighlightedItemData>) => void;
  clearHighlighted: () => void;
  isHighlighted: (input: HighlightedItemData) => boolean;
  isFaded: (input: HighlightedItemData) => boolean;
};

export const HighlightedContext = React.createContext<HighlightedState>({
  options: null,
  highlightedItem: null,
  setHighlighted: () => {},
  clearHighlighted: () => {},
  isHighlighted: () => false,
  isFaded: () => false,
});

if (process.env.NODE_ENV !== 'production') {
  HighlightedContext.displayName = 'HighlightedContext';
}
