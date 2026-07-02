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

function collectTreemapDescendants(
  layout: TreemapLayout,
  nodeId: TreemapItemId,
  set: Set<TreemapItemId>,
) {
  layout.byId.get(nodeId)?.childrenIds.forEach((childId) => {
    set.add(childId);
    collectTreemapDescendants(layout, childId, set);
  });
}

function collectTreemapAncestors(
  layout: TreemapLayout,
  nodeId: TreemapItemId,
  set: Set<TreemapItemId>,
) {
  let currentId = layout.byId.get(nodeId)?.parentId ?? null;
  while (currentId != null) {
    set.add(currentId);
    currentId = layout.byId.get(currentId)?.parentId ?? null;
  }
}

/**
 * Collects, once per hovered tile, the set of node ids in the given hierarchy scope
 * relative to `hoveredId` (always including the hovered tile itself, except for 'none').
 * Rendering then does an O(1) `Set.has` lookup per tile instead of a per-tile traversal.
 */
export function collectTreemapScope(
  layout: TreemapLayout,
  scope: TreemapHighlight,
  hoveredId: TreemapItemId,
): Set<TreemapItemId> {
  const set = new Set<TreemapItemId>();
  const hovered = layout.byId.get(hoveredId);
  if (scope === 'none' || !hovered) {
    return set;
  }
  set.add(hoveredId);
  switch (scope) {
    case 'children':
      collectTreemapDescendants(layout, hoveredId, set);
      break;
    case 'parents':
      collectTreemapAncestors(layout, hoveredId, set);
      break;
    case 'parent':
      if (hovered.parentId != null) {
        set.add(hovered.parentId);
      }
      break;
    case 'child':
      hovered.childrenIds.forEach((childId) => set.add(childId));
      break;
    case 'node':
    default:
      break;
  }
  return set;
}
