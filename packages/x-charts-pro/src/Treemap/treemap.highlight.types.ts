'use client';

export type TreemapHighlight = 'node' | 'children' | 'parents' | 'parent' | 'child' | 'none';
export type TreemapFade = 'node' | 'children' | 'parents' | 'global' | 'none';

export type TreemapHighlightScope = {
  /**
   * Highlight mode for the hovered tile.
   * - 'node': Highlight the hovered tile only.
   * - 'children': Highlight the hovered tile and all of its descendants.
   * - 'parents': Highlight the hovered tile and all of its ancestors.
   * - 'parent': Highlight the hovered tile and its immediate parent.
   * - 'child': Highlight the hovered tile and its immediate children.
   * - 'none': No highlighting.
   * @default 'node'
   */
  highlight?: TreemapHighlight;
  /**
   * Fade mode for the tiles that are not highlighted.
   * - 'node': Fade the hovered tile.
   * - 'children': Fade the hovered tile and all of its descendants.
   * - 'parents': Fade the hovered tile and all of its ancestors.
   * - 'global': Fade every tile that is not highlighted.
   * - 'none': No fading.
   * @default 'none'
   */
  fade?: TreemapFade;
};
