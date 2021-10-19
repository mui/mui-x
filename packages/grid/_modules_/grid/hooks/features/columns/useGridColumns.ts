import * as React from 'react';
import { GridEvents } from '../../../constants/eventsConstants';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { GridColumnApi } from '../../../models/api/gridColumnApi';
import {
  GridColDef,
  GridColumns,
  GridColumnsState,
  GridStateColDef,
} from '../../../models/colDef/gridColDef';
import { GridColumnTypesRecord } from '../../../models/colDef/gridColumnTypesRecord';
import { getGridDefaultColumnTypes } from '../../../models/colDef/gridDefaultColumnTypes';
import { getGridColDef } from '../../../models/colDef/getGridColDef';
import { GridColumnOrderChangeParams } from '../../../models/params/gridColumnOrderChangeParams';
import { mergeGridColTypes } from '../../../utils/mergeUtils';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { useGridLogger } from '../../utils/useGridLogger';
import { useGridState } from '../../utils/useGridState';
import {
  allGridColumnsFieldsSelector,
  allGridColumnsSelector,
  gridColumnsMetaSelector,
  gridColumnsSelector,
  visibleGridColumnsSelector,
} from './gridColumnsSelector';
import {
  useGridApiEventHandler,
  useGridApiOptionHandler,
} from '../../utils/useGridApiEventHandler';
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
): GridColumns {
  const mergedColTypes = mergeGridColTypes(getGridDefaultColumnTypes(), columnTypes);
  const extendedColumns = columns.map((column) => ({
    ...getGridColDef(mergedColTypes, column.type),
    ...column,
  }));

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
 * @requires useGridColumnsPreProcessing (method)
 * @requires useGridParamsApi (method)
 * @requires useGridContainerProps (state)
 * TODO: Impossible priority - useGridParamsApi also needs to be after useGridColumns
 * TODO: Impossible priority - useGridContainerProps also needs to be after useGridColumns
 */
export function useGridColumns(
  apiRef: GridApiRef,
  props: Pick<
    GridComponentProps,
    'columns' | 'onColumnVisibilityChange' | 'columnTypes' | 'checkboxSelection' | 'classes'
  >,
): void {
  const logger = useGridLogger(apiRef, 'useGridColumns');

  useGridStateInit(apiRef, (state) => {
    const hydratedColumns = hydrateColumnsType(props.columns, props.columnTypes);
    const preProcessedColumns =
      apiRef.current.UNSTABLE_applyAllColumnPreProcessing(hydratedColumns);
    const columns = upsertColumnsState(preProcessedColumns);
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
  const [, setGridState, forceUpdate] = useGridState(apiRef);

  // On the first render, `useGridContainerProps` has not yet initialized its state because it is called after `useGridColumns`
  // But it viewport width would always be 0 on the 1st render since the DOM Node is not mounted yet, so we can provide a safe fallback here
  // TODO: Fix when removing `viewportSizes` from the state
  const viewportSizes = apiRef.current.state.viewportSizes?.width ?? 0;

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
    () => allGridColumnsSelector(apiRef.current.state),
    [apiRef],
  );
  const getVisibleColumns = React.useCallback<GridColumnApi['getVisibleColumns']>(
    () => visibleGridColumnsSelector(apiRef.current.state),
    [apiRef],
  );
  const getColumnsMeta = React.useCallback<GridColumnApi['getColumnsMeta']>(
    () => gridColumnsMetaSelector(apiRef.current.state),
    [apiRef],
  );

  const getColumnIndex = React.useCallback(
    (field: string, useVisibleColumns: boolean = true): number => {
      const columns = useVisibleColumns
        ? visibleGridColumnsSelector(apiRef.current.state)
        : allGridColumnsSelector(apiRef.current.state);

      return columns.findIndex((col) => col.field === field);
    },
    [apiRef],
  );

  const getColumnPosition: (field: string) => number = React.useCallback(
    (field) => {
      const index = getColumnIndex(field);
      return gridColumnsMetaSelector(apiRef.current.state).positions[index];
    },
    [apiRef, getColumnIndex],
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
      const allColumns = allGridColumnsFieldsSelector(apiRef.current.state);
      const oldIndexPosition = allColumns.findIndex((col) => col === field);
      if (oldIndexPosition === targetIndexPosition) {
        return;
      }

      logger.debug(`Moving column ${field} to index ${targetIndexPosition}`);

      const updatedColumns = [...allColumns];
      updatedColumns.splice(targetIndexPosition, 0, updatedColumns.splice(oldIndexPosition, 1)[0]);
      setGridColumnsState({ ...gridColumnsSelector(apiRef.current.state), all: updatedColumns });

      const params: GridColumnOrderChangeParams = {
        field,
        element: apiRef.current.getColumnHeaderElement(field),
        colDef: apiRef.current.getColumn(field),
        targetIndex: targetIndexPosition,
        oldIndex: oldIndexPosition,
      };
      apiRef.current.publishEvent(GridEvents.columnOrderChange, params);
    },
    [apiRef, logger, setGridColumnsState],
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

  // The effect do not track any value defined synchronously during the 1st render by hooks called after `useGridColumns`
  // As a consequence, the state generated by the 1st run of this useEffect will always be equal to the initialization one
  const isFirstRender = React.useRef(true);
  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    logger.info(`GridColumns have changed, new length ${props.columns.length}`);

    const hydratedColumns = hydrateColumnsType(props.columns, props.columnTypes);

    const preProcessedColumns =
      apiRef.current.UNSTABLE_applyAllColumnPreProcessing(hydratedColumns);
    const columnState = upsertColumnsState(preProcessedColumns);
    setColumnsState(columnState);
  }, [logger, apiRef, setColumnsState, props.columns, props.columnTypes]);

  React.useEffect(() => {
    logger.debug(`GridColumns gridState.viewportSizes.width, changed ${viewportSizes}`);

    // This hook is meant to update the column's width when the viewport changes
    // We can skip the whole block if the width is missing
    if (viewportSizes === 0) {
      return;
    }

    // Avoid dependency on gridState as I only want to update cols when viewport size changed.
    setColumnsState(apiRef.current.state.columns);
  }, [apiRef, setColumnsState, viewportSizes, logger]);

  const handlePreProcessColumns = React.useCallback(() => {
    logger.info(`Columns pre-processing have changed, regenerating the columns`);

    const hydratedColumns = hydrateColumnsType(props.columns, props.columnTypes);
    const preProcessedColumns =
      apiRef.current.UNSTABLE_applyAllColumnPreProcessing(hydratedColumns);
    const columnState = upsertColumnsState(preProcessedColumns);
    setColumnsState(columnState);
  }, [apiRef, logger, setColumnsState, props.columns, props.columnTypes]);

  useGridApiEventHandler(apiRef, GridEvents.columnsPreProcessingChange, handlePreProcessColumns);

  // Grid Option Handlers
  useGridApiOptionHandler(
    apiRef,
    GridEvents.columnVisibilityChange,
    props.onColumnVisibilityChange,
  );
}
