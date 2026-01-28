import {
  GRID_ROOT_GROUP_ID,
  type GridGroupNode,
  type GridRowId,
  type GridRowTreeConfig,
} from '@mui/x-data-grid';
import {
  type GridRowTreeCreationValue,
  type GridTreeDepths,
  getTreeNodeDescendants,
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
}

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
