"use strict";
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
exports.useGridSorting = exports.sortingStateInitializer = void 0;
var React = require("react");
var useEnhancedEffect_1 = require("@mui/utils/useEnhancedEffect");
var useGridEvent_1 = require("../../utils/useGridEvent");
var useGridApiMethod_1 = require("../../utils/useGridApiMethod");
var useGridLogger_1 = require("../../utils/useGridLogger");
var gridColumnsSelector_1 = require("../columns/gridColumnsSelector");
var gridSortingSelector_1 = require("./gridSortingSelector");
var rows_1 = require("../rows");
var useFirstRender_1 = require("../../utils/useFirstRender");
var strategyProcessing_1 = require("../../core/strategyProcessing");
var gridSortingUtils_1 = require("./gridSortingUtils");
var pipeProcessing_1 = require("../../core/pipeProcessing");
var gridRowsUtils_1 = require("../rows/gridRowsUtils");
var sortingStateInitializer = function (state, props) {
    var _a, _b, _c, _d;
    var sortModel = (_d = (_a = props.sortModel) !== null && _a !== void 0 ? _a : (_c = (_b = props.initialState) === null || _b === void 0 ? void 0 : _b.sorting) === null || _c === void 0 ? void 0 : _c.sortModel) !== null && _d !== void 0 ? _d : [];
    return __assign(__assign({}, state), { sorting: {
            sortModel: (0, gridSortingUtils_1.sanitizeSortModel)(sortModel, props.disableMultipleColumnsSorting),
            sortedRows: [],
        } });
};
exports.sortingStateInitializer = sortingStateInitializer;
/**
 * @requires useGridRows (event)
 * @requires useGridColumns (event)
 */
var useGridSorting = function (apiRef, props) {
    var _a, _b;
    var logger = (0, useGridLogger_1.useGridLogger)(apiRef, 'useGridSorting');
    apiRef.current.registerControlState({
        stateId: 'sortModel',
        propModel: props.sortModel,
        propOnChange: props.onSortModelChange,
        stateSelector: gridSortingSelector_1.gridSortModelSelector,
        changeEvent: 'sortModelChange',
    });
    var upsertSortModel = React.useCallback(function (field, sortItem) {
        var sortModel = (0, gridSortingSelector_1.gridSortModelSelector)(apiRef);
        var existingIdx = sortModel.findIndex(function (c) { return c.field === field; });
        var newSortModel = __spreadArray([], sortModel, true);
        if (existingIdx > -1) {
            if ((sortItem === null || sortItem === void 0 ? void 0 : sortItem.sort) == null) {
                newSortModel.splice(existingIdx, 1);
            }
            else {
                newSortModel.splice(existingIdx, 1, sortItem);
            }
        }
        else {
            newSortModel = __spreadArray(__spreadArray([], sortModel, true), [sortItem], false);
        }
        return newSortModel;
    }, [apiRef]);
    var createSortItem = React.useCallback(function (col, directionOverride) {
        var _a, _b;
        var sortModel = (0, gridSortingSelector_1.gridSortModelSelector)(apiRef);
        var existing = sortModel.find(function (c) { return c.field === col.field; });
        if (existing) {
            var nextSort = directionOverride === undefined
                ? (0, gridSortingUtils_1.getNextGridSortDirection)((_a = col.sortingOrder) !== null && _a !== void 0 ? _a : props.sortingOrder, existing.sort)
                : directionOverride;
            return nextSort === undefined ? undefined : __assign(__assign({}, existing), { sort: nextSort });
        }
        return {
            field: col.field,
            sort: directionOverride === undefined
                ? (0, gridSortingUtils_1.getNextGridSortDirection)((_b = col.sortingOrder) !== null && _b !== void 0 ? _b : props.sortingOrder)
                : directionOverride,
        };
    }, [apiRef, props.sortingOrder]);
    var addColumnMenuItem = React.useCallback(function (columnMenuItems, colDef) {
        if (colDef == null || colDef.sortable === false || props.disableColumnSorting) {
            return columnMenuItems;
        }
        var sortingOrder = colDef.sortingOrder || props.sortingOrder;
        if (sortingOrder.some(function (item) { return !!item; })) {
            return __spreadArray(__spreadArray([], columnMenuItems, true), ['columnMenuSortItem'], false);
        }
        return columnMenuItems;
    }, [props.sortingOrder, props.disableColumnSorting]);
    /**
     * API METHODS
     */
    var applySorting = React.useCallback(function () {
        apiRef.current.setState(function (state) {
            if (props.sortingMode === 'server') {
                logger.debug('Skipping sorting rows as sortingMode = server');
                return __assign(__assign({}, state), { sorting: __assign(__assign({}, state.sorting), { sortedRows: (0, gridRowsUtils_1.getTreeNodeDescendants)((0, rows_1.gridRowTreeSelector)(apiRef), rows_1.GRID_ROOT_GROUP_ID, false) }) });
            }
            var sortModel = (0, gridSortingSelector_1.gridSortModelSelector)(apiRef);
            var sortRowList = (0, gridSortingUtils_1.buildAggregatedSortingApplier)(sortModel, apiRef);
            var sortedRows = apiRef.current.applyStrategyProcessor('sorting', {
                sortRowList: sortRowList,
            });
            return __assign(__assign({}, state), { sorting: __assign(__assign({}, state.sorting), { sortedRows: sortedRows }) });
        });
        apiRef.current.publishEvent('sortedRowsSet');
    }, [apiRef, logger, props.sortingMode]);
    var setSortModel = React.useCallback(function (model) {
        var currentModel = (0, gridSortingSelector_1.gridSortModelSelector)(apiRef);
        if (currentModel !== model) {
            logger.debug("Setting sort model");
            apiRef.current.setState((0, gridSortingUtils_1.mergeStateWithSortModel)(model, props.disableMultipleColumnsSorting));
            apiRef.current.applySorting();
        }
    }, [apiRef, logger, props.disableMultipleColumnsSorting]);
    var sortColumn = React.useCallback(function (field, direction, allowMultipleSorting) {
        var column = apiRef.current.getColumn(field);
        var sortItem = createSortItem(column, direction);
        var sortModel;
        if (!allowMultipleSorting || props.disableMultipleColumnsSorting) {
            sortModel = (sortItem === null || sortItem === void 0 ? void 0 : sortItem.sort) == null ? [] : [sortItem];
        }
        else {
            sortModel = upsertSortModel(column.field, sortItem);
        }
        apiRef.current.setSortModel(sortModel);
    }, [apiRef, upsertSortModel, createSortItem, props.disableMultipleColumnsSorting]);
    var getSortModel = React.useCallback(function () { return (0, gridSortingSelector_1.gridSortModelSelector)(apiRef); }, [apiRef]);
    var getSortedRows = React.useCallback(function () {
        var sortedRows = (0, gridSortingSelector_1.gridSortedRowEntriesSelector)(apiRef);
        return sortedRows.map(function (row) { return row.model; });
    }, [apiRef]);
    var getSortedRowIds = React.useCallback(function () { return (0, gridSortingSelector_1.gridSortedRowIdsSelector)(apiRef); }, [apiRef]);
    var getRowIdFromRowIndex = React.useCallback(function (index) { return apiRef.current.getSortedRowIds()[index]; }, [apiRef]);
    var sortApi = {
        getSortModel: getSortModel,
        getSortedRows: getSortedRows,
        getSortedRowIds: getSortedRowIds,
        getRowIdFromRowIndex: getRowIdFromRowIndex,
        setSortModel: setSortModel,
        sortColumn: sortColumn,
        applySorting: applySorting,
    };
    (0, useGridApiMethod_1.useGridApiMethod)(apiRef, sortApi, 'public');
    /**
     * PRE-PROCESSING
     */
    var stateExportPreProcessing = React.useCallback(function (prevState, context) {
        var _a, _b;
        var sortModelToExport = (0, gridSortingSelector_1.gridSortModelSelector)(apiRef);
        var shouldExportSortModel = 
        // Always export if the `exportOnlyDirtyModels` property is not activated
        !context.exportOnlyDirtyModels ||
            // Always export if the model is controlled
            props.sortModel != null ||
            // Always export if the model has been initialized
            ((_b = (_a = props.initialState) === null || _a === void 0 ? void 0 : _a.sorting) === null || _b === void 0 ? void 0 : _b.sortModel) != null ||
            // Export if the model is not empty
            sortModelToExport.length > 0;
        if (!shouldExportSortModel) {
            return prevState;
        }
        return __assign(__assign({}, prevState), { sorting: {
                sortModel: sortModelToExport,
            } });
    }, [apiRef, props.sortModel, (_b = (_a = props.initialState) === null || _a === void 0 ? void 0 : _a.sorting) === null || _b === void 0 ? void 0 : _b.sortModel]);
    var stateRestorePreProcessing = React.useCallback(function (params, context) {
        var _a;
        var sortModel = (_a = context.stateToRestore.sorting) === null || _a === void 0 ? void 0 : _a.sortModel;
        if (sortModel == null) {
            return params;
        }
        apiRef.current.setState((0, gridSortingUtils_1.mergeStateWithSortModel)(sortModel, props.disableMultipleColumnsSorting));
        return __assign(__assign({}, params), { callbacks: __spreadArray(__spreadArray([], params.callbacks, true), [apiRef.current.applySorting], false) });
    }, [apiRef, props.disableMultipleColumnsSorting]);
    var flatSortingMethod = React.useCallback(function (params) {
        var rowTree = (0, rows_1.gridRowTreeSelector)(apiRef);
        var rootGroupNode = rowTree[rows_1.GRID_ROOT_GROUP_ID];
        var sortedChildren = params.sortRowList
            ? params.sortRowList(rootGroupNode.children.map(function (childId) { return rowTree[childId]; }))
            : __spreadArray([], rootGroupNode.children, true);
        if (rootGroupNode.footerId != null) {
            sortedChildren.push(rootGroupNode.footerId);
        }
        return sortedChildren;
    }, [apiRef]);
    (0, pipeProcessing_1.useGridRegisterPipeProcessor)(apiRef, 'exportState', stateExportPreProcessing);
    (0, pipeProcessing_1.useGridRegisterPipeProcessor)(apiRef, 'restoreState', stateRestorePreProcessing);
    (0, strategyProcessing_1.useGridRegisterStrategyProcessor)(apiRef, strategyProcessing_1.GRID_DEFAULT_STRATEGY, 'sorting', flatSortingMethod);
    /**
     * EVENTS
     */
    var handleColumnHeaderClick = React.useCallback(function (_a, event) {
        var field = _a.field, colDef = _a.colDef;
        if (!colDef.sortable || props.disableColumnSorting) {
            return;
        }
        var allowMultipleSorting = props.multipleColumnsSortingMode === 'always' ||
            event.shiftKey ||
            event.metaKey ||
            event.ctrlKey;
        sortColumn(field, undefined, allowMultipleSorting);
    }, [sortColumn, props.disableColumnSorting, props.multipleColumnsSortingMode]);
    var handleColumnHeaderKeyDown = React.useCallback(function (_a, event) {
        var field = _a.field, colDef = _a.colDef;
        if (!colDef.sortable || props.disableColumnSorting) {
            return;
        }
        // Ctrl + Enter opens the column menu
        if (event.key === 'Enter' && !event.ctrlKey && !event.metaKey) {
            sortColumn(field, undefined, props.multipleColumnsSortingMode === 'always' || event.shiftKey);
        }
    }, [sortColumn, props.disableColumnSorting, props.multipleColumnsSortingMode]);
    var handleColumnsChange = React.useCallback(function () {
        // When the columns change we check that the sorted columns are still part of the dataset
        var sortModel = (0, gridSortingSelector_1.gridSortModelSelector)(apiRef);
        var latestColumns = (0, gridColumnsSelector_1.gridColumnLookupSelector)(apiRef);
        if (sortModel.length > 0) {
            var newModel = sortModel.filter(function (sortItem) { return latestColumns[sortItem.field]; });
            if (newModel.length < sortModel.length) {
                apiRef.current.setSortModel(newModel);
            }
        }
    }, [apiRef]);
    var handleStrategyProcessorChange = React.useCallback(function (methodName) {
        if (methodName === 'sorting') {
            apiRef.current.applySorting();
        }
    }, [apiRef]);
    (0, pipeProcessing_1.useGridRegisterPipeProcessor)(apiRef, 'columnMenu', addColumnMenuItem);
    (0, useGridEvent_1.useGridEvent)(apiRef, 'columnHeaderClick', handleColumnHeaderClick);
    (0, useGridEvent_1.useGridEvent)(apiRef, 'columnHeaderKeyDown', handleColumnHeaderKeyDown);
    (0, useGridEvent_1.useGridEvent)(apiRef, 'rowsSet', apiRef.current.applySorting);
    (0, useGridEvent_1.useGridEvent)(apiRef, 'columnsChange', handleColumnsChange);
    (0, useGridEvent_1.useGridEvent)(apiRef, 'activeStrategyProcessorChange', handleStrategyProcessorChange);
    /**
     * 1ST RENDER
     */
    (0, useFirstRender_1.useFirstRender)(function () {
        apiRef.current.applySorting();
    });
    /**
     * EFFECTS
     */
    (0, useEnhancedEffect_1.default)(function () {
        if (props.sortModel !== undefined) {
            apiRef.current.setSortModel(props.sortModel);
        }
    }, [apiRef, props.sortModel]);
};
exports.useGridSorting = useGridSorting;
