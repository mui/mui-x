import { GRID_ROOT_GROUP_ID } from '../rows/gridRowsUtils';
import { GridColDef } from '../../../models/colDef/gridColDef';
import { GridRowId, GridRowTreeConfig, GridGroupNode } from '../../../models/gridRows';

export const getGroupKeys = (tree: GridRowTreeConfig, rowId: GridRowId) => {
  const rowNode = tree[rowId];
  let currentNodeId = rowNode.parent;
  const groupKeys = [];
  while (currentNodeId && currentNodeId !== GRID_ROOT_GROUP_ID) {
    const currentNode = tree[currentNodeId] as GridGroupNode;
    groupKeys.push(currentNode.groupingKey ?? '');
    currentNodeId = currentNode.parent;
  }
  return groupKeys.reverse();
};

export const getDefaultCellValue = (colDef: GridColDef) => {
  switch (colDef.type) {
    case 'boolean':
      return false;
    case 'date':
    case 'dateTime':
    case 'number':
      return undefined;
    case 'singleSelect':
      return null;
    case 'string':
    default:
      return '';
  }
};
