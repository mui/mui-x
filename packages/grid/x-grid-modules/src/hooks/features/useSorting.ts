import { useCallback, useEffect, useRef, useState } from 'react';
import {
  CellValue,
  ColDef,
  ColumnHeaderClickedParams,
  Columns,
  ColumnSortedParams,
  FieldComparatorList,
  GridOptions,
  RowId,
  RowModel,
  RowsProp,
  SortApi,
  GridApiRef,
} from '../../models';
import {
  COLUMN_HEADER_CLICKED,
  COLUMNS_SORTED,
  MULTIPLE_KEY_PRESS_CHANGED,
  POST_SORT,
  ROWS_UPDATED,
  SORT_MODEL_UPDATED,
} from '../../constants/eventsConstants';
import { useLogger } from '../utils';
import { isDesc, nextSortDirection } from '../../utils';
import { SortItem, SortModel } from '../../models/sortModel';
import { useApiEventHandler } from '../root/useApiEventHandler';
import { useApiMethod } from '../root/useApiMethod';

export const useSorting = (
  options: GridOptions,
  rowsProp: RowsProp,
  colsProp: Columns,
  apiRef: GridApiRef,
) => {
  const logger = useLogger('useSorting');
  const sortModelRef = useRef<SortModel>([]);
  const allowMultipleSorting = useRef<boolean>(false);
  const originalOrder = useRef<RowId[]>([]);
  const comparatorList = useRef<FieldComparatorList>([]);

  const upsertSortModel = useCallback(
    (field: string, sortItem?: SortItem): SortModel => {
      const existingIdx = sortModelRef.current.findIndex((c) => c.colId === field);
      let newSortModel = [...sortModelRef.current];
      if (existingIdx > -1) {
        if (!sortItem) {
          newSortModel.splice(existingIdx, 1);
        } else {
          newSortModel.splice(existingIdx, 1, sortItem);
        }
      } else {
        newSortModel = [...sortModelRef.current, sortItem!];
      }
      return newSortModel;
    },
    [sortModelRef],
  );

  const createSortItem = useCallback(
    (col: ColDef): SortItem | undefined => {
      const existing = sortModelRef.current.find((c) => c.colId === col.field);
      if (existing) {
        const nextSort = nextSortDirection(options.sortingOrder, existing.sort);
        return nextSort == null ? undefined : { ...existing, sort: nextSort };
      }
      return { colId: col.field, sort: nextSortDirection(options.sortingOrder) };
    },
    [sortModelRef, options.sortingOrder],
  );

  const comparatorListAggregate = useCallback(
    (row1: RowModel, row2: RowModel) => {
      const result = comparatorList.current.reduce((res, colComparator) => {
        const { field, comparator } = colComparator;
        res = res || comparator(row1.data[field], row2.data[field], row1, row2);
        return res;
      }, 0);
      return result;
    },
    [comparatorList],
  );

  const buildComparatorList = useCallback(
    (sortModel: SortModel): FieldComparatorList => {
      const comparators = sortModel.map((item) => {
        const col = apiRef.current!.getColumnFromField(item.colId);
        const comparator = isDesc(item.sort)
          ? (v1: CellValue, v2: CellValue, row1: RowModel, row2: RowModel) =>
              -1 * col.sortComparator!(v1, v2, row1, row2)
          : col.sortComparator!;
        return { field: col.field, comparator };
      });
      return comparators;
    },
    [apiRef],
  );

  const getOriginalOrderedRows: () => RowModel[] = useCallback(() => {
    return originalOrder.current.map((rowId) => apiRef.current!.getRowFromId(rowId));
  }, [apiRef, originalOrder]);

  const applySorting = useCallback(() => {
    if (!apiRef.current) {
      return;
    }

    logger.info('Sorting rows with ', sortModelRef.current);
    const newRows = apiRef.current.getRowModels();

    let sorted = [...newRows];
    if (sortModelRef.current.length === 0) {
      sorted = getOriginalOrderedRows();
    } else {
      sorted = sorted.sort(comparatorListAggregate);
    }
    apiRef.current!.setRowModels([...sorted]);
    apiRef.current!.emit(POST_SORT, sortModelRef.current);

    const params: ColumnSortedParams = {
      sortedColumns: sortModelRef.current.map((model) =>
        apiRef.current!.getColumnFromField(model.colId),
      ),
      sortModel: sortModelRef.current,
    };
    apiRef.current!.emit(COLUMNS_SORTED, params);
  }, [apiRef, sortModelRef, comparatorListAggregate, getOriginalOrderedRows, logger]);

  const setSortModel = useCallback(
    (sortModel: SortModel) => {
      sortModelRef.current = sortModel;
      comparatorList.current = buildComparatorList(sortModel);
      apiRef.current!.emit(SORT_MODEL_UPDATED, sortModelRef.current);
      applySorting();
    },
    [sortModelRef, comparatorList, apiRef, applySorting, buildComparatorList],
  );

  const sortColumn = useCallback(
    (column: ColDef) => {
      const sortItem = createSortItem(column);
      let sortModel;
      if (!allowMultipleSorting.current) {
        sortModel = !sortItem ? [] : [sortItem];
      } else {
        sortModel = upsertSortModel(column.field, sortItem);
      }
      setSortModel(sortModel);
    },
    [upsertSortModel, setSortModel, allowMultipleSorting, createSortItem],
  );

  const headerClickHandler = useCallback(
    ({ column, field }: ColumnHeaderClickedParams) => {
      if (column.sortable) {
        sortColumn(column);
      }
    },
    [sortColumn],
  );

  const storeOriginalOrder = useCallback(() => {
    originalOrder.current = apiRef.current!.getRowModels().reduce((order, row) => {
      order.push(row.id);
      return order;
    }, [] as RowId[]);
  }, [originalOrder, apiRef]);

  const onRowsUpdated = useCallback(() => {
    storeOriginalOrder();
    if (sortModelRef.current.length > 0) {
      applySorting();
    }
  }, [sortModelRef, storeOriginalOrder, applySorting]);

  const getSortModel = useCallback(() => sortModelRef.current, [sortModelRef]);

  const onMultipleKeyPressed = useCallback(
    (isPressed: boolean) => {
      allowMultipleSorting.current = options.enableMultipleColumnsSorting && isPressed;
    },
    [allowMultipleSorting, options.enableMultipleColumnsSorting],
  );

  const onColumnsSorted = useCallback(
    (handler: (param: ColumnSortedParams) => void): (() => void) => {
      return apiRef!.current!.registerEvent(COLUMNS_SORTED, handler);
    },
    [apiRef],
  );

  const [colState, setColState] = useState(colsProp);

  useEffect(() => {
    setColState(colsProp);
    sortModelRef.current = [];
  }, [colsProp]);

  useEffect(() => {
    if (rowsProp.length > 0) {
      storeOriginalOrder();
      if (sortModelRef.current.length > 0) {
        applySorting();
      }
    }
  }, [rowsProp, applySorting, storeOriginalOrder]);

  useEffect(() => {
    if (colsProp.length > 0 && apiRef.current) {
      const sortedCols = apiRef.current
        .getAllColumns()
        .filter((c) => c.sortDirection != null)
        .sort((a, b) => a.sortIndex! - b.sortIndex!);

      const sortModel = sortedCols.map((c) => ({ colId: c.field, sort: c.sortDirection }));
      setSortModel(sortModel);
    }
  }, [colState, setSortModel, apiRef, colsProp]);

  useApiEventHandler(apiRef, COLUMN_HEADER_CLICKED, headerClickHandler);
  useApiEventHandler(apiRef, ROWS_UPDATED, onRowsUpdated);
  useApiEventHandler(apiRef, MULTIPLE_KEY_PRESS_CHANGED, onMultipleKeyPressed);
  const sortApi: SortApi = { getSortModel, setSortModel, onColumnsSorted };

  useApiMethod(apiRef, sortApi, 'SortApi');
};
