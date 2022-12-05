import {
  GRID_ROOT_GROUP_ID,
  GridChildrenFromPathLookup,
  GridGroupNode,
  GridLeafNode,
  GridRowId,
  GridRowTreeConfig,
  GridTreeNode,
} from '@mui/x-data-grid';
import {
  GridTreeDepths,
  GridRowTreeUpdateGroupAction,
  GridRowTreeUpdatedGroupsManager,
} from '@mui/x-data-grid/internals';
import { RowTreeBuilderGroupingCriterion } from './models';
import { DataGridProProps } from '../../models/dataGridProProps';

export const getGroupRowIdFromPath = (path: RowTreeBuilderGroupingCriterion[]) => {
  const pathStr = path
    .map((groupingCriteria) => `${groupingCriteria.field}/${groupingCriteria.key}`)
    .join('-');

  return `auto-generated-row-${pathStr}`;
};

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
      field: (node as GridGroupNode).groupingField,
      key: node.groupingKey,
    });

    node = tree[node.parent!] as GridGroupNode | GridLeafNode;
  }

  return path;
};

export const addGroupDefaultExpansion = ({
  node,
  isGroupExpandedByDefault,
  defaultGroupingExpansionDepth,
}: {
  node: GridGroupNode;
  isGroupExpandedByDefault?: DataGridProProps['isGroupExpandedByDefault'];
  defaultGroupingExpansionDepth: number;
}) => {
  let childrenExpanded: boolean;
  if (node.id === GRID_ROOT_GROUP_ID) {
    childrenExpanded = true;
  } else if (isGroupExpandedByDefault) {
    childrenExpanded = isGroupExpandedByDefault(node);
  } else {
    childrenExpanded =
      defaultGroupingExpansionDepth === -1 || defaultGroupingExpansionDepth > node.depth;
  }

  return {
    ...node,
    childrenExpanded,
  };
};

/**
 * Insert a node in the tree
 */
export const insertNodeInTree = ({
  node,
  tree,
  treeDepths,
}: {
  node: GridTreeNode;
  tree: GridRowTreeConfig;
  treeDepths: GridTreeDepths;
}) => {
  // 1. Insert node in the tree.
  tree[node.id] = node;

  // 2. Increment the `treeDepths` object for the node's depth.
  treeDepths[node.depth] = (treeDepths[node.depth] ?? 0) + 1;

  // 3. Register the new node in its parent.
  const parentNode = tree[node.parent!] as GridGroupNode;
  if (node.type === 'footer') {
    // For footers,
    // Register the node from its parent `footerId` property.
    tree[node.parent] = {
      ...parentNode,
      footerId: node.id,
    };
  } else if (node.type === 'group' || node.type === 'leaf') {
    // For groups and leaves,
    // Register the node from its parents `children` and `childrenFromPath` properties.
    const groupingField = (node as GridGroupNode).groupingField ?? '__no_field__';
    const groupingKey = (node as GridGroupNode).groupingKey ?? '__no_key__';

    tree[node.parent!] = {
      ...parentNode,
      childrenFromPath: {
        ...parentNode.childrenFromPath,
        [groupingField]: {
          ...parentNode.childrenFromPath?.[groupingField],
          [groupingKey.toString()]: node.id,
        },
      },
      children: [...parentNode.children, node.id],
    };
  }
};

/**
 * Removes a node from the tree
 */
export const removeNodeFromTree = ({
  node,
  tree,
  treeDepths,
}: {
  node: GridTreeNode;
  tree: GridRowTreeConfig;
  treeDepths: GridTreeDepths;
}) => {
  // 1. Remove node from the tree.
  delete tree[node.id];

  // 2. Decrement the `treeDepths` object for the node's depth.
  const nodeDepth = node.depth;
  const currentNodeCount = treeDepths[nodeDepth];
  if (currentNodeCount === 1) {
    delete treeDepths[nodeDepth];
  } else {
    treeDepths[nodeDepth] = currentNodeCount - 1;
  }

  // 3. Unregister the new node in its parent.
  const parentNode = tree[node.parent!] as GridGroupNode;
  // For footers,
  // Unregister the node from its parent `footerId` property.
  if (node.type === 'footer') {
    tree[parentNode.id] = {
      ...parentNode,
      footerId: null,
    };
  }
  // For groups and leaves,
  // Unregister the node from its parents `children` and `childrenFromPath` properties.
  else {
    const groupingField = (node as GridGroupNode).groupingField ?? '__no_field__';
    const groupingKey = (node as GridGroupNode).groupingKey ?? '__no_key__';
    const { [groupingKey.toString()]: childrenToRemove, ...newChildrenFromPathWithField } =
      parentNode.childrenFromPath?.[groupingField] ?? {};

    // TODO rows v6: Can we avoid this linear complexity ?
    const children = parentNode.children.filter((childId) => childId !== node.id);
    const childrenFromPath: GridChildrenFromPathLookup = { ...parentNode.childrenFromPath };
    if (Object.keys(newChildrenFromPathWithField).length === 0) {
      delete childrenFromPath[groupingField];
    } else {
      childrenFromPath[groupingField] = newChildrenFromPathWithField;
    }

    tree[parentNode.id] = {
      ...parentNode,
      children,
      childrenFromPath,
    };
  }
};

/**
 * Updates the `id` and `isAutoGenerated` properties of a group node.
 */
export const updateGroupNodeIdAndAutoGenerated = ({
  node,
  updatedNode,
  tree,
  treeDepths,
}: {
  node: GridGroupNode;
  updatedNode: Pick<GridGroupNode, 'id' | 'isAutoGenerated'>;
  tree: GridRowTreeConfig;
  treeDepths: GridTreeDepths;
}) => {
  // 1. Set the new parent for all children from the old group
  node.children.forEach((childId) => {
    tree[childId] = {
      ...tree[childId],
      parent: updatedNode.id,
    };
  });

  // 2. Remove the old group from the tree
  removeNodeFromTree({
    node,
    tree,
    treeDepths,
  });

  // 3. Add the new group in the tree
  const groupNode: GridGroupNode = {
    ...node,
    ...updatedNode,
  };

  insertNodeInTree({
    node: groupNode,
    tree,
    treeDepths,
  });
};

export const createUpdatedGroupsManager = (): GridRowTreeUpdatedGroupsManager => ({
  value: {},
  addAction(groupId: GridRowId, action: GridRowTreeUpdateGroupAction) {
    if (!this.value[groupId]) {
      this.value[groupId] = {};
    }

    this.value[groupId][action] = true;
  },
});
