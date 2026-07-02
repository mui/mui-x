'use client';

export type TreemapHighlight = 'item' | 'none';
export type TreemapFade = 'global' | 'none';

export type TreemapHighlightScope = {
  /**
   * Highlight mode for the hovered tile.
   * - 'item': Highlight the hovered tile.
   * - 'none': No highlighting.
   * @default 'item'
   */
  highlight?: TreemapHighlight;
  /**
   * Fade mode for the non-highlighted tiles.
   * - 'global': Fade all non-highlighted tiles.
   * - 'none': No fading.
   * @default 'none'
   */
  fade?: TreemapFade;
};
