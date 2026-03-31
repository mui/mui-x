import { GRID_ROOT_GROUP_ID, } from '@mui/x-data-grid';
import { defaultGridFilterLookup, getTreeNodeDescendants, } from '@mui/x-data-grid/internals';
export function skipFiltering(rowTree) {
    const filteredChildrenCountLookup = {};
    const nodes = Object.values(rowTree);
    for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i];
        filteredChildrenCountLookup[node.id] = node.serverChildrenCount ?? 0;
    }
    return {
        filteredRowsLookup: defaultGridFilterLookup.filteredRowsLookup,
        filteredChildrenCountLookup,
        filteredDescendantCountLookup: defaultGridFilterLookup.filteredDescendantCountLookup,
    };
}
export function skipSorting(rowTree) {
    return getTreeNodeDescendants(rowTree, GRID_ROOT_GROUP_ID, false);
}
/**
 * Retrieves the parent path for a row from the previous tree state.
 * Used during full tree updates to maintain correct hierarchy.
 *
 * Uses the parent node's `path` property, which stores the group keys
 * representing the full path to the parent (i.e. the keys used to fetch the current node).
 */
export function getParentPath(rowId, treeCreationParams) {
    if (treeCreationParams.updates.type !== 'full' ||
        !treeCreationParams.previousTree?.[rowId] ||
        treeCreationParams.previousTree[rowId].depth < 1) {
        return [];
    }
    const node = treeCreationParams.previousTree[rowId];
    const parentId = node.parent;
    if (parentId == null) {
        return [];
    }
    const parentNode = treeCreationParams.previousTree[parentId];
    if (parentNode && 'path' in parentNode) {
        return parentNode.path || [];
    }
    return [];
}
