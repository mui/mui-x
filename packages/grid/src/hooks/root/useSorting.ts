import { useEffect, useRef, useState } from 'react';
import {
  CellValue,
  ColDef,
  ColumnHeaderClickedParam,
  Columns,
  ColumnSortedParams,
  ComparatorFn,
  FieldComparatorList,
  GridApi,
  GridOptions,
  RowId,
  RowModel,
  RowsProp,
  SortApi,
} from '../../models';
import {
  COLUMN_HEADER_CLICKED,
  COLUMNS_SORTED,
  MULTIPLE_KEY_PRESS_CHANGED,
  POST_SORT,
  ROWS_UPDATED,
  SORT_MODEL_UPDATED,
} from '../../constants/eventsConstants';
import { GridApiRef } from '../../grid';
import { useLogger } from '../utils';
import { isDesc, nextSortDirection } from '../../utils/';
import { SortItem, SortModel } from '../../models/sortModel';

export const useSorting = (options: GridOptions, rowsProp: RowsProp, colsProp: Columns, apiRef: GridApiRef) => {
  const logger = useLogger('useSorting');
  const sortModelRef = useRef<SortModel>([]);
  const allowMultipleSorting = useRef<boolean>(false);
  const originalOrder = useRef<RowId[]>([]);
  const comparatorList = useRef<FieldComparatorList>([]);

  const upsertSortModel = (field: string, sortItem?: SortItem): SortModel => {
    const existingIdx = sortModelRef.current.findIndex(c => c.colId === field);
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
  };

  const createSortItem = (col: ColDef): SortItem | undefined => {
    const existing = sortModelRef.current.find(c => c.colId === col.field);
    if (existing) {
      const nextSort = nextSortDirection(options.sortingOrder, existing.sort);
      return nextSort == null ? undefined : { ...existing, sort: nextSort };
    } else {
      return { colId: col.field, sort: nextSortDirection(options.sortingOrder) };
    }
  };

  const comparatorListAggregate: ComparatorFn = (row1, row2) => {
    const result = comparatorList.current.reduce((res, colComparator) => {
      const { field, comparator } = colComparator;
      res = res || comparator(row1.data[field], row2.data[field]);
      return res;
    }, 0);
    return result;
  };

  const buildComparatorList = (sortModel: SortModel): FieldComparatorList => {
    const comparatorList = sortModel.map(item => {
      const col = apiRef.current!.getColumnFromField(item.colId);
      const comparator = isDesc(item.sort)
        ? (v1: CellValue, v2: CellValue) => -1 * col.comparator!(v1, v2)
        : col.comparator!;
      return { field: col.field, comparator };
    });
    return comparatorList;
  };

  const getOriginalOrderedRows: () => RowModel[] = () => {
    return originalOrder.current.map(rowId => apiRef.current!.getRowFromId(rowId));
  };

  const applySorting = () => {
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
      sortedColumns: sortModelRef.current.map(model => apiRef.current!.getColumnFromField(model.colId)),
      sortModel: sortModelRef.current,
    };
    apiRef.current!.emit(COLUMNS_SORTED, params);
  };

  const setSortModel = (sortModel: SortModel) => {
    sortModelRef.current = sortModel;
    comparatorList.current = buildComparatorList(sortModel);
    apiRef.current!.emit(SORT_MODEL_UPDATED, sortModelRef.current);
    applySorting();
  };

  const sortColumn = (column: ColDef) => {
    const sortItem = createSortItem(column);
    let sortModel;
    if (!allowMultipleSorting.current) {
      sortModel = !sortItem ? [] : [sortItem];
    } else {
      sortModel = upsertSortModel(column.field, sortItem);
    }
    setSortModel(sortModel);
  };

  const headerClickHandler = ({ column, field }: ColumnHeaderClickedParam) => {
    if (column.sortable) {
      sortColumn(column);
    }
  };

  const storeOriginalOrder = () => {
    originalOrder.current = apiRef.current!.getRowModels().reduce((order, row) => {
      order.push(row.id);
      return order;
    }, [] as RowId[]);
  };

  const onRowsUpdated = () => {
    storeOriginalOrder();
    if (sortModelRef.current.length > 0) {
      applySorting();
    }
  };

  const getSortModel = () => sortModelRef.current;

  const onMultipleKeyPressed = (isPressed: boolean) => {
    allowMultipleSorting.current = options.enableMultipleColumnsSorting && isPressed;
  };

  const onColumnsSorted = (handler: (param: ColumnSortedParams) => void): (() => void) => {
    return apiRef!.current!.registerEvent(COLUMNS_SORTED, handler);
  };

  useEffect(() => {
    if (apiRef && apiRef.current) {
      logger.debug('Binding Sorting events');

      apiRef.current.on(COLUMN_HEADER_CLICKED, headerClickHandler);
      apiRef.current.on(ROWS_UPDATED, onRowsUpdated);
      apiRef.current.on(MULTIPLE_KEY_PRESS_CHANGED, onMultipleKeyPressed);

      logger.debug('Adding sorting to api');

      const sortApi: SortApi = { getSortModel, setSortModel, onColumnsSorted };
      apiRef.current = Object.assign(apiRef.current, sortApi) as GridApi;

      return () => {
        apiRef.current?.removeListener(COLUMN_HEADER_CLICKED, headerClickHandler);
        apiRef.current?.removeListener(ROWS_UPDATED, onRowsUpdated);
        apiRef.current?.removeListener(MULTIPLE_KEY_PRESS_CHANGED, onMultipleKeyPressed);
      };
    }
  }, [apiRef]);

  const [rowsState, setRowsState] = useState(rowsProp);
  const [colState, setColState] = useState(colsProp);

  useEffect(() => {
    setRowsState(rowsProp);
  }, [rowsProp]);

  useEffect(() => {
    setColState(colsProp);
    sortModelRef.current = [];
  }, [colsProp]);

  useEffect(() => {
    if (rowsProp.length > 0) {
      storeOriginalOrder();
      applySorting();
    }
  }, [rowsState]);

  useEffect(() => {
    if (colsProp.length > 0 && apiRef.current) {
      const sortedCols = apiRef.current
        .getAllColumns()
        .filter(c => c.sortDirection != null)
        .sort((a, b) => a.sortIndex! - b.sortIndex!);

      const sortModel = sortedCols.map(c => ({ colId: c.field, sort: c.sortDirection }));
      setSortModel(sortModel);
    }
  }, [colState]);
};
