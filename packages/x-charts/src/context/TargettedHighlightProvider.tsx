import * as React from 'react';
import { MakeOptional } from '../models/helpers';

type ItemData = {
  seriesId: string;
  itemId: string;
  value: string;
};

// Highlights a series
type HighlightedSeries = {
  type: 'series';
  highlighted: 'same-series' | 'item' | 'none';
  // global for the case of multiple type of data in composable chart
  faded: 'same-series' | 'other-series' | 'global' | 'none';
} & MakeOptional<ItemData, 'value'>;

// Highlights a value across all series?? (will it have the concept of series?)
type HighlightedValue = {
  type: 'value';
  highlighted: 'same-value' | 'item' | 'none';
  faded: 'same-value' | 'other-value' | 'global' | 'none';
} & ItemData;

type HighlightedOptions = HighlightedValue | HighlightedSeries | null;

type HighlightState = {
  options: HighlightedOptions;
  setHighlighted: (options: HighlightedOptions) => void;
  isHighlighted: (input: ItemData) => boolean;
  isFaded: (input: ItemData) => boolean;
};

export const HighlighContext = React.createContext<HighlightState>({
  options: null,
  setHighlighted: () => {},
  isHighlighted: () => false,
  isFaded: () => false,
});

if (process.env.NODE_ENV !== 'production') {
  HighlighContext.displayName = 'HighlighContext';
}

export const HighlightContext = (options: HighlightedOptions) => {
  const [highlightedOptions, setHighlighted] = React.useState<HighlightedOptions>(null);
  const { type, seriesId, itemId, value, highlighted, faded } = options ?? {};

  React.useEffect(() => {
    setHighlighted(options ?? null);
  }, [options]);

  const isHighlighted = (input: ItemData) => {};

  const isFaded = (input: ItemData) => {};

  return {
    options: highlightedOptions,
    isFaded,
    isHighlighted,
    setHighlighted,
  };
};
