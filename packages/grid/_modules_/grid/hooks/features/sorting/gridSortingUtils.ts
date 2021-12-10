import { GridSortingModelApplier } from './gridSortingState';
import {
  GridApiRef,
  GridComparatorFn,
  GridRowId,
  GridRowTreeNodeConfig,
  GridSortCellParams,
  GridSortModel,
} from '../../../models';
import { isDesc } from '../../../utils/sortingUtils';

type GridSortingFieldComparator = {
  getSortCellParams: (id: GridRowId) => GridSortCellParams;
  comparator: GridComparatorFn;
};

/**
 * Generates a method to easily sort a list of rows according to the current sort model.
 * @param {GridSortModel} sortModel The model with which we want to sort the rows.
 * @param {GridApiRef} apiRef The API of the grid.
 * @returns {GridSortingModelApplier | null} A method that sorts a list of rows according to the current sort model. If `null`, we consider that the rows should remain in the order there were provided.
 */
export const buildAggregatedSortingApplier = (
  sortModel: GridSortModel,
  apiRef: GridApiRef,
): GridSortingModelApplier | null => {
  const comparatorList = sortModel
    .map((item) => {
      const column = apiRef.current.getColumn(item.field);
      if (!column) {
        return null;
      }

      const comparator: GridComparatorFn = isDesc(item.sort)
        ? (...args) => -1 * column.sortComparator!(...args)
        : column.sortComparator!;

      const getSortCellParams = (id: GridRowId): GridSortCellParams => ({
        id,
        field: column.field,
        value: apiRef.current.getCellValue(id, column.field),
        api: apiRef.current,
      });

      return { getSortCellParams, comparator };
    })
    .filter((comparator): comparator is GridSortingFieldComparator => !!comparator);

  if (comparatorList.length === 0) {
    return null;
  }

  const aggregatedComparator = (row1: GridSortCellParams[], row2: GridSortCellParams[]) => {
    return comparatorList.reduce((res, colComparator, index) => {
      if (res !== 0) {
        return res;
      }

      const { comparator } = colComparator;
      const sortCellParams1 = row1[index];
      const sortCellParams2 = row2[index];
      res = comparator(
        sortCellParams1.value,
        sortCellParams2.value,
        sortCellParams1,
        sortCellParams2,
      );
      return res;
    }, 0);
  };

  return (rowList: GridRowTreeNodeConfig[]) =>
    rowList
      .map((value) => ({
        value,
        params: comparatorList.map((el) => el.getSortCellParams(value.id)),
      }))
      .sort((a, b) => aggregatedComparator(a.params, b.params))
      .map((row) => row.value.id);
};
