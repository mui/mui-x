import type { RefObject } from '@mui/x-internals/types';
import {
  GRID_ROOT_GROUP_ID,
  gridRowNodeSelector,
  type GridRowId,
  type GridTreeNode,
  type GridGroupNode,
  type GridRowTreeConfig,
  type GridLeafNode,
} from '@mui/x-data-grid-pro';
import type { RowTreeBuilderGroupingCriterion } from '@mui/x-data-grid-pro/internals';
import type { ReorderValidationContext as Ctx, ReorderOperationType } from './types';
import type { GridPrivateApiPremium } from '../../../models/gridApiPremium';

// TODO: Share these conditions with the executor by making the contexts similar
/**
 * Reusable validation conditions for row reordering validation
 */
export const conditions = {
  // Node type checks
  isGroupToGroup: (ctx: Ctx) => ctx.sourceNode.type === 'group' && ctx.targetNode.type === 'group',

  isLeafToLeaf: (ctx: Ctx) => ctx.sourceNode.type === 'leaf' && ctx.targetNode.type === 'leaf',

  isLeafToGroup: (ctx: Ctx) => ctx.sourceNode.type === 'leaf' && ctx.targetNode.type === 'group',

  isGroupToLeaf: (ctx: Ctx) => ctx.sourceNode.type === 'group' && ctx.targetNode.type === 'leaf',

  // Drop position checks
  isDropAbove: (ctx: Ctx) => ctx.dropPosition === 'above',
  isDropBelow: (ctx: Ctx) => ctx.dropPosition === 'below',

  // Depth checks
  sameDepth: (ctx: Ctx) => ctx.sourceNode.depth === ctx.targetNode.depth,

  sourceDepthGreater: (ctx: Ctx) => ctx.sourceNode.depth > ctx.targetNode.depth,

  targetDepthIsSourceMinusOne: (ctx: Ctx) => ctx.targetNode.depth === ctx.sourceNode.depth - 1,

  // Parent checks
  sameParent: (ctx: Ctx) => ctx.sourceNode.parent === ctx.targetNode.parent,

  // Node state checks
  targetGroupExpanded: (ctx: Ctx) =>
    (ctx.targetNode.type === 'group' && (ctx.targetNode as GridGroupNode).childrenExpanded) ??
    false,

  targetGroupCollapsed: (ctx: Ctx) =>
    ctx.targetNode.type === 'group' && !(ctx.targetNode as GridGroupNode).childrenExpanded,

  // Previous/Next node checks
  hasPrevNode: (ctx: Ctx) => ctx.prevNode !== null,
  hasNextNode: (ctx: Ctx) => ctx.nextNode !== null,

  prevIsLeaf: (ctx: Ctx) => ctx.prevNode?.type === 'leaf',
  prevIsGroup: (ctx: Ctx) => ctx.prevNode?.type === 'group',
  nextIsLeaf: (ctx: Ctx) => ctx.nextNode?.type === 'leaf',
  nextIsGroup: (ctx: Ctx) => ctx.nextNode?.type === 'group',

  prevDepthEquals: (ctx: Ctx, depth: number) => ctx.prevNode?.depth === depth,

  prevDepthEqualsSource: (ctx: Ctx) => ctx.prevNode?.depth === ctx.sourceNode.depth,

  // Complex checks
  prevBelongsToSource: (ctx: Ctx) => {
    if (!ctx.prevNode) {
      return false;
    }
    // Check if prevNode.parent OR any of its ancestors === sourceNode.id
    let currentId = ctx.prevNode.parent;
    while (currentId) {
      if (currentId === ctx.sourceNode.id) {
        return true;
      }
      const node = ctx.rowTree[currentId];
      if (!node) {
        break;
      }
      currentId = node.parent;
    }
    return false;
  },

  // Position checks
  isAdjacentPosition: (ctx: Ctx) => {
    const { sourceRowIndex, targetRowIndex, dropPosition } = ctx;
    return (
      (dropPosition === 'above' && targetRowIndex === sourceRowIndex + 1) ||
      (dropPosition === 'below' && targetRowIndex === sourceRowIndex - 1)
    );
  },

  // First child check
  targetFirstChildIsGroupWithSourceDepth: (ctx: Ctx) => {
    if (ctx.targetNode.type !== 'group') {
      return false;
    }
    const targetGroup = ctx.targetNode as GridGroupNode;
    const firstChild = targetGroup.children?.[0] ? ctx.rowTree[targetGroup.children[0]] : null;
    return firstChild?.type === 'group' && firstChild.depth === ctx.sourceNode.depth;
  },

  targetFirstChildDepthEqualsSource: (ctx: Ctx) => {
    if (ctx.targetNode.type !== 'group') {
      return false;
    }
    const targetGroup = ctx.targetNode as GridGroupNode;
    const firstChild = targetGroup.children?.[0] ? ctx.rowTree[targetGroup.children[0]] : null;
    return firstChild ? firstChild.depth === ctx.sourceNode.depth : false;
  },
};

export function determineOperationType(
  sourceNode: GridTreeNode,
  targetNode: GridTreeNode,
): ReorderOperationType {
  if (sourceNode.parent === targetNode.parent) {
    return 'same-parent-swap';
  }
  if (sourceNode.type === 'leaf') {
    return 'cross-parent-leaf';
  }
  return 'cross-parent-group';
}

export function calculateTargetIndex(
  sourceNode: GridTreeNode,
  targetNode: GridTreeNode,
  isLastChild: boolean,
  rowTree: Record<GridRowId, GridTreeNode>,
): number {
  if (sourceNode.parent === targetNode.parent && !isLastChild) {
    // Same parent: find target's position in parent's children
    const parent = rowTree[sourceNode.parent!] as GridGroupNode;
    return parent.children.findIndex((id) => id === targetNode.id);
  }

  if (isLastChild) {
    // Append at the end
    const targetParent = rowTree[targetNode.parent!] as GridGroupNode;
    return targetParent.children.length;
  }

  // Find position in target parent
  const targetParent = rowTree[targetNode.parent!] as GridGroupNode;
  const targetIndex = targetParent.children.findIndex((id) => id === targetNode.id);
  return targetIndex >= 0 ? targetIndex : 0;
}

// Get the path from a node to the root in the tree
export const getNodePathInTree = ({
  id,
  tree,
}: {
  id: GridRowId;
  tree: GridRowTreeConfig;
}): RowTreeBuilderGroupingCriterion[] => {
  const path: RowTreeBuilderGroupingCriterion[] = [];
  let node = tree[id] as GridGroupNode | GridLeafNode;

  while (node.id !== GRID_ROOT_GROUP_ID) {
    path.push({
      field: node.type === 'leaf' ? null : node.groupingField,
      key: node.groupingKey,
    });

    node = tree[node.parent!] as GridGroupNode | GridLeafNode;
  }

  path.reverse();

  return path;
};

// Recursively collect all leaf node IDs from a group
export const collectAllLeafDescendants = (
  groupNode: GridGroupNode,
  tree: GridRowTreeConfig,
): GridRowId[] => {
  const leafIds: GridRowId[] = [];

  const collectFromNode = (nodeId: GridRowId) => {
    const node = tree[nodeId];
    if (node.type === 'leaf') {
      leafIds.push(nodeId);
    } else if (node.type === 'group') {
      (node as GridGroupNode).children.forEach(collectFromNode);
    }
  };

  groupNode.children.forEach(collectFromNode);
  return leafIds;
};

export function adjustTargetNode(
  sourceNode: GridTreeNode,
  targetNode: GridTreeNode,
  targetIndex: number,
  placeholderIndex: number,
  sortedFilteredRowIds: GridRowId[],
  apiRef: RefObject<GridPrivateApiPremium>,
): { adjustedTargetNode: GridTreeNode; isLastChild: boolean } {
  let adjustedTargetNode: GridTreeNode = targetNode;
  let isLastChild = false;

  // Handle end-of-list case
  if (placeholderIndex >= sortedFilteredRowIds.length && sortedFilteredRowIds.length > 0) {
    isLastChild = true;
  }

  // Case A and B adjustment: Move to last child of parent where target should be the node above
  if (
    targetNode.type === 'group' &&
    sourceNode.parent !== targetNode.parent &&
    sourceNode.depth > targetNode.depth
  ) {
    // Find the first node with the same depth as source before target and quit early if a
    // node with depth < source.depth is found
    let i = targetIndex - 1;
    while (i >= 0) {
      const node = apiRef.current.getRowNode(sortedFilteredRowIds[i]);
      if (node && node.depth < sourceNode.depth) {
        break;
      }
      if (node && node.depth === sourceNode.depth) {
        adjustedTargetNode = node;
        break;
      }
      i -= 1;
    }
  }

  // Case D adjustment: Leaf to group where we need previous leaf
  if (
    sourceNode.type === 'leaf' &&
    targetNode.type === 'group' &&
    targetNode.depth < sourceNode.depth
  ) {
    isLastChild = true;
    const prevIndex = placeholderIndex - 1;
    if (prevIndex >= 0) {
      const prevRowId = sortedFilteredRowIds[prevIndex];
      const leafTargetNode = gridRowNodeSelector(apiRef, prevRowId);
      if (leafTargetNode && leafTargetNode.type === 'leaf') {
        adjustedTargetNode = leafTargetNode;
      }
    }
  }

  return { adjustedTargetNode, isLastChild };
}
