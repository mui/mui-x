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
exports.useGridFilter = exports.filterStateInitializer = void 0;
var React = require("react");
var lruMemoize_1 = require("@mui/x-internals/lruMemoize");
var useEnhancedEffect_1 = require("@mui/utils/useEnhancedEffect");
var isDeepEqual_1 = require("@mui/x-internals/isDeepEqual");
var useLazyRef_1 = require("../../utils/useLazyRef");
var useGridEvent_1 = require("../../utils/useGridEvent");
var useGridApiMethod_1 = require("../../utils/useGridApiMethod");
var useGridLogger_1 = require("../../utils/useGridLogger");
var gridColumnsSelector_1 = require("../columns/gridColumnsSelector");
var gridPreferencePanelsValue_1 = require("../preferencesPanel/gridPreferencePanelsValue");
var gridFilterState_1 = require("./gridFilterState");
var gridFilterSelector_1 = require("./gridFilterSelector");
var useFirstRender_1 = require("../../utils/useFirstRender");
var rows_1 = require("../rows");
var pipeProcessing_1 = require("../../core/pipeProcessing");
var strategyProcessing_1 = require("../../core/strategyProcessing");
var gridFilterUtils_1 = require("./gridFilterUtils");
var filterStateInitializer = function (state, props, apiRef) {
    var _a, _b, _c, _d;
    var filterModel = (_d = (_a = props.filterModel) !== null && _a !== void 0 ? _a : (_c = (_b = props.initialState) === null || _b === void 0 ? void 0 : _b.filter) === null || _c === void 0 ? void 0 : _c.filterModel) !== null && _d !== void 0 ? _d : (0, gridFilterState_1.getDefaultGridFilterModel)();
    return __assign(__assign({}, state), { filter: __assign({ filterModel: (0, gridFilterUtils_1.sanitizeFilterModel)(filterModel, props.disableMultipleColumnsFiltering, apiRef) }, gridFilterState_1.defaultGridFilterLookup), visibleRowsLookup: {} });
};
exports.filterStateInitializer = filterStateInitializer;
var getVisibleRowsLookup = function (params) {
    // For flat tree, the `visibleRowsLookup` and the `filteredRowsLookup` are equals since no row is collapsed.
    return params.filteredRowsLookup;
};
function getVisibleRowsLookupState(apiRef, state) {
    return apiRef.current.applyStrategyProcessor('visibleRowsLookupCreation', {
        tree: state.rows.tree,
        filteredRowsLookup: state.filter.filteredRowsLookup,
    });
}
function createMemoizedValues() {
    return (0, lruMemoize_1.lruMemoize)(Object.values);
}
/**
 * @requires useGridColumns (method, event)
 * @requires useGridParamsApi (method)
 * @requires useGridRows (event)
 */
var useGridFilter = function (apiRef, props) {
    var _a, _b, _c;
    var logger = (0, useGridLogger_1.useGridLogger)(apiRef, 'useGridFilter');
    apiRef.current.registerControlState({
        stateId: 'filter',
        propModel: props.filterModel,
        propOnChange: props.onFilterModelChange,
        stateSelector: gridFilterSelector_1.gridFilterModelSelector,
        changeEvent: 'filterModelChange',
    });
    var updateFilteredRows = React.useCallback(function () {
        apiRef.current.setState(function (state) {
            var filterModel = (0, gridFilterSelector_1.gridFilterModelSelector)(apiRef);
            var filterState = apiRef.current.getFilterState(filterModel);
            var newState = __assign(__assign({}, state), { filter: __assign(__assign({}, state.filter), filterState) });
            var visibleRowsLookupState = getVisibleRowsLookupState(apiRef, newState);
            return __assign(__assign({}, newState), { visibleRowsLookup: visibleRowsLookupState });
        });
        apiRef.current.publishEvent('filteredRowsSet');
    }, [apiRef]);
    var addColumnMenuItem = React.useCallback(function (columnMenuItems, colDef) {
        if (colDef == null || colDef.filterable === false || props.disableColumnFilter) {
            return columnMenuItems;
        }
        return __spreadArray(__spreadArray([], columnMenuItems, true), ['columnMenuFilterItem'], false);
    }, [props.disableColumnFilter]);
    /**
     * API METHODS
     */
    var upsertFilterItem = React.useCallback(function (item) {
        var filterModel = (0, gridFilterSelector_1.gridFilterModelSelector)(apiRef);
        var items = __spreadArray([], filterModel.items, true);
        var itemIndex = items.findIndex(function (filterItem) { return filterItem.id === item.id; });
        if (itemIndex === -1) {
            items.push(item);
        }
        else {
            items[itemIndex] = item;
        }
        apiRef.current.setFilterModel(__assign(__assign({}, filterModel), { items: items }), 'upsertFilterItem');
    }, [apiRef]);
    var upsertFilterItems = React.useCallback(function (items) {
        var filterModel = (0, gridFilterSelector_1.gridFilterModelSelector)(apiRef);
        var existingItems = __spreadArray([], filterModel.items, true);
        items.forEach(function (item) {
            var itemIndex = existingItems.findIndex(function (filterItem) { return filterItem.id === item.id; });
            if (itemIndex === -1) {
                existingItems.push(item);
            }
            else {
                existingItems[itemIndex] = item;
            }
        });
        apiRef.current.setFilterModel(__assign(__assign({}, filterModel), { items: existingItems }), 'upsertFilterItems');
    }, [apiRef]);
    var deleteFilterItem = React.useCallback(function (itemToDelete) {
        var filterModel = (0, gridFilterSelector_1.gridFilterModelSelector)(apiRef);
        var items = filterModel.items.filter(function (item) { return item.id !== itemToDelete.id; });
        if (items.length === filterModel.items.length) {
            return;
        }
        apiRef.current.setFilterModel(__assign(__assign({}, filterModel), { items: items }), 'deleteFilterItem');
    }, [apiRef]);
    var showFilterPanel = React.useCallback(function (targetColumnField, panelId, labelId) {
        logger.debug('Displaying filter panel');
        if (targetColumnField) {
            var filterModel = (0, gridFilterSelector_1.gridFilterModelSelector)(apiRef);
            var filterItemsWithValue = filterModel.items.filter(function (item) {
                var _a;
                if (item.value !== undefined) {
                    // Some filters like `isAnyOf` support array as `item.value`.
                    // If array is empty, we want to remove it from the filter model.
                    if (Array.isArray(item.value) && item.value.length === 0) {
                        return false;
                    }
                    return true;
                }
                var column = apiRef.current.getColumn(item.field);
                var filterOperator = (_a = column.filterOperators) === null || _a === void 0 ? void 0 : _a.find(function (operator) { return operator.value === item.operator; });
                var requiresFilterValue = typeof (filterOperator === null || filterOperator === void 0 ? void 0 : filterOperator.requiresFilterValue) === 'undefined'
                    ? true
                    : filterOperator === null || filterOperator === void 0 ? void 0 : filterOperator.requiresFilterValue;
                // Operators like `isEmpty` don't have and don't require `item.value`.
                // So we don't want to remove them from the filter model if `item.value === undefined`.
                // See https://github.com/mui/mui-x/issues/5402
                if (requiresFilterValue) {
                    return false;
                }
                return true;
            });
            var newFilterItems = void 0;
            var filterItemOnTarget = filterItemsWithValue.find(function (item) { return item.field === targetColumnField; });
            var targetColumn = apiRef.current.getColumn(targetColumnField);
            if (filterItemOnTarget) {
                newFilterItems = filterItemsWithValue;
            }
            else if (props.disableMultipleColumnsFiltering) {
                newFilterItems = [
                    (0, gridFilterUtils_1.cleanFilterItem)({ field: targetColumnField, operator: targetColumn.filterOperators[0].value }, apiRef),
                ];
            }
            else {
                newFilterItems = __spreadArray(__spreadArray([], filterItemsWithValue, true), [
                    (0, gridFilterUtils_1.cleanFilterItem)({ field: targetColumnField, operator: targetColumn.filterOperators[0].value }, apiRef),
                ], false);
            }
            apiRef.current.setFilterModel(__assign(__assign({}, filterModel), { items: newFilterItems }));
        }
        apiRef.current.showPreferences(gridPreferencePanelsValue_1.GridPreferencePanelsValue.filters, panelId, labelId);
    }, [apiRef, logger, props.disableMultipleColumnsFiltering]);
    var hideFilterPanel = React.useCallback(function () {
        logger.debug('Hiding filter panel');
        apiRef.current.hidePreferences();
    }, [apiRef, logger]);
    var setFilterLogicOperator = React.useCallback(function (logicOperator) {
        var filterModel = (0, gridFilterSelector_1.gridFilterModelSelector)(apiRef);
        if (filterModel.logicOperator === logicOperator) {
            return;
        }
        apiRef.current.setFilterModel(__assign(__assign({}, filterModel), { logicOperator: logicOperator }), 'changeLogicOperator');
    }, [apiRef]);
    var setQuickFilterValues = React.useCallback(function (values) {
        var filterModel = (0, gridFilterSelector_1.gridFilterModelSelector)(apiRef);
        if ((0, isDeepEqual_1.isDeepEqual)(filterModel.quickFilterValues, values)) {
            return;
        }
        apiRef.current.setFilterModel(__assign(__assign({}, filterModel), { quickFilterValues: __spreadArray([], values, true) }));
    }, [apiRef]);
    var setFilterModel = React.useCallback(function (model, reason) {
        var currentModel = (0, gridFilterSelector_1.gridFilterModelSelector)(apiRef);
        if (currentModel !== model) {
            logger.debug('Setting filter model');
            apiRef.current.updateControlState('filter', (0, gridFilterUtils_1.mergeStateWithFilterModel)(model, props.disableMultipleColumnsFiltering, apiRef), reason);
            apiRef.current.unstable_applyFilters();
        }
    }, [apiRef, logger, props.disableMultipleColumnsFiltering]);
    var getFilterState = React.useCallback(function (inputFilterModel) {
        var filterModel = (0, gridFilterUtils_1.sanitizeFilterModel)(inputFilterModel, props.disableMultipleColumnsFiltering, apiRef);
        var isRowMatchingFilters = props.filterMode === 'client'
            ? (0, gridFilterUtils_1.buildAggregatedFilterApplier)(filterModel, apiRef, props.disableEval)
            : null;
        var filterResult = apiRef.current.applyStrategyProcessor('filtering', {
            isRowMatchingFilters: isRowMatchingFilters,
            filterModel: filterModel !== null && filterModel !== void 0 ? filterModel : (0, gridFilterState_1.getDefaultGridFilterModel)(),
        });
        return __assign(__assign({}, filterResult), { filterModel: filterModel });
    }, [props.disableMultipleColumnsFiltering, props.filterMode, props.disableEval, apiRef]);
    var filterApi = {
        setFilterLogicOperator: setFilterLogicOperator,
        unstable_applyFilters: updateFilteredRows,
        deleteFilterItem: deleteFilterItem,
        upsertFilterItem: upsertFilterItem,
        upsertFilterItems: upsertFilterItems,
        setFilterModel: setFilterModel,
        showFilterPanel: showFilterPanel,
        hideFilterPanel: hideFilterPanel,
        setQuickFilterValues: setQuickFilterValues,
        ignoreDiacritics: props.ignoreDiacritics,
        getFilterState: getFilterState,
    };
    (0, useGridApiMethod_1.useGridApiMethod)(apiRef, filterApi, 'public');
    /**
     * PRE-PROCESSING
     */
    var stateExportPreProcessing = React.useCallback(function (prevState, context) {
        var _a, _b;
        var filterModelToExport = (0, gridFilterSelector_1.gridFilterModelSelector)(apiRef);
        // Remove the additional `fromInput` property from the filter model
        filterModelToExport.items.forEach(function (item) {
            delete item.fromInput;
        });
        var shouldExportFilterModel = 
        // Always export if the `exportOnlyDirtyModels` property is not activated
        !context.exportOnlyDirtyModels ||
            // Always export if the model is controlled
            props.filterModel != null ||
            // Always export if the model has been initialized
            ((_b = (_a = props.initialState) === null || _a === void 0 ? void 0 : _a.filter) === null || _b === void 0 ? void 0 : _b.filterModel) != null ||
            // Export if the model is not equal to the default value
            !(0, isDeepEqual_1.isDeepEqual)(filterModelToExport, (0, gridFilterState_1.getDefaultGridFilterModel)());
        if (!shouldExportFilterModel) {
            return prevState;
        }
        return __assign(__assign({}, prevState), { filter: {
                filterModel: filterModelToExport,
            } });
    }, [apiRef, props.filterModel, (_b = (_a = props.initialState) === null || _a === void 0 ? void 0 : _a.filter) === null || _b === void 0 ? void 0 : _b.filterModel]);
    var stateRestorePreProcessing = React.useCallback(function (params, context) {
        var _a;
        var filterModel = (_a = context.stateToRestore.filter) === null || _a === void 0 ? void 0 : _a.filterModel;
        if (filterModel == null) {
            return params;
        }
        apiRef.current.updateControlState('filter', (0, gridFilterUtils_1.mergeStateWithFilterModel)(filterModel, props.disableMultipleColumnsFiltering, apiRef), 'restoreState');
        return __assign(__assign({}, params), { callbacks: __spreadArray(__spreadArray([], params.callbacks, true), [apiRef.current.unstable_applyFilters], false) });
    }, [apiRef, props.disableMultipleColumnsFiltering]);
    var preferencePanelPreProcessing = React.useCallback(function (initialValue, value) {
        var _a;
        if (value === gridPreferencePanelsValue_1.GridPreferencePanelsValue.filters) {
            var FilterPanel = props.slots.filterPanel;
            return <FilterPanel {...(_a = props.slotProps) === null || _a === void 0 ? void 0 : _a.filterPanel}/>;
        }
        return initialValue;
    }, [props.slots.filterPanel, (_c = props.slotProps) === null || _c === void 0 ? void 0 : _c.filterPanel]);
    var getRowId = props.getRowId;
    var getRowsRef = (0, useLazyRef_1.useLazyRef)(createMemoizedValues);
    var flatFilteringMethod = React.useCallback(function (params) {
        var _a;
        if (props.filterMode !== 'client' ||
            !params.isRowMatchingFilters ||
            (!params.filterModel.items.length && !((_a = params.filterModel.quickFilterValues) === null || _a === void 0 ? void 0 : _a.length))) {
            return gridFilterState_1.defaultGridFilterLookup;
        }
        var dataRowIdToModelLookup = (0, rows_1.gridRowsLookupSelector)(apiRef);
        var filteredRowsLookup = {};
        var isRowMatchingFilters = params.isRowMatchingFilters;
        var filterCache = {};
        var result = {
            passingFilterItems: null,
            passingQuickFilterValues: null,
        };
        var rows = getRowsRef.current(apiRef.current.state.rows.dataRowIdToModelLookup);
        for (var i = 0; i < rows.length; i += 1) {
            var row = rows[i];
            var id = getRowId ? getRowId(row) : row.id;
            isRowMatchingFilters(row, undefined, result);
            var isRowPassing = (0, gridFilterUtils_1.passFilterLogic)([result.passingFilterItems], [result.passingQuickFilterValues], params.filterModel, apiRef, filterCache);
            if (!isRowPassing) {
                filteredRowsLookup[id] = isRowPassing;
            }
        }
        var footerId = 'auto-generated-group-footer-root';
        var footer = dataRowIdToModelLookup[footerId];
        if (footer) {
            filteredRowsLookup[footerId] = true;
        }
        return {
            filteredRowsLookup: filteredRowsLookup,
            filteredChildrenCountLookup: {},
            filteredDescendantCountLookup: {},
        };
    }, [apiRef, props.filterMode, getRowId, getRowsRef]);
    (0, pipeProcessing_1.useGridRegisterPipeProcessor)(apiRef, 'columnMenu', addColumnMenuItem);
    (0, pipeProcessing_1.useGridRegisterPipeProcessor)(apiRef, 'exportState', stateExportPreProcessing);
    (0, pipeProcessing_1.useGridRegisterPipeProcessor)(apiRef, 'restoreState', stateRestorePreProcessing);
    (0, pipeProcessing_1.useGridRegisterPipeProcessor)(apiRef, 'preferencePanel', preferencePanelPreProcessing);
    (0, strategyProcessing_1.useGridRegisterStrategyProcessor)(apiRef, strategyProcessing_1.GRID_DEFAULT_STRATEGY, 'filtering', flatFilteringMethod);
    (0, strategyProcessing_1.useGridRegisterStrategyProcessor)(apiRef, strategyProcessing_1.GRID_DEFAULT_STRATEGY, 'visibleRowsLookupCreation', getVisibleRowsLookup);
    /**
     * EVENTS
     */
    var handleColumnsChange = React.useCallback(function () {
        logger.debug('onColUpdated - GridColumns changed, applying filters');
        var filterModel = (0, gridFilterSelector_1.gridFilterModelSelector)(apiRef);
        var columnsLookup = (0, gridColumnsSelector_1.gridColumnLookupSelector)(apiRef);
        var newFilterItems = filterModel.items.filter(function (item) { return item.field && columnsLookup[item.field]; });
        if (newFilterItems.length < filterModel.items.length) {
            apiRef.current.setFilterModel(__assign(__assign({}, filterModel), { items: newFilterItems }));
        }
    }, [apiRef, logger]);
    var handleStrategyProcessorChange = React.useCallback(function (methodName) {
        if (methodName === 'filtering') {
            apiRef.current.unstable_applyFilters();
        }
    }, [apiRef]);
    var updateVisibleRowsLookupState = React.useCallback(function () {
        apiRef.current.setState(function (state) {
            return __assign(__assign({}, state), { visibleRowsLookup: getVisibleRowsLookupState(apiRef, state) });
        });
    }, [apiRef]);
    (0, useGridEvent_1.useGridEvent)(apiRef, 'rowsSet', updateFilteredRows);
    (0, useGridEvent_1.useGridEvent)(apiRef, 'columnsChange', handleColumnsChange);
    (0, useGridEvent_1.useGridEvent)(apiRef, 'activeStrategyProcessorChange', handleStrategyProcessorChange);
    (0, useGridEvent_1.useGridEvent)(apiRef, 'rowExpansionChange', updateVisibleRowsLookupState);
    (0, useGridEvent_1.useGridEvent)(apiRef, 'columnVisibilityModelChange', function () {
        var _a;
        var filterModel = (0, gridFilterSelector_1.gridFilterModelSelector)(apiRef);
        if (((_a = filterModel.quickFilterValues) === null || _a === void 0 ? void 0 : _a.length) &&
            (0, gridFilterUtils_1.shouldQuickFilterExcludeHiddenColumns)(filterModel)) {
            // re-apply filters because the quick filter results may have changed
            updateFilteredRows();
        }
    });
    /**
     * 1ST RENDER
     */
    (0, useFirstRender_1.useFirstRender)(function () {
        updateFilteredRows();
    });
    /**
     * EFFECTS
     */
    (0, useEnhancedEffect_1.default)(function () {
        if (props.filterModel !== undefined) {
            apiRef.current.setFilterModel(props.filterModel);
        }
    }, [apiRef, logger, props.filterModel]);
};
exports.useGridFilter = useGridFilter;
