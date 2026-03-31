import { GRID_ROOT_GROUP_ID, } from '@mui/x-data-grid';
import { buildRootGroup } from '@mui/x-data-grid/internals';
import { insertDataRowInTree } from './insertDataRowInTree';
/**
 * Transform a list of rows into a tree structure where each row references its parent and children.
 */
export const createRowTree = (params) => {
    const dataRowIds = [];
    const tree = {
        [GRID_ROOT_GROUP_ID]: buildRootGroup(),
    };
    const treeDepths = {};
    const groupsToFetch = new Set();
    for (let i = 0; i < params.nodes.length; i += 1) {
        const node = params.nodes[i];
        dataRowIds.push(node.id);
        insertDataRowInTree({
            tree,
            previousTree: params.previousTree,
            id: node.id,
            path: node.path,
            serverChildrenCount: node.serverChildrenCount,
            onDuplicatePath: params.onDuplicatePath,
            treeDepths,
            isGroupExpandedByDefault: params.isGroupExpandedByDefault,
            defaultGroupingExpansionDepth: params.defaultGroupingExpansionDepth,
            groupsToFetch,
            maxDepth: params.maxDepth,
        });
    }
    return {
        tree,
        treeDepths,
        groupingName: params.groupingName,
        dataRowIds,
        groupsToFetch: Array.from(groupsToFetch),
    };
};
