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
import { optionsSelector } from '../../utils/useOptionsProp';
import { GridState } from '../core/gridState';
import { useGridSelector } from '../core/useGridSelector';
import { useGridState } from '../core/useGridState';
import { allColumnsSelector, columnsMetaSelector, visibleColumnsSelector } from './columnsSelector';

function updateColumnsWidth(columns: Columns, viewportWidth: number) {
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

  let newColumns = columns;
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

const upsertColumnsState = (state: InternalColumns, columnUpdates: ColDef[]): InternalColumns => {
  const newState = { all: [...state.all], lookup: { ...state.lookup } };

  columnUpdates.forEach((newColumn) => {
    if (newState.lookup[newColumn.field] == null) {
      // New Column
      newState.lookup[newColumn.field] = newColumn;
      newState.all.push(newColumn.field);
    } else {
      newState.lookup[newColumn.field] = { ...newState.lookup[newColumn.field], ...newColumn };
    }
  });
  return newState;
};

export function useColumns(columns: Columns, apiRef: ApiRef): void {
  const logger = useLogger('useColumns');
  const [gridState, setGridState, forceUpdate] = useGridState(apiRef);
  const columnsMeta = useGridSelector(apiRef, columnsMetaSelector);
  const allColumns = useGridSelector(apiRef, allColumnsSelector);
  const visibleColumns = useGridSelector(apiRef, visibleColumnsSelector);
  const options = useGridSelector(apiRef, optionsSelector);

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

  const getColumnFromField: (field: string) => ColDef = React.useCallback(
    (field) => apiRef.current.state.columns.lookup[field],
    [apiRef],
  );

  const getAllColumns: () => Columns = React.useCallback(() => allColumns, [allColumns]);
  const getVisibleColumns = React.useCallback(() => visibleColumns, [visibleColumns]);
  const getColumnsMeta: () => ColumnsMeta = React.useCallback(() => columnsMeta, [columnsMeta]);

  const getColumnIndex: (field: string, useVisibleColumns?: boolean) => number = React.useCallback(
    (field, useVisibleColumns = true) =>
      useVisibleColumns
        ? visibleColumns.findIndex((col) => col.field === field)
        : allColumns.findIndex((col) => col.field === field),
    [allColumns, visibleColumns],
  );

  const getColumnPosition: (field: string) => number = React.useCallback(
    (field) => {
      const index = getColumnIndex(field);
      return columnsMeta.positions[index];
    },
    [columnsMeta.positions, getColumnIndex],
  );

  const updateColumns = React.useCallback(
    (cols: ColDef[]) => {
      logger.debug('updating Columns with new state');
      const newState = upsertColumnsState(gridState.columns, cols);
      updateState(newState, false);
    },
    [logger, gridState.columns, updateState],
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

  const moveColumn = React.useCallback(
    (field: string, targetIndexPosition: number) => {
      logger.debug(`Moving column ${field} to index ${targetIndexPosition}`);
      const oldIndexPosition = gridState.columns.all.findIndex((col) => col === field);

      const updatedColumns = [...gridState.columns.all];
      updatedColumns.splice(targetIndexPosition, 0, updatedColumns.splice(oldIndexPosition, 1)[0]);
      updateState({ ...gridState.columns, all: updatedColumns }, false);
    },
    [gridState.columns, logger, updateState],
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
    moveColumn,
  };

  useApiMethod(apiRef, colApi, 'ColApi');

  React.useEffect(() => {
    logger.info(`Columns have changed, new length ${columns.length}`);

    if (columns.length > 0) {
      const hydratedColumns = hydrateColumns(
        columns,
        options.columnTypes,
        !!options.checkboxSelection,
        logger,
      );

      updateState({
        all: hydratedColumns.map((col) => col.field),
        lookup: toLookup(logger, hydratedColumns),
      });
    } else {
      updateState(getInitialColumnsState());
    }
  }, [logger, columns, options.columnTypes, options.checkboxSelection, updateState]);

  React.useEffect(() => {
    logger.debug(`Columns gridState.viewportSizes.width, changed ${gridState.viewportSizes.width}`);
    // Avoid dependency on gridState as I only want to update cols when viewport size changed.
    const currentColumns = allColumnsSelector(apiRef.current.getState<GridState>());

    const updatedCols = updateColumnsWidth(currentColumns, gridState.viewportSizes.width);
    apiRef.current.updateColumns(updatedCols);
  }, [apiRef, gridState.viewportSizes.width, logger]);
}
