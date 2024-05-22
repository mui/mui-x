import * as React from 'react';
import { SeriesId } from '../../models/seriesType/common';

export type HighlightedItemData = {
  /**
   * The series id of the highlighted item.
   */
  seriesId: SeriesId;
  /**
   * The item id of the highlighted item. Usually, it is the index of the data.
   */
  itemId?: number;
};

export type HighlightedScope = {
  /**
   * The scope of highlighted elements.
   * - 'none': no highlight.
   * - 'item': only highlight the item.
   * - 'series': highlight all elements of the same series.
   * @default 'none'
   */
  highlighted?: 'same-series' | 'item' | 'none';
  /**
   * The scope of faded elements.
   * - 'none': no fading.
   * - 'series': only fade element of the same series.
   * - 'global': fade all elements that are not highlighted.
   * @default 'none'
   */
  faded?: 'same-series' | 'global' | 'none';
};

export type HighlightedState = {
  options?: HighlightedScope;
  highlightedItem: HighlightedItemData | null;
  setHighlighted: (options: NonNullable<HighlightedItemData>) => void;
  clearHighlighted: () => void;
  isHighlighted: (input: HighlightedItemData) => boolean;
  isFaded: (input: HighlightedItemData) => boolean;
};

export const HighlightedContext = React.createContext<HighlightedState>({
  options: undefined,
  highlightedItem: null,
  setHighlighted: () => {},
  clearHighlighted: () => {},
  isHighlighted: () => false,
  isFaded: () => false,
});

if (process.env.NODE_ENV !== 'production') {
  HighlightedContext.displayName = 'HighlightedContext';
}
