export type HighlightOptions = 'none' | 'item' | 'series' | 'group';

export type FadeOptions = 'none' | 'series' | 'global';

export type HighlightScope = {
  /**
   * The scope of highlighted elements.
   * - 'none': no highlight.
   * - 'item': only highlight the item.
   * - 'series': highlight all elements of the same series.
   * - 'group': highlight all elements of the same group.
   * @default 'none'
   */
  highlight?: HighlightOptions;
  /**
   * The scope of faded elements.
   * - 'none': no fading.
   * - 'series': only fade element of the same series.
   * - 'global': fade all elements that are not highlighted.
   * @default 'none'
   */
  fade?: FadeOptions;
};
