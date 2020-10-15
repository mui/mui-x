import * as React from 'react';
import { ApiRef } from '../../models/api/apiRef';
import { ColumnApi } from '../../models/api/columnApi';
import { checkboxSelectionColDef } from '../../models/colDef/checkboxSelection';
import { ColDef, Columns, ColumnsMeta, InternalColumns } from '../../models/colDef/colDef';
import { ColumnTypesRecord } from '../../models/colDef/colTypeDef';
import { getColDef } from '../../models/colDef/getColDef';
import { GridOptions } from '../../models/gridOptions';
import { SortModelParams } from '../../models/params/sortModelParams';
import { isEqual } from '../../utils/utils';
import { GridState } from '../features/core/gridState';
import { useGridState } from '../features/core/useGridState';
import { Logger, useLogger } from '../utils/useLogger';
import { SORT_MODEL_CHANGE, COLUMNS_UPDATED } from '../../constants/eventsConstants';
import { useApiMethod } from './useApiMethod';
import { useApiEventHandler } from './useApiEventHandler';

export const getInitialColumnsState = (): InternalColumns => ({
  visible: [],
  all: [],
  lookup: {},
  hasVisibleColumns: false,
  hasColumns: false,
  meta: { positions: [], totalWidth: 0 },
});

function hydrateColumns(
  columns: Columns,
  columnTypes: ColumnTypesRecord,
  withCheckboxSelection: boolean,
  logger: Logger,
  apiRef: ApiRef,
): Columns {
  logger.debug('Hydrating Columns with default definitions');
  let mappedCols = columns.map((c) => ({ ...getColDef(columnTypes, c.type), ...c }));
  if (withCheckboxSelection) {
    mappedCols = [checkboxSelectionColDef, ...mappedCols];
  }
  const sortedCols = mappedCols.filter((c) => c.sortDirection != null);
  if (sortedCols.length > 1) {
    // in case consumer missed to set the sort index
    sortedCols.forEach((c, idx) => {
      if (c.sortIndex == null) {
        c.sortIndex = idx + 1;
      }
    });
  }
  // we check if someone called setSortModel using apiref to apply icons
  if (apiRef.current && apiRef.current.getSortModel) {
    const sortModel = apiRef.current.getSortModel();
    sortModel.forEach((c, idx) => {
      const col = mappedCols.find((mc) => mc.field === c.field);
      if (col) {
        col.sortDirection = c.sort;
        col.sortIndex = sortModel.length > 1 ? idx + 1 : undefined;
      }
    });
  }
  return mappedCols;
}

function toLookup(logger: Logger, allColumns: Columns) {
  logger.debug('Building columns lookup');
  return allColumns.reduce((lookup, col) => {
    lookup[col.field] = col;
    return lookup;
  }, {} as { [key: string]: ColDef });
}

function filterVisible(logger: Logger, allColumns: Columns) {
  logger.debug('Calculating visibleColumns');
  return allColumns.filter((c) => c.field != null && !c.hide);
}

function toMeta(logger: Logger, visibleColumns: Columns): ColumnsMeta {
  logger.debug('Calculating columnsMeta');
  let totalWidth = 0;
  const positions: number[] = [];

  totalWidth = visibleColumns.reduce((totalW, curCol) => {
    positions.push(totalW);
    return totalW + curCol.width!;
  }, 0);
  return { totalWidth, positions };
}

const resetState = (
  columns: Columns,
  columnTypes: ColumnTypesRecord,
  withCheckboxSelection: boolean,
  logger: Logger,
  apiRef: ApiRef,
): InternalColumns => {
  if (columns.length === 0) {
    return getInitialColumnsState();
  }

  const all = hydrateColumns(columns, columnTypes, withCheckboxSelection, logger, apiRef);
  const visible = filterVisible(logger, all);
  const meta = toMeta(logger, visible);
  const lookup = toLookup(logger, all);
  return {
    all,
    visible,
    meta,
    lookup,
    hasColumns: all.length > 0,
    hasVisibleColumns: visible.length > 0,
  };
};

const getUpdatedColumnState = (
  logger: Logger,
  state: InternalColumns,
  columnUpdates: ColDef[],
  resetColumnState = false,
): InternalColumns => {
  const newState = { ...state };

  if (resetColumnState) {
    newState.all = columnUpdates;
  } else {
    columnUpdates.forEach((newColumn) => {
      const index = newState.all.findIndex((col) => col.field === newColumn.field);
      const columnUpdated = { ...newState.all[index], ...newColumn };
      newState.all[index] = columnUpdated;
      newState.all = [...newState.all];

      newState.lookup[newColumn.field] = columnUpdated;
      newState.lookup = { ...newState.lookup };
    });
  }

  const visible = filterVisible(logger, newState.all);
  const meta = toMeta(logger, visible);
  return {
    ...newState,
    visible,
    meta,
    hasColumns: newState.all.length > 0,
    hasVisibleColumns: visible.length > 0,
  };
};

export function useColumns(
  columns: Columns,
  apiRef: ApiRef,
): InternalColumns {
  const logger = useLogger('useColumns');
  const [gridState, setGridState, forceUpdate] = useGridState(apiRef);

  const updateState = React.useCallback(
    (newState: InternalColumns, emit = true) => {
      logger.debug('Updating columns state.');
      setGridState((oldState)=>  ({...oldState, columns: newState}));

      if (apiRef.current && emit) {
        apiRef.current.publishEvent(COLUMNS_UPDATED, newState.all);
      }
    },
    [logger, setGridState, apiRef],
  );

  React.useEffect(() => {
    logger.info(`Columns have change, new length ${columns.length}`);
    const newState = resetState(
      columns,
      gridState.options.columnTypes,
      !!gridState.options.checkboxSelection,
      logger,
      apiRef,
    );
    updateState(newState);
  }, [columns, gridState.options.columnTypes, gridState.options.checkboxSelection, logger, apiRef, updateState]);

  const getColumnFromField: (field: string) => ColDef = React.useCallback(
    (field) => gridState.columns.lookup[field],
    [gridState.columns],
  );
  const getAllColumns: () => Columns = () => gridState.columns.all;
  const getColumnsMeta: () => ColumnsMeta = () => gridState.columns.meta;
  const getColumnIndex: (field: string) => number = (field) =>
    gridState.columns.visible.findIndex((c) => c.field === field);
  const getColumnIndex: (field: string, useVisibleColumns?: boolean) => number = (
    field,
    useVisibleColumns = true,
  ) =>
    useVisibleColumns
      ? stateRef.current.visible.findIndex((col) => col.field === field)
      : stateRef.current.all.findIndex((col) => col.field === field);
  const getColumnPosition: (field: string) => number = (field) => {
    const index = getColumnIndex(field);
    return gridState.columns.meta.positions[index];
  };

  const getVisibleColumns: () => Columns = () => gridState.columns.visible;

  const updateColumns = React.useCallback(
    (cols: ColDef[]) => {
      const newState = getUpdatedColumnState(logger, gridState.columns, cols);
    (cols: ColDef[], resetColumnState = false) => {
      const newState = getUpdatedColumnState(logger, stateRef.current, cols, resetColumnState);
      updateState(newState, false);
    },
    [updateState, logger, gridState.columns],
  );

  const updateColumn = React.useCallback((col: ColDef) => updateColumns([col]), [updateColumns]);

  const onColumnsSorted = React.useCallback(
    ({ sortModel }: SortModelParams) => {
      logger.debug('Sort model change to ', sortModel);
      const updatedCols: ColDef[] = [];

      const currentSortedCols = gridState.columns.all
        .filter((c) => c.sortDirection != null)
        .map((c) => ({ field: c.field, sort: c.sortDirection }));
      if (isEqual(currentSortedCols, sortModel)) {
        return;
      }

      // We restore the previous columns
      currentSortedCols.forEach((c) => {
        updatedCols.push({ field: c.field, sortDirection: null, sortIndex: undefined });
      });

      sortModel.forEach((model, index) => {
        const sortIndex = sortModel.length > 1 ? index + 1 : undefined;
        updatedCols.push({ field: model.field, sortDirection: model.sort, sortIndex });
      });

      if (updatedCols.length > 0) {
        updateColumns(updatedCols);
      }

      forceUpdate();
    },
    [logger, gridState.columns.all, forceUpdate, updateColumns],
  );

  const colApi: ColumnApi = {
    getColumnFromField,
    getAllColumns,
    getColumnIndex,
    getColumnPosition,
    getVisibleColumns,
    getColumnsMeta,
    updateColumn,
    updateColumns,
  };

  useApiMethod(apiRef, colApi, 'ColApi');
  useApiEventHandler(apiRef, SORT_MODEL_CHANGE, onColumnsSorted);

  return gridState.columns;
}
