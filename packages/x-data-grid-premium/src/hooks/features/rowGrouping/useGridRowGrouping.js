"use strict";
'use client';
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGridRowGrouping = exports.rowGroupingStateInitializer = void 0;
var React = require("react");
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var internals_1 = require("@mui/x-data-grid-pro/internals");
var gridRowGroupingSelector_1 = require("./gridRowGroupingSelector");
var gridRowGroupingUtils_1 = require("./gridRowGroupingUtils");
var rowGroupingStateInitializer = function (state, props, apiRef) {
    var _a, _b, _c, _d;
    apiRef.current.caches.rowGrouping = {
        rulesOnLastRowTreeCreation: [],
    };
    return __assign(__assign({}, state), { rowGrouping: {
            model: (_d = (_a = props.rowGroupingModel) !== null && _a !== void 0 ? _a : (_c = (_b = props.initialState) === null || _b === void 0 ? void 0 : _b.rowGrouping) === null || _c === void 0 ? void 0 : _c.model) !== null && _d !== void 0 ? _d : [],
        } });
};
exports.rowGroupingStateInitializer = rowGroupingStateInitializer;
/**
 * @requires useGridColumns (state, method) - can be after, async only
 * @requires useGridRows (state, method) - can be after, async only
 * @requires useGridParamsApi (method) - can be after, async only
 */
var useGridRowGrouping = function (apiRef, props) {
    var _a, _b;
    apiRef.current.registerControlState({
        stateId: 'rowGrouping',
        propModel: props.rowGroupingModel,
        propOnChange: props.onRowGroupingModelChange,
        stateSelector: gridRowGroupingSelector_1.gridRowGroupingModelSelector,
        changeEvent: 'rowGroupingModelChange',
    });
    /*
     * API METHODS
     */
    var setRowGroupingModel = React.useCallback(function (model) {
        var currentModel = (0, gridRowGroupingSelector_1.gridRowGroupingModelSelector)(apiRef);
        if (currentModel !== model) {
            apiRef.current.setState((0, gridRowGroupingUtils_1.mergeStateWithRowGroupingModel)(model));
            (0, gridRowGroupingUtils_1.setStrategyAvailability)(apiRef, props.disableRowGrouping);
        }
    }, [apiRef, props.disableRowGrouping]);
    var addRowGroupingCriteria = React.useCallback(function (field, groupingIndex) {
        var currentModel = (0, gridRowGroupingSelector_1.gridRowGroupingModelSelector)(apiRef);
        if (currentModel.includes(field)) {
            return;
        }
        var cleanGroupingIndex = groupingIndex !== null && groupingIndex !== void 0 ? groupingIndex : currentModel.length;
        var updatedModel = __spreadArray(__spreadArray(__spreadArray([], currentModel.slice(0, cleanGroupingIndex), true), [
            field
        ], false), currentModel.slice(cleanGroupingIndex), true);
        apiRef.current.setRowGroupingModel(updatedModel);
    }, [apiRef]);
    var removeRowGroupingCriteria = React.useCallback(function (field) {
        var currentModel = (0, gridRowGroupingSelector_1.gridRowGroupingModelSelector)(apiRef);
        if (!currentModel.includes(field)) {
            return;
        }
        apiRef.current.setRowGroupingModel(currentModel.filter(function (el) { return el !== field; }));
    }, [apiRef]);
    var setRowGroupingCriteriaIndex = React.useCallback(function (field, targetIndex) {
        var currentModel = (0, gridRowGroupingSelector_1.gridRowGroupingModelSelector)(apiRef);
        var currentTargetIndex = currentModel.indexOf(field);
        if (currentTargetIndex === -1) {
            return;
        }
        var updatedModel = __spreadArray([], currentModel, true);
        updatedModel.splice(targetIndex, 0, updatedModel.splice(currentTargetIndex, 1)[0]);
        apiRef.current.setRowGroupingModel(updatedModel);
    }, [apiRef]);
    var rowGroupingApi = {
        setRowGroupingModel: setRowGroupingModel,
        addRowGroupingCriteria: addRowGroupingCriteria,
        removeRowGroupingCriteria: removeRowGroupingCriteria,
        setRowGroupingCriteriaIndex: setRowGroupingCriteriaIndex,
    };
    (0, x_data_grid_pro_1.useGridApiMethod)(apiRef, rowGroupingApi, 'public');
    /**
     * PRE-PROCESSING
     */
    var addColumnMenuButtons = React.useCallback(function (columnMenuItems, colDef) {
        if (props.disableRowGrouping) {
            return columnMenuItems;
        }
        if ((0, gridRowGroupingUtils_1.isGroupingColumn)(colDef.field) || colDef.groupable) {
            return __spreadArray(__spreadArray([], columnMenuItems, true), ['columnMenuGroupingItem'], false);
        }
        return columnMenuItems;
    }, [props.disableRowGrouping]);
    var addGetRowsParams = React.useCallback(function (params) {
        return __assign(__assign({}, params), { groupFields: (0, gridRowGroupingSelector_1.gridRowGroupingModelSelector)(apiRef) });
    }, [apiRef]);
    var stateExportPreProcessing = React.useCallback(function (prevState, context) {
        var _a, _b;
        var rowGroupingModelToExport = (0, gridRowGroupingSelector_1.gridRowGroupingModelSelector)(apiRef);
        var shouldExportRowGroupingModel = 
        // Always export if the `exportOnlyDirtyModels` property is not activated
        !context.exportOnlyDirtyModels ||
            // Always export if the model is controlled
            props.rowGroupingModel != null ||
            // Always export if the model has been initialized
            ((_b = (_a = props.initialState) === null || _a === void 0 ? void 0 : _a.rowGrouping) === null || _b === void 0 ? void 0 : _b.model) != null ||
            // Export if the model is not empty
            Object.keys(rowGroupingModelToExport).length > 0;
        if (!shouldExportRowGroupingModel) {
            return prevState;
        }
        return __assign(__assign({}, prevState), { rowGrouping: {
                model: rowGroupingModelToExport,
            } });
    }, [apiRef, props.rowGroupingModel, (_b = (_a = props.initialState) === null || _a === void 0 ? void 0 : _a.rowGrouping) === null || _b === void 0 ? void 0 : _b.model]);
    var stateRestorePreProcessing = React.useCallback(function (params, context) {
        var _a;
        if (props.disableRowGrouping) {
            return params;
        }
        var rowGroupingModel = (_a = context.stateToRestore.rowGrouping) === null || _a === void 0 ? void 0 : _a.model;
        if (rowGroupingModel != null) {
            apiRef.current.setState((0, gridRowGroupingUtils_1.mergeStateWithRowGroupingModel)(rowGroupingModel));
        }
        return params;
    }, [apiRef, props.disableRowGrouping]);
    (0, internals_1.useGridRegisterPipeProcessor)(apiRef, 'columnMenu', addColumnMenuButtons);
    (0, internals_1.useGridRegisterPipeProcessor)(apiRef, 'getRowsParams', addGetRowsParams);
    (0, internals_1.useGridRegisterPipeProcessor)(apiRef, 'exportState', stateExportPreProcessing);
    (0, internals_1.useGridRegisterPipeProcessor)(apiRef, 'restoreState', stateRestorePreProcessing);
    /*
     * EVENTS
     */
    var handleCellKeyDown = React.useCallback(function (params, event) {
        var cellParams = apiRef.current.getCellParams(params.id, params.field);
        if ((0, gridRowGroupingUtils_1.isGroupingColumn)(cellParams.field) && event.key === ' ' && !event.shiftKey) {
            event.stopPropagation();
            event.preventDefault();
            if (params.rowNode.type !== 'group') {
                return;
            }
            var isOnGroupingCell = props.rowGroupingColumnMode === 'single' ||
                (0, gridRowGroupingUtils_1.getRowGroupingFieldFromGroupingCriteria)(params.rowNode.groupingField) === params.field;
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
    var checkGroupingColumnsModelDiff = React.useCallback(function () {
        var sanitizedRowGroupingModel = (0, gridRowGroupingSelector_1.gridRowGroupingSanitizedModelSelector)(apiRef);
        var rulesOnLastRowTreeCreation = apiRef.current.caches.rowGrouping.rulesOnLastRowTreeCreation || [];
        var groupingRules = (0, gridRowGroupingUtils_1.getGroupingRules)({
            sanitizedRowGroupingModel: sanitizedRowGroupingModel,
            columnsLookup: (0, x_data_grid_pro_1.gridColumnLookupSelector)(apiRef),
        });
        if (!(0, gridRowGroupingUtils_1.areGroupingRulesEqual)(rulesOnLastRowTreeCreation, groupingRules)) {
            apiRef.current.caches.rowGrouping.rulesOnLastRowTreeCreation = groupingRules;
            apiRef.current.requestPipeProcessorsApplication('hydrateColumns');
            (0, gridRowGroupingUtils_1.setStrategyAvailability)(apiRef, props.disableRowGrouping);
            // Refresh the row tree creation strategy processing
            // TODO: Add a clean way to re-run a strategy processing without publishing a private event
            if (apiRef.current.getActiveStrategy(internals_1.GridStrategyGroup.RowTree) === internals_1.RowGroupingStrategy.Default) {
                apiRef.current.publishEvent('activeStrategyProcessorChange', 'rowTreeCreation');
            }
        }
    }, [apiRef, props.disableRowGrouping]);
    (0, x_data_grid_pro_1.useGridEvent)(apiRef, 'cellKeyDown', handleCellKeyDown);
    (0, x_data_grid_pro_1.useGridEvent)(apiRef, 'columnsChange', checkGroupingColumnsModelDiff);
    (0, x_data_grid_pro_1.useGridEvent)(apiRef, 'rowGroupingModelChange', checkGroupingColumnsModelDiff);
    /*
     * EFFECTS
     */
    React.useEffect(function () {
        if (props.rowGroupingModel !== undefined) {
            apiRef.current.setRowGroupingModel(props.rowGroupingModel);
        }
    }, [apiRef, props.rowGroupingModel]);
};
exports.useGridRowGrouping = useGridRowGrouping;
