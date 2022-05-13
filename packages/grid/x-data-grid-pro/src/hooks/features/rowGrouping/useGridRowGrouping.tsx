import * as React from 'react';
import Divider from '@mui/material/Divider';
import {
  GridEventListener,
  useGridApiEventHandler,
  useGridApiMethod,
  gridFilteredDescendantCountLookupSelector,
} from '@mui/x-data-grid';
import {
  useGridRegisterPipeProcessor,
  GridPipeProcessor,
  GridRestoreStatePreProcessingContext,
  GridStateInitializer,
  isDeepEqual,
} from '@mui/x-data-grid/internals';
import { GridApiPro } from '../../../models/gridApiPro';
import {
  gridRowGroupingModelSelector,
  gridRowGroupingSanitizedModelSelector,
  gridRowGroupingStateSelector,
} from './gridRowGroupingSelector';
import { DataGridProProcessedProps } from '../../../models/dataGridProProps';
import {
  getRowGroupingFieldFromGroupingCriteria,
  ROW_GROUPING_STRATEGY,
  isGroupingColumn,
  mergeStateWithRowGroupingModel,
  setStrategyAvailability,
} from './gridRowGroupingUtils';
import { GridRowGroupingApi } from './gridRowGroupingInterfaces';
import { GridRowGroupableColumnMenuItems } from '../../../components/GridRowGroupableColumnMenuItems';
import { GridRowGroupingColumnMenuItems } from '../../../components/GridRowGroupingColumnMenuItems';
import { GridInitialStatePro } from '../../../models/gridStatePro';

export const rowGroupingStateInitializer: GridStateInitializer<
  Pick<DataGridProProcessedProps, 'rowGroupingModel' | 'initialState'>
> = (state, props) => ({
  ...state,
  rowGrouping: {
    model: props.rowGroupingModel ?? props.initialState?.rowGrouping?.model ?? [],
    unstable_sanitizedModelOnLastRowTreeCreation: [],
  },
});

/**
 * @requires useGridColumns (state, method) - can be after, async only
 * @requires useGridRows (state, method) - can be after, async only
 * @requires useGridParamsApi (method) - can be after, async only
 */
export const useGridRowGrouping = (
  apiRef: React.MutableRefObject<GridApiPro>,
  props: Pick<
    DataGridProProcessedProps,
    | 'initialState'
    | 'rowGroupingModel'
    | 'onRowGroupingModelChange'
    | 'defaultGroupingExpansionDepth'
    | 'isGroupExpandedByDefault'
    | 'groupingColDef'
    | 'rowGroupingColumnMode'
    | 'disableRowGrouping'
  >,
) => {
  apiRef.current.unstable_updateControlState({
    stateId: 'rowGrouping',
    propModel: props.rowGroupingModel,
    propOnChange: props.onRowGroupingModelChange,
    stateSelector: gridRowGroupingModelSelector,
    changeEvent: 'rowGroupingModelChange',
  });

  /**
   * API METHODS
   */
  const setRowGroupingModel = React.useCallback<GridRowGroupingApi['setRowGroupingModel']>(
    (model) => {
      const currentModel = gridRowGroupingModelSelector(apiRef);
      if (currentModel !== model) {
        apiRef.current.setState(mergeStateWithRowGroupingModel(model));
        setStrategyAvailability(apiRef, props.disableRowGrouping);
        apiRef.current.forceUpdate();
      }
    },
    [apiRef, props.disableRowGrouping],
  );

  const addRowGroupingCriteria = React.useCallback<GridRowGroupingApi['addRowGroupingCriteria']>(
    (field, groupingIndex) => {
      const currentModel = gridRowGroupingModelSelector(apiRef);
      if (currentModel.includes(field)) {
        return;
      }

      const cleanGroupingIndex = groupingIndex ?? currentModel.length;

      const updatedModel = [
        ...currentModel.slice(0, cleanGroupingIndex),
        field,
        ...currentModel.slice(cleanGroupingIndex),
      ];

      apiRef.current.setRowGroupingModel(updatedModel);
    },
    [apiRef],
  );

  const removeRowGroupingCriteria = React.useCallback<
    GridRowGroupingApi['removeRowGroupingCriteria']
  >(
    (field) => {
      const currentModel = gridRowGroupingModelSelector(apiRef);
      if (!currentModel.includes(field)) {
        return;
      }
      apiRef.current.setRowGroupingModel(currentModel.filter((el) => el !== field));
    },
    [apiRef],
  );

  const setRowGroupingCriteriaIndex = React.useCallback<
    GridRowGroupingApi['setRowGroupingCriteriaIndex']
  >(
    (field, targetIndex) => {
      const currentModel = gridRowGroupingModelSelector(apiRef);
      const currentTargetIndex = currentModel.indexOf(field);

      if (currentTargetIndex === -1) {
        return;
      }

      const updatedModel = [...currentModel];
      updatedModel.splice(targetIndex, 0, updatedModel.splice(currentTargetIndex, 1)[0]);

      apiRef.current.setRowGroupingModel(updatedModel);
    },
    [apiRef],
  );

  const rowGroupingApi: GridRowGroupingApi = {
    setRowGroupingModel,
    addRowGroupingCriteria,
    removeRowGroupingCriteria,
    setRowGroupingCriteriaIndex,
  };

  useGridApiMethod(apiRef, rowGroupingApi, 'GridRowGroupingApi');

  /**
   * PRE-PROCESSING
   */
  const addColumnMenuButtons = React.useCallback<GridPipeProcessor<'columnMenu'>>(
    (initialValue, columns) => {
      if (props.disableRowGrouping) {
        return initialValue;
      }

      let menuItems: React.ReactNode;
      if (isGroupingColumn(columns.field)) {
        menuItems = <GridRowGroupingColumnMenuItems />;
      } else if (columns.groupable) {
        menuItems = <GridRowGroupableColumnMenuItems />;
      } else {
        menuItems = null;
      }

      if (menuItems == null) {
        return initialValue;
      }

      return [...initialValue, <Divider />, menuItems];
    },
    [props.disableRowGrouping],
  );

  const stateExportPreProcessing = React.useCallback<GridPipeProcessor<'exportState'>>(
    (prevState) => {
      if (props.disableRowGrouping) {
        return prevState;
      }

      const rowGroupingModelToExport = gridRowGroupingModelSelector(apiRef);
      if (rowGroupingModelToExport.length === 0) {
        return prevState;
      }

      return {
        ...prevState,
        rowGrouping: {
          model: rowGroupingModelToExport,
        },
      };
    },
    [apiRef, props.disableRowGrouping],
  );

  const stateRestorePreProcessing = React.useCallback<GridPipeProcessor<'restoreState'>>(
    (params, context: GridRestoreStatePreProcessingContext<GridInitialStatePro>) => {
      if (props.disableRowGrouping) {
        return params;
      }

      const rowGroupingModel = context.stateToRestore.rowGrouping?.model;
      if (rowGroupingModel != null) {
        apiRef.current.setState(mergeStateWithRowGroupingModel(rowGroupingModel));
      }
      return params;
    },
    [apiRef, props.disableRowGrouping],
  );

  useGridRegisterPipeProcessor(apiRef, 'columnMenu', addColumnMenuButtons);
  useGridRegisterPipeProcessor(apiRef, 'exportState', stateExportPreProcessing);
  useGridRegisterPipeProcessor(apiRef, 'restoreState', stateRestorePreProcessing);

  /**
   * EVENTS
   */
  const handleCellKeyDown = React.useCallback<GridEventListener<'cellKeyDown'>>(
    (params, event) => {
      const cellParams = apiRef.current.getCellParams(params.id, params.field);
      if (isGroupingColumn(cellParams.field) && event.key === ' ' && !event.shiftKey) {
        event.stopPropagation();
        event.preventDefault();

        const filteredDescendantCount =
          gridFilteredDescendantCountLookupSelector(apiRef)[params.id] ?? 0;

        const isOnGroupingCell =
          props.rowGroupingColumnMode === 'single' ||
          getRowGroupingFieldFromGroupingCriteria(params.rowNode.groupingField) === params.field;
        if (!isOnGroupingCell || filteredDescendantCount === 0) {
          return;
        }

        apiRef.current.setRowChildrenExpansion(params.id, !params.rowNode.childrenExpanded);
      }
    },
    [apiRef, props.rowGroupingColumnMode],
  );

  const checkGroupingColumnsModelDiff = React.useCallback<
    GridEventListener<'columnsChange'>
  >(() => {
    const rowGroupingModel = gridRowGroupingSanitizedModelSelector(apiRef);
    const lastGroupingColumnsModelApplied = gridRowGroupingStateSelector(
      apiRef.current.state,
    ).unstable_sanitizedModelOnLastRowTreeCreation;

    if (!isDeepEqual(lastGroupingColumnsModelApplied, rowGroupingModel)) {
      apiRef.current.setState((state) => ({
        ...state,
        rowGrouping: {
          ...state.rowGrouping,
          unstable_sanitizedModelOnLastRowTreeCreation: rowGroupingModel,
        },
      }));

      apiRef.current.unstable_requestPipeProcessorsApplication('hydrateColumns');
      setStrategyAvailability(apiRef, props.disableRowGrouping);

      // Refresh the row tree creation strategy processing
      // TODO: Add a clean way to re-run a strategy processing without publishing a private event
      if (apiRef.current.unstable_getActiveStrategy('rowTree') === ROW_GROUPING_STRATEGY) {
        apiRef.current.publishEvent('activeStrategyProcessorChange', 'rowTreeCreation');
      }
    }
  }, [apiRef, props.disableRowGrouping]);

  useGridApiEventHandler(apiRef, 'cellKeyDown', handleCellKeyDown);
  useGridApiEventHandler(apiRef, 'columnsChange', checkGroupingColumnsModelDiff);
  useGridApiEventHandler(apiRef, 'rowGroupingModelChange', checkGroupingColumnsModelDiff);

  /**
   * EFFECTS
   */
  React.useEffect(() => {
    if (props.rowGroupingModel !== undefined) {
      apiRef.current.setRowGroupingModel(props.rowGroupingModel);
    }
  }, [apiRef, props.rowGroupingModel]);
};
