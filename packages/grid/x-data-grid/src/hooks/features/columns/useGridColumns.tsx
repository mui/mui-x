import * as React from 'react';
import { GridEventListener } from '../../../models/events';
import { GridApiCommunity } from '../../../models/api/gridApiCommunity';
import { GridColumnApi } from '../../../models/api/gridColumnApi';
import { GridColumnOrderChangeParams } from '../../../models/params/gridColumnOrderChangeParams';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { useGridLogger } from '../../utils/useGridLogger';
import {
  gridColumnFieldsSelector,
  gridColumnDefinitionsSelector,
  gridColumnLookupSelector,
  gridColumnsMetaSelector,
  gridColumnsSelector,
  gridColumnVisibilityModelSelector,
  gridVisibleColumnDefinitionsSelector,
  gridColumnPositionsSelector,
} from './gridColumnsSelector';
import {
  useGridApiEventHandler,
  useGridApiOptionHandler,
} from '../../utils/useGridApiEventHandler';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { GridColumnVisibilityChangeParams } from '../../../models';
import {
  GridPipeProcessor,
  useGridRegisterPipeProcessor,
  useGridRegisterPipeApplier,
} from '../../core/pipeProcessing';
import {
  GridColumnDimensions,
  GridColumnsInitialState,
  GridColumnsState,
  GridColumnVisibilityModel,
} from './gridColumnsInterfaces';
import { GridStateInitializer } from '../../utils/useGridInitializeState';
import {
  hydrateColumnsWidth,
  computeColumnTypes,
  createColumnsState,
  mergeColumnsState,
  COLUMNS_DIMENSION_PROPERTIES,
} from './gridColumnsUtils';
import { GridPreferencePanelsValue } from '../preferencesPanel';

export const columnsStateInitializer: GridStateInitializer<
  Pick<DataGridProcessedProps, 'columnVisibilityModel' | 'initialState' | 'columnTypes' | 'columns'>
> = (state, props, apiRef) => {
  const isUsingColumnVisibilityModel =
    !!props.columnVisibilityModel || !!props.initialState?.columns?.columnVisibilityModel;

  const columnsTypes = computeColumnTypes(props.columnTypes);

  const columnsState = createColumnsState({
    apiRef,
    columnTypes: columnsTypes,
    columnsToUpsert: props.columns,
    initialState: props.initialState?.columns,
    shouldRegenColumnVisibilityModelFromColumns: !isUsingColumnVisibilityModel,
    currentColumnVisibilityModel:
      props.columnVisibilityModel ?? props.initialState?.columns?.columnVisibilityModel ?? {},
    keepOnlyColumnsToUpsert: true,
  });

  return {
    ...state,
    columns: columnsState,
  };
};

/**
 * @requires useGridParamsApi (method)
 * @requires useGridDimensions (method, event) - can be after
 * TODO: Impossible priority - useGridParamsApi also needs to be after useGridColumns
 */
export function useGridColumns(
  apiRef: React.MutableRefObject<GridApiCommunity>,
  props: Pick<
    DataGridProcessedProps,
    | 'initialState'
    | 'columns'
    | 'onColumnVisibilityChange'
    | 'columnVisibilityModel'
    | 'onColumnVisibilityModelChange'
    | 'columnTypes'
    | 'classes'
    | 'components'
    | 'componentsProps'
  >,
): void {
  const logger = useGridLogger(apiRef, 'useGridColumns');

  const columnTypes = React.useMemo(
    () => computeColumnTypes(props.columnTypes),
    [props.columnTypes],
  );

  const previousColumnsProp = React.useRef(props.columns);
  const previousColumnTypesProp = React.useRef(columnTypes);

  /**
   * If `initialState.columns.columnVisibilityModel` or `columnVisibilityModel` was defined during the 1st render, we are directly updating the model
   * If not, we keep the old behavior and update the `GridColDef.hide` option (which will update the state model through the `GridColDef.hide` => `columnVisibilityModel` sync in `createColumnsState`
   */
  const isUsingColumnVisibilityModel = React.useRef(
    !!props.columnVisibilityModel || !!props.initialState?.columns?.columnVisibilityModel,
  );

  apiRef.current.unstable_updateControlState({
    stateId: 'visibleColumns',
    propModel: props.columnVisibilityModel,
    propOnChange: props.onColumnVisibilityModelChange,
    stateSelector: gridColumnVisibilityModelSelector,
    changeEvent: 'columnVisibilityModelChange',
  });

  const setGridColumnsState = React.useCallback(
    (columnsState: GridColumnsState) => {
      logger.debug('Updating columns state.');

      apiRef.current.setState(mergeColumnsState(columnsState));
      apiRef.current.forceUpdate();
      apiRef.current.publishEvent('columnsChange', columnsState.all);
    },
    [logger, apiRef],
  );

  /**
   * API METHODS
   */
  const getColumn = React.useCallback<GridColumnApi['getColumn']>(
    (field) => gridColumnLookupSelector(apiRef)[field],
    [apiRef],
  );

  const getAllColumns = React.useCallback<GridColumnApi['getAllColumns']>(
    () => gridColumnDefinitionsSelector(apiRef),
    [apiRef],
  );

  const getVisibleColumns = React.useCallback<GridColumnApi['getVisibleColumns']>(
    () => gridVisibleColumnDefinitionsSelector(apiRef),
    [apiRef],
  );

  const getColumnsMeta = React.useCallback<GridColumnApi['getColumnsMeta']>(
    () => gridColumnsMetaSelector(apiRef),
    [apiRef],
  );

  const getColumnIndex = React.useCallback<GridColumnApi['getColumnIndex']>(
    (field, useVisibleColumns = true) => {
      const columns = useVisibleColumns
        ? gridVisibleColumnDefinitionsSelector(apiRef)
        : gridColumnDefinitionsSelector(apiRef);

      return columns.findIndex((col) => col.field === field);
    },
    [apiRef],
  );

  const getColumnPosition = React.useCallback<GridColumnApi['getColumnPosition']>(
    (field) => {
      const index = getColumnIndex(field);
      return gridColumnPositionsSelector(apiRef)[index];
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
            columnTypes,
            columnsToUpsert: [],
            initialState: undefined,
            shouldRegenColumnVisibilityModelFromColumns: false,
            currentColumnVisibilityModel: model,
            keepOnlyColumnsToUpsert: false,
          }),
        }));
        apiRef.current.forceUpdate();
      }
    },
    [apiRef, columnTypes],
  );

  const updateColumns = React.useCallback<GridColumnApi['updateColumns']>(
    (columns) => {
      const columnsState = createColumnsState({
        apiRef,
        columnTypes,
        columnsToUpsert: columns as any,
        initialState: undefined,
        shouldRegenColumnVisibilityModelFromColumns: true,
        keepOnlyColumnsToUpsert: false,
      });
      setGridColumnsState(columnsState);
    },
    [apiRef, setGridColumnsState, columnTypes],
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
      if (isUsingColumnVisibilityModel.current) {
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

        apiRef.current.publishEvent('columnVisibilityChange', params);
      }
    },
    [apiRef],
  );

  const setColumnIndex = React.useCallback<GridColumnApi['setColumnIndex']>(
    (field, targetIndexPosition) => {
      const allColumns = gridColumnFieldsSelector(apiRef);
      const oldIndexPosition = allColumns.findIndex((col) => col === field);
      if (oldIndexPosition === targetIndexPosition) {
        return;
      }

      logger.debug(`Moving column ${field} to index ${targetIndexPosition}`);

      const updatedColumns = [...allColumns];
      const fieldRemoved = updatedColumns.splice(oldIndexPosition, 1)[0];
      updatedColumns.splice(targetIndexPosition, 0, fieldRemoved);
      setGridColumnsState({ ...gridColumnsSelector(apiRef.current.state), all: updatedColumns });

      const params: GridColumnOrderChangeParams = {
        field,
        element: apiRef.current.getColumnHeaderElement(field),
        colDef: apiRef.current.getColumn(field),
        targetIndex: targetIndexPosition,
        oldIndex: oldIndexPosition,
      };
      apiRef.current.publishEvent('columnOrderChange', params);
    },
    [apiRef, logger, setGridColumnsState],
  );

  const setColumnWidth = React.useCallback<GridColumnApi['setColumnWidth']>(
    (field, width) => {
      logger.debug(`Updating column ${field} width to ${width}`);

      const column = apiRef.current.getColumn(field);
      const newColumn = { ...column, width };
      apiRef.current.updateColumns([newColumn]);

      apiRef.current.publishEvent('columnWidthChange', {
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
  const stateExportPreProcessing = React.useCallback<GridPipeProcessor<'exportState'>>(
    (prevState) => {
      const columnsStateToExport: GridColumnsInitialState = {};

      if (isUsingColumnVisibilityModel.current) {
        const columnVisibilityModelToExport = gridColumnVisibilityModelSelector(apiRef);
        const hasHiddenColumns = Object.values(columnVisibilityModelToExport).some(
          (value) => value === false,
        );

        if (hasHiddenColumns) {
          columnsStateToExport.columnVisibilityModel = columnVisibilityModelToExport;
        }
      }

      columnsStateToExport.orderedFields = gridColumnFieldsSelector(apiRef);

      const columns = gridColumnDefinitionsSelector(apiRef);
      const dimensions: Record<string, GridColumnDimensions> = {};
      columns.forEach((colDef) => {
        if (colDef.hasBeenResized) {
          const colDefDimensions: GridColumnDimensions = {};
          COLUMNS_DIMENSION_PROPERTIES.forEach((propertyName) => {
            let propertyValue: number | undefined = colDef[propertyName];
            if (propertyValue === Infinity) {
              propertyValue = -1;
            }
            colDefDimensions[propertyName] = propertyValue;
          });
          dimensions[colDef.field] = colDefDimensions;
        }
      });

      if (Object.keys(dimensions).length > 0) {
        columnsStateToExport.dimensions = dimensions;
      }

      return {
        ...prevState,
        columns: columnsStateToExport,
      };
    },
    [apiRef],
  );

  const stateRestorePreProcessing = React.useCallback<GridPipeProcessor<'restoreState'>>(
    (params, context) => {
      const columnVisibilityModelToImport = isUsingColumnVisibilityModel.current
        ? context.stateToRestore.columns?.columnVisibilityModel
        : undefined;
      const initialState = context.stateToRestore.columns;

      if (columnVisibilityModelToImport == null && initialState == null) {
        return params;
      }

      const columnsState = createColumnsState({
        apiRef,
        columnTypes,
        columnsToUpsert: [],
        initialState,
        shouldRegenColumnVisibilityModelFromColumns: !isUsingColumnVisibilityModel.current,
        currentColumnVisibilityModel: columnVisibilityModelToImport,
        keepOnlyColumnsToUpsert: false,
      });
      apiRef.current.setState(mergeColumnsState(columnsState));

      if (initialState != null) {
        apiRef.current.publishEvent('columnsChange', columnsState.all);
      }

      return params;
    },
    [apiRef, columnTypes],
  );

  const preferencePanelPreProcessing = React.useCallback<GridPipeProcessor<'preferencePanel'>>(
    (initialValue, value) => {
      if (value === GridPreferencePanelsValue.columns) {
        const ColumnsPanel = props.components.ColumnsPanel;
        return <ColumnsPanel {...props.componentsProps?.columnsPanel} />;
      }

      return initialValue;
    },
    [props.components.ColumnsPanel, props.componentsProps?.columnsPanel],
  );

  useGridRegisterPipeProcessor(apiRef, 'exportState', stateExportPreProcessing);
  useGridRegisterPipeProcessor(apiRef, 'restoreState', stateRestorePreProcessing);
  useGridRegisterPipeProcessor(apiRef, 'preferencePanel', preferencePanelPreProcessing);

  /**
   * EVENTS
   */
  const prevInnerWidth = React.useRef<number | null>(null);
  const handleGridSizeChange: GridEventListener<'viewportInnerSizeChange'> = (
    viewportInnerSize,
  ) => {
    if (prevInnerWidth.current !== viewportInnerSize.width) {
      prevInnerWidth.current = viewportInnerSize.width;
      setGridColumnsState(
        hydrateColumnsWidth(gridColumnsSelector(apiRef.current.state), viewportInnerSize.width),
      );
    }
  };

  useGridApiEventHandler(apiRef, 'viewportInnerSizeChange', handleGridSizeChange);

  useGridApiOptionHandler(apiRef, 'columnVisibilityChange', props.onColumnVisibilityChange);

  /**
   * APPLIERS
   */
  const hydrateColumns = React.useCallback(() => {
    logger.info(`Columns pipe processing have changed, regenerating the columns`);

    const columnsState = createColumnsState({
      apiRef,
      columnTypes,
      columnsToUpsert: [],
      initialState: undefined,
      shouldRegenColumnVisibilityModelFromColumns: !isUsingColumnVisibilityModel.current,
      keepOnlyColumnsToUpsert: false,
    });
    setGridColumnsState(columnsState);
  }, [apiRef, logger, setGridColumnsState, columnTypes]);

  useGridRegisterPipeApplier(apiRef, 'hydrateColumns', hydrateColumns);

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

    if (
      previousColumnsProp.current === props.columns &&
      previousColumnTypesProp.current === columnTypes
    ) {
      return;
    }

    const columnsState = createColumnsState({
      apiRef,
      columnTypes,
      initialState: undefined,
      // If the user provides a model, we don't want to set it in the state here because it has it's dedicated `useEffect` which calls `setColumnVisibilityModel`
      shouldRegenColumnVisibilityModelFromColumns: !isUsingColumnVisibilityModel.current,
      columnsToUpsert: props.columns,
      keepOnlyColumnsToUpsert: true,
    });
    previousColumnsProp.current = props.columns;
    previousColumnTypesProp.current = columnTypes;
    setGridColumnsState(columnsState);
  }, [logger, apiRef, setGridColumnsState, props.columns, columnTypes]);

  React.useEffect(() => {
    if (props.columnVisibilityModel !== undefined) {
      apiRef.current.setColumnVisibilityModel(props.columnVisibilityModel);
    }
  }, [apiRef, logger, props.columnVisibilityModel]);
}
