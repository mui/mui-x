import * as React from 'react';
import { GridEvents } from '../../../constants/eventsConstants';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { GridColumnApi } from '../../../models/api/gridColumnApi';
import { gridCheckboxSelectionColDef } from '../../../models/colDef/gridCheckboxSelection';
import {
  GridColDef,
  GridColumns,
  GridColumnsState,
  GridStateColDef,
} from '../../../models/colDef/gridColDef';
import { GridColumnTypesRecord } from '../../../models/colDef/gridColTypeDef';
import { getGridDefaultColumnTypes } from '../../../models/colDef/gridDefaultColumnTypes';
import { getGridColDef } from '../../../models/colDef/getGridColDef';
import { GridColumnOrderChangeParams } from '../../../models/params/gridColumnOrderChangeParams';
import { mergeGridColTypes } from '../../../utils/mergeUtils';
import { useGridApiMethod } from '../../root/useGridApiMethod';
import { useGridLogger } from '../../utils/useGridLogger';
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
import { useGridStateInit } from '../../utils/useGridStateInit';

type RawGridColumnsState = Omit<GridColumnsState, 'lookup'> & {
  lookup: { [field: string]: GridColDef | GridStateColDef };
};

function hydrateColumnsWidth(
  columns: (GridColDef | GridStateColDef)[],
  viewportWidth: number,
): GridStateColDef[] {
  let totalFlexUnits = 0;
  let widthToAllocateInFlex = viewportWidth;

  // Compute the width of non-flex columns and how much width must be allocated between the flex columns
  const stateColumns = columns.map((column) => {
    const newColumn = { ...column } as GridStateColDef;
    if (column.hide) {
      newColumn.computedWidth = 0;
    } else {
      const minWidth = newColumn.minWidth ?? GRID_STRING_COL_DEF.minWidth!;

      if (newColumn.flex && newColumn.flex > 0) {
        totalFlexUnits += newColumn.flex;
        newColumn.computedWidth = minWidth;
      } else {
        const computedWidth = Math.max(newColumn.width ?? GRID_STRING_COL_DEF.width!, minWidth);
        widthToAllocateInFlex -= computedWidth;
        newColumn.computedWidth = computedWidth;
      }
    }

    return newColumn;
  });

  // Compute the width of flex columns
  if (totalFlexUnits > 0 && widthToAllocateInFlex > 0) {
    const widthPerFlexUnit = widthToAllocateInFlex / totalFlexUnits;

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

function hydrateColumnsType(
  columns: GridColumns,
  columnTypes: GridColumnTypesRecord = {},
  getLocaleText: <T extends GridTranslationKeys>(key: T) => GridLocaleText[T],
  checkboxSelection?: boolean,
): GridColumns {
  const mergedColTypes = mergeGridColTypes(getGridDefaultColumnTypes(), columnTypes);
  const extendedColumns = columns.map((column) => ({
    ...getGridColDef(mergedColTypes, column.type),
    ...column,
  }));

  if (checkboxSelection) {
    return [
      {
        ...gridCheckboxSelectionColDef,
        headerName: getLocaleText('checkboxSelectionHeaderName'),
      },
      ...extendedColumns,
    ];
  }

  return extendedColumns;
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

/**
 * @requires useGridParamsApi (method)
 * TODO: Impossible priority - useGridParamsApi also needs to be after useGridColumns
 */
export function useGridColumns(
  apiRef: GridApiRef,
  props: Pick<
    GridComponentProps,
    'columns' | 'onColumnVisibilityChange' | 'columnTypes' | 'checkboxSelection'
  >,
): void {
  const logger = useGridLogger(apiRef, 'useGridColumns');

  useGridStateInit(apiRef, (state) => {
    const hydratedColumns = hydrateColumnsType(
      props.columns,
      props.columnTypes,
      apiRef.current.getLocaleText,
      props.checkboxSelection,
    );

    const columns = upsertColumnsState(hydratedColumns);
    let newColumns: GridColumns = columns.all.map((field) => columns.lookup[field]);
    newColumns = hydrateColumnsWidth(newColumns, 0);

    const columnState: GridColumnsState = {
      all: newColumns.map((col) => col.field),
      lookup: newColumns.reduce((acc, col) => {
        acc[col.field] = col;
        return acc;
      }, {}),
    };

    return {
      ...state,
      columns: columnState,
    };
  });
  const [gridState, setGridState, forceUpdate] = useGridState(apiRef);
  const columnsMeta = useGridSelector(apiRef, gridColumnsMetaSelector);
  const allColumns = useGridSelector(apiRef, allGridColumnsSelector);
  const visibleColumns = useGridSelector(apiRef, visibleGridColumnsSelector);

  const setGridColumnsState = React.useCallback(
    (columnsState: GridColumnsState, emit = true) => {
      logger.debug('Updating columns state.');

      setGridState((state) => ({ ...state, columns: columnsState }));
      forceUpdate();

      if (emit) {
        apiRef.current.publishEvent(GridEvents.columnsChange, columnsState.all);
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
      const viewportWidth = apiRef.current.state.viewportSizes.width;
      let newColumns: GridColumns = newState.all.map((field) => newState.lookup[field]);
      newColumns = hydrateColumnsWidth(newColumns, viewportWidth);

      const columnState: GridColumnsState = {
        all: newColumns.map((col) => col.field),
        lookup: newColumns.reduce((acc, col) => {
          acc[col.field] = col;
          return acc;
        }, {}),
      };

      setGridColumnsState(columnState, emit);
    },
    [apiRef, logger, setGridColumnsState],
  );

  const updateColumns = React.useCallback(
    (columns: GridColDef[]) => {
      // Avoid dependency on gridState to avoid infinite loop
      const columnsState = upsertColumnsState(columns, apiRef.current.state.columns);
      setColumnsState(columnsState, false);
    },
    [apiRef, setColumnsState],
  );

  const updateColumn = React.useCallback(
    (column: GridColDef) => updateColumns([column]),
    [updateColumns],
  );

  const setColumnVisibility = React.useCallback(
    (field: string, isVisible: boolean) => {
      const column = getColumn(field);
      const newColumn = { ...column, hide: !isVisible };

      updateColumns([newColumn]);

      apiRef.current.publishEvent(GridEvents.columnVisibilityChange, {
        field,
        colDef: newColumn,
        isVisible,
      });
    },
    [apiRef, getColumn, updateColumns],
  );

  const setColumnIndex = React.useCallback(
    (field: string, targetIndexPosition: number) => {
      const oldIndexPosition = gridState.columns.all.findIndex((col) => col === field);
      if (oldIndexPosition === targetIndexPosition) {
        return;
      }

      logger.debug(`Moving column ${field} to index ${targetIndexPosition}`);

      const updatedColumns = [...gridState.columns.all];
      updatedColumns.splice(targetIndexPosition, 0, updatedColumns.splice(oldIndexPosition, 1)[0]);
      setGridColumnsState({ ...gridState.columns, all: updatedColumns });

      const params: GridColumnOrderChangeParams = {
        field,
        element: apiRef.current.getColumnHeaderElement(field),
        colDef: apiRef.current.getColumn(field),
        targetIndex: targetIndexPosition,
        oldIndex: oldIndexPosition,
      };
      apiRef.current.publishEvent(GridEvents.columnOrderChange, params);
    },
    [apiRef, gridState.columns, logger, setGridColumnsState],
  );

  const setColumnWidth = React.useCallback(
    (field: string, width: number) => {
      logger.debug(`Updating column ${field} width to ${width}`);

      const column = apiRef.current.getColumn(field);
      const newColumn = { ...column, width };
      apiRef.current.updateColumns([newColumn]);

      apiRef.current.publishEvent(GridEvents.columnWidthChange, {
        element: apiRef.current.getColumnHeaderElement(field),
        colDef: newColumn,
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

    const hydratedColumns = hydrateColumnsType(
      props.columns,
      props.columnTypes,
      apiRef.current.getLocaleText,
      props.checkboxSelection,
    );

    const columnState = upsertColumnsState(hydratedColumns);
    setColumnsState(columnState);
  }, [logger, apiRef, setColumnsState, props.columns, props.columnTypes, props.checkboxSelection]);

  React.useEffect(() => {
    logger.debug(
      `GridColumns gridState.viewportSizes.width, changed ${gridState.viewportSizes.width}`,
    );

    // This hook is meant to update the column's width when the viewport changes
    // We can skip the whole block if the width is missing
    if (gridState.viewportSizes.width === 0) {
      return;
    }

    // Avoid dependency on gridState as I only want to update cols when viewport size changed.
    setColumnsState(apiRef.current.state.columns);
  }, [apiRef, setColumnsState, gridState.viewportSizes.width, logger]);

  // Grid Option Handlers
  useGridApiOptionHandler(
    apiRef,
    GridEvents.columnVisibilityChange,
    props.onColumnVisibilityChange,
  );
}
