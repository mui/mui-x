import * as React from 'react';
import { COLUMNS_UPDATED } from '../../../constants/eventsConstants';
import { ApiRef } from '../../../models/api/apiRef';
import { ColumnApi } from '../../../models/api/columnApi';
import { checkboxSelectionColDef } from '../../../models/colDef/checkboxSelection';
import {
  ColDef,
  Columns,
  ColumnsMeta,
  getInitialColumnsState,
  InternalColumns,
} from '../../../models/colDef/colDef';
import { ColumnTypesRecord } from '../../../models/colDef/colTypeDef';
import { getColDef } from '../../../models/colDef/getColDef';
import { useApiMethod } from '../../root/useApiMethod';
import { Logger, useLogger } from '../../utils/useLogger';
import { GridState } from '../core/gridState';
import { useGridState } from '../core/useGridState';

function updateColumnsWidth(columns: Columns,   viewportWidth: number) {
  const numberOfFluidColumns = columns.filter((column) => !!column.flex).length;
  let flexDivider = 0;

  if (numberOfFluidColumns && viewportWidth) {
    columns.forEach((column) => {
      if (!column.flex) {
        viewportWidth -= column.width!;
      } else {
        flexDivider += column.flex;
      }
    });
  }

  let newColumns = [...columns];
  if (viewportWidth > 0 && numberOfFluidColumns) {
    const flexMultiplier = viewportWidth / flexDivider;
    newColumns = columns.map((column) => {
      return {
        ...column,
        width: column.flex! ? Math.floor(flexMultiplier * column.flex!) : column.width,
      };
    });
  }
  return newColumns;
}

function hydrateColumns(
  columns: Columns,
  columnTypes: ColumnTypesRecord,
  withCheckboxSelection: boolean,
  logger: Logger,
): Columns {
  logger.debug('Hydrating Columns with default definitions');

  const extendedColumns = columns.map((c) => ({ ...getColDef(columnTypes, c.type), ...c }));

  if (withCheckboxSelection) {
    return [checkboxSelectionColDef, ...extendedColumns];
  }

  return extendedColumns;
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
  logger.debug(`Meta totalWidth ${totalWidth}`);

  return { totalWidth, positions };
}

const resetState = (
  columns: Columns,
  columnTypes: ColumnTypesRecord,
  viewportWidth: number,
  withCheckboxSelection: boolean,
  logger: Logger,
): InternalColumns => {
  let all = hydrateColumns(columns, columnTypes, withCheckboxSelection, logger);
  all = updateColumnsWidth(all, viewportWidth);

  const visible = filterVisible(logger, all);
  const meta = toMeta(logger, visible);
  const lookup = toLookup(logger, all);
  return {
    all,
    visible,
    meta,
    lookup,
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
      if(index === -1) {
        // new column
        newState.all.push(newColumn);
        newState.lookup[newColumn.field] = newColumn;
      } else {
        const columnUpdated = {...newState.all[index], ...newColumn};
        newState.all[index] = columnUpdated;
        newState.lookup[newColumn.field] = columnUpdated;
      }
    });
    newState.all = [...newState.all];
    newState.lookup = { ...newState.lookup };
  }

  const visible = filterVisible(logger, newState.all);
  const meta = toMeta(logger, visible);
  return {
    ...newState,
    visible,
    meta,
  };
};

export function useColumns(columns: Columns, apiRef: ApiRef): void {
  const logger = useLogger('useColumns');
  const [gridState, setGridState, forceUpdate] = useGridState(apiRef);
  const updateState = React.useCallback(
    (newState: InternalColumns, emit = true) => {
      logger.debug('Updating columns state.');
      setGridState((oldState) => ({ ...oldState, columns: newState }));
      forceUpdate();

      if (apiRef.current && emit) {
        apiRef.current.publishEvent(COLUMNS_UPDATED, newState.all);
      }
    },
    [logger, setGridState, forceUpdate, apiRef],
  );

  const resetColumns = React.useCallback(() => {
    logger.info(`Columns have changed, new length ${columns.length}`);
    const currentViewportWidth = apiRef.current.getState<GridState>().viewportSizes.width;
    const newState = resetState(
      columns,
      gridState.options.columnTypes,
      currentViewportWidth,
      !!gridState.options.checkboxSelection,
      logger,
    );
    updateState(newState);
  }, [logger, columns, apiRef, gridState.options.columnTypes, gridState.options.checkboxSelection, updateState]);

  React.useEffect(() => {
    resetColumns();
  }, [resetColumns]);

  const getColumnFromField: (field: string) => ColDef = React.useCallback(
    (field) => apiRef.current.getState<GridState>().columns.lookup[field],
    [apiRef],
  );
  const getAllColumns: () => Columns = React.useCallback(
    () => apiRef.current.getState<GridState>().columns.all,
    [apiRef],
  );
  const getColumnsMeta: () => ColumnsMeta = React.useCallback(
    () => apiRef.current.getState<GridState>().columns.meta,
    [apiRef],
  );
  const getColumnIndex: (field: string, useVisibleColumns?: boolean) => number = React.useCallback(
    (field, useVisibleColumns = true) =>
      useVisibleColumns
        ? apiRef.current
            .getState<GridState>()
            .columns.visible.findIndex((col) => col.field === field)
        : apiRef.current.getState<GridState>().columns.all.findIndex((col) => col.field === field),
    [apiRef],
  );

  const getColumnPosition: (field: string) => number = React.useCallback(
    (field) => {
      const index = getColumnIndex(field);
      return apiRef.current.getState<GridState>().columns.meta.positions[index];
    },
    [apiRef, getColumnIndex],
  );

  const getVisibleColumns: () => Columns = React.useCallback(
    () => apiRef.current.getState<GridState>().columns.visible,
    [apiRef],
  );

  const updateColumns = React.useCallback(
    (cols: ColDef[], resetColumnState = false) => {
      const newState = getUpdatedColumnState(logger, gridState.columns, cols, resetColumnState);
      updateState(newState, false);
    },
    [updateState, logger, gridState.columns],
  );

  const updateColumn = React.useCallback((col: ColDef) => updateColumns([col]), [updateColumns]);
  const toggleColumn = React.useCallback(
    (field: string, hide?: boolean) => {
      const col = getColumnFromField(field);
      const updatedCol = { ...col, hide: hide == null ? !col.hide : hide };
      updateColumns([updatedCol]);
      forceUpdate();
    },
    [forceUpdate, getColumnFromField, updateColumns],
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
    toggleColumn,
  };

  useApiMethod(apiRef, colApi, 'ColApi');

  React.useEffect(() => {
    logger.debug(`Columns gridState.viewportSizes.width, changed ${gridState.viewportSizes.width}`);
    const currentColumns = apiRef.current.getState<GridState>().columns.all;

    const updatedCols = updateColumnsWidth(currentColumns, gridState.viewportSizes.width);
    apiRef.current.updateColumns(updatedCols);

  }, [apiRef, gridState.viewportSizes.width, logger]);
}
