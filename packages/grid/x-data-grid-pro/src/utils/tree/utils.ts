import { GridRowId, GridRowTreeConfig, GridTreeNode } from '@mui/x-data-grid';
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
  id,
  tree,
  treeDepths,
}: {
  node: GridTreeNode;
  id: GridRowId;
  tree: GridRowTreeConfig;
  treeDepths: { [depth: number]: number };
}) => {
  tree[id] = node;
  treeDepths[node.depth] = (treeDepths[node.depth] ?? 0) + 1;
};
