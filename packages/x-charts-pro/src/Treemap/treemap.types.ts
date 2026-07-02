'use client';

import type { SeriesId } from '@mui/x-charts/internals';
import type { DefaultizedProps } from '@mui/x-internals/types';
import type { TreemapHighlightScope } from './treemap.highlight.types';

export type TreemapItemId = string | number;

/**
 * A user-facing treemap node. Nodes nest recursively through `children`.
 * Leaves carry a `value`; parents derive their value from the sum of their descendants.
 */
export interface TreemapSeriesData {
  /**
   * Unique identifier for the node. Defaulted from the node path when omitted.
   */
  id?: TreemapItemId;
  /**
   * The label displayed on the tile and in the tooltip. Defaults to the node id.
   */
  label?: string;
  /**
   * The size of a leaf node. Ignored on nodes that have children.
   */
  value?: number;
  /**
   * Color override for this node. Wins over the palette.
   */
  color?: string;
  /**
   * Arbitrary payload surfaced to the tooltip and value formatter.
   */
  data?: any;
  /**
   * The children of this node.
   */
  children?: readonly TreemapSeriesData[];
}

export type TreemapTilingMethod = 'squarify' | 'binary' | 'slice' | 'dice' | 'sliceDice';

export interface TreemapTilingOptions {
  /**
   * The tiling algorithm used to subdivide a node into its children.
   * @default 'squarify'
   */
  method?: TreemapTilingMethod;
  /**
   * Shorthand that sets both `paddingInner` and `paddingOuter`, in pixels.
   */
  padding?: number;
  /**
   * The gap between sibling tiles, in pixels.
   * @default 2
   */
  paddingInner?: number;
  /**
   * Shorthand that sets `paddingTop`, `paddingRight`, `paddingBottom` and `paddingLeft`, in pixels.
   * @default 2
   */
  paddingOuter?: number;
  /**
   * The inset at the top of a node before laying out its children, in pixels.
   * By default, it reserves a header band sized to fit the group's label.
   */
  paddingTop?: number;
  /**
   * The inset at the right of a node before laying out its children, in pixels.
   */
  paddingRight?: number;
  /**
   * The inset at the bottom of a node before laying out its children, in pixels.
   */
  paddingBottom?: number;
  /**
   * The inset at the left of a node before laying out its children, in pixels.
   */
  paddingLeft?: number;
  /**
   * How to sort sibling nodes.
   * - 'auto': descending by value.
   * - 'fixed': preserve the order from the data.
   * @default 'auto'
   */
  sort?: 'auto' | 'fixed';
}

export interface TreemapNodeOptions extends TreemapHighlightScope {
  /**
   * Which nodes render a rectangle.
   * - 'leaf': only leaf nodes (classic treemap).
   * - 'all': nested group tiles plus leaves.
   * @default 'all'
   */
  renderMode?: 'leaf' | 'all';
  /**
   * Controls which tiles display a label.
   * - `true` (default): every rendered tile is labeled.
   * - `false`: no labels.
   * - a function: called per tile, return `true` to display its label.
   * @default true
   */
  showLabels?: boolean | ((node: TreemapLayoutNode) => boolean);
  /**
   * The padding between a tile's edge and its label, in pixels.
   * A number applies to both axes, or pass `{ x, y }` to set each independently.
   * @default 4
   */
  labelPadding?: number | { x?: number; y?: number };
  /**
   * The border radius of the tiles, in pixels.
   * @default 0
   */
  borderRadius?: number;
}

export type TreemapValueFormatterContext = {
  /**
   * Where the value will be displayed.
   */
  location: 'tooltip' | 'label';
  /**
   * The id of the node being formatted.
   */
  nodeId: TreemapItemId;
  /**
   * The depth of the node (0 = root).
   */
  depth: number;
};

export interface TreemapSeriesType {
  /**
   * Unique identifier for the series.
   */
  id?: SeriesId;
  /**
   * Type identifier for the treemap series.
   */
  type: 'treemap';
  /**
   * The hierarchical data. Either a single root node or an array of root nodes
   * (which are wrapped in a synthetic root).
   */
  data: TreemapSeriesData | readonly TreemapSeriesData[];
  /**
   * Options for the tiling algorithm and padding.
   */
  tiling?: TreemapTilingOptions;
  /**
   * Options for the nodes style, layout, and interaction behavior.
   */
  nodeOptions?: TreemapNodeOptions;
  /**
   * Formatter used to render values in the tooltip or on labels.
   * @param {number} value The value to render.
   * @param {TreemapValueFormatterContext} context The rendering context of the value.
   * @returns {string | null} The formatted value to display.
   */
  valueFormatter?: (value: number, context: TreemapValueFormatterContext) => string | null;
}

// ---------------------------------------------------------------------------------------
// Layout — mirrors the Sankey `WithPosition` pattern. d3-hierarchy types never leak here.

export interface TreemapLayoutNodeProperties {
  /**
   * Unique identifier for the node.
   */
  id: TreemapItemId;
  /**
   * The node label.
   */
  label: string;
  /**
   * The resolved fill color.
   */
  color: string;
  /**
   * The node value (summed for parents).
   */
  value: number;
  /**
   * Depth in the hierarchy (0 = root).
   */
  depth: number;
  /**
   * Distance to the deepest leaf below this node (0 = leaf).
   */
  height: number;
  /**
   * The id of the parent node, or `null` for the root.
   */
  parentId: TreemapItemId | null;
  /**
   * The ids of the direct children.
   */
  childrenIds: readonly TreemapItemId[];
  /**
   * Arbitrary payload provided on the data node.
   */
  data?: any;
}

export interface TreemapLayoutNodeWithPosition extends TreemapLayoutNodeProperties {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

/**
 * A node of the computed treemap layout.
 * When `WithPosition` is `true` the node carries its resolved coordinates.
 */
export type TreemapLayoutNode<WithPosition extends boolean = true> = WithPosition extends true
  ? TreemapLayoutNodeWithPosition
  : TreemapLayoutNodeProperties;

/**
 * The computed treemap layout. `nodes` are painter-ordered (parents before children).
 */
export interface TreemapLayout<WithPosition extends boolean = true> {
  nodes: readonly TreemapLayoutNode<WithPosition>[];
  rootId: TreemapItemId;
  byId: Map<TreemapItemId, TreemapLayoutNode<WithPosition>>;
}

export interface DefaultizedTreemapSeriesType extends DefaultizedProps<
  Omit<TreemapSeriesType, 'data'>,
  'id' | 'valueFormatter'
> {
  /**
   * The normalized hierarchy with summed values and resolved colors, without positions.
   */
  data: TreemapLayout<false>;
  /**
   * Highlight scope derived from `nodeOptions`.
   */
  highlightScope: TreemapHighlightScope;
}

// ---------------------------------------------------------------------------------------
// Identifiers

export interface TreemapItemIdentifier {
  type: 'treemap';
  /**
   * Unique identifier for the series.
   */
  seriesId: SeriesId;
  /**
   * The id of the node.
   */
  nodeId: TreemapItemId;
}

export type TreemapItemIdentifierWithData<WithPosition extends boolean = true> =
  TreemapItemIdentifier & {
    /**
     * The layout node with all computed properties.
     */
    node: TreemapLayoutNode<WithPosition>;
  };
