import * as React from 'react';
import { GridEventListener, GridEvents } from '../../../models/events';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { GridColumnApi } from '../../../models/api/gridColumnApi';
import { GridColumnOrderChangeParams } from '../../../models/params/gridColumnOrderChangeParams';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { useGridLogger } from '../../utils/useGridLogger';
import {
  allGridColumnsFieldsSelector,
  allGridColumnsSelector,
  gridColumnLookupSelector,
  gridColumnsMetaSelector,
  gridColumnsSelector,
  gridVisibleColumnsModelLookupSelector,
  gridVisibleColumnsModelSelector,
  visibleGridColumnsSelector,
} from './gridColumnsSelector';
import {
  useGridApiEventHandler,
  useGridApiOptionHandler,
} from '../../utils/useGridApiEventHandler';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { useGridStateInit } from '../../utils/useGridStateInit';
import { GridColumnVisibilityChangeParams } from '../../../models';
import { GridPreProcessingGroup } from '../../core/preProcessing';
import { GridColumnsState } from './gridColumnsInterfaces';
import { hydrateColumnsWidth, computeColumnTypes, createColumnsState } from './gridColumnsUtils';

/**
 * @requires useGridParamsApi (method)
 * @requires useGridDimensions (method, event) - can be after
 * TODO: Impossible priority - useGridParamsApi also needs to be after useGridColumns
 */
export function useGridColumns(
  apiRef: GridApiRef,
  props: Pick<
    DataGridProcessedProps,
    | 'columns'
    | 'onColumnVisibilityChange'
    | 'visibleColumnsModel'
    | 'onVisibleColumnsModelChange'
    | 'columnTypes'
    | 'checkboxSelection'
    | 'classes'
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
      propVisibleColumnsModel: props.visibleColumnsModel,
      reset: true,
    });

    return {
      ...state,
      columns: columnsState,
    };
  });

  const isVisibleColumnsModelControlled = !!props.visibleColumnsModel;

  apiRef.current.unstable_updateControlState({
    stateId: 'visibleColumns',
    propModel: props.visibleColumnsModel,
    propOnChange: props.onVisibleColumnsModelChange,
    stateSelector: gridVisibleColumnsModelSelector,
    changeEvent: GridEvents.visibleColumnsModelChange,
  });

  const setGridColumnsState = React.useCallback(
    (columnsState: GridColumnsState) => {
      logger.debug('Updating columns state.');

      apiRef.current.setState((state) => ({ ...state, columns: columnsState }));
      apiRef.current.forceUpdate();
      apiRef.current.publishEvent(GridEvents.columnsChange, columnsState.all);
    },
    [logger, apiRef],
  );

  /**
   * API METHODS
   */
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

  const setVisibleColumnsModel = React.useCallback<GridColumnApi['setVisibleColumnsModel']>(
    (model) => {
      const currentModel = gridVisibleColumnsModelSelector(apiRef.current.state);
      if (currentModel !== model) {
        apiRef.current.setState((state) => ({
          ...state,
          columns: {
            ...state.columns,
            visibleColumnsModel: model,
          },
        }));
      }
    },
    [apiRef],
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
    (column) => apiRef.current.updateColumns([column]),
    [apiRef],
  );

  const setColumnVisibility = React.useCallback<GridColumnApi['setColumnVisibility']>(
    (field, isVisible) => {
      // We keep updating the `hide` option of `GridColDef` when not controlling the model to avoid any breaking change.
      // `updateColumns` take care of updating the model itself if needs be.
      // TODO: In v6 stop using the `hide` field even when the model is not defined
      if (isVisibleColumnsModelControlled) {
        const visibleColumnsModel = gridVisibleColumnsModelSelector(apiRef.current.state);
        const visibleColumnsModelLookup = gridVisibleColumnsModelLookupSelector(
          apiRef.current.state,
        );
        const isCurrentlyVisible: boolean = visibleColumnsModelLookup[field] ?? false;
        if (isVisible !== isCurrentlyVisible) {
          const newModel = isVisible
            ? [...visibleColumnsModel, field]
            : visibleColumnsModel.filter((col) => col !== field);
          apiRef.current.setVisibleColumnsModel(newModel);
        }
      } else {
        const column = apiRef.current.getColumn(field);
        const newColumn = { ...column, hide: !isVisible };

        apiRef.current.updateColumns([newColumn]);

        const params: GridColumnVisibilityChangeParams = {
          field,
          colDef: newColumn,
          isVisible,
        };

        apiRef.current.publishEvent(GridEvents.columnVisibilityChange, params);
      }
    },
    [apiRef, isVisibleColumnsModelControlled],
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

  const columnApi: GridColumnApi = {
    getColumn,
    getAllColumns,
    getColumnIndex,
    getColumnPosition,
    getVisibleColumns,
    getColumnsMeta,
    updateColumn,
    updateColumns,
    setVisibleColumnsModel,
    setColumnVisibility,
    setColumnIndex,
    setColumnWidth,
  };

  useGridApiMethod(apiRef, columnApi, 'GridColumnApi');

  /**
   * EVENTS
   */
  const handlePreProcessorRegister = React.useCallback<
    GridEventListener<GridEvents.preProcessorRegister>
  >(
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

  useGridApiOptionHandler(
    apiRef,
    GridEvents.columnVisibilityChange,
    props.onColumnVisibilityChange,
  );

  /**
   * EFFECTS
   */
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
      // If controlling, we don't want to listen to the model here because it has it's dedicated `useEffect` which calls `setVisibleColumnsModel`
      propVisibleColumnsModel: isVisibleColumnsModelControlled
        ? gridVisibleColumnsModelSelector(apiRef.current.state)
        : undefined,
      columnsToUpsert: props.columns,
      reset: true,
    });
    setGridColumnsState(columnsState);
  }, [
    logger,
    apiRef,
    setGridColumnsState,
    props.columns,
    columnsTypes,
    isVisibleColumnsModelControlled,
  ]);

  React.useEffect(() => {
    if (props.visibleColumnsModel !== undefined) {
      apiRef.current.setVisibleColumnsModel(props.visibleColumnsModel);
    }
  }, [apiRef, logger, props.visibleColumnsModel]);
}
