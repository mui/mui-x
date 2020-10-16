import * as React from 'react';
import {
  ApiRef,
  CellValue,
  ColDef,
  ColParams,
  Columns,
  SortModelParams,
  FeatureModeConstant,
  FieldComparatorList,
  GridOptions,
  RowId,
  RowModel,
  RowsProp,
  SortApi,
  CellParams,
} from '../../models';
import {
  COLUMN_HEADER_CLICK,
  MULTIPLE_KEY_PRESS_CHANGED,
  ROWS_UPDATED,
  SORT_MODEL_CHANGE,
} from '../../constants/eventsConstants';
import { columnsSelector } from '../root/columns/columnsSelector';
import { useLogger } from '../utils';
import { buildCellParams, isDesc, isEqual, nextSortDirection } from '../../utils';
import { SortItem, SortModel } from '../../models/sortModel';
import { useApiEventHandler } from '../root/useApiEventHandler';
import { useApiMethod } from '../root/useApiMethod';
import { optionsSelector } from '../utils/useOptionsProp';
import { useGridSelector } from './core/useGridSelector';
import { rowCountSelector, rowsSelector } from './rows/rowsSelector';

export const useSorting = (
  apiRef: ApiRef,
) => {
  const logger = useLogger('useSorting');
  const sortModelRef = React.useRef<SortModel>([]);
  const allowMultipleSorting = React.useRef<boolean>(false);
  const originalOrder = React.useRef<RowId[]>([]);
  const comparatorList = React.useRef<FieldComparatorList>([]);
  const options = useGridSelector(apiRef, optionsSelector);
  const columns = useGridSelector(apiRef, columnsSelector);
  const rowCount = useGridSelector(apiRef, rowCountSelector);

  const getSortModelParams = React.useCallback(
    (): SortModelParams => ({
      sortModel: sortModelRef.current,
      api: apiRef.current,
      columns: apiRef.current.getAllColumns(),
    }),
    [apiRef],
  );

  const upsertSortModel = React.useCallback((field: string, sortItem?: SortItem): SortModel => {
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
  }, []);

  const createSortItem = React.useCallback(
    (col: ColDef): SortItem | undefined => {
      const existing = sortModelRef.current.find((c) => c.field === col.field);
      if (existing) {
        const nextSort = nextSortDirection(options.sortingOrder, existing.sort);
        return nextSort == null ? undefined : { ...existing, sort: nextSort };
      }
      return { field: col.field, sort: nextSortDirection(options.sortingOrder) };
    },
    [options.sortingOrder],
  );

  const comparatorListAggregate = React.useCallback(
    (row1: RowModel, row2: RowModel) => {
      const result = comparatorList.current.reduce((res, colComparator) => {
        const { field, comparator } = colComparator;
        res =
          res ||
          comparator(
            row1.data[field],
            row2.data[field],
            buildCellParams({
              api: apiRef.current,
              colDef: apiRef.current.getColumnFromField(field),
              rowModel: row1,
              value: row1.data[field],
            }),
            buildCellParams({
              api: apiRef.current,
              colDef: apiRef.current.getColumnFromField(field),
              rowModel: row2,
              value: row2.data[field],
            }),
          );
        return res;
      }, 0);
      return result;
    },
    [apiRef],
  );

  const buildComparatorList = React.useCallback(
    (sortModel: SortModel): FieldComparatorList => {
      const comparators = sortModel.map((item) => {
        const column = apiRef.current.getColumnFromField(item.field);
        const comparator = isDesc(item.sort)
          ? (v1: CellValue, v2: CellValue, cellParams1: CellParams, cellParams2: CellParams) =>
              -1 * column.sortComparator!(v1, v2, cellParams1, cellParams2)
          : column.sortComparator!;
        return { field: column.field, comparator };
      });
      return comparators;
    },
    [apiRef],
  );

  const getOriginalOrderedRows: () => RowModel[] = React.useCallback(() => {
    return originalOrder.current.map((rowId) => apiRef.current.getRowFromId(rowId));
  }, [apiRef]);

  const applySorting = React.useCallback(() => {
    logger.info('Sorting rows with ', sortModelRef.current);
    const newRows = apiRef.current.getRowModels();

    let sorted = [...newRows];
    if (sortModelRef.current.length === 0) {
      sorted = getOriginalOrderedRows();
    } else {
      comparatorList.current = buildComparatorList(sortModelRef.current);
      sorted = sorted.sort(comparatorListAggregate);
    }

    //TODO move that to sorting state;
    apiRef.current.setRowModels([...sorted]);

  }, [
    apiRef,
    sortModelRef,
    buildComparatorList,
    comparatorListAggregate,
    getOriginalOrderedRows,
    logger,
  ]);

  const setSortModel = React.useCallback(
    (sortModel: SortModel) => {
      sortModelRef.current = sortModel;
      if(columns.visible.length === 0) {
        return;
      }
      apiRef.current.publishEvent(SORT_MODEL_CHANGE, getSortModelParams());

      if (options.sortingMode === FeatureModeConstant.client) {
        applySorting();
      }
    },
    [columns.visible.length, apiRef, getSortModelParams, options.sortingMode, applySorting],
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
    [upsertSortModel, setSortModel, createSortItem],
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
    originalOrder.current = apiRef.current.getRowModels().reduce((order, row) => {
      order.push(row.id);
      return order;
    }, [] as RowId[]);
  }, [apiRef]);

  const onRowsUpdated = React.useCallback(() => {
    storeOriginalOrder();
    if (sortModelRef.current.length > 0) {
      applySorting();
    }
  }, [storeOriginalOrder, applySorting]);

  const getSortModel = React.useCallback(() => sortModelRef.current, [sortModelRef]);

  const onMultipleKeyPressed = React.useCallback(
    (isPressed: boolean) => {
      allowMultipleSorting.current = !options.disableMultipleColumnsSorting && isPressed;
    },
    [options.disableMultipleColumnsSorting],
  );

  const onSortModelChange = React.useCallback(
    (handler: (param: SortModelParams) => void): (() => void) => {
      return apiRef.current.subscribeEvent(SORT_MODEL_CHANGE, handler);
    },
    [apiRef],
  );

  useApiEventHandler(apiRef, COLUMN_HEADER_CLICK, headerClickHandler);
  useApiEventHandler(apiRef, ROWS_UPDATED, onRowsUpdated);
  useApiEventHandler(apiRef, MULTIPLE_KEY_PRESS_CHANGED, onMultipleKeyPressed);

  useApiEventHandler(apiRef, SORT_MODEL_CHANGE, options.onSortModelChange);

  const sortApi: SortApi = { getSortModel, setSortModel, onSortModelChange };
  useApiMethod(apiRef, sortApi, 'SortApi');

  React.useEffect(() => {
    if (rowCount > 0 && options.sortingMode === FeatureModeConstant.client) {
      storeOriginalOrder();
      if (sortModelRef.current.length > 0) {
        logger.debug('row changed, applying sortModel');
        applySorting();
      }
    }
  }, [rowCount, applySorting, storeOriginalOrder, options.sortingMode, logger]);

  React.useEffect(() => {
    if (columns.visible.length > 0) {
      const sortedColumns = apiRef.current
        .getAllColumns()
        .filter((column) => column.sortDirection != null)
        .sort((a, b) => a.sortIndex! - b.sortIndex!);

      const sortModel = sortedColumns.map((column) => ({
        field: column.field,
        sort: column.sortDirection,
      }));
      if (sortModel.length > 0 && !isEqual(sortModelRef.current, sortModel)) {
        setSortModel(sortModel);
      }
    }
  }, [columns, setSortModel, apiRef]);

  React.useEffect(() => {
    const model = options.sortModel || [];
    if (model !== sortModelRef.current && model.length > 0 && apiRef.current?.isInitialised) {
      setSortModel(model);
    }
  }, [options.sortModel, setSortModel, apiRef, apiRef.current?.isInitialised]);
};
