import * as React from 'react';
import { GridEvents } from '../../../constants/eventsConstants';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { GridColumnApi } from '../../../models/api/gridColumnApi';
import { GridColumnOrderChangeParams } from '../../../models/params/gridColumnOrderChangeParams';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { useGridLogger } from '../../utils/useGridLogger';
import { useGridState } from '../../utils/useGridState';
import {
  allGridColumnsFieldsSelector,
  allGridColumnsSelector,
  gridColumnLookupSelector,
  gridColumnsMetaSelector,
  gridColumnsSelector,
  visibleGridColumnsSelector,
} from './gridColumnsSelector';
import {
  useGridApiEventHandler,
  useGridApiOptionHandler,
} from '../../utils/useGridApiEventHandler';
import { GridComponentProps } from '../../../GridComponentProps';
import { useGridStateInit } from '../../utils/useGridStateInit';
import { GridPreProcessingGroup } from '../../core/preProcessing';
import { GridColumnsState } from './gridColumnsState';
import { hydrateColumnsWidth, computeColumnTypes, createColumnsState } from './gridColumnsUtils';

/**
 * @requires useGridParamsApi (method)
 * @requires useGridDimensions (method, event) - can be after
 * TODO: Impossible priority - useGridParamsApi also needs to be after useGridColumns
 */
export function useGridColumns(
  apiRef: GridApiRef,
  props: Pick<
    GridComponentProps,
    'columns' | 'onColumnVisibilityChange' | 'columnTypes' | 'checkboxSelection' | 'classes'
  >,
): void {
  const logger = useGridLogger(apiRef, 'useGridColumns');

  const columnsTypes = React.useMemo(
    () => computeColumnTypes(props.columnTypes),
    [props.columnTypes],
  );

  useGridStateInit(apiRef, (state) => {
    const columnsState = createColumnsState({
      apiRef,
      columnsTypes,
      columnsToUpsert: props.columns,
      reset: true,
    });

    return {
      ...state,
      columns: columnsState,
    };
  });

  const [, setGridState, forceUpdate] = useGridState(apiRef);

  const setGridColumnsState = React.useCallback(
    (columnsState: GridColumnsState) => {
      logger.debug('Updating columns state.');

      setGridState((state) => ({ ...state, columns: columnsState }));
      forceUpdate();
      apiRef.current.publishEvent(GridEvents.columnsChange, columnsState.all);
    },
    [logger, setGridState, forceUpdate, apiRef],
  );

  const getColumn = React.useCallback<GridColumnApi['getColumn']>(
    (field) => gridColumnLookupSelector(apiRef.current.state)[field],
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

  const getColumnIndex = React.useCallback<GridColumnApi['getColumnIndex']>(
    (field, useVisibleColumns = true) => {
      const columns = useVisibleColumns
        ? visibleGridColumnsSelector(apiRef.current.state)
        : allGridColumnsSelector(apiRef.current.state);

      return columns.findIndex((col) => col.field === field);
    },
    [apiRef],
  );

  const getColumnPosition = React.useCallback<GridColumnApi['getColumnPosition']>(
    (field) => {
      const index = getColumnIndex(field);
      return gridColumnsMetaSelector(apiRef.current.state).positions[index];
    },
    [apiRef, getColumnIndex],
  );

  const updateColumns = React.useCallback<GridColumnApi['updateColumns']>(
    (columns) => {
      const columnsState = createColumnsState({
        apiRef,
        columnsTypes,
        columnsToUpsert: columns,
        reset: false,
      });
      setGridColumnsState(columnsState);
    },
    [apiRef, setGridColumnsState, columnsTypes],
  );

  const updateColumn = React.useCallback<GridColumnApi['updateColumn']>(
    (column) => updateColumns([column]),
    [updateColumns],
  );

  const setColumnVisibility = React.useCallback<GridColumnApi['setColumnVisibility']>(
    (field, isVisible) => {
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

  const setColumnIndex = React.useCallback<GridColumnApi['setColumnIndex']>(
    (field, targetIndexPosition) => {
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

  const setColumnWidth = React.useCallback<GridColumnApi['setColumnWidth']>(
    (field, width) => {
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

    const columnsState = createColumnsState({
      apiRef,
      columnsTypes,
      columnsToUpsert: props.columns,
      reset: true,
    });
    setGridColumnsState(columnsState);
  }, [logger, apiRef, setGridColumnsState, props.columns, columnsTypes]);

  const handlePreProcessorRegister = React.useCallback(
    (name) => {
      if (name !== GridPreProcessingGroup.hydrateColumns) {
        return;
      }

      logger.info(`Columns pre-processing have changed, regenerating the columns`);

      const columnsState = createColumnsState({
        apiRef,
        columnsTypes,
        columnsToUpsert: [],
        reset: false,
      });
      setGridColumnsState(columnsState);
    },
    [apiRef, logger, setGridColumnsState, columnsTypes],
  );

  const prevInnerWidth = React.useRef<number | null>(null);
  const handleGridSizeChange = (viewportInnerSize) => {
    if (prevInnerWidth.current !== viewportInnerSize.width) {
      prevInnerWidth.current = viewportInnerSize.width;
      setGridColumnsState(
        hydrateColumnsWidth(gridColumnsSelector(apiRef.current.state), viewportInnerSize.width),
      );
    }
  };

  useGridApiEventHandler(apiRef, GridEvents.preProcessorRegister, handlePreProcessorRegister);
  useGridApiEventHandler(apiRef, GridEvents.viewportInnerSizeChange, handleGridSizeChange);

  // Grid Option Handlers
  useGridApiOptionHandler(
    apiRef,
    GridEvents.columnVisibilityChange,
    props.onColumnVisibilityChange,
  );
}
