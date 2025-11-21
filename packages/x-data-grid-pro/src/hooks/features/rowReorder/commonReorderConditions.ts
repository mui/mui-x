import {
  gridExpandedSortedRowIndexLookupSelector,
  gridRowTreeSelector,
  type GridGroupNode,
} from '@mui/x-data-grid';
import type { ReorderValidationContext as Ctx } from './models';

/**
 * Reusable validation conditions for row reordering validation
 */
export const commonReorderConditions = {
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
      const node = gridRowTreeSelector(ctx.apiRef)[currentId];
      if (!node) {
        break;
      }
      currentId = node.parent;
    }
    return false;
  },

  // Position checks
  isAdjacentPosition: (ctx: Ctx) => {
    const expandedSortedRowIndexLookup = gridExpandedSortedRowIndexLookupSelector(ctx.apiRef);
    const sourceRowIndex = expandedSortedRowIndexLookup[ctx.sourceNode.id];
    const targetRowIndex = expandedSortedRowIndexLookup[ctx.targetNode.id];
    const dropPosition = ctx.dropPosition;
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
    const rowTree = gridRowTreeSelector(ctx.apiRef);
    const targetGroup = ctx.targetNode as GridGroupNode;
    const firstChild = targetGroup.children?.[0] ? rowTree[targetGroup.children[0]] : null;
    return firstChild?.type === 'group' && firstChild.depth === ctx.sourceNode.depth;
  },

  targetFirstChildDepthEqualsSource: (ctx: Ctx) => {
    if (ctx.targetNode.type !== 'group') {
      return false;
    }
    const rowTree = gridRowTreeSelector(ctx.apiRef);
    const targetGroup = ctx.targetNode as GridGroupNode;
    const firstChild = targetGroup.children?.[0] ? rowTree[targetGroup.children[0]] : null;
    return firstChild ? firstChild.depth === ctx.sourceNode.depth : false;
  },
};
