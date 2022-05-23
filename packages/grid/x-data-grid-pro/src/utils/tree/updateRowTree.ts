import {
  GRID_ROOT_GROUP_ID,
  GridGroupNode,
  GridRowId,
  GridRowsLookup,
  GridRowTreeConfig,
} from '@mui/x-data-grid';
import { GridRowTreeCreationValue, isDeepEqual } from '@mui/x-data-grid/internals';
import { RowTreeBuilderGroupingCriterion, RowTreeBuilderNode } from './models';
import { insertNodeInTree } from './insertNodeInTree';
import { removeNodeFromTree } from './removeNodeFromTree';

export interface UpdateRowTreeNodes {
  inserted: RowTreeBuilderNode[];
  modified: RowTreeBuilderNode[];
  deleted: GridRowId[];
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
  idRowsLookup: GridRowsLookup;
  idToIdLookup: Record<string, GridRowId>;
  previousTree: GridRowTreeConfig;
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

  // TODO: Retrieve previous tree depth
  let treeDepth = 1;
  const idRowsLookup = { ...params.idRowsLookup };
  const idToIdLookup = { ...params.idToIdLookup };

  for (let i = 0; i < params.nodes.inserted.length; i += 1) {
    const node = params.nodes.inserted[i];

    insertNodeInTree({
      tree,
      idRowsLookup,
      idToIdLookup,
      id: node.id,
      path: node.path,
      onDuplicatePath: params.onDuplicatePath,
    });

    treeDepth = Math.max(treeDepth, node.path.length);
  }

  for (let i = 0; i < params.nodes.deleted.length; i += 1) {
    const nodeId = params.nodes.deleted[i];

    removeNodeFromTree({
      tree,
      idRowsLookup,
      idToIdLookup,
      id: nodeId,
    });
  }

  for (let i = 0; i < params.nodes.modified.length; i += 1) {
    const node = params.nodes.modified[i];

    const pathInPreviousTree = getNodePathInTree(params.previousTree, node.id);
    const isInSameGroup = isDeepEqual(pathInPreviousTree, node.path);

    if (!isInSameGroup) {
      removeNodeFromTree({
        tree,
        idRowsLookup,
        idToIdLookup,
        id: node.id,
      });

      insertNodeInTree({
        tree,
        idRowsLookup,
        idToIdLookup,
        id: node.id,
        path: node.path,
        onDuplicatePath: params.onDuplicatePath,
      });

      treeDepth = Math.max(treeDepth, node.path.length);
    }
  }

  return {
    tree,
    treeDepth,
    idRowsLookup,
    idToIdLookup,
    groupingName: params.groupingName,
  };
};
