import { GRID_ROOT_GROUP_ID, GridGroupNode, GridRowId, GridRowTreeConfig } from '@mui/x-data-grid';
import { GridSortingModelApplier } from '@mui/x-data-grid/internals';

interface SortRowTreeParams {
  rowTree: GridRowTreeConfig;
  disableChildrenSorting: boolean;
  sortRowList: GridSortingModelApplier | null;
  shouldRenderGroupBelowLeaves: boolean;
}

export const sortRowTree = (params: SortRowTreeParams) => {
  const { rowTree, disableChildrenSorting, sortRowList, shouldRenderGroupBelowLeaves } = params;
  let sortedRows: GridRowId[] = [];

  const sortedGroupedByParentRows = new Map<GridRowId, GridRowId[]>();

  const sortGroup = (node: GridGroupNode) => {
    const shouldSortGroup = !!sortRowList && (!disableChildrenSorting || node.depth === -1);

    let sortedRowIds: GridRowId[];

    if (shouldSortGroup) {
      for (let i = 0; i < node.children.length; i += 1) {
        const childNode = rowTree[node.children[i]];
        if (childNode.type === 'group') {
          sortGroup(childNode);
        }
      }

      sortedRowIds = sortRowList(node.children.map((childId) => rowTree[childId]));
    } else if (shouldRenderGroupBelowLeaves) {
      const childrenLeaves: GridRowId[] = [];
      const childrenGroups: GridRowId[] = [];
      for (let i = 0; i < node.children.length; i += 1) {
        const childId = node.children[i];
        const childNode = rowTree[childId];
        if (childNode.type === 'group') {
          sortGroup(childNode);
          childrenGroups.push(childId);
        } else if (childNode.type === 'leaf') {
          childrenLeaves.push(childId);
        }
      }

      sortedRowIds = [...childrenLeaves, ...childrenGroups];
    } else {
      for (let i = 0; i < node.children.length; i += 1) {
        const childNode = rowTree[node.children[i]];
        if (childNode.type === 'group') {
          sortGroup(childNode);
        }
      }

      sortedRowIds = [...node.children];
    }

    if (node.footerId != null) {
      sortedRowIds.push(node.footerId);
    }

    sortedGroupedByParentRows.set(node.id, sortedRowIds);
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
