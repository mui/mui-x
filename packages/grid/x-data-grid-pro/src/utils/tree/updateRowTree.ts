import { GRID_ROOT_GROUP_ID, GridGroupNode, GridRowId, GridRowTreeConfig } from '@mui/x-data-grid';
import {
  GridRowTreeCreationValue,
  isDeepEqual,
  getTreeNodeDescendants,
} from '@mui/x-data-grid/internals';
import { RowTreeBuilderGroupingCriterion, RowTreeBuilderNode } from './models';
import { insertDataRowInTree } from './insertDataRowInTree';
import { removeDataRowFromTree } from './removeDataRowFromTree';

export interface UpdateRowTreeNodes {
  inserted: RowTreeBuilderNode[];
  modified: RowTreeBuilderNode[];
  removed: GridRowId[];
}

const getNodePathInTree = (
  tree: GridRowTreeConfig,
  id: GridRowId,
): RowTreeBuilderGroupingCriterion[] => {
  const node = tree[id];

  const parentPath =
    node.parent == null || node.parent === GRID_ROOT_GROUP_ID
      ? []
      : getNodePathInTree(tree, node.parent);

  if (node.type === 'footer') {
    return [...parentPath, { key: '', field: null }];
  }

  if (node.type === 'group') {
    return [...parentPath, { key: node.groupingKey ?? '', field: node.groupingField }];
  }

  return [...parentPath, { key: node.groupingKey ?? '', field: null }];
};

interface UpdateRowTreeParams {
  previousTree: GridRowTreeConfig;
  previousTreeDepth: { [depth: number]: number };
  nodes: UpdateRowTreeNodes;
  defaultGroupingExpansionDepth: number;
  isGroupExpandedByDefault?: (node: GridGroupNode) => boolean;
  groupingName: string;
  onDuplicatePath?: (
    firstId: GridRowId,
    secondId: GridRowId,
    path: RowTreeBuilderGroupingCriterion[],
  ) => void;
}

export const updateRowTree = (params: UpdateRowTreeParams): GridRowTreeCreationValue => {
  const tree = { ...params.previousTree };
  const treeDepths = { ...params.previousTreeDepth };

  for (let i = 0; i < params.nodes.inserted.length; i += 1) {
    const node = params.nodes.inserted[i];

    insertDataRowInTree({
      tree,
      treeDepths,
      id: node.id,
      path: node.path,
      onDuplicatePath: params.onDuplicatePath,
    });
  }

  for (let i = 0; i < params.nodes.removed.length; i += 1) {
    const nodeId = params.nodes.removed[i];

    removeDataRowFromTree({
      tree,
      treeDepths,
      id: nodeId,
    });
  }

  for (let i = 0; i < params.nodes.modified.length; i += 1) {
    const node = params.nodes.modified[i];

    const pathInPreviousTree = getNodePathInTree(params.previousTree, node.id);
    const isInSameGroup = isDeepEqual(pathInPreviousTree, node.path);

    if (!isInSameGroup) {
      removeDataRowFromTree({
        tree,
        treeDepths,
        id: node.id,
      });

      insertDataRowInTree({
        tree,
        treeDepths,
        id: node.id,
        path: node.path,
        onDuplicatePath: params.onDuplicatePath,
      });
    }
  }

  const dataRowIds = getTreeNodeDescendants(tree, GRID_ROOT_GROUP_ID, true);

  return {
    tree,
    treeDepths,
    groupingName: params.groupingName,
    dataRowIds,
  };
};
