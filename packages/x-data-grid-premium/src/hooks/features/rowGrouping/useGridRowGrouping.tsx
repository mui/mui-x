'use client';
import * as React from 'react';
import { RefObject } from '@mui/x-internals/types';
import {
  GridEventListener,
  useGridEvent,
  useGridApiMethod,
  gridColumnLookupSelector,
  gridRowMaximumTreeDepthSelector,
  gridRowTreeSelector,
  gridExpandedSortedRowIdsSelector,
  gridExpandedSortedRowIndexLookupSelector,
  type ReorderValidationContext,
} from '@mui/x-data-grid-pro';
import {
  useGridRegisterPipeProcessor,
  GridPipeProcessor,
  GridRestoreStatePreProcessingContext,
  GridStateInitializer,
  GridStrategyGroup,
  RowGroupingStrategy,
} from '@mui/x-data-grid-pro/internals';
import { GridPrivateApiPremium } from '../../../models/gridApiPremium';
import {
  gridRowGroupingModelSelector,
  gridRowGroupingSanitizedModelSelector,
} from './gridRowGroupingSelector';
import { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';
import {
  getRowGroupingFieldFromGroupingCriteria,
  isGroupingColumn,
  mergeStateWithRowGroupingModel,
  setStrategyAvailability,
  getGroupingRules,
  areGroupingRulesEqual,
} from './gridRowGroupingUtils';
import { GridRowGroupingApi } from './gridRowGroupingInterfaces';
import { GridInitialStatePremium } from '../../../models/gridStatePremium';
import { rowGroupingReorderValidator } from '../rowReorder/rowGroupingReorderValidator';

export const rowGroupingStateInitializer: GridStateInitializer<
  Pick<DataGridPremiumProcessedProps, 'rowGroupingModel' | 'initialState'>
> = (state, props, apiRef) => {
  apiRef.current.caches.rowGrouping = {
    rulesOnLastRowTreeCreation: [],
  };

  const { rowGroupingModel, initialState } = props;

  return {
    ...state,
    rowGrouping: {
      model: rowGroupingModel ?? initialState?.rowGrouping?.model ?? [],
    },
  };
};

/**
 * @requires useGridColumns (state, method) - can be after, async only
 * @requires useGridRows (state, method) - can be after, async only
 * @requires useGridParamsApi (method) - can be after, async only
 */
export const useGridRowGrouping = (
  apiRef: RefObject<GridPrivateApiPremium>,
  props: Pick<
    DataGridPremiumProcessedProps,
    | 'initialState'
    | 'rowGroupingModel'
    | 'onRowGroupingModelChange'
    | 'rowGroupingColumnMode'
    | 'disableRowGrouping'
    | 'dataSource'
    | 'treeData'
    | 'isValidRowReorder'
  >,
) => {
  const {
    initialState,
    rowGroupingModel,
    onRowGroupingModelChange,
    rowGroupingColumnMode,
    disableRowGrouping,
    dataSource,
    treeData,
    isValidRowReorder,
  } = props;
  apiRef.current.registerControlState({
    stateId: 'rowGrouping',
    propModel: rowGroupingModel,
    propOnChange: onRowGroupingModelChange,
    stateSelector: gridRowGroupingModelSelector,
    changeEvent: 'rowGroupingModelChange',
  });

  /*
   * API METHODS
   */
  const setRowGroupingModel = React.useCallback<GridRowGroupingApi['setRowGroupingModel']>(
    (model) => {
      const currentModel = gridRowGroupingModelSelector(apiRef);
      if (currentModel !== model) {
        apiRef.current.setState(mergeStateWithRowGroupingModel(model));
        setStrategyAvailability(apiRef, disableRowGrouping);
      }
    },
    [apiRef, disableRowGrouping],
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

  useGridApiMethod(apiRef, rowGroupingApi, 'public');

  /**
   * PRE-PROCESSING
   */
  const addColumnMenuButtons = React.useCallback<GridPipeProcessor<'columnMenu'>>(
    (columnMenuItems, colDef) => {
      if (disableRowGrouping) {
        return columnMenuItems;
      }
      if (isGroupingColumn(colDef.field) || colDef.groupable) {
        return [...columnMenuItems, 'columnMenuGroupingItem'];
      }
      return columnMenuItems;
    },
    [disableRowGrouping],
  );

  const addGetRowsParams = React.useCallback<GridPipeProcessor<'getRowsParams'>>(
    (params) => {
      return {
        ...params,
        groupFields: gridRowGroupingModelSelector(apiRef),
      };
    },
    [apiRef],
  );

  const stateExportPreProcessing = React.useCallback<GridPipeProcessor<'exportState'>>(
    (prevState, context) => {
      const rowGroupingModelToExport = gridRowGroupingModelSelector(apiRef);

      const shouldExportRowGroupingModel =
        // Always export if the `exportOnlyDirtyModels` property is not activated
        !context.exportOnlyDirtyModels ||
        // Always export if the model is controlled
        rowGroupingModel != null ||
        // Always export if the model has been initialized
        initialState?.rowGrouping?.model != null ||
        // Export if the model is not empty
        Object.keys(rowGroupingModelToExport).length > 0;

      if (!shouldExportRowGroupingModel) {
        return prevState;
      }

      return {
        ...prevState,
        rowGrouping: {
          model: rowGroupingModelToExport,
        },
      };
    },
    [apiRef, rowGroupingModel, initialState?.rowGrouping?.model],
  );

  const stateRestorePreProcessing = React.useCallback<GridPipeProcessor<'restoreState'>>(
    (params, context: GridRestoreStatePreProcessingContext<GridInitialStatePremium>) => {
      if (disableRowGrouping) {
        return params;
      }

      const rowGroupingModelToRestore = context.stateToRestore.rowGrouping?.model;
      if (rowGroupingModelToRestore != null) {
        apiRef.current.setState(mergeStateWithRowGroupingModel(rowGroupingModelToRestore));
      }
      return params;
    },
    [apiRef, disableRowGrouping],
  );

  useGridRegisterPipeProcessor(apiRef, 'columnMenu', addColumnMenuButtons);
  useGridRegisterPipeProcessor(apiRef, 'getRowsParams', addGetRowsParams);
  useGridRegisterPipeProcessor(apiRef, 'exportState', stateExportPreProcessing);
  useGridRegisterPipeProcessor(apiRef, 'restoreState', stateRestorePreProcessing);

  /*
   * EVENTS
   */
  const handleCellKeyDown = React.useCallback<GridEventListener<'cellKeyDown'>>(
    (params, event) => {
      const cellParams = apiRef.current.getCellParams(params.id, params.field);
      if (isGroupingColumn(cellParams.field) && event.key === ' ' && !event.shiftKey) {
        event.stopPropagation();
        event.preventDefault();

        if (params.rowNode.type !== 'group') {
          return;
        }

        const isOnGroupingCell =
          rowGroupingColumnMode === 'single' ||
          getRowGroupingFieldFromGroupingCriteria(params.rowNode.groupingField) === params.field;
        if (!isOnGroupingCell) {
          return;
        }

        if (dataSource && !params.rowNode.childrenExpanded) {
          apiRef.current.dataSource.fetchRows(params.id);
          return;
        }

        apiRef.current.setRowChildrenExpansion(params.id, !params.rowNode.childrenExpanded);
      }
    },
    [apiRef, rowGroupingColumnMode, dataSource],
  );

  const checkGroupingColumnsModelDiff = React.useCallback<
    GridEventListener<'columnsChange'>
  >(() => {
    const sanitizedRowGroupingModel = gridRowGroupingSanitizedModelSelector(apiRef);
    const rulesOnLastRowTreeCreation =
      apiRef.current.caches.rowGrouping.rulesOnLastRowTreeCreation || [];

    const groupingRules = getGroupingRules({
      sanitizedRowGroupingModel,
      columnsLookup: gridColumnLookupSelector(apiRef),
    });

    if (!areGroupingRulesEqual(rulesOnLastRowTreeCreation, groupingRules)) {
      apiRef.current.caches.rowGrouping.rulesOnLastRowTreeCreation = groupingRules;
      apiRef.current.requestPipeProcessorsApplication('hydrateColumns');
      setStrategyAvailability(apiRef, disableRowGrouping);

      // Refresh the row tree creation strategy processing
      // TODO: Add a clean way to re-run a strategy processing without publishing a private event
      if (
        apiRef.current.getActiveStrategy(GridStrategyGroup.RowTree) === RowGroupingStrategy.Default
      ) {
        apiRef.current.publishEvent('activeStrategyProcessorChange', 'rowTreeCreation');
      }
    }
  }, [apiRef, disableRowGrouping]);

  const isValidRowReorderProp = isValidRowReorder;
  const isRowReorderValid = React.useCallback<GridPipeProcessor<'isRowReorderValid'>>(
    (initialValue, { sourceRowId, targetRowId, dropPosition, dragDirection }) => {
      if (gridRowMaximumTreeDepthSelector(apiRef) === 1 || treeData) {
        return initialValue;
      }

      const expandedSortedRowIndexLookup = gridExpandedSortedRowIndexLookupSelector(apiRef);
      const expandedSortedRowIds = gridExpandedSortedRowIdsSelector(apiRef);
      const rowTree = gridRowTreeSelector(apiRef);

      const targetRowIndex = expandedSortedRowIndexLookup[targetRowId];
      const sourceNode = rowTree[sourceRowId];
      const targetNode = rowTree[targetRowId];
      const prevNode =
        targetRowIndex > 0 ? rowTree[expandedSortedRowIds[targetRowIndex - 1]] : null;
      const nextNode =
        targetRowIndex < expandedSortedRowIds.length - 1
          ? rowTree[expandedSortedRowIds[targetRowIndex + 1]]
          : null;

      // Basic validity checks
      if (!sourceNode || !targetNode) {
        return false;
      }

      // Create context object
      const context: ReorderValidationContext = {
        apiRef,
        sourceNode,
        targetNode,
        prevNode,
        nextNode,
        dropPosition,
        dragDirection,
      };

      // First apply internal validation
      let isValid = rowGroupingReorderValidator.validate(context);

      // If internal validation passes AND user provided additional validation
      if (isValid && isValidRowReorderProp) {
        // Apply additional user restrictions
        isValid = isValidRowReorderProp(context);
      }

      if (isValid) {
        return true;
      }
      return false;
    },
    [apiRef, treeData, isValidRowReorderProp],
  );

  useGridRegisterPipeProcessor(apiRef, 'isRowReorderValid', isRowReorderValid);
  useGridEvent(apiRef, 'cellKeyDown', handleCellKeyDown);
  useGridEvent(apiRef, 'columnsChange', checkGroupingColumnsModelDiff);
  useGridEvent(apiRef, 'rowGroupingModelChange', checkGroupingColumnsModelDiff);

  /*
   * EFFECTS
   */
  React.useEffect(() => {
    if (rowGroupingModel !== undefined) {
      apiRef.current.setRowGroupingModel(rowGroupingModel);
    }
  }, [apiRef, rowGroupingModel]);
};
