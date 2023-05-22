import {
  GRID_ROOT_GROUP_ID,
  GridGroupNode,
  GridRowId,
  GridRowTreeConfig,
  GridTreeNode,
} from '@mui/x-data-grid';
import { GridTreeDepths, GridRowTreeUpdatedGroupsManager } from '@mui/x-data-grid/internals';
import {
  getNodePathInTree,
  getGroupRowIdFromPath,
  removeNodeFromTree,
  updateGroupNodeIdAndAutoGenerated,
} from './utils';

interface RemoveDataRowFromTreeParams {
  /**
   * ID of the data row to remove from the tree.
   */
  id: GridRowId;
  /**
   * Tree from which to remove the data row.
   * This tree can be mutated but it's children should not.
   * For instance:
   *
   * - `tree[nodeId] = newNode` => valid
   * - `tree[nodeId].children.push(newNodeId)` => invalid
   */
  tree: GridRowTreeConfig;
  /**
   * Amount of nodes at each depth of the tree.
   * This object can be mutated.
   * For instance:
   *
   * - `treeDepths[nodeDepth] = treeDepth[nodeDepth] + 1` => valid
   */
  treeDepths: GridTreeDepths;
  /**
   * Object tracking the action performed on each group.
   * Used to decide which groups to refresh on sorting, filtering, aggregation, ...
   * If not defined, then the tracking will be skipped.
   */
  updatedGroupsManager?: GridRowTreeUpdatedGroupsManager;
}

const removeNodeAndCleanParent = ({
  node,
  tree,
  treeDepths,
  updatedGroupsManager,
}: {
  node: GridTreeNode;
  tree: GridRowTreeConfig;
  treeDepths: GridTreeDepths;
  updatedGroupsManager?: GridRowTreeUpdatedGroupsManager;
}) => {
  removeNodeFromTree({
    node,
    tree,
    treeDepths,
  });

  if (node.type === 'group' && node.footerId != null) {
    removeNodeFromTree({
      node: tree[node.footerId],
      tree,
      treeDepths,
    });
  }

  const parentNode = tree[node.parent!] as GridGroupNode;

  updatedGroupsManager?.addAction(parentNode.id, 'removeChildren');

  const shouldDeleteGroup =
    parentNode.id !== GRID_ROOT_GROUP_ID && parentNode.children.length === 0;
  if (shouldDeleteGroup) {
    if (parentNode.isAutoGenerated) {
      removeNodeAndCleanParent({ node: parentNode, tree, treeDepths });
    } else {
      tree[parentNode.id] = {
        type: 'leaf',
        id: parentNode.id,
        depth: parentNode.depth,
        parent: parentNode.parent!,
        groupingKey: parentNode.groupingKey,
      };
    }
  }
};

const replaceDataGroupWithAutoGeneratedGroup = ({
  node,
  tree,
  treeDepths,
  updatedGroupsManager,
}: {
  node: GridGroupNode;
  tree: GridRowTreeConfig;
  treeDepths: GridTreeDepths;
  updatedGroupsManager?: GridRowTreeUpdatedGroupsManager;
}) => {
  updatedGroupsManager?.addAction(node.parent!, 'removeChildren');
  updatedGroupsManager?.addAction(node.parent!, 'insertChildren');

  updateGroupNodeIdAndAutoGenerated({
    previousTree: null,
    tree,
    treeDepths,
    node,
    updatedNode: {
      id: getGroupRowIdFromPath(getNodePathInTree({ id: node.id, tree })),
      isAutoGenerated: true,
    },
  });
};

/**
 * Removed a data row from the tree.
 * If the node is a non-empty group, replace it with an auto-generated group to be able to keep displaying its children.
 * If not, remove it and recursively clean its parent with the following rules:
 * - An empty auto-generated should be removed from the tree
 * - An empty non-auto-generated should be turned into a leaf
 */
export const removeDataRowFromTree = ({
  id,
  tree,
  treeDepths,
  updatedGroupsManager,
}: RemoveDataRowFromTreeParams) => {
  const node = tree[id];

  if (node.type === 'group' && node.children.length > 0) {
    replaceDataGroupWithAutoGeneratedGroup({ node, tree, treeDepths, updatedGroupsManager });
  } else {
    removeNodeAndCleanParent({ node, tree, treeDepths, updatedGroupsManager });
  }
};
