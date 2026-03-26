import {
  GRID_ROOT_GROUP_ID,
  type GridGroupNode,
  type GridKeyValue,
  type GridRowId,
  type GridRowTreeConfig,
} from '@mui/x-data-grid';

export const getGroupKeys = (tree: GridRowTreeConfig, rowId: GridRowId) => {
  const rowNode = tree[rowId];
  let currentNodeId = rowNode.parent;
  const groupKeys: GridKeyValue[] = [];
  while (currentNodeId && currentNodeId !== GRID_ROOT_GROUP_ID) {
    const currentNode = tree[currentNodeId] as GridGroupNode;
    groupKeys.push(currentNode.groupingKey ?? '');
    currentNodeId = currentNode.parent;
  }
  return groupKeys.reverse();
};
