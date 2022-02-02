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
  gridColumnVisibilityModelSelector,
  visibleGridColumnsSelector,
} from './gridColumnsSelector';
import {
  useGridApiEventHandler,
  useGridApiOptionHandler,
} from '../../utils/useGridApiEventHandler';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { useGridStateInit } from '../../utils/useGridStateInit';
import { GridColumnVisibilityChangeParams } from '../../../models';
import { GridPreProcessor, useGridRegisterPreProcessor } from '../../core/preProcessing';
import { GridColumnsState, GridColumnVisibilityModel } from './gridColumnsInterfaces';
import {
  hydrateColumnsWidth,
  computeColumnTypes,
  createColumnsState,
  setColumnsState,
} from './gridColumnsUtils';

/**
 * @requires useGridParamsApi (method)
 * @requires useGridDimensions (method, event) - can be after
 * TODO: Impossible priority - useGridParamsApi also needs to be after useGridColumns
 */
export function useGridColumns(
  apiRef: GridApiRef,
  props: Pick<
    DataGridProcessedProps,
    | 'initialState'
    | 'columns'
    | 'onColumnVisibilityChange'
    | 'columnVisibilityModel'
    | 'onColumnVisibilityModelChange'
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

  /**
   * If `initialState.columns.columnVisibilityModel` or `columnVisibilityModel` was defined during the 1st render, we are directly updating the model
   * If not, we keep the old behavior and update the `GridColDef.hide` option (which will update the state model through the `GridColDef.hide` => `columnVisibilityModel` sync in `createColumnsState`
   */
  const shouldUseVisibleColumnModel = React.useRef(
    !!props.columnVisibilityModel || !!props.initialState?.columns?.columnVisibilityModel,
  ).current;

  useGridStateInit(apiRef, (state) => {
    const columnsState = createColumnsState({
      apiRef,
      columnsTypes,
      columnsToUpsert: props.columns,
      shouldRegenColumnVisibilityModelFromColumns: !shouldUseVisibleColumnModel,
      currentColumnVisibilityModel:
        props.columnVisibilityModel ?? props.initialState?.columns?.columnVisibilityModel ?? {},
      reset: true,
    });

    return {
      ...state,
      columns: columnsState,
    };
  });

  apiRef.current.unstable_updateControlState({
    stateId: 'visibleColumns',
    propModel: props.columnVisibilityModel,
    propOnChange: props.onColumnVisibilityModelChange,
    stateSelector: gridColumnVisibilityModelSelector,
    changeEvent: GridEvents.columnVisibilityModelChange,
  });

  const setGridColumnsState = React.useCallback(
    (columnsState: GridColumnsState) => {
      logger.debug('Updating columns state.');

      apiRef.current.setState(setColumnsState(columnsState));
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
    () => allGridColumnsSelector(apiRef),
    [apiRef],
  );

  const getVisibleColumns = React.useCallback<GridColumnApi['getVisibleColumns']>(
    () => visibleGridColumnsSelector(apiRef),
    [apiRef],
  );

  const getColumnsMeta = React.useCallback<GridColumnApi['getColumnsMeta']>(
    () => gridColumnsMetaSelector(apiRef),
    [apiRef],
  );

  const getColumnIndex = React.useCallback<GridColumnApi['getColumnIndex']>(
    (field, useVisibleColumns = true) => {
      const columns = useVisibleColumns
        ? visibleGridColumnsSelector(apiRef)
        : allGridColumnsSelector(apiRef);

      return columns.findIndex((col) => col.field === field);
    },
    [apiRef],
  );

  const getColumnPosition = React.useCallback<GridColumnApi['getColumnPosition']>(
    (field) => {
      const index = getColumnIndex(field);
      return gridColumnsMetaSelector(apiRef).positions[index];
    },
    [apiRef, getColumnIndex],
  );

  const setColumnVisibilityModel = React.useCallback<GridColumnApi['setColumnVisibilityModel']>(
    (model) => {
      const currentModel = gridColumnVisibilityModelSelector(apiRef);
      if (currentModel !== model) {
        apiRef.current.setState((state) => ({
          ...state,
          columns: createColumnsState({
            apiRef,
            columnsTypes,
            columnsToUpsert: [],
            shouldRegenColumnVisibilityModelFromColumns: false,
            currentColumnVisibilityModel: model,
            reset: false,
          }),
        }));
        apiRef.current.forceUpdate();
      }
    },
    [apiRef, columnsTypes],
  );

  const updateColumns = React.useCallback<GridColumnApi['updateColumns']>(
    (columns) => {
      const columnsState = createColumnsState({
        apiRef,
        columnsTypes,
        columnsToUpsert: columns,
        shouldRegenColumnVisibilityModelFromColumns: true,
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
      // TODO v6: stop using the `hide` field even when the model is not defined
      if (shouldUseVisibleColumnModel) {
        const columnVisibilityModel = gridColumnVisibilityModelSelector(apiRef);
        const isCurrentlyVisible: boolean = columnVisibilityModel[field] ?? true;
        if (isVisible !== isCurrentlyVisible) {
          const newModel: GridColumnVisibilityModel = {
            ...columnVisibilityModel,
            [field]: isVisible,
          };
          apiRef.current.setColumnVisibilityModel(newModel);
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
    [apiRef, shouldUseVisibleColumnModel],
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
    setColumnVisibilityModel,
    setColumnVisibility,
    setColumnIndex,
    setColumnWidth,
  };

  useGridApiMethod(apiRef, columnApi, 'GridColumnApi');

  /**
   * PRE-PROCESSING
   */
  const stateExportPreProcessing = React.useCallback<GridPreProcessor<'exportState'>>(
    (prevState) => {
      if (!shouldUseVisibleColumnModel) {
        return prevState;
      }

      const columnVisibilityModelToExport = gridColumnVisibilityModelSelector(apiRef.current.state);
      const hasHiddenColumns = Object.values(columnVisibilityModelToExport).some(
        (value) => value === false,
      );
      if (!hasHiddenColumns) {
        return prevState;
      }

      return {
        ...prevState,
        columns: {
          columnVisibilityModel: columnVisibilityModelToExport,
        },
      };
    },
    [apiRef, shouldUseVisibleColumnModel],
  );

  const stateRestorePreProcessing = React.useCallback<GridPreProcessor<'restoreState'>>(
    (params, context) => {
      if (!shouldUseVisibleColumnModel) {
        return params;
      }

      const columnVisibilityModel = context.stateToRestore.columns?.columnVisibilityModel;
      if (columnVisibilityModel != null) {
        const columnsState = createColumnsState({
          apiRef,
          columnsTypes,
          columnsToUpsert: [],
          shouldRegenColumnVisibilityModelFromColumns: false,
          currentColumnVisibilityModel: columnVisibilityModel,
          reset: false,
        });
        apiRef.current.setState(setColumnsState(columnsState));
      }
      return params;
    },
    [apiRef, shouldUseVisibleColumnModel, columnsTypes],
  );

  useGridRegisterPreProcessor(apiRef, 'exportState', stateExportPreProcessing);
  useGridRegisterPreProcessor(apiRef, 'restoreState', stateRestorePreProcessing);

  /**
   * EVENTS
   */
  const handlePreProcessorRegister = React.useCallback<
    GridEventListener<GridEvents.preProcessorRegister>
  >(
    (name) => {
      if (name !== 'hydrateColumns') {
        return;
      }

      logger.info(`Columns pre-processing have changed, regenerating the columns`);

      const columnsState = createColumnsState({
        apiRef,
        columnsTypes,
        columnsToUpsert: [],
        shouldRegenColumnVisibilityModelFromColumns: !shouldUseVisibleColumnModel,
        reset: false,
      });
      setGridColumnsState(columnsState);
    },
    [apiRef, logger, setGridColumnsState, columnsTypes, shouldUseVisibleColumnModel],
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
      // If the user provides a model, we don't want to set it in the state here because it has it's dedicated `useEffect` which calls `setColumnVisibilityModel`
      shouldRegenColumnVisibilityModelFromColumns: !shouldUseVisibleColumnModel,
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
    shouldUseVisibleColumnModel,
  ]);

  React.useEffect(() => {
    if (props.columnVisibilityModel !== undefined) {
      apiRef.current.setColumnVisibilityModel(props.columnVisibilityModel);
    }
  }, [apiRef, logger, props.columnVisibilityModel]);
}
