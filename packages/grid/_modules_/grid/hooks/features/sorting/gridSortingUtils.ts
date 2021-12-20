import { GridSortingModelApplier } from './gridSortingState';
import {
  GridApiRef,
  GridComparatorFn,
  GridRowId,
  GridRowTreeNodeConfig,
  GridSortCellParams,
  GridSortItem,
  GridSortModel,
} from '../../../models';
import { isDesc } from '../../../utils/sortingUtils';

type GridSortingFieldComparator = {
  getSortCellParams: (id: GridRowId) => GridSortCellParams;
  comparator: GridComparatorFn;
};

interface GridParsedSortItem {
  comparator: GridComparatorFn;
  getSortCellParams: (id: GridRowId) => GridSortCellParams;
}

/**
 * Transform an item of the sorting model into a method comparing two rows.
 * @param {GridSortItem} sortItem The sort item we want to apply.
 * @param {GridApiRef} apiRef The API of the grid.
 * @returns {GridParsedSortItem | null} The parsed sort item. Returns `null` is the sort item is not valid.
 */
const parseSortItem = (sortItem: GridSortItem, apiRef: GridApiRef): GridParsedSortItem | null => {
  const column = apiRef.current.getColumn(sortItem.field);
  if (!column) {
    return null;
  }

  const comparator: GridComparatorFn = isDesc(sortItem.sort)
    ? (...args) => -1 * column.sortComparator!(...args)
    : column.sortComparator!;

  const getSortCellParams = (id: GridRowId): GridSortCellParams => ({
    id,
    field: column.field,
    rowNode: apiRef.current.getRowNode(id)!,
    value: apiRef.current.getCellValue(id, column.field),
    api: apiRef.current,
  });

  return { getSortCellParams, comparator };
};

/**
 * Compare two rows according to a list of valid sort items.
 * The `row1Params` and `row2Params` must have the same length as `parsedSortItems`,
 * and each of their index must contain the `GridSortCellParams` of the sort item with the same index.
 * @param {GridParsedSortItem[]} parsedSortItems All the sort items with which we want to compare the rows.
 * @param {GridSortCellParams} row1Params The params of the 1st row for each sort item.
 * @param {GridSortCellParams} row2Params The params of the 2nd row for each sort item.
 */
const compareRows = (
  parsedSortItems: GridParsedSortItem[],
  row1Params: GridSortCellParams[],
  row2Params: GridSortCellParams[],
) => {
  return parsedSortItems.reduce((res, item, index) => {
    if (res !== 0) {
      // return the results of the first comparator which distinguish the two rows
      return res;
    }

    const sortCellParams1 = row1Params[index];
    const sortCellParams2 = row2Params[index];
    res = item.comparator(
      sortCellParams1.value,
      sortCellParams2.value,
      sortCellParams1,
      sortCellParams2,
    );
    return res;
  }, 0);
};

/**
 * Generates a method to easily sort a list of rows according to the current sort model.
 * @param {GridSortModel} sortModel The model with which we want to sort the rows.
 * @param {GridApiRef} apiRef The API of the grid.
 * @returns {GridSortingModelApplier | null} A method that generates a list of sorted row ids from a list of rows according to the current sort model. If `null`, we consider that the rows should remain in the order there were provided.
 */
export const buildAggregatedSortingApplier = (
  sortModel: GridSortModel,
  apiRef: GridApiRef,
): GridSortingModelApplier | null => {
  const comparatorList = sortModel
    .map((item) => parseSortItem(item, apiRef))
    .filter((comparator): comparator is GridSortingFieldComparator => !!comparator);

  if (comparatorList.length === 0) {
    return null;
  }

  return (rowList: GridRowTreeNodeConfig[]) =>
    rowList
      .map((value) => ({
        value,
        params: comparatorList.map((el) => el.getSortCellParams(value.id)),
      }))
      .sort((a, b) => compareRows(comparatorList, a.params, b.params))
      .map((row) => row.value.id);
};
