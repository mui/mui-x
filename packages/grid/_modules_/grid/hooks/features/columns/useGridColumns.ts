import * as React from 'react';
import { GRID_COLUMNS_UPDATED, GRID_COLUMN_ORDER_CHANGE } from '../../../constants/eventsConstants';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { GridColumnApi } from '../../../models/api/gridColumnApi';
import { gridCheckboxSelectionColDef } from '../../../models/colDef/gridCheckboxSelection';
import {
  GridColDef,
  GridColumns,
  GridColumnsMeta,
  getInitialGridColumnsState,
  GridInternalColumns,
} from '../../../models/colDef/gridColDef';
import { GridColumnTypesRecord } from '../../../models/colDef/gridColTypeDef';
import { getGridDefaultColumnTypes } from '../../../models/colDef/gridDefaultColumnTypes';
import { getGridColDef } from '../../../models/colDef/getGridColDef';
import { GridColumnOrderChangeParams } from '../../../models/params/gridColumnOrderChangeParams';
import { mergeGridColTypes } from '../../../utils/mergeUtils';
import { useGridApiMethod } from '../../root/useGridApiMethod';
import { optionsSelector } from '../../utils/optionsSelector';
import { Logger, useLogger } from '../../utils/useLogger';
import { useGridSelector } from '../core/useGridSelector';
import { GridLocaleText, GridTranslationKeys } from '../../../models/api/gridLocaleTextApi';
import { useGridState } from '../core/useGridState';
import {
  allGridColumnsSelector,
  gridColumnsMetaSelector,
  visibleGridColumnsSelector,
} from './gridColumnsSelector';

function updateColumnsWidth(columns: GridColumns, viewportWidth: number) {
  const numberOfFluidColumns = columns.filter((column) => !!column.flex && !column.hide).length;
  let flexDivider = 0;

  if (numberOfFluidColumns && viewportWidth) {
    columns.forEach((column) => {
      if (!column.hide) {
        if (!column.flex) {
          viewportWidth -= column.width!;
        } else {
          flexDivider += column.flex;
        }
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
  columns: GridColumns,
  columnTypes: GridColumnTypesRecord,
  withCheckboxSelection: boolean,
  logger: Logger,
  getLocaleText: <T extends GridTranslationKeys>(key: T) => GridLocaleText[T],
): GridColumns {
  logger.debug('Hydrating GridColumns with default definitions');
  const mergedColTypes = mergeGridColTypes(getGridDefaultColumnTypes(), columnTypes);
  const extendedColumns = columns.map((c) => ({ ...getGridColDef(mergedColTypes, c.type), ...c }));

  if (withCheckboxSelection) {
    const checkboxSelection = { ...gridCheckboxSelectionColDef };
    checkboxSelection.headerName = getLocaleText('checkboxSelectionHeaderName');
    return [checkboxSelection, ...extendedColumns];
  }

  return extendedColumns;
}

function toLookup(logger: Logger, allColumns: GridColumns) {
  logger.debug('Building columns lookup');
  return allColumns.reduce((lookup, col) => {
    lookup[col.field] = col;
    return lookup;
  }, {} as { [key: string]: GridColDef });
}

const upsertColumnsState = (
  state: GridInternalColumns,
  columnUpdates: GridColDef[],
): GridInternalColumns => {
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

export function useGridColumns(columns: GridColumns, apiRef: GridApiRef): void {
  const logger = useLogger('useGridColumns');
  const [gridState, setGridState, forceUpdate] = useGridState(apiRef);
  const columnsMeta = useGridSelector(apiRef, gridColumnsMetaSelector);
  const allColumns = useGridSelector(apiRef, allGridColumnsSelector);
  const visibleColumns = useGridSelector(apiRef, visibleGridColumnsSelector);
  const options = useGridSelector(apiRef, optionsSelector);

  const updateState = React.useCallback(
    (newState: GridInternalColumns, emit = true) => {
      logger.debug('Updating columns state.');
      setGridState((oldState) => ({ ...oldState, columns: newState }));
      forceUpdate();

      if (apiRef.current && emit) {
        apiRef.current.publishEvent(GRID_COLUMNS_UPDATED, newState.all);
      }
    },
    [logger, setGridState, forceUpdate, apiRef],
  );

  const getColumnFromField: (field: string) => GridColDef = React.useCallback(
    (field) => apiRef.current.state.columns.lookup[field],
    [apiRef],
  );

  const getAllColumns: () => GridColumns = React.useCallback(() => allColumns, [allColumns]);
  const getVisibleColumns = React.useCallback(() => visibleColumns, [visibleColumns]);
  const getColumnsMeta: () => GridColumnsMeta = React.useCallback(() => columnsMeta, [columnsMeta]);

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
    (cols: GridColDef[]) => {
      logger.debug('updating GridColumns with new state');
      const newState = upsertColumnsState(gridState.columns, cols);
      updateState(newState, false);
    },
    [logger, gridState.columns, updateState],
  );

  const updateColumn = React.useCallback((col: GridColDef) => updateColumns([col]), [
    updateColumns,
  ]);
  const toggleColumn = React.useCallback(
    (field: string, hide?: boolean) => {
      const col = getColumnFromField(field);
      const updatedCol = { ...col, hide: hide == null ? !col.hide : hide };
      updateColumns([updatedCol]);
      forceUpdate();
    },
    [forceUpdate, getColumnFromField, updateColumns],
  );

  const setColumnIndex = React.useCallback(
    (field: string, targetIndexPosition: number) => {
      const oldIndexPosition = gridState.columns.all.findIndex((col) => col === field);
      if (oldIndexPosition === targetIndexPosition) {
        return;
      }

      logger.debug(`Moving column ${field} to index ${targetIndexPosition}`);

      const params: GridColumnOrderChangeParams = {
        field,
        element: apiRef.current.getColumnHeaderElement(field),
        colDef: apiRef.current.getColumnFromField(field),
        targetIndex: targetIndexPosition,
        oldIndex: oldIndexPosition,
        api: apiRef.current,
      };
      apiRef.current.publishEvent(GRID_COLUMN_ORDER_CHANGE, params);

      const updatedColumns = [...gridState.columns.all];
      updatedColumns.splice(targetIndexPosition, 0, updatedColumns.splice(oldIndexPosition, 1)[0]);
      updateState({ ...gridState.columns, all: updatedColumns });
    },
    [apiRef, gridState.columns, logger, updateState],
  );

  const colApi: GridColumnApi = {
    getColumnFromField,
    getAllColumns,
    getColumnIndex,
    getColumnPosition,
    getVisibleColumns,
    getColumnsMeta,
    updateColumn,
    updateColumns,
    toggleColumn,
    setColumnIndex,
  };

  useGridApiMethod(apiRef, colApi, 'ColApi');

  React.useEffect(() => {
    logger.info(`GridColumns have changed, new length ${columns.length}`);

    if (columns.length > 0) {
      const hydratedColumns = hydrateColumns(
        columns,
        options.columnTypes,
        !!options.checkboxSelection,
        logger,
        apiRef.current.getLocaleText,
      );

      const updatedCols = updateColumnsWidth(
        hydratedColumns,
        apiRef.current.getState().viewportSizes.width,
      );

      updateState({
        all: updatedCols.map((col) => col.field),
        lookup: toLookup(logger, updatedCols),
      });
    } else {
      updateState(getInitialGridColumnsState());
    }
  }, [logger, apiRef, columns, options.columnTypes, options.checkboxSelection, updateState]);

  React.useEffect(() => {
    logger.debug(
      `GridColumns gridState.viewportSizes.width, changed ${gridState.viewportSizes.width}`,
    );
    // Avoid dependency on gridState as I only want to update cols when viewport size changed.
    const currentColumns = allGridColumnsSelector(apiRef.current.getState());

    const updatedCols = updateColumnsWidth(currentColumns, gridState.viewportSizes.width);
    apiRef.current.updateColumns(updatedCols);
  }, [apiRef, gridState.viewportSizes.width, logger]);
}
