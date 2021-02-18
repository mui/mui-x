import * as React from 'react';
import {
  GRID_COLUMN_HEADER_CLICK,
  GRID_COLUMNS_UPDATED,
  GRID_MULTIPLE_KEY_PRESS_CHANGED,
  GRID_ROWS_CLEARED,
  GRID_ROWS_SET,
  GRID_ROWS_UPDATED,
  GRID_SORT_MODEL_CHANGE,
} from '../../../constants/eventsConstants';
import { ApiRef } from '../../../models/api/apiRef';
import { SortApi } from '../../../models/api/sortApi';
import { CellValue } from '../../../models/cell';
import { ColDef } from '../../../models/colDef/colDef';
import { GridFeatureModeConstant } from '../../../models/gridFeatureMode';
import { CellParams } from '../../../models/params/cellParams';
import { ColParams } from '../../../models/params/colParams';
import { SortModelParams } from '../../../models/params/sortModelParams';
import { RowModel, RowsProp } from '../../../models/rows';
import { FieldComparatorList, SortItem, SortModel, SortDirection } from '../../../models/sortModel';
import { buildGridCellParams } from '../../../utils/paramsUtils';
import { isDesc, nextGridSortDirection } from '../../../utils/sortingUtils';
import { isDeepEqual } from '../../../utils/utils';
import { useGridApiEventHandler } from '../../root/useGridApiEventHandler';
import { useGridApiMethod } from '../../root/useGridApiMethod';
import { optionsSelector } from '../../utils/optionsSelector';
import { useLogger } from '../../utils/useLogger';
import { allGridColumnsSelector, visibleGridColumnsSelector } from '../columns/gridColumnsSelector';
import { useGridSelector } from '../core/useGridSelector';
import { useGridState } from '../core/useGridState';
import { gridRowCountSelector } from '../rows/gridRowsSelector';

export const useGridSorting = (apiRef: ApiRef, rowsProp: RowsProp) => {
  const logger = useLogger('useGridSorting');
  const allowMultipleSorting = React.useRef<boolean>(false);
  const comparatorList = React.useRef<FieldComparatorList>([]);

  const [gridState, setGridState, forceUpdate] = useGridState(apiRef);
  const options = useGridSelector(apiRef, optionsSelector);
  const visibleColumns = useGridSelector(apiRef, visibleGridColumnsSelector);
  const rowCount = useGridSelector(apiRef, gridRowCountSelector);

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
    (col: ColDef, directionOverride?: SortDirection): SortItem | undefined => {
      const existing = gridState.sorting.sortModel.find((c) => c.field === col.field);

      if (existing) {
        const nextSort =
          directionOverride === undefined
            ? nextGridSortDirection(options.sortingOrder, existing.sort)
            : directionOverride;

        return nextSort == null ? undefined : { ...existing, sort: nextSort };
      }
      return {
        field: col.field,
        sort:
          directionOverride === undefined
            ? nextGridSortDirection(options.sortingOrder)
            : directionOverride,
      };
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
            row1[field],
            row2[field],
            buildGridCellParams({
              api: apiRef.current,
              colDef: apiRef.current.getColumnFromField(field),
              rowModel: row1,
              value: row1[field],
            }),
            buildGridCellParams({
              api: apiRef.current,
              colDef: apiRef.current.getColumnFromField(field),
              rowModel: row2,
              value: row2[field],
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
        if (!column) {
          throw new Error(`Error sorting: column with field '${item.field}' not found. `);
        }
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
    const rowModels = apiRef.current.getRowModels();

    if (options.sortingMode === GridFeatureModeConstant.server) {
      logger.debug('Skipping sorting rows as sortingMode = server');
      setGridState((oldState) => {
        return {
          ...oldState,
          sorting: { ...oldState.sorting, sortedRows: rowModels.map((row) => row.id) },
        };
      });
      return;
    }

    const sortModel = apiRef.current.getState().sorting.sortModel;
    logger.debug('Sorting rows with ', sortModel);
    const sorted = [...rowModels];
    if (sortModel.length > 0) {
      comparatorList.current = buildComparatorList(sortModel);
      sorted.sort(comparatorListAggregate);
    }

    setGridState((oldState) => {
      return {
        ...oldState,
        sorting: { ...oldState.sorting, sortedRows: sorted.map((row) => row.id) },
      };
    });
    forceUpdate();
  }, [
    apiRef,
    logger,
    setGridState,
    forceUpdate,
    buildComparatorList,
    comparatorListAggregate,
    options.sortingMode,
  ]);

  const setSortModel = React.useCallback(
    (sortModel: SortModel) => {
      setGridState((oldState) => {
        const sortingState = { ...oldState.sorting, sortModel };
        return { ...oldState, sorting: { ...sortingState } };
      });
      forceUpdate();

      if (visibleColumns.length === 0) {
        return;
      }
      apiRef.current.publishEvent(GRID_SORT_MODEL_CHANGE, getSortModelParams(sortModel));
      apiRef.current.applySorting();
    },
    [setGridState, forceUpdate, visibleColumns.length, apiRef, getSortModelParams],
  );

  const sortColumn = React.useCallback(
    (column: ColDef, direction?: SortDirection) => {
      if (!column.sortable) {
        return;
      }
      const sortItem = createSortItem(column, direction);
      let sortModel: SortItem | SortItem[];
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
      sortColumn(colDef);
    },
    [sortColumn],
  );

  const onRowsCleared = React.useCallback(() => {
    setGridState((state) => {
      return { ...state, sorting: { ...state.sorting, sortedRows: [] } };
    });
  }, [setGridState]);

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
      return apiRef.current.subscribeEvent(GRID_SORT_MODEL_CHANGE, handler);
    },
    [apiRef],
  );

  const onColUpdated = React.useCallback(() => {
    // When the columns change we check that the sorted columns are still part of the dataset
    setGridState((state) => {
      const sortModel = state.sorting.sortModel;
      const latestColumns = allGridColumnsSelector(state);
      let newModel = sortModel;
      if (sortModel.length > 0) {
        newModel = sortModel.reduce((model, sortedCol) => {
          const exist = latestColumns.find((col) => col.field === sortedCol.field);
          if (exist) {
            model.push(sortedCol);
          }
          return model;
        }, [] as SortModel);
      }

      return { ...state, sorting: { ...state.sorting, sortModel: newModel } };
    });
  }, [setGridState]);

  useGridApiEventHandler(apiRef, GRID_COLUMN_HEADER_CLICK, headerClickHandler);
  useGridApiEventHandler(apiRef, GRID_ROWS_SET, apiRef.current.applySorting);
  useGridApiEventHandler(apiRef, GRID_ROWS_CLEARED, onRowsCleared);
  useGridApiEventHandler(apiRef, GRID_ROWS_UPDATED, apiRef.current.applySorting);
  useGridApiEventHandler(apiRef, GRID_COLUMNS_UPDATED, onColUpdated);
  useGridApiEventHandler(apiRef, GRID_MULTIPLE_KEY_PRESS_CHANGED, onMultipleKeyPressed);

  useGridApiEventHandler(apiRef, GRID_SORT_MODEL_CHANGE, options.onSortModelChange);

  const sortApi: SortApi = {
    getSortModel,
    setSortModel,
    sortColumn,
    onSortModelChange,
    applySorting,
  };
  useGridApiMethod(apiRef, sortApi, 'SortApi');

  React.useEffect(() => {
    // When the rows prop change, we re apply the sorting.
    apiRef.current.applySorting();
  }, [apiRef, rowsProp]);

  React.useEffect(() => {
    if (rowCount > 0) {
      logger.debug('row changed, applying sortModel');
      apiRef.current.applySorting();
    }
  }, [rowCount, apiRef, logger]);

  React.useEffect(() => {
    const sortModel = options.sortModel || [];
    const oldSortModel = apiRef.current.state.sorting.sortModel;
    if (!isDeepEqual(sortModel, oldSortModel)) {
      // we use apiRef to avoid watching setSortModel as it will trigger an update on every state change
      apiRef.current.setSortModel(sortModel);
    }
  }, [options.sortModel, apiRef]);
};
