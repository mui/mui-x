import * as React from 'react';
import { MakeOptional } from '../../models/helpers';

export type HighlightItemData = {
  seriesId: string;
  itemId: string;
  value: string;
};

export type HighlightedSeries = {
  type: 'series';
  highlighted: 'same-series' | 'item' | 'none';
  faded: 'same-series' | 'other-series' | 'global' | 'none';
} & MakeOptional<HighlightItemData, 'value'>;

export type HighlightedValue = {
  type: 'value';
  highlighted: 'same-value' | 'item' | 'none';
  faded: 'same-value' | 'other-value' | 'global' | 'none';
} & HighlightItemData;

export type HighlightedOptions = HighlightedValue | HighlightedSeries | null;

export type HighlightedState = {
  options: HighlightedOptions;
  setHighlighted: (options: NonNullable<HighlightedOptions>) => void;
  clearHighlighted: () => void;
  isHighlighted: (input: HighlightItemData) => boolean;
  isFaded: (input: HighlightItemData) => boolean;
};

export const HighlightedContext = React.createContext<HighlightedState>({
  options: null,
  setHighlighted: () => {},
  clearHighlighted: () => {},
  isHighlighted: () => false,
  isFaded: () => false,
});

if (process.env.NODE_ENV !== 'production') {
  HighlightedContext.displayName = 'HighlightContext';
}
