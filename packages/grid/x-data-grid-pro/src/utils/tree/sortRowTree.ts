import {
  GRID_ROOT_GROUP_ID,
  GridGroupNode,
  GridRowId,
  GridRowTreeConfig,
  GridTreeNode,
} from '@mui/x-data-grid';
import { GridSortingModelApplier } from '@mui/x-data-grid/internals';

interface SortRowTreeParams {
  rowTree: GridRowTreeConfig;
  disableChildrenSorting: boolean;
  sortRowList: GridSortingModelApplier | null;
}

export const sortRowTree = (params: SortRowTreeParams) => {
  const { rowTree, disableChildrenSorting, sortRowList } = params;
  let sortedRows: GridRowId[] = [];

  const sortedGroupedByParentRows = new Map<GridRowId, GridRowId[]>();

  const sortGroup = (node: GridGroupNode) => {
    const shouldSortGroup = !!sortRowList && (!disableChildrenSorting || node.depth === -1);

    const footerIds: GridRowId[] = [];
    const unsortedBodyNodes: GridTreeNode[] = [];

    node.children.forEach((childNodeId) => {
      const childNode = rowTree[childNodeId];
      if (childNode.type === 'footer') {
        footerIds.push(childNodeId);
      } else {
        unsortedBodyNodes.push(childNode);
      }

      if (childNode.type === 'group') {
        sortGroup(childNode);
      }
    });

    const sortedBodyRowIds = shouldSortGroup
      ? sortRowList(unsortedBodyNodes)
      : unsortedBodyNodes.map((childNode) => childNode.id);
    sortedGroupedByParentRows.set(node.id, [...sortedBodyRowIds, ...footerIds]);
  };

  sortGroup(rowTree[GRID_ROOT_GROUP_ID] as GridGroupNode);

  // Flatten the sorted lists to have children just after their parent
  const insertRowListIntoSortedRows = (startIndex: number, rowList: GridRowId[]) => {
    sortedRows = [...sortedRows.slice(0, startIndex), ...rowList, ...sortedRows.slice(startIndex)];

    let treeSize = 0;
    rowList.forEach((rowId) => {
      treeSize += 1;
      const children = sortedGroupedByParentRows.get(rowId);
      if (children?.length) {
        const subTreeSize = insertRowListIntoSortedRows(startIndex + treeSize, children);
        treeSize += subTreeSize;
      }
    });

    return treeSize;
  };

  insertRowListIntoSortedRows(0, sortedGroupedByParentRows.get(GRID_ROOT_GROUP_ID)!);

  return sortedRows;
};
