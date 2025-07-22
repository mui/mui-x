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
} from '@mui/x-data-grid-pro';
import {
  useGridRegisterPipeProcessor,
  GridPipeProcessor,
  GridRestoreStatePreProcessingContext,
  GridStateInitializer,
  GridStrategyGroup,
  gridExpandedSortedRowIndexLookupSelector,
} from '@mui/x-data-grid-pro/internals';
import { GridPrivateApiPremium } from '../../../models/gridApiPremium';
import {
  gridRowGroupingModelSelector,
  gridRowGroupingSanitizedModelSelector,
} from './gridRowGroupingSelector';
import { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';
import {
  getRowGroupingFieldFromGroupingCriteria,
  RowGroupingStrategy,
  isGroupingColumn,
  mergeStateWithRowGroupingModel,
  setStrategyAvailability,
  getGroupingRules,
  areGroupingRulesEqual,
} from './gridRowGroupingUtils';
import { GridRowGroupingApi } from './gridRowGroupingInterfaces';
import { GridInitialStatePremium } from '../../../models/gridStatePremium';

export const rowGroupingStateInitializer: GridStateInitializer<
  Pick<DataGridPremiumProcessedProps, 'rowGroupingModel' | 'initialState'>
> = (state, props, apiRef) => {
  apiRef.current.caches.rowGrouping = {
    rulesOnLastRowTreeCreation: [],
  };

  return {
    ...state,
    rowGrouping: {
      model: props.rowGroupingModel ?? props.initialState?.rowGrouping?.model ?? [],
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
    | 'defaultGroupingExpansionDepth'
    | 'isGroupExpandedByDefault'
    | 'rowGroupingColumnMode'
    | 'disableRowGrouping'
    | 'slotProps'
    | 'slots'
    | 'dataSource'
    | 'treeData'
  >,
) => {
  apiRef.current.registerControlState({
    stateId: 'rowGrouping',
    propModel: props.rowGroupingModel,
    propOnChange: props.onRowGroupingModelChange,
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
        setStrategyAvailability(apiRef, props.disableRowGrouping);
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

  useGridApiMethod(apiRef, rowGroupingApi, 'public');

  /**
   * PRE-PROCESSING
   */
  const addColumnMenuButtons = React.useCallback<GridPipeProcessor<'columnMenu'>>(
    (columnMenuItems, colDef) => {
      if (props.disableRowGrouping) {
        return columnMenuItems;
      }
      if (isGroupingColumn(colDef.field) || colDef.groupable) {
        return [...columnMenuItems, 'columnMenuGroupingItem'];
      }
      return columnMenuItems;
    },
    [props.disableRowGrouping],
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
        props.rowGroupingModel != null ||
        // Always export if the model has been initialized
        props.initialState?.rowGrouping?.model != null ||
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
    [apiRef, props.rowGroupingModel, props.initialState?.rowGrouping?.model],
  );

  const stateRestorePreProcessing = React.useCallback<GridPipeProcessor<'restoreState'>>(
    (params, context: GridRestoreStatePreProcessingContext<GridInitialStatePremium>) => {
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
          props.rowGroupingColumnMode === 'single' ||
          getRowGroupingFieldFromGroupingCriteria(params.rowNode.groupingField) === params.field;
        if (!isOnGroupingCell) {
          return;
        }

        if (props.dataSource && !params.rowNode.childrenExpanded) {
          apiRef.current.dataSource.fetchRows(params.id);
          return;
        }

        apiRef.current.setRowChildrenExpansion(params.id, !params.rowNode.childrenExpanded);
      }
    },
    [apiRef, props.rowGroupingColumnMode, props.dataSource],
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
      setStrategyAvailability(apiRef, props.disableRowGrouping);

      // Refresh the row tree creation strategy processing
      // TODO: Add a clean way to re-run a strategy processing without publishing a private event
      if (
        apiRef.current.getActiveStrategy(GridStrategyGroup.RowTree) === RowGroupingStrategy.Default
      ) {
        apiRef.current.publishEvent('activeStrategyProcessorChange', 'rowTreeCreation');
      }
    }
  }, [apiRef, props.disableRowGrouping]);

  const getRowReorderTargetIndex = React.useCallback<GridPipeProcessor<'getRowReorderTargetIndex'>>(
    (initialValue, { sourceRowId, targetRowId, dropPosition, dragDirection }) => {
      if (gridRowMaximumTreeDepthSelector(apiRef) === 1 || props.treeData) {
        return initialValue;
      }

      const expandedSortedRowIndexLookup = gridExpandedSortedRowIndexLookupSelector(apiRef);
      const expandedSortedRowIds = gridExpandedSortedRowIdsSelector(apiRef);
      const rowTree = gridRowTreeSelector(apiRef);

      const sourceRowIndex = expandedSortedRowIndexLookup[sourceRowId];
      const targetRowIndex = expandedSortedRowIndexLookup[targetRowId];
      const sourceNode = rowTree[sourceRowId];
      const targetNode = rowTree[targetRowId];

      if (!sourceNode || !targetNode) {
        return -1;
      }

      // Check if the move would be a no-op (adjacent position)
      const isAdjacent =
        (dropPosition === 'above' && targetRowIndex === sourceRowIndex + 1) ||
        (dropPosition === 'below' && targetRowIndex === sourceRowIndex - 1);

      if (isAdjacent) {
        return -1;
      }

      // Get previous node for context
      const prevNode =
        targetRowIndex > 0 ? rowTree[expandedSortedRowIds[targetRowIndex - 1]] : null;

      // Case 1: Group source -> Leaf target (never allowed)
      if (sourceNode.type === 'group' && targetNode.type === 'leaf') {
        return -1;
      }

      // Case 2: Group source -> Group target
      if (sourceNode.type === 'group' && targetNode.type === 'group') {
        // Only allow if same parent (same depth and share parent)
        if (sourceNode.parent !== targetNode.parent) {
          return -1;
        }
        // Don't allow dropping below an expanded group (that position is for its children)
        if (dropPosition === 'below' && targetNode.childrenExpanded) {
          return -1;
        }
        // Dropping here would mean no actual movement
        if (
          dropPosition === 'above' &&
          prevNode?.type === 'leaf' &&
          prevNode.parent === sourceNode.id
        ) {
          return -1;
        }
      }

      // Case 3: Leaf source -> Leaf target
      if (sourceNode.type === 'leaf' && targetNode.type === 'leaf') {
        // Allow if same parent or same depth (can change parents at same level)
        if (sourceNode.depth !== targetNode.depth) {
          return -1;
        }
      }

      // Case 4: Leaf source -> Group target
      if (sourceNode.type === 'leaf' && targetNode.type === 'group') {
        if (dropPosition === 'above') {
          // Check if there's a leaf before this group that can be sibling to source
          if (!prevNode || prevNode.type !== 'leaf' || prevNode.depth !== sourceNode.depth) {
            return -1;
          }
        } else {
          // dropPosition === 'below'
          if (!targetNode.childrenExpanded) {
            // Cannot drop below collapsed group (would trigger expansion)
            return -1;
          }
          // For expanded group, check if source can become first child
          const firstChild = targetNode.children?.[0] ? rowTree[targetNode.children[0]] : null;
          if (!firstChild || sourceNode.depth !== firstChild.depth) {
            return -1;
          }
        }
      }

      // Calculate the final target index
      let finalTargetIndex: number;

      if (dragDirection === 'up') {
        finalTargetIndex = dropPosition === 'above' ? targetRowIndex : targetRowIndex + 1;
      } else {
        finalTargetIndex = dropPosition === 'above' ? targetRowIndex - 1 : targetRowIndex;
      }

      return finalTargetIndex;
    },
    [apiRef, props.treeData],
  );

  useGridRegisterPipeProcessor(apiRef, 'getRowReorderTargetIndex', getRowReorderTargetIndex);
  useGridEvent(apiRef, 'cellKeyDown', handleCellKeyDown);
  useGridEvent(apiRef, 'columnsChange', checkGroupingColumnsModelDiff);
  useGridEvent(apiRef, 'rowGroupingModelChange', checkGroupingColumnsModelDiff);

  /*
   * EFFECTS
   */
  React.useEffect(() => {
    if (props.rowGroupingModel !== undefined) {
      apiRef.current.setRowGroupingModel(props.rowGroupingModel);
    }
  }, [apiRef, props.rowGroupingModel]);
};
