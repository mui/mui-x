import { GridRowId, GridRowTreeConfig, GridRowTreeNodeConfig } from '../../models';
import { GridSortingFieldComparator } from '../../hooks/features/sorting/gridSortingState';

interface SortRowTreeParams {
  rowIds: GridRowId[];
  rowTree: GridRowTreeConfig;
  disableChildrenSorting: boolean;
  comparatorList: GridSortingFieldComparator[];
  sortRowList: (rowList: GridRowTreeNodeConfig[]) => GridRowId[];
}

export const sortRowTree = (params: SortRowTreeParams) => {
  const { rowIds, rowTree, disableChildrenSorting, comparatorList, sortRowList } = params;
  let sortedRows: GridRowId[] = [];

  // Group the rows by parent
  const groupedByParentRows = new Map<GridRowId | null, GridRowTreeNodeConfig[]>([[null, []]]);
  for (let i = 0; i < rowIds.length; i += 1) {
    const rowId = rowIds[i];
    const node = rowTree[rowId];
    let group = groupedByParentRows.get(node.parent);
    if (!group) {
      group = [];
      groupedByParentRows.set(node.parent, group);
    }
    group.push(node);
  }

  // Apply the sorting to each list of children
  const sortedGroupedByParentRows = new Map<GridRowId | null, GridRowId[]>();
  groupedByParentRows.forEach((rowList, parent) => {
    if (rowList.length === 0) {
      sortedGroupedByParentRows.set(parent, []);
    } else {
      const depth = rowList[0].depth;
      if (depth > 0 && disableChildrenSorting) {
        sortedGroupedByParentRows.set(
          parent,
          rowList.map((row) => row.id),
        );
      } else if (comparatorList.length === 0) {
        sortedGroupedByParentRows.set(
          parent,
          rowList.map((row) => row.id),
        );
      } else {
        sortedGroupedByParentRows.set(parent, sortRowList(rowList));
      }
    }
  });

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

  insertRowListIntoSortedRows(0, sortedGroupedByParentRows.get(null)!);

  return sortedRows;
};
