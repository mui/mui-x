import * as React from 'react';
import {
  ApiRef,
  CellValue,
  ColDef,
  ColParams,
  Columns,
  ColumnSortedParams,
  FeatureModeConstant,
  FieldComparatorList,
  GridOptions,
  RowId,
  RowModel,
  RowsProp,
  SortApi,
} from '../../models';
import {
  COLUMN_HEADER_CLICK,
  COLUMNS_SORTED,
  MULTIPLE_KEY_PRESS_CHANGED,
  ROWS_UPDATED,
  COLUMNS_SORTING_CHANGE,
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
  apiRef: ApiRef,
) => {
  const logger = useLogger('useSorting');
  const sortModelRef = React.useRef<SortModel>([]);
  const allowMultipleSorting = React.useRef<boolean>(false);
  const originalOrder = React.useRef<RowId[]>([]);
  const comparatorList = React.useRef<FieldComparatorList>([]);

  const getColumnsSortedParams = React.useCallback(
    (): ColumnSortedParams => ({
      sortedColumns: sortModelRef.current.map((model) =>
        apiRef.current!.getColumnFromField(model.field),
      ),
      sortModel: sortModelRef.current,
    }),
    [sortModelRef, apiRef],
  );

  const upsertSortModel = React.useCallback(
    (field: string, sortItem?: SortItem): SortModel => {
      const existingIdx = sortModelRef.current.findIndex((c) => c.field === field);
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

  const createSortItem = React.useCallback(
    (col: ColDef): SortItem | undefined => {
      const existing = sortModelRef.current.find((c) => c.field === col.field);
      if (existing) {
        const nextSort = nextSortDirection(options.sortingOrder, existing.sort);
        return nextSort == null ? undefined : { ...existing, sort: nextSort };
      }
      return { field: col.field, sort: nextSortDirection(options.sortingOrder) };
    },
    [sortModelRef, options.sortingOrder],
  );

  const comparatorListAggregate = React.useCallback(
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

  const buildComparatorList = React.useCallback(
    (sortModel: SortModel): FieldComparatorList => {
      const comparators = sortModel.map((item) => {
        const col = apiRef.current!.getColumnFromField(item.field);
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

  const getOriginalOrderedRows: () => RowModel[] = React.useCallback(() => {
    return originalOrder.current.map((rowId) => apiRef.current!.getRowFromId(rowId));
  }, [apiRef, originalOrder]);

  const applySorting = React.useCallback(() => {
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
    apiRef.current!.emit(COLUMNS_SORTED, getColumnsSortedParams());
  }, [apiRef, sortModelRef, comparatorListAggregate, getOriginalOrderedRows, logger]);

  const setSortModel = React.useCallback(
    (sortModel: SortModel) => {
      sortModelRef.current = sortModel;
      comparatorList.current = buildComparatorList(sortModel);
      apiRef.current!.emit(COLUMNS_SORTING_CHANGE, getColumnsSortedParams());
      if (options.sortingMode === FeatureModeConstant.client) {
        applySorting();
      } else {
        apiRef.current!.emit(COLUMNS_SORTED, getColumnsSortedParams());
      }
    },
    [sortModelRef, comparatorList, apiRef, applySorting, buildComparatorList, options.sortingMode],
  );

  const sortColumn = React.useCallback(
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

  const headerClickHandler = React.useCallback(
    ({ colDef }: ColParams) => {
      if (colDef.sortable) {
        sortColumn(colDef);
      }
    },
    [sortColumn],
  );

  const storeOriginalOrder = React.useCallback(() => {
    originalOrder.current = apiRef.current!.getRowModels().reduce((order, row) => {
      order.push(row.id);
      return order;
    }, [] as RowId[]);
  }, [originalOrder, apiRef]);

  const onRowsUpdated = React.useCallback(() => {
    storeOriginalOrder();
    if (sortModelRef.current.length > 0) {
      applySorting();
    }
  }, [sortModelRef, storeOriginalOrder, applySorting]);

  const getSortModel = React.useCallback(() => sortModelRef.current, [sortModelRef]);

  const onMultipleKeyPressed = React.useCallback(
    (isPressed: boolean) => {
      allowMultipleSorting.current = options.enableMultipleColumnsSorting && isPressed;
    },
    [allowMultipleSorting, options.enableMultipleColumnsSorting],
  );

  const onColumnsSorted = React.useCallback(
    (handler: (param: ColumnSortedParams) => void): (() => void) => {
      return apiRef!.current!.registerEvent(COLUMNS_SORTED, handler);
    },
    [apiRef],
  );
  const onColumnsSortingChange = React.useCallback(
    (handler: (param: ColumnSortedParams) => void): (() => void) => {
      return apiRef!.current!.registerEvent(COLUMNS_SORTING_CHANGE, handler);
    },
    [apiRef],
  );

  const [colState, setColState] = React.useState(colsProp);

  React.useEffect(() => {
    setColState(colsProp);
    sortModelRef.current = [];
  }, [colsProp]);

  React.useEffect(() => {
    if (rowsProp.length > 0 && options.sortingMode === FeatureModeConstant.client) {
      storeOriginalOrder();
      if (sortModelRef.current.length > 0) {
        logger.debug('row changed, applying sortModel');
        applySorting();
      }
    }
  }, [rowsProp, applySorting, storeOriginalOrder, options.sortingMode]);

  React.useEffect(() => {
    if (colsProp.length > 0 && apiRef.current) {
      const sortedCols = apiRef.current
        .getAllColumns()
        .filter((c) => c.sortDirection != null)
        .sort((a, b) => a.sortIndex! - b.sortIndex!);

      const sortModel = sortedCols.map((c) => ({ field: c.field, sort: c.sortDirection }));
      if (sortModel.length > 0) {
        setSortModel(sortModel);
      }
    }
  }, [colState, setSortModel, apiRef, colsProp]);

  React.useEffect(() => {
    const model = options.sortModel || [];
    if (model !== sortModelRef.current && model.length > 0 && apiRef.current?.isInitialised) {
      setSortModel(model);
    }
  }, [options.sortModel, setSortModel, apiRef, apiRef.current?.isInitialised]);

  useApiEventHandler(apiRef, COLUMN_HEADER_CLICK, headerClickHandler);
  useApiEventHandler(apiRef, ROWS_UPDATED, onRowsUpdated);
  useApiEventHandler(apiRef, MULTIPLE_KEY_PRESS_CHANGED, onMultipleKeyPressed);

  useApiEventHandler(apiRef, COLUMNS_SORTING_CHANGE, options.onColumnsSortingChange);
  useApiEventHandler(apiRef, COLUMNS_SORTED, options.onColumnsSorted);

  const sortApi: SortApi = { getSortModel, setSortModel, onColumnsSorted, onColumnsSortingChange };

  useApiMethod(apiRef, sortApi, 'SortApi');
};
