import { gridExpandedSortedRowIndexLookupSelector, gridRowTreeSelector, } from '@mui/x-data-grid';
/**
 * Reusable validation conditions for row reordering validation
 */
export const commonReorderConditions = {
    // Node type checks
    isGroupToGroup: (ctx) => ctx.sourceNode.type === 'group' && ctx.targetNode.type === 'group',
    isLeafToLeaf: (ctx) => ctx.sourceNode.type === 'leaf' && ctx.targetNode.type === 'leaf',
    isLeafToGroup: (ctx) => ctx.sourceNode.type === 'leaf' && ctx.targetNode.type === 'group',
    isGroupToLeaf: (ctx) => ctx.sourceNode.type === 'group' && ctx.targetNode.type === 'leaf',
    // Drop position checks
    isDropAbove: (ctx) => ctx.dropPosition === 'above',
    isDropBelow: (ctx) => ctx.dropPosition === 'below',
    // Depth checks
    sameDepth: (ctx) => ctx.sourceNode.depth === ctx.targetNode.depth,
    sourceDepthGreater: (ctx) => ctx.sourceNode.depth > ctx.targetNode.depth,
    targetDepthIsSourceMinusOne: (ctx) => ctx.targetNode.depth === ctx.sourceNode.depth - 1,
    // Parent checks
    sameParent: (ctx) => ctx.sourceNode.parent === ctx.targetNode.parent,
    // Node state checks
    targetGroupExpanded: (ctx) => (ctx.targetNode.type === 'group' && ctx.targetNode.childrenExpanded) ??
        false,
    targetGroupCollapsed: (ctx) => ctx.targetNode.type === 'group' && !ctx.targetNode.childrenExpanded,
    // Previous/Next node checks
    hasPrevNode: (ctx) => ctx.prevNode !== null,
    hasNextNode: (ctx) => ctx.nextNode !== null,
    prevIsLeaf: (ctx) => ctx.prevNode?.type === 'leaf',
    prevIsGroup: (ctx) => ctx.prevNode?.type === 'group',
    nextIsLeaf: (ctx) => ctx.nextNode?.type === 'leaf',
    nextIsGroup: (ctx) => ctx.nextNode?.type === 'group',
    prevDepthEquals: (ctx, depth) => ctx.prevNode?.depth === depth,
    prevDepthEqualsSource: (ctx) => ctx.prevNode?.depth === ctx.sourceNode.depth,
    // Complex checks
    prevBelongsToSource: (ctx) => {
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
    isAdjacentPosition: (ctx) => {
        const expandedSortedRowIndexLookup = gridExpandedSortedRowIndexLookupSelector(ctx.apiRef);
        const sourceRowIndex = expandedSortedRowIndexLookup[ctx.sourceNode.id];
        const targetRowIndex = expandedSortedRowIndexLookup[ctx.targetNode.id];
        const dropPosition = ctx.dropPosition;
        return ((dropPosition === 'above' && targetRowIndex === sourceRowIndex + 1) ||
            (dropPosition === 'below' && targetRowIndex === sourceRowIndex - 1));
    },
    // First child check
    targetFirstChildIsGroupWithSourceDepth: (ctx) => {
        if (ctx.targetNode.type !== 'group') {
            return false;
        }
        const rowTree = gridRowTreeSelector(ctx.apiRef);
        const targetGroup = ctx.targetNode;
        const firstChild = targetGroup.children?.[0] ? rowTree[targetGroup.children[0]] : null;
        return firstChild?.type === 'group' && firstChild.depth === ctx.sourceNode.depth;
    },
    targetFirstChildDepthEqualsSource: (ctx) => {
        if (ctx.targetNode.type !== 'group') {
            return false;
        }
        const rowTree = gridRowTreeSelector(ctx.apiRef);
        const targetGroup = ctx.targetNode;
        const firstChild = targetGroup.children?.[0] ? rowTree[targetGroup.children[0]] : null;
        return firstChild ? firstChild.depth === ctx.sourceNode.depth : false;
    },
};
