import * as React from 'react';
import { GridEvents } from '../../../constants/eventsConstants';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { GridColumnApi } from '../../../models/api/gridColumnApi';
import { gridCheckboxSelectionColDef } from '../../../models/colDef/gridCheckboxSelection';
import {
  GridColDef,
  GridColumns,
  getInitialGridColumnsState,
  GridColumnsState,
  GridStateColDef,
  GridColumnLookup,
} from '../../../models/colDef/gridColDef';
import { GridColumnTypesRecord } from '../../../models/colDef/gridColTypeDef';
import { getGridDefaultColumnTypes } from '../../../models/colDef/gridDefaultColumnTypes';
import { getGridColDef } from '../../../models/colDef/getGridColDef';
import { Logger } from '../../../models/logger';
import { GridColumnOrderChangeParams } from '../../../models/params/gridColumnOrderChangeParams';
import { mergeGridColTypes } from '../../../utils/mergeUtils';
import { useGridApiMethod } from '../../root/useGridApiMethod';
import { useLogger } from '../../utils/useLogger';
import { useGridSelector } from '../core/useGridSelector';
import { GridLocaleText, GridTranslationKeys } from '../../../models/api/gridLocaleTextApi';
import { useGridState } from '../core/useGridState';
import {
  allGridColumnsSelector,
  gridColumnsMetaSelector,
  visibleGridColumnsSelector,
} from './gridColumnsSelector';
import { useGridApiOptionHandler } from '../../root/useGridApiEventHandler';
import { GRID_STRING_COL_DEF } from '../../../models/colDef/gridStringColDef';
import { GridComponentProps } from '../../../GridComponentProps';

type RawGridColumnsState = Omit<GridColumnsState, 'lookup'> & {
  lookup: { [field: string]: GridColDef | GridStateColDef };
};

function getStateColumns(
  columns: (GridColDef | GridStateColDef)[],
  viewportWidth: number,
): GridStateColDef[] {
  let totalFlexUnits = 0;
  let widthToAllocateInFlex = viewportWidth;

  const stateColumns: GridStateColDef[] = [];

  // Compute the width of non-flex columns and how much width must be allocated between the flex columns
  for (let i = 0; i < columns.length; i += 1) {
    const column = { ...columns[i] } as GridStateColDef;

    if (column.hide) {
      column.computedWidth = 0;
    } else {
      const minWidth = column.minWidth ?? GRID_STRING_COL_DEF.minWidth!;

      if (column.flex && column.flex > 0) {
        totalFlexUnits += column.flex;
        column.computedWidth = minWidth;
      } else {
        const computedWidth = Math.max(column.width ?? GRID_STRING_COL_DEF.width!, minWidth);
        column.computedWidth = computedWidth;
        widthToAllocateInFlex -= computedWidth;
      }
    }

    stateColumns.push(column);
  }

  // Compute the width of flex columns
  if (totalFlexUnits && widthToAllocateInFlex > 0) {
    const widthPerFlexUnit = totalFlexUnits > 0 ? widthToAllocateInFlex / totalFlexUnits : 0;

    for (let i = 0; i < stateColumns.length; i += 1) {
      const column = stateColumns[i];

      if (!column.hide && column.flex && column.flex > 0) {
        stateColumns[i].computedWidth = Math.max(
          widthPerFlexUnit * column.flex,
          column.computedWidth,
        );
      }
    }
  }

  return stateColumns;
}

function hydrateColumns(
  columns: GridColumns,
  columnTypes: GridColumnTypesRecord = {},
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

function toLookup(logger: Logger, allColumns: GridStateColDef[]): GridColumnLookup {
  logger.debug('Building columns lookup');
  return allColumns.reduce((lookup, col) => {
    lookup[col.field] = col;
    return lookup;
  }, {});
}

const upsertColumnsState = (columnUpdates: GridColDef[], prevColumnsState?: GridColumnsState) => {
  const newState: RawGridColumnsState = {
    all: [...(prevColumnsState?.all ?? [])],
    lookup: { ...(prevColumnsState?.lookup ?? {}) },
  };

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

export function useGridColumns(
  apiRef: GridApiRef,
  props: Pick<
    GridComponentProps,
    'columns' | 'onColumnVisibilityChange' | 'columnTypes' | 'checkboxSelection'
  >,
): void {
  const logger = useLogger('useGridColumns');
  const [gridState, setGridState, forceUpdate] = useGridState(apiRef);
  const columnsMeta = useGridSelector(apiRef, gridColumnsMetaSelector);
  const allColumns = useGridSelector(apiRef, allGridColumnsSelector);
  const visibleColumns = useGridSelector(apiRef, visibleGridColumnsSelector);

  const updateState = React.useCallback(
    (newState: GridColumnsState, emit = true) => {
      logger.debug('Updating columns state.');

      setGridState((state) => ({ ...state, columns: newState }));
      forceUpdate();

      if (apiRef.current && emit) {
        apiRef.current.publishEvent(GridEvents.columnsChange, newState.all);
      }
    },
    [logger, setGridState, forceUpdate, apiRef],
  );

  const getColumn = React.useCallback<GridColumnApi['getColumn']>(
    (field) => apiRef.current.state.columns.lookup[field],
    [apiRef],
  );

  const getAllColumns = React.useCallback<GridColumnApi['getAllColumns']>(
    () => allColumns,
    [allColumns],
  );
  const getVisibleColumns = React.useCallback<GridColumnApi['getVisibleColumns']>(
    () => visibleColumns,
    [visibleColumns],
  );
  const getColumnsMeta = React.useCallback<GridColumnApi['getColumnsMeta']>(
    () => columnsMeta,
    [columnsMeta],
  );

  const getColumnIndex = React.useCallback(
    (field: string, useVisibleColumns: boolean = true): number =>
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

  const setColumnsState = React.useCallback(
    (newState: RawGridColumnsState, emit?: boolean) => {
      logger.debug('updating GridColumns with new state');

      // Avoid dependency on gridState to avoid infinite loop
      const refGridState = apiRef.current.getState();
      const newColumns: GridColumns = newState.all.map((field) => newState.lookup[field]);
      const updatedCols = getStateColumns(newColumns, refGridState.viewportSizes.width);

      const finalState: GridColumnsState = {
        all: updatedCols.map((col) => col.field),
        lookup: toLookup(logger, updatedCols),
      };

      updateState(finalState, emit);
    },
    [apiRef, logger, updateState],
  );

  const updateColumns = React.useCallback(
    (cols: GridColDef[]) => {
      // Avoid dependency on gridState to avoid infinite loop
      const newState = upsertColumnsState(cols, apiRef.current.getState().columns);
      setColumnsState(newState, false);
    },
    [apiRef, setColumnsState],
  );

  const updateColumn = React.useCallback(
    (col: GridColDef) => updateColumns([col]),
    [updateColumns],
  );

  const setColumnVisibility = React.useCallback(
    (field: string, isVisible: boolean) => {
      const col = getColumn(field);
      const updatedCol = { ...col, hide: !isVisible };

      updateColumns([updatedCol]);
      forceUpdate();

      apiRef.current.publishEvent(GridEvents.columnVisibilityChange, {
        field,
        colDef: updatedCol,
        api: apiRef,
        isVisible,
      });
    },
    [apiRef, forceUpdate, getColumn, updateColumns],
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
        colDef: apiRef.current.getColumn(field),
        targetIndex: targetIndexPosition,
        oldIndex: oldIndexPosition,
        api: apiRef.current,
      };
      apiRef.current.publishEvent(GridEvents.columnOrderChange, params);

      const updatedColumns = [...gridState.columns.all];
      updatedColumns.splice(targetIndexPosition, 0, updatedColumns.splice(oldIndexPosition, 1)[0]);
      updateState({ ...gridState.columns, all: updatedColumns });
    },
    [apiRef, gridState.columns, logger, updateState],
  );

  const setColumnWidth = React.useCallback(
    (field: string, width: number) => {
      logger.debug(`Updating column ${field} width to ${width}`);

      const column = apiRef.current.getColumn(field);
      apiRef.current.updateColumn({ ...column, width });

      apiRef.current.publishEvent(GridEvents.columnWidthChange, {
        element: apiRef.current.getColumnHeaderElement(field),
        colDef: column,
        api: apiRef,
        width,
      });
    },
    [apiRef, logger],
  );

  const colApi: GridColumnApi = {
    getColumn,
    getAllColumns,
    getColumnIndex,
    getColumnPosition,
    getVisibleColumns,
    getColumnsMeta,
    updateColumn,
    updateColumns,
    setColumnVisibility,
    setColumnIndex,
    setColumnWidth,
  };

  useGridApiMethod(apiRef, colApi, 'ColApi');

  React.useEffect(() => {
    logger.info(`GridColumns have changed, new length ${props.columns.length}`);

    if (props.columns.length > 0) {
      const hydratedColumns = hydrateColumns(
        props.columns,
        props.columnTypes,
        !!props.checkboxSelection,
        logger,
        apiRef.current.getLocaleText,
      );

      const newState = upsertColumnsState(hydratedColumns);
      setColumnsState(newState);
    } else {
      updateState(getInitialGridColumnsState());
    }
  }, [
    logger,
    apiRef,
    props.columns,
    props.columnTypes,
    props.checkboxSelection,
    updateState,
    setColumnsState,
  ]);

  React.useEffect(() => {
    logger.debug(
      `GridColumns gridState.viewportSizes.width, changed ${gridState.viewportSizes.width}`,
    );
    // Avoid dependency on gridState as I only want to update cols when viewport size changed.
    const currentColumns = allGridColumnsSelector(apiRef.current.getState());

    apiRef.current.updateColumns(currentColumns);
  }, [apiRef, gridState.viewportSizes.width, logger]);

  // Grid Option Handlers
  useGridApiOptionHandler(
    apiRef,
    GridEvents.columnVisibilityChange,
    props.onColumnVisibilityChange,
  );
}
