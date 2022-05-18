import {
  GRID_ROOT_GROUP_ID,
  GridFooterNode,
  GridGroupNode,
  GridLeafNode,
  GridRowId,
  GridRowTreeConfig,
} from '@mui/x-data-grid';
import { GridSortingModelApplier } from '@mui/x-data-grid/internals';

interface SortRowTreeParams {
  rowIds: GridRowId[];
  rowTree: GridRowTreeConfig;
  disableChildrenSorting: boolean;
  sortRowList: GridSortingModelApplier | null;
}

export const sortRowTree = (params: SortRowTreeParams) => {
  const { rowIds, rowTree, disableChildrenSorting, sortRowList } = params;
  let sortedRows: GridRowId[] = [];

  // Group the rows by parent
  const groupedByParentRows = new Map<
    GridRowId,
    { body: (GridGroupNode | GridLeafNode)[]; footer: GridFooterNode[] }
  >([[GRID_ROOT_GROUP_ID, { body: [], footer: [] }]]);
  for (let i = 0; i < rowIds.length; i += 1) {
    const rowId = rowIds[i];
    const node = rowTree[rowId];

    if (node.parent != null) {
      let group = groupedByParentRows.get(node.parent);
      if (!group) {
        group = { body: [], footer: [] };
        groupedByParentRows.set(node.parent, group);
      }

      if (node.type === 'footer') {
        group.footer.push(node);
      } else {
        group.body.push(node);
      }
    }
  }

  // Apply the sorting to each list of children
  const sortedGroupedByParentRows = new Map<GridRowId, GridRowId[]>();
  groupedByParentRows.forEach((group, parent) => {
    if (group.body.length === 0) {
      sortedGroupedByParentRows.set(parent, []);
    } else {
      let sortedBodyRows: GridRowId[];
      const depth = group.body[0].depth;
      if ((depth > 0 && disableChildrenSorting) || !sortRowList) {
        sortedBodyRows = group.body.map((row) => row.id);
      } else {
        sortedBodyRows = sortRowList(group.body);
      }

      const footerRows = group.footer.map((row) => row.id);

      sortedGroupedByParentRows.set(parent, [...sortedBodyRows, ...footerRows]);
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

  insertRowListIntoSortedRows(0, sortedGroupedByParentRows.get(GRID_ROOT_GROUP_ID)!);

  return sortedRows;
};
