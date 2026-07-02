import {
  treemapSquarify,
  treemapBinary,
  treemapDice,
  treemapSlice,
  treemapSliceDice,
} from '@mui/x-charts-vendor/d3-hierarchy';
import type { TreemapItemId, TreemapLayout, TreemapTilingMethod } from './treemap.types';
import type { TreemapHighlight } from './treemap.highlight.types';

/** Id assigned to the synthetic root wrapping an array of root nodes. */
export const TREEMAP_ROOT_ID = '__mui-treemap-root__';

/** Padding, in pixels, between a tile's edge and its label. */
export const TREEMAP_LABEL_PADDING = 4;

/** Default gap, in pixels, between tiles (inner and outer padding). */
export const DEFAULT_TILE_PADDING = 2;

/** Resolves the `labelPadding` option to explicit x/y pixel values. */
export function resolveLabelPadding(
  labelPadding: number | { x?: number; y?: number } | undefined,
): { x: number; y: number } {
  if (labelPadding == null) {
    return { x: TREEMAP_LABEL_PADDING, y: TREEMAP_LABEL_PADDING };
  }
  if (typeof labelPadding === 'number') {
    return { x: labelPadding, y: labelPadding };
  }
  return {
    x: labelPadding.x ?? TREEMAP_LABEL_PADDING,
    y: labelPadding.y ?? TREEMAP_LABEL_PADDING,
  };
}

/**
 * Maps a public tiling method name to the corresponding d3-hierarchy tile function.
 */
export function getTilingMethod(method: TreemapTilingMethod = 'squarify') {
  switch (method) {
    case 'binary':
      return treemapBinary;
    case 'slice':
      return treemapSlice;
    case 'dice':
      return treemapDice;
    case 'sliceDice':
      return treemapSliceDice;
    case 'squarify':
    default:
      return treemapSquarify;
  }
}

/** Whether `ancestorId` is a (strict) ancestor of `nodeId` in the layout tree. */
function isTreemapAncestor(
  layout: TreemapLayout,
  ancestorId: TreemapItemId,
  nodeId: TreemapItemId,
): boolean {
  let currentId = layout.byId.get(nodeId)?.parentId ?? null;
  while (currentId != null) {
    if (currentId === ancestorId) {
      return true;
    }
    currentId = layout.byId.get(currentId)?.parentId ?? null;
  }
  return false;
}

/**
 * Whether the tile `targetId` should be highlighted given the `highlight` scope and the
 * currently hovered tile `hoveredId`. The hovered tile is always highlighted.
 */
export function isTreemapNodeHighlighted(
  layout: TreemapLayout,
  highlight: TreemapHighlight,
  hoveredId: TreemapItemId,
  targetId: TreemapItemId,
): boolean {
  if (highlight === 'none') {
    return false;
  }
  if (targetId === hoveredId) {
    return true;
  }
  const hovered = layout.byId.get(hoveredId);
  const target = layout.byId.get(targetId);
  if (!hovered || !target) {
    return false;
  }
  switch (highlight) {
    case 'parent':
      return targetId === hovered.parentId;
    case 'child':
      return target.parentId === hoveredId;
    case 'parents':
      return isTreemapAncestor(layout, targetId, hoveredId);
    case 'children':
      return isTreemapAncestor(layout, hoveredId, targetId);
    case 'node':
    default:
      return false;
  }
}
