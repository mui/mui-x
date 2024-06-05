import * as React from 'react';
import { SeriesId } from '../../models/seriesType/common';
import { Initializable } from '../context.types';

/**
 * The data of the highlighted item.
 * To highlight an item, you need to provide the series id and the item id.
 * If targeting the whole series, you can omit the item id.
 * To clear the highlight, set the value to an empty object.
 *
 * @example
 * // Highlight the item with the series id 'london' and the item id 0.
 * { seriesId: 'london', dataIndex: 0 }
 *
 * // Highlight the whole series with the series id 'london'.
 * { seriesId: 'london' }
 *
 * // Clear the highlight.
 * {}
 */
export type HighlightItemData = {
  /**
   * The series id of the highlighted item.
   */
  seriesId?: SeriesId;
  /**
   * The index of the item in series data.
   */
  dataIndex?: number;
};

export type HighlightOptions = 'none' | 'item' | 'series';

export type FadeOptions = 'none' | 'series' | 'global';

export type HighlightScope = {
  /**
   * @deprecated Use `highlight` instead.
   */
  highlighted?: HighlightOptions;
  /**
   * The scope of highlighted elements.
   * - 'none': no highlight.
   * - 'item': only highlight the item.
   * - 'series': highlight all elements of the same series.
   * @default 'none'
   */
  highlight?: HighlightOptions;
  /**
   * @deprecated Use `fade` instead.
   */
  faded?: FadeOptions;
  /**
   * The scope of faded elements.
   * - 'none': no fading.
   * - 'series': only fade element of the same series.
   * - 'global': fade all elements that are not highlighted.
   * @default 'none'
   */
  fade?: FadeOptions;
};

export type HighlightedState = {
  highlightScope?: Partial<HighlightScope>;
  highlightedItem: HighlightItemData | null;
  setHighlighted: (item: HighlightItemData) => void;
  clearHighlighted: () => void;
  isHighlighted: (input: HighlightItemData) => boolean;
  isFaded: (input: HighlightItemData) => boolean;
};

export const HighlightedContext = React.createContext<Initializable<HighlightedState>>({
  isInitialized: false,
  data: {
    highlightedItem: null,
    setHighlighted: () => {},
    clearHighlighted: () => {},
    isHighlighted: () => false,
    isFaded: () => false,
  },
});

if (process.env.NODE_ENV !== 'production') {
  HighlightedContext.displayName = 'HighlightedContext';
}
