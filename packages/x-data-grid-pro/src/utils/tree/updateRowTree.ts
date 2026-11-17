import { GRID_ROOT_GROUP_ID } from '@mui/x-data-grid';
import type { GridGroupNode, GridRowId, GridRowTreeConfig } from '@mui/x-data-grid';
import { getTreeNodeDescendants } from '@mui/x-data-grid/internals';
import type {
  GridRowsPartialUpdates,
  GridRowTreeCreationValue,
  GridTreeDepths,
} from '@mui/x-data-grid/internals';
import { isDeepEqual } from '@mui/x-internals/isDeepEqual';
import type { GridTreePathDuplicateHandler, RowTreeBuilderNode } from './models';
import { insertDataRowInTree } from './insertDataRowInTree';
import { removeDataRowFromTree } from './removeDataRowFromTree';
import { getNodePathInTree } from './utils';

export interface UpdateRowTreeNodes {
  inserted: RowTreeBuilderNode[];
  modified: RowTreeBuilderNode[];
  removed: GridRowId[];
}

interface UpdateRowTreeParams {
  previousTree: GridRowTreeConfig;
  previousTreeDepth: GridTreeDepths;
  nodes: UpdateRowTreeNodes;
  defaultGroupingExpansionDepth: number;
  isGroupExpandedByDefault?: (node: GridGroupNode) => boolean;
  groupingName: string;
  onDuplicatePath?: GridTreePathDuplicateHandler;
  previousGroupsToFetch?: GridRowId[];
  maxDepth?: number;
  childrenOrder?: GridRowsPartialUpdates['childrenOrder'];
}

/**
 * Reorders the children of a group, which otherwise keep the index they were inserted at.
 */
const applyChildrenOrder = (
  tree: GridRowTreeConfig,
  childrenOrder: NonNullable<UpdateRowTreeParams['childrenOrder']>,
) => {
  const { parentId, ids } = childrenOrder;
  const parentNode = tree[parentId];
  if (parentNode?.type !== 'group') {
    return;
  }

  const orderedChildren = ids.filter((id) => tree[id]?.parent === parentId);
  if (orderedChildren.length === 0) {
    return;
  }

  const orderedChildrenLookup = new Set(orderedChildren);
  // Children the update did not mention go last, in their current order.
  const children = orderedChildren.concat(
    parentNode.children.filter((id) => !orderedChildrenLookup.has(id)),
  );
  if (children.every((id, index) => id === parentNode.children[index])) {
    return;
  }

  tree[parentId] = { ...parentNode, children };
};

export const updateRowTree = (params: UpdateRowTreeParams): GridRowTreeCreationValue => {
  const tree = { ...params.previousTree };
  const treeDepths = { ...params.previousTreeDepth };
  const groupsToFetch = params.previousGroupsToFetch
    ? new Set([...params.previousGroupsToFetch])
    : new Set([]);

  for (let i = 0; i < params.nodes.inserted.length; i += 1) {
    const { id, path, serverChildrenCount } = params.nodes.inserted[i];

    insertDataRowInTree({
      previousTree: params.previousTree,
      tree,
      treeDepths,
      id,
      path,
      serverChildrenCount,
      onDuplicatePath: params.onDuplicatePath,
      isGroupExpandedByDefault: params.isGroupExpandedByDefault,
      defaultGroupingExpansionDepth: params.defaultGroupingExpansionDepth,
      groupsToFetch,
      maxDepth: params.maxDepth,
    });
  }

  for (let i = 0; i < params.nodes.removed.length; i += 1) {
    const nodeId = params.nodes.removed[i];

    removeDataRowFromTree({
      tree,
      treeDepths,
      id: nodeId,
      groupingName: params.groupingName,
    });
  }

  for (let i = 0; i < params.nodes.modified.length; i += 1) {
    const { id, path, serverChildrenCount } = params.nodes.modified[i];
    const pathInPreviousTree = getNodePathInTree({ tree, id });
    const isInSameGroup = isDeepEqual(pathInPreviousTree, path);

    if (!isInSameGroup) {
      removeDataRowFromTree({
        tree,
        treeDepths,
        id,
        groupingName: params.groupingName,
      });

      insertDataRowInTree({
        previousTree: params.previousTree,
        tree,
        treeDepths,
        id,
        path,
        serverChildrenCount,
        onDuplicatePath: params.onDuplicatePath,
        isGroupExpandedByDefault: params.isGroupExpandedByDefault,
        defaultGroupingExpansionDepth: params.defaultGroupingExpansionDepth,
        groupsToFetch,
        maxDepth: params.maxDepth,
      });
    }
  }

  if (params.childrenOrder) {
    applyChildrenOrder(tree, params.childrenOrder);
  }

  // TODO rows v6: Avoid walking the whole tree, we should be able to generate the new list only using slices.
  const dataRowIds = getTreeNodeDescendants(tree, GRID_ROOT_GROUP_ID, true);

  return {
    tree,
    treeDepths,
    groupingName: params.groupingName,
    dataRowIds,
    groupsToFetch: Array.from(groupsToFetch),
  };
};
