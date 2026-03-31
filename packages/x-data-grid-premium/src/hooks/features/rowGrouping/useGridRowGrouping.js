'use client';
import * as React from 'react';
import { useGridEvent, useGridApiMethod, gridColumnLookupSelector, gridRowMaximumTreeDepthSelector, gridRowTreeSelector, gridExpandedSortedRowIdsSelector, gridExpandedSortedRowIndexLookupSelector, } from '@mui/x-data-grid-pro';
import { useGridRegisterPipeProcessor, GridStrategyGroup, RowGroupingStrategy, } from '@mui/x-data-grid-pro/internals';
import { gridRowGroupingModelSelector, gridRowGroupingSanitizedModelSelector, } from './gridRowGroupingSelector';
import { getRowGroupingFieldFromGroupingCriteria, isGroupingColumn, mergeStateWithRowGroupingModel, setStrategyAvailability, getGroupingRules, areGroupingRulesEqual, } from './gridRowGroupingUtils';
import { rowGroupingReorderValidator } from '../rowReorder/rowGroupingReorderValidator';
export const rowGroupingStateInitializer = (state, props, apiRef) => {
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
export const useGridRowGrouping = (apiRef, props) => {
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
    const setRowGroupingModel = React.useCallback((model) => {
        const currentModel = gridRowGroupingModelSelector(apiRef);
        if (currentModel !== model) {
            apiRef.current.setState(mergeStateWithRowGroupingModel(model));
            setStrategyAvailability(apiRef, props.disableRowGrouping);
        }
    }, [apiRef, props.disableRowGrouping]);
    const addRowGroupingCriteria = React.useCallback((field, groupingIndex) => {
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
    }, [apiRef]);
    const removeRowGroupingCriteria = React.useCallback((field) => {
        const currentModel = gridRowGroupingModelSelector(apiRef);
        if (!currentModel.includes(field)) {
            return;
        }
        apiRef.current.setRowGroupingModel(currentModel.filter((el) => el !== field));
    }, [apiRef]);
    const setRowGroupingCriteriaIndex = React.useCallback((field, targetIndex) => {
        const currentModel = gridRowGroupingModelSelector(apiRef);
        const currentTargetIndex = currentModel.indexOf(field);
        if (currentTargetIndex === -1) {
            return;
        }
        const updatedModel = [...currentModel];
        updatedModel.splice(targetIndex, 0, updatedModel.splice(currentTargetIndex, 1)[0]);
        apiRef.current.setRowGroupingModel(updatedModel);
    }, [apiRef]);
    const rowGroupingApi = {
        setRowGroupingModel,
        addRowGroupingCriteria,
        removeRowGroupingCriteria,
        setRowGroupingCriteriaIndex,
    };
    useGridApiMethod(apiRef, rowGroupingApi, 'public');
    /**
     * PRE-PROCESSING
     */
    const addColumnMenuButtons = React.useCallback((columnMenuItems, colDef) => {
        if (props.disableRowGrouping) {
            return columnMenuItems;
        }
        if (isGroupingColumn(colDef.field) || colDef.groupable) {
            return [...columnMenuItems, 'columnMenuGroupingItem'];
        }
        return columnMenuItems;
    }, [props.disableRowGrouping]);
    const addGetRowsParams = React.useCallback((params) => {
        return {
            ...params,
            groupFields: gridRowGroupingModelSelector(apiRef),
        };
    }, [apiRef]);
    const stateExportPreProcessing = React.useCallback((prevState, context) => {
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
    }, [apiRef, props.rowGroupingModel, props.initialState?.rowGrouping?.model]);
    const stateRestorePreProcessing = React.useCallback((params, context) => {
        if (props.disableRowGrouping) {
            return params;
        }
        const rowGroupingModel = context.stateToRestore.rowGrouping?.model;
        if (rowGroupingModel != null) {
            apiRef.current.setState(mergeStateWithRowGroupingModel(rowGroupingModel));
        }
        return params;
    }, [apiRef, props.disableRowGrouping]);
    useGridRegisterPipeProcessor(apiRef, 'columnMenu', addColumnMenuButtons);
    useGridRegisterPipeProcessor(apiRef, 'getRowsParams', addGetRowsParams);
    useGridRegisterPipeProcessor(apiRef, 'exportState', stateExportPreProcessing);
    useGridRegisterPipeProcessor(apiRef, 'restoreState', stateRestorePreProcessing);
    /*
     * EVENTS
     */
    const handleCellKeyDown = React.useCallback((params, event) => {
        const cellParams = apiRef.current.getCellParams(params.id, params.field);
        if (isGroupingColumn(cellParams.field) && event.key === ' ' && !event.shiftKey) {
            event.stopPropagation();
            event.preventDefault();
            if (params.rowNode.type !== 'group') {
                return;
            }
            const isOnGroupingCell = props.rowGroupingColumnMode === 'single' ||
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
    }, [apiRef, props.rowGroupingColumnMode, props.dataSource]);
    const checkGroupingColumnsModelDiff = React.useCallback(() => {
        const sanitizedRowGroupingModel = gridRowGroupingSanitizedModelSelector(apiRef);
        const rulesOnLastRowTreeCreation = apiRef.current.caches.rowGrouping.rulesOnLastRowTreeCreation || [];
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
            if (apiRef.current.getActiveStrategy(GridStrategyGroup.RowTree) === RowGroupingStrategy.Default) {
                apiRef.current.publishEvent('activeStrategyProcessorChange', 'rowTreeCreation');
            }
        }
    }, [apiRef, props.disableRowGrouping]);
    const isValidRowReorderProp = props.isValidRowReorder;
    const isRowReorderValid = React.useCallback((initialValue, { sourceRowId, targetRowId, dropPosition, dragDirection }) => {
        if (gridRowMaximumTreeDepthSelector(apiRef) === 1 || props.treeData) {
            return initialValue;
        }
        const expandedSortedRowIndexLookup = gridExpandedSortedRowIndexLookupSelector(apiRef);
        const expandedSortedRowIds = gridExpandedSortedRowIdsSelector(apiRef);
        const rowTree = gridRowTreeSelector(apiRef);
        const targetRowIndex = expandedSortedRowIndexLookup[targetRowId];
        const sourceNode = rowTree[sourceRowId];
        const targetNode = rowTree[targetRowId];
        const prevNode = targetRowIndex > 0 ? rowTree[expandedSortedRowIds[targetRowIndex - 1]] : null;
        const nextNode = targetRowIndex < expandedSortedRowIds.length - 1
            ? rowTree[expandedSortedRowIds[targetRowIndex + 1]]
            : null;
        // Basic validity checks
        if (!sourceNode || !targetNode) {
            return false;
        }
        // Create context object
        const context = {
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
    }, [apiRef, props.treeData, isValidRowReorderProp]);
    useGridRegisterPipeProcessor(apiRef, 'isRowReorderValid', isRowReorderValid);
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
