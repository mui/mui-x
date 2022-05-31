import { GridGroupNode, GridRowId, GridRowTreeConfig, GridTreeNode } from '@mui/x-data-grid';
import { RowTreeBuilderGroupingCriterion } from './models';

export const getGroupRowIdFromPath = (path: RowTreeBuilderGroupingCriterion[]) => {
  const pathStr = path
    .map((groupingCriteria) => `${groupingCriteria.field}/${groupingCriteria.key}`)
    .join('-');

  return `auto-generated-row-${pathStr}`;
};

export const removeNodeFromTree = ({
  id,
  tree,
  treeDepths,
}: {
  id: GridRowId;
  tree: GridRowTreeConfig;
  treeDepths: { [depth: number]: number };
}) => {
  const nodeDepth = tree[id].depth;

  const currentNodeCount = treeDepths[nodeDepth];

  if (currentNodeCount === 1) {
    delete treeDepths[nodeDepth];
  } else {
    treeDepths[nodeDepth] = currentNodeCount - 1;
  }

  delete tree[id];
};

export const insertNodeInTree = ({
  node,
  tree,
  treeDepths,
}: {
  node: GridTreeNode;
  tree: GridRowTreeConfig;
  treeDepths: { [depth: number]: number };
}) => {
  tree[node.id] = node;
  treeDepths[node.depth] = (treeDepths[node.depth] ?? 0) + 1;

  const parentNode = tree[node.parent!] as GridGroupNode;

  if (node.type === 'footer') {
    tree[node.parent] = {
      ...parentNode,
      footerId: node.id,
    };
  } else {
    const groupingField = (node as GridGroupNode).groupingField ?? '__no_field__';
    const groupingKey = node.groupingKey ?? '__no_key__';

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
