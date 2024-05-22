import * as React from 'react';
import { SeriesId } from '../../models/seriesType/common';

export type HighlightItemData = {
  /**
   * The series id of the highlighted item.
   */
  seriesId: SeriesId;
  /**
   * The item id of the highlighted item. Usually, it is the index of the data.
   */
  itemId?: number | string;
};

export type HighlightOptions = 'none' | 'item' | 'same-series';

export type FadeOptions = 'none' | 'same-series' | 'global';

export type DeprecatedHighlightScope = {
  /**
   * @deprecated Use `highlight` instead.
   */
  highlighted: 'none' | 'item' | 'series';
  /**
   * @deprecated Use `fade` instead.
   */
  faded: 'none' | 'series' | 'global';
};

export type HighlightScope = {
  /**
   * The scope of highlighted elements.
   * - 'none': no highlight.
   * - 'item': only highlight the item.
   * - 'same-series': highlight all elements of the same series.
   * @default 'none'
   */
  highlight?: HighlightOptions;
  /**
   * The scope of faded elements.
   * - 'none': no fading.
   * - 'same-series': only fade element of the same series.
   * - 'global': fade all elements that are not highlighted.
   * @default 'none'
   */
  fade?: FadeOptions;
};

export type HighlightedState = {
  options?: HighlightScope;
  highlightedItem: HighlightItemData | null;
  setHighlighted: (options: NonNullable<HighlightItemData>) => void;
  clearHighlighted: () => void;
  isHighlighted: (input: HighlightItemData) => boolean;
  isFaded: (input: HighlightItemData) => boolean;
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
