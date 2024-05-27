import * as React from 'react';
import { SeriesId } from '../../models/seriesType/common';

/**
 * The data of the highlighted item.
 * To highlight an item, you need to provide the series id and the item id.
 * If targeting the whole series, you can omit the item id.
 * To clear the highlight, set the value to an empty object.
 *
 * @example
 * // Highlight the item with the series id 'london' and the item at 0.
 * { seriesId: 'london', path: '0' }
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
   * The path to access the data.
   * - On Cartesian charts, the path is the dataIndex of the series.
   * - On Pie charts, the path is the index of the data.
   */
  path?: string | string[];
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
  highlightScope?: Partial<HighlightScope>;
  highlightedItem: HighlightItemData | null;
  setHighlighted: (item: HighlightItemData) => void;
  clearHighlighted: () => void;
  isHighlighted: (input: HighlightItemData) => boolean;
  isFaded: (input: HighlightItemData) => boolean;
};

export const HighlightedContext = React.createContext<HighlightedState>({
  highlightedItem: null,
  setHighlighted: () => {},
  clearHighlighted: () => {},
  isHighlighted: () => false,
  isFaded: () => false,
});

if (process.env.NODE_ENV !== 'production') {
  HighlightedContext.displayName = 'HighlightedContext';
}
