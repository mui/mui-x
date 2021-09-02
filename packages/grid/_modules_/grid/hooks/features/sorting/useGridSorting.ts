import * as React from 'react';
import { GridEvents } from '../../../constants/eventsConstants';
import { GridComponentProps } from '../../../GridComponentProps';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { GridSortApi } from '../../../models/api/gridSortApi';
import { GridCellValue } from '../../../models/gridCell';
import { GridColDef } from '../../../models/colDef/gridColDef';
import { GridFeatureModeConstant } from '../../../models/gridFeatureMode';
import { GridColumnHeaderParams } from '../../../models/params/gridColumnHeaderParams';
import { GridRowId, GridRowModel } from '../../../models/gridRows';
import {
  GridFieldComparatorList,
  GridSortItem,
  GridSortModel,
  GridSortDirection,
  GridSortCellParams,
} from '../../../models/gridSortModel';
import { isDesc, nextGridSortDirection } from '../../../utils/sortingUtils';
import { isEnterKey } from '../../../utils/keyboardUtils';
import { useGridApiEventHandler } from '../../root/useGridApiEventHandler';
import { useGridApiMethod } from '../../root/useGridApiMethod';
import { useLogger } from '../../utils/useLogger';
import { allGridColumnsSelector } from '../columns/gridColumnsSelector';
import { useGridSelector } from '../core/useGridSelector';
import { useGridState } from '../core/useGridState';
import { gridRowCountSelector } from '../rows/gridRowsSelector';
import {
  gridSortModelSelector,
  sortedGridRowIdsSelector,
  sortedGridRowsSelector,
} from './gridSortingSelector';
import { useGridStateInit } from '../../utils/useGridStateInit';
import { useFirstRender } from '../../utils/useFirstRender';
import { useGridRegisterControlState } from '../../utils/useGridRegisterControlState';

/**
 * @requires useGridRows (state, event)
 * @requires useGridControlStateManager (method)
 * @requires useGridColumns (event)
 */
export const useGridSorting = (
  apiRef: GridApiRef,
  props: Pick<
    GridComponentProps,
    | 'rows'
    | 'sortModel'
    | 'onSortModelChange'
    | 'sortingOrder'
    | 'sortingMode'
    | 'disableMultipleColumnsSorting'
  >,
) => {
  const logger = useLogger('useGridSorting');

  useGridStateInit(apiRef, (state) => ({
    ...state,
    sorting: {
      sortModel: props.sortModel ?? [],
      sortedRows: [],
    },
  }));

  const [, setGridState, forceUpdate] = useGridState(apiRef);
  const rowCount = useGridSelector(apiRef, gridRowCountSelector);

  useGridRegisterControlState(apiRef, {
    stateId: 'sortModel',
    propModel: props.sortModel,
    propOnChange: props.onSortModelChange,
    stateSelector: (state) => state.sorting.sortModel,
    changeEvent: GridEvents.sortModelChange,
  });

  const upsertSortModel = React.useCallback(
    (field: string, sortItem?: GridSortItem): GridSortModel => {
      const sortModel = gridSortModelSelector(apiRef.current.state);
      const existingIdx = sortModel.findIndex((c) => c.field === field);
      let newSortModel = [...sortModel];
      if (existingIdx > -1) {
        if (!sortItem) {
          newSortModel.splice(existingIdx, 1);
        } else {
          newSortModel.splice(existingIdx, 1, sortItem);
        }
      } else {
        newSortModel = [...sortModel, sortItem!];
      }
      return newSortModel;
    },
    [apiRef],
  );

  const createSortItem = React.useCallback(
    (col: GridColDef, directionOverride?: GridSortDirection): GridSortItem | undefined => {
      const sortModel = gridSortModelSelector(apiRef.current.state);
      const existing = sortModel.find((c) => c.field === col.field);

      if (existing) {
        const nextSort =
          directionOverride === undefined
            ? nextGridSortDirection(props.sortingOrder, existing.sort)
            : directionOverride;

        return nextSort == null ? undefined : { ...existing, sort: nextSort };
      }
      return {
        field: col.field,
        sort:
          directionOverride === undefined
            ? nextGridSortDirection(props.sortingOrder)
            : directionOverride,
      };
    },
    [apiRef, props.sortingOrder],
  );

  const getSortCellParams = React.useCallback(
    (id: GridRowId, field: string) => {
      const params: GridSortCellParams = {
        id,
        field,
        value: apiRef.current.getCellValue(id, field),
        api: apiRef.current,
      };

      return params;
    },
    [apiRef],
  );

  const comparatorListAggregate = React.useCallback(
    (comparatorList: GridFieldComparatorList) =>
      (row1: GridSortCellParams[], row2: GridSortCellParams[]) => {
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
      },
    [],
  );

  const buildComparatorList = React.useCallback(
    (sortModel: GridSortModel): GridFieldComparatorList => {
      const comparators = sortModel.map((item) => {
        const column = apiRef.current.getColumn(item.field);
        if (!column) {
          throw new Error(`Error sorting: column with field '${item.field}' not found. `);
        }
        const comparator = isDesc(item.sort)
          ? (
              v1: GridCellValue,
              v2: GridCellValue,
              cellParams1: GridSortCellParams,
              cellParams2: GridSortCellParams,
            ) => -1 * column.sortComparator!(v1, v2, cellParams1, cellParams2)
          : column.sortComparator!;
        return { field: column.field, comparator };
      });
      return comparators;
    },
    [apiRef],
  );

  const applySorting = React.useCallback(() => {
    let sortedRows = apiRef.current.getAllRowIds();

    if (props.sortingMode === GridFeatureModeConstant.server) {
      logger.debug('Skipping sorting rows as sortingMode = server');
      setGridState((state) => ({
        ...state,
        sorting: { ...state.sorting, sortedRows },
      }));
      return;
    }

    const sortModel = gridSortModelSelector(apiRef.current.state);

    if (sortModel.length > 0) {
      const comparatorList = buildComparatorList(sortModel);
      logger.debug('Sorting rows with ', sortModel);
      sortedRows = sortedRows
        .map((id) => {
          return comparatorList.map((colComparator) => {
            return getSortCellParams(id, colComparator.field);
          });
        })
        .sort(comparatorListAggregate(comparatorList))
        .map((field) => field[0].id);
    }

    setGridState((state) => ({
      ...state,
      sorting: { ...state.sorting, sortedRows },
    }));
    forceUpdate();
  }, [
    apiRef,
    logger,
    getSortCellParams,
    setGridState,
    forceUpdate,
    buildComparatorList,
    comparatorListAggregate,
    props.sortingMode,
  ]);

  const setSortModel = React.useCallback(
    (sortModel: GridSortModel) => {
      const currentModel = gridSortModelSelector(apiRef.current.state);
      if (sortModel !== currentModel) {
        setGridState((state) => {
          return { ...state, sorting: { ...state.sorting, sortModel } };
        });
        forceUpdate();
        apiRef.current.applySorting();
      }
    },
    [setGridState, forceUpdate, apiRef],
  );

  const sortColumn = React.useCallback(
    (column: GridColDef, direction?: GridSortDirection, allowMultipleSorting?: boolean) => {
      if (!column.sortable) {
        return;
      }
      const sortItem = createSortItem(column, direction);
      let sortModel: GridSortItem[];
      if (!allowMultipleSorting || props.disableMultipleColumnsSorting) {
        sortModel = !sortItem ? [] : [sortItem];
      } else {
        sortModel = upsertSortModel(column.field, sortItem);
      }
      setSortModel(sortModel);
    },
    [upsertSortModel, setSortModel, createSortItem, props.disableMultipleColumnsSorting],
  );

  const handleColumnHeaderClick = React.useCallback(
    ({ colDef }: GridColumnHeaderParams, event: React.MouseEvent) => {
      const allowMultipleSorting = event.shiftKey || event.metaKey || event.ctrlKey;
      sortColumn(colDef, undefined, allowMultipleSorting);
    },
    [sortColumn],
  );

  const handleColumnHeaderKeyDown = React.useCallback(
    ({ colDef }: GridColumnHeaderParams, event: React.KeyboardEvent) => {
      // CTRL + Enter opens the column menu
      if (isEnterKey(event.key) && !event.ctrlKey && !event.metaKey) {
        sortColumn(colDef, undefined, event.shiftKey);
      }
    },
    [sortColumn],
  );

  const onRowsCleared = React.useCallback(() => {
    setGridState((state) => {
      return { ...state, sorting: { ...state.sorting, sortedRows: [] } };
    });
  }, [setGridState]);

  const getSortModel = React.useCallback(
    () => gridSortModelSelector(apiRef.current.state),
    [apiRef],
  );

  const getSortedRows = React.useCallback(
    (): GridRowModel[] => Object.values(sortedGridRowsSelector(apiRef.current.state)),
    [apiRef],
  );

  const getSortedRowIds = React.useCallback(
    (): GridRowId[] => sortedGridRowIdsSelector(apiRef.current.state),
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
        }, [] as GridSortModel);
      }

      return { ...state, sorting: { ...state.sorting, sortModel: newModel } };
    });
  }, [setGridState]);

  useGridApiEventHandler(apiRef, GridEvents.columnHeaderClick, handleColumnHeaderClick);
  useGridApiEventHandler(apiRef, GridEvents.columnHeaderKeyDown, handleColumnHeaderKeyDown);
  useGridApiEventHandler(apiRef, GridEvents.rowsSet, apiRef.current.applySorting);
  useGridApiEventHandler(apiRef, GridEvents.rowsClear, onRowsCleared);
  useGridApiEventHandler(apiRef, GridEvents.rowsUpdate, apiRef.current.applySorting);
  useGridApiEventHandler(apiRef, GridEvents.columnsChange, onColUpdated);

  const sortApi: GridSortApi = {
    getSortModel,
    getSortedRows,
    getSortedRowIds,
    setSortModel,
    sortColumn,
    applySorting,
  };
  useGridApiMethod(apiRef, sortApi, 'GridSortApi');

  React.useEffect(() => {
    // When the rows prop change, we re apply the sorting.
    apiRef.current.applySorting();
  }, [apiRef, props.rows]);

  React.useEffect(() => {
    if (rowCount > 0) {
      logger.debug('row changed, applying sortModel');
      apiRef.current.applySorting();
    }
  }, [rowCount, apiRef, logger]);

  React.useEffect(() => {
    if (props.sortModel !== undefined) {
      apiRef.current.setSortModel(props.sortModel);
    }
  }, [props.sortModel, apiRef]);

  useFirstRender(() => apiRef.current.applySorting());
};
