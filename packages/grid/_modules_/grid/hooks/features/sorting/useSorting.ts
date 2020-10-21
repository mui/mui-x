import * as React from 'react';
import {
  COLUMN_HEADER_CLICK,
  MULTIPLE_KEY_PRESS_CHANGED,
  ROWS_UPDATED,
  SORT_MODEL_CHANGE,
} from '../../../constants/eventsConstants';
import { ApiRef } from '../../../models/api/apiRef';
import { SortApi } from '../../../models/api/sortApi';
import { ColDef } from '../../../models/colDef/colDef';
import { FeatureModeConstant } from '../../../models/featureMode';
import { CellParams } from '../../../models/params/cellParams';
import { ColParams } from '../../../models/params/colParams';
import { SortModelParams } from '../../../models/params/sortModelParams';
import { CellValue, RowModel } from '../../../models/rows';
import { FieldComparatorList, SortItem, SortModel } from '../../../models/sortModel';
import { buildCellParams } from '../../../utils/paramsUtils';
import { isDesc, nextSortDirection } from '../../../utils/sortingUtils';
import { isEqual } from '../../../utils/utils';
import { useApiEventHandler } from '../../root/useApiEventHandler';
import { useApiMethod } from '../../root/useApiMethod';
import { useLogger } from '../../utils/useLogger';
import { optionsSelector } from '../../utils/useOptionsProp';
import { columnsSelector } from '../columns/columnsSelector';
import { useGridSelector } from '../core/useGridSelector';
import { useGridState } from '../core/useGridState';
import { rowCountSelector, unorderedRowModelsSelector } from '../rows/rowsSelector';
import { SortingState } from './sortingState';

export const useSorting = (apiRef: ApiRef) => {
  const logger = useLogger('useSorting');
  const allowMultipleSorting = React.useRef<boolean>(false);
  const comparatorList = React.useRef<FieldComparatorList>([]);

  const [gridState, setGridState, forceUpdate] = useGridState(apiRef);
  const options = useGridSelector(apiRef, optionsSelector);
  const columns = useGridSelector(apiRef, columnsSelector);
  const rowCount = useGridSelector(apiRef, rowCountSelector);
  const unorderedRows = useGridSelector(apiRef, unorderedRowModelsSelector);

  const getSortModelParams = React.useCallback(
    (sortModel: SortModel): SortModelParams => ({
      sortModel,
      api: apiRef.current,
      columns: apiRef.current.getAllColumns(),
    }),
    [apiRef],
  );

  const upsertSortModel = React.useCallback(
    (field: string, sortItem?: SortItem): SortModel => {
      const existingIdx = gridState.sorting.sortModel.findIndex((c) => c.field === field);
      let newSortModel = [...gridState.sorting.sortModel];
      if (existingIdx > -1) {
        if (!sortItem) {
          newSortModel.splice(existingIdx, 1);
        } else {
          newSortModel.splice(existingIdx, 1, sortItem);
        }
      } else {
        newSortModel = [...gridState.sorting.sortModel, sortItem!];
      }
      return newSortModel;
    },
    [gridState.sorting.sortModel],
  );

  const createSortItem = React.useCallback(
    (col: ColDef): SortItem | undefined => {
      const existing = gridState.sorting.sortModel.find((c) => c.field === col.field);
      if (existing) {
        const nextSort = nextSortDirection(options.sortingOrder, existing.sort);
        return nextSort == null ? undefined : { ...existing, sort: nextSort };
      }
      return { field: col.field, sort: nextSortDirection(options.sortingOrder) };
    },
    [gridState.sorting.sortModel, options.sortingOrder],
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

  const applySorting = React.useCallback(() => {
    logger.info('Sorting rows with ', gridState.sorting.sortModel);

    let sorted = [...unorderedRows];
    if (gridState.sorting.sortModel.length > 0) {
      comparatorList.current = buildComparatorList(gridState.sorting.sortModel);
      sorted = sorted.sort(comparatorListAggregate);
    }

    setGridState((oldState) => {
      return {
        ...oldState,
        sorting: { ...oldState.sorting, sortedRows: [...sorted.map((row) => row.id)] },
      };
    });
    forceUpdate();
  }, [
    logger,
    gridState.sorting.sortModel,
    unorderedRows,
    setGridState,
    forceUpdate,
    buildComparatorList,
    comparatorListAggregate,
  ]);

  const setSortModel = React.useCallback(
    (sortModel: SortModel) => {
      setGridState((oldState) => {
        const sortingState = { ...oldState.sorting, sortModel };
        return { ...oldState, sorting: { ...sortingState } };
      });
      forceUpdate();

      if (columns.visible.length === 0) {
        return;
      }
      apiRef.current.publishEvent(SORT_MODEL_CHANGE, getSortModelParams(sortModel));

      if (options.sortingMode === FeatureModeConstant.client) {
        applySorting();
      }
    },
    [
      setGridState,
      forceUpdate,
      columns.visible.length,
      apiRef,
      getSortModelParams,
      options.sortingMode,
      applySorting,
    ],
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

  const onRowsUpdated = React.useCallback(() => {
    if (gridState.sorting.sortModel.length > 0) {
      applySorting();
    }
  }, [gridState.sorting.sortModel.length, applySorting]);

  const getSortModel = React.useCallback(() => gridState.sorting.sortModel, [
    gridState.sorting.sortModel,
  ]);

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
      logger.debug('row changed, applying sortModel');
      applySorting();
    }
  }, [rowCount, applySorting, options.sortingMode, logger]);

  // TODO Remove if we deprecate column.sortDirection
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

      if (
        sortModel.length > 0 &&
        !isEqual(apiRef.current.getState<SortingState>('sorting').sortModel, sortModel)
      ) {
        // we use apiRef to avoid watching setSortModel as it will trigger an infinite loop
        apiRef.current.setSortModel(sortModel);
      }
    }
  }, [apiRef, columns]);

  React.useEffect(() => {
    const sortModel = options.sortModel || [];
    if (sortModel.length > 0) {
      // we use apiRef to avoid watching setSortModel as it will trigger an update on every state change
      apiRef.current.setSortModel(sortModel);
    }
  }, [options.sortModel, apiRef]);
};
