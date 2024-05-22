/**
 * @deprecated Use `HighlightedScope` instead. If using `'series'` change it to `'same-series'`.
 */
export type HighlightOptions = 'none' | 'item' | 'series';

/**
 * @deprecated Use `HighlightedScope` instead. If using `'series'` change it to `'same-series'`.
 */
export type FadeOptions = 'none' | 'series' | 'global';

/**
 * @deprecated Use `HighlightedScope` instead. If using `'series'` change it to `'same-series'`.
 */
export type HighlightScope = {
  /**
   * The scope of highlighted elements.
   * - 'none': no highlight.
   * - 'item': only highlight the item.
   * - 'series': highlight all elements of the same series.
   * @default 'none'
   */
  highlighted: HighlightOptions;
  /**
   * The scope of faded elements.
   * - 'none': no fading.
   * - 'series': only fade element of the same series.
   * - 'global': fade all elements that are not highlighted.
   * @default 'none'
   */
  faded: FadeOptions;
};
