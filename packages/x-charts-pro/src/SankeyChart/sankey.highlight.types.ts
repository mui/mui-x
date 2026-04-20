'use client';

export type SankeyNodeHighlight = 'nodes' | 'links' | 'incoming' | 'outgoing' | 'none';
export type SankeyNodeFade = 'global' | 'none';
export type SankeyLinkHighlight = 'links' | 'nodes' | 'source' | 'target' | 'none';
export type SankeyLinkFade = 'global' | 'none';

export type SankeyNodeHighlightScope = {
  /**
   * Highlight mode for nodes
   * - 'nodes': Highlight hovered node
   * - 'links': Highlight links connected to hovered node
   * - 'incoming': Highlight incoming links to hovered node
   * - 'outgoing': Highlight outgoing links from hovered node
   * - 'none': No highlighting
   * @default 'links'
   */
  highlight?: SankeyNodeHighlight;
  /**
   * Fade mode for nodes
   * - 'global': Fade all non-highlighted items
   * - 'none': No fading
   * @default 'none'
   */
  fade?: SankeyNodeFade;
};

export type SankeyLinkHighlightScope = {
  /**
   * Highlight mode for links
   * - 'links': Highlight hovered link
   * - 'nodes': Highlight nodes connected to hovered link
   * - 'source': Highlight source node of hovered link
   * - 'target': Highlight target node of hovered link
   * - 'none': No highlighting
   * @default 'links'
   */
  highlight?: SankeyLinkHighlight;
  /**
   * Fade mode for links
   * - 'global': Fade all non-highlighted items
   * - 'none': No fading
   * @default 'none'
   */
  fade?: SankeyLinkFade;
};

export type SankeyHighlightScope = {
  nodes: SankeyNodeHighlightScope;
  links: SankeyLinkHighlightScope;
};
