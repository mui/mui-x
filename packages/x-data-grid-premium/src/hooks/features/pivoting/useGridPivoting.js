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
exports.useGridPivotingExportState = exports.useGridPivoting = exports.pivotingStateInitializer = void 0;
var React = require("react");
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var useEnhancedEffect_1 = require("@mui/utils/useEnhancedEffect");
var useOnMount_1 = require("@mui/utils/useOnMount");
var internals_1 = require("@mui/x-data-grid-pro/internals");
var pivotPanel_1 = require("../../../components/pivotPanel");
var gridPivotingSelectors_1 = require("./gridPivotingSelectors");
var utils_1 = require("./utils");
var gridAggregationUtils_1 = require("../aggregation/gridAggregationUtils");
var sidebar_1 = require("../sidebar");
var emptyPivotModel = { rows: [], columns: [], values: [] };
var pivotingStateInitializer = function (state, props, apiRef) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    apiRef.current.caches.pivoting = {
        exportedStateRef: {
            current: null,
        },
        nonPivotDataRef: {
            current: undefined,
        },
    };
    if (!(0, utils_1.isPivotingAvailable)(props)) {
        return __assign(__assign({}, state), { pivoting: {
                active: false,
                model: emptyPivotModel,
            } });
    }
    var initialColumns = (0, utils_1.getInitialColumns)((_a = props.columns) !== null && _a !== void 0 ? _a : [], props.getPivotDerivedColumns, apiRef.current.getLocaleText);
    var open = (_e = (_b = props.pivotPanelOpen) !== null && _b !== void 0 ? _b : (_d = (_c = props.initialState) === null || _c === void 0 ? void 0 : _c.pivoting) === null || _d === void 0 ? void 0 : _d.panelOpen) !== null && _e !== void 0 ? _e : false;
    var sidebarStateUpdate = open
        ? {
            open: open,
            value: sidebar_1.GridSidebarValue.Pivot,
        }
        : {};
    return __assign(__assign({}, state), { pivoting: {
            active: (_j = (_f = props.pivotActive) !== null && _f !== void 0 ? _f : (_h = (_g = props.initialState) === null || _g === void 0 ? void 0 : _g.pivoting) === null || _h === void 0 ? void 0 : _h.enabled) !== null && _j !== void 0 ? _j : false,
            model: (_o = (_k = props.pivotModel) !== null && _k !== void 0 ? _k : (_m = (_l = props.initialState) === null || _l === void 0 ? void 0 : _l.pivoting) === null || _m === void 0 ? void 0 : _m.model) !== null && _o !== void 0 ? _o : emptyPivotModel,
            initialColumns: initialColumns,
        }, sidebar: __assign(__assign({}, state.sidebar), sidebarStateUpdate) });
};
exports.pivotingStateInitializer = pivotingStateInitializer;
var useGridPivoting = function (apiRef, props, originalColumnsProp, originalRowsProp) {
    var isPivotActive = (0, internals_1.useGridSelector)(apiRef, gridPivotingSelectors_1.gridPivotActiveSelector);
    var _a = apiRef.current.caches.pivoting, exportedStateRef = _a.exportedStateRef, nonPivotDataRef = _a.nonPivotDataRef;
    var isPivotingAvailable = (0, utils_1.isPivotingAvailable)(props);
    apiRef.current.registerControlState({
        stateId: 'pivotModel',
        propModel: props.pivotModel,
        propOnChange: props.onPivotModelChange,
        stateSelector: gridPivotingSelectors_1.gridPivotModelSelector,
        changeEvent: 'pivotModelChange',
    });
    apiRef.current.registerControlState({
        stateId: 'pivotMode',
        propModel: props.pivotActive,
        propOnChange: props.onPivotActiveChange,
        stateSelector: gridPivotingSelectors_1.gridPivotActiveSelector,
        changeEvent: 'pivotModeChange',
    });
    apiRef.current.registerControlState({
        stateId: 'pivotPanelOpen',
        propModel: props.pivotPanelOpen,
        propOnChange: props.onPivotPanelOpenChange,
        stateSelector: gridPivotingSelectors_1.gridPivotPanelOpenSelector,
        changeEvent: 'pivotPanelOpenChange',
    });
    var getInitialData = React.useCallback(function () {
        if (!exportedStateRef.current) {
            exportedStateRef.current = apiRef.current.exportState();
        }
        var rowIds = (0, x_data_grid_pro_1.gridDataRowIdsSelector)(apiRef);
        var rowsLookup = (0, x_data_grid_pro_1.gridRowsLookupSelector)(apiRef);
        var rows = rowIds.map(function (id) { return rowsLookup[id]; });
        var initialColumns = (0, utils_1.getInitialColumns)(originalColumnsProp, props.getPivotDerivedColumns, apiRef.current.getLocaleText);
        return { rows: rows, columns: initialColumns, originalRowsProp: originalRowsProp };
    }, [
        apiRef,
        props.getPivotDerivedColumns,
        originalColumnsProp,
        originalRowsProp,
        exportedStateRef,
    ]);
    var computePivotingState = React.useCallback(function (_a) {
        var active = _a.active, pivotModel = _a.model;
        if (active && pivotModel) {
            var _b = nonPivotDataRef.current || { rows: [], columns: new Map() }, rows = _b.rows, columns = _b.columns;
            return {
                initialColumns: columns,
                // TODO: fix getPivotedData called twice in controlled mode
                propsOverrides: (0, utils_1.getPivotedData)({
                    rows: rows,
                    columns: columns,
                    pivotModel: pivotModel,
                    apiRef: apiRef,
                    pivotingColDef: props.pivotingColDef,
                    groupingColDef: props.groupingColDef,
                }),
            };
        }
        return undefined;
    }, [apiRef, props.pivotingColDef, props.groupingColDef, nonPivotDataRef]);
    (0, useOnMount_1.default)(function () {
        var _a;
        if (!isPivotingAvailable || !isPivotActive) {
            return undefined;
        }
        nonPivotDataRef.current = getInitialData();
        var isLoading = (_a = (0, x_data_grid_pro_1.gridRowsLoadingSelector)(apiRef)) !== null && _a !== void 0 ? _a : false;
        if (isLoading) {
            return undefined;
        }
        apiRef.current.setState(function (state) {
            var pivotingState = __assign(__assign({}, state.pivoting), computePivotingState(state.pivoting));
            return __assign(__assign({}, state), { pivoting: pivotingState });
        });
        return undefined;
    });
    (0, useEnhancedEffect_1.default)(function () {
        if (!isPivotingAvailable || !isPivotActive) {
            if (nonPivotDataRef.current) {
                // Prevent rows from being resynced from the original rows prop
                apiRef.current.caches.rows.rowsBeforePartialUpdates =
                    nonPivotDataRef.current.originalRowsProp;
                apiRef.current.setRows(nonPivotDataRef.current.rows);
                nonPivotDataRef.current = undefined;
            }
            if (exportedStateRef.current) {
                apiRef.current.restoreState(exportedStateRef.current);
                exportedStateRef.current = null;
            }
        }
    }, [isPivotActive, apiRef, isPivotingAvailable, nonPivotDataRef, exportedStateRef]);
    var setPivotModel = React.useCallback(function (callback) {
        if (!isPivotingAvailable) {
            return;
        }
        apiRef.current.setState(function (state) {
            var _a, _b;
            var newPivotModel = typeof callback === 'function' ? callback((_a = state.pivoting) === null || _a === void 0 ? void 0 : _a.model) : callback;
            if (((_b = state.pivoting) === null || _b === void 0 ? void 0 : _b.model) === newPivotModel) {
                return state;
            }
            var newPivotingState = __assign(__assign(__assign({}, state.pivoting), computePivotingState(__assign(__assign({}, state.pivoting), { model: newPivotModel }))), { model: newPivotModel });
            return __assign(__assign({}, state), { pivoting: newPivotingState });
        });
    }, [apiRef, computePivotingState, isPivotingAvailable]);
    var updatePivotModel = React.useCallback(function (_a) {
        var field = _a.field, targetSection = _a.targetSection, originSection = _a.originSection, targetField = _a.targetField, targetFieldPosition = _a.targetFieldPosition;
        if (field === targetField) {
            return;
        }
        apiRef.current.setPivotModel(function (prev) {
            var _a, _b, _c, _d;
            var newModel = __assign({}, prev);
            var isSameSection = targetSection === originSection;
            var hidden = originSection === null
                ? false
                : ((_b = (_a = prev[originSection].find(function (item) { return item.field === field; })) === null || _a === void 0 ? void 0 : _a.hidden) !== null && _b !== void 0 ? _b : false);
            if (targetSection) {
                var newSectionArray = __spreadArray([], prev[targetSection], true);
                var toIndex = newSectionArray.length;
                if (targetField) {
                    var fromIndex = newSectionArray.findIndex(function (item) { return item.field === field; });
                    if (fromIndex > -1) {
                        newSectionArray.splice(fromIndex, 1);
                    }
                    toIndex = newSectionArray.findIndex(function (item) { return item.field === targetField; });
                    if (targetFieldPosition === 'bottom') {
                        toIndex += 1;
                    }
                }
                if (targetSection === 'values') {
                    var initialColumns = (0, internals_1.gridPivotInitialColumnsSelector)(apiRef);
                    var aggFunc = isSameSection
                        ? (_c = prev.values.find(function (item) { return item.field === field; })) === null || _c === void 0 ? void 0 : _c.aggFunc
                        : (0, gridAggregationUtils_1.getAvailableAggregationFunctions)({
                            aggregationFunctions: props.aggregationFunctions,
                            colDef: initialColumns.get(field),
                            isDataSource: false,
                        })[0];
                    newSectionArray.splice(toIndex, 0, {
                        field: field,
                        aggFunc: aggFunc,
                        hidden: hidden,
                    });
                    newModel.values = newSectionArray;
                }
                else if (targetSection === 'columns') {
                    var sort = isSameSection
                        ? (_d = prev.columns.find(function (item) { return item.field === field; })) === null || _d === void 0 ? void 0 : _d.sort
                        : undefined;
                    newSectionArray.splice(toIndex, 0, { field: field, sort: sort, hidden: hidden });
                    newModel.columns = newSectionArray;
                }
                else if (targetSection === 'rows') {
                    newSectionArray.splice(toIndex, 0, { field: field, hidden: hidden });
                    newModel.rows = newSectionArray;
                }
            }
            if (!isSameSection && originSection) {
                newModel[originSection] = prev[originSection].filter(function (f) { return f.field !== field; });
            }
            return newModel;
        });
    }, [apiRef, props.aggregationFunctions]);
    var setPivotActive = React.useCallback(function (callback) {
        if (!isPivotingAvailable) {
            return;
        }
        apiRef.current.setState(function (state) {
            var _a, _b;
            var newPivotMode = typeof callback === 'function' ? callback((_a = state.pivoting) === null || _a === void 0 ? void 0 : _a.active) : callback;
            if (((_b = state.pivoting) === null || _b === void 0 ? void 0 : _b.active) === newPivotMode) {
                return state;
            }
            if (newPivotMode) {
                nonPivotDataRef.current = getInitialData();
            }
            var newPivotingState = __assign(__assign(__assign({}, state.pivoting), computePivotingState(__assign(__assign({}, state.pivoting), { active: newPivotMode }))), { active: newPivotMode });
            var newState = __assign(__assign({}, state), { pivoting: newPivotingState });
            return newState;
        });
        apiRef.current.selectRows([], false, true);
    }, [apiRef, computePivotingState, getInitialData, isPivotingAvailable, nonPivotDataRef]);
    var setPivotPanelOpen = React.useCallback(function (callback) {
        if (!isPivotingAvailable) {
            return;
        }
        var panelOpen = (0, gridPivotingSelectors_1.gridPivotPanelOpenSelector)(apiRef);
        var newPanelOpen = typeof callback === 'function' ? callback(panelOpen) : callback;
        if (panelOpen === newPanelOpen) {
            return;
        }
        if (newPanelOpen) {
            apiRef.current.showSidebar(sidebar_1.GridSidebarValue.Pivot);
        }
        else {
            apiRef.current.hideSidebar();
        }
    }, [apiRef, isPivotingAvailable]);
    var addColumnMenuButton = React.useCallback(function (menuItems) {
        if (isPivotingAvailable) {
            return __spreadArray(__spreadArray([], menuItems, true), ['columnMenuPivotItem'], false);
        }
        return menuItems;
    }, [isPivotingAvailable]);
    (0, internals_1.useGridRegisterPipeProcessor)(apiRef, 'columnMenu', addColumnMenuButton);
    var updateNonPivotColumns = React.useCallback(function (columns, keepPreviousColumns) {
        if (keepPreviousColumns === void 0) { keepPreviousColumns = true; }
        if (!nonPivotDataRef.current || !isPivotingAvailable) {
            return;
        }
        if (keepPreviousColumns) {
            (0, utils_1.getInitialColumns)(columns, props.getPivotDerivedColumns, apiRef.current.getLocaleText).forEach(function (col) {
                nonPivotDataRef.current.columns.set(col.field, col);
            });
        }
        else {
            nonPivotDataRef.current.columns = (0, utils_1.getInitialColumns)(columns, props.getPivotDerivedColumns, apiRef.current.getLocaleText);
        }
        apiRef.current.setState(function (state) {
            var _a;
            return __assign(__assign({}, state), { pivoting: __assign(__assign(__assign({}, state.pivoting), computePivotingState(state.pivoting)), { initialColumns: (_a = nonPivotDataRef.current) === null || _a === void 0 ? void 0 : _a.columns }) });
        });
    }, [
        isPivotingAvailable,
        apiRef,
        props.getPivotDerivedColumns,
        computePivotingState,
        nonPivotDataRef,
    ]);
    var updateNonPivotRows = React.useCallback(function (rows, keepPreviousRows) {
        if (keepPreviousRows === void 0) { keepPreviousRows = true; }
        if (!nonPivotDataRef.current || !isPivotingAvailable || !rows || rows.length === 0) {
            return;
        }
        if (keepPreviousRows) {
            var rowsMap_1 = new Map();
            nonPivotDataRef.current.rows.forEach(function (row) {
                rowsMap_1.set((0, x_data_grid_pro_1.gridRowIdSelector)(apiRef, row), row);
            });
            rows.forEach(function (row) {
                var rowId = (0, x_data_grid_pro_1.gridRowIdSelector)(apiRef, row);
                // eslint-disable-next-line no-underscore-dangle
                if (row._action === 'delete') {
                    rowsMap_1.delete(rowId);
                }
                else {
                    rowsMap_1.set(rowId, row);
                }
            });
            nonPivotDataRef.current.rows = Array.from(rowsMap_1.values());
        }
        else {
            nonPivotDataRef.current.rows = rows;
        }
        apiRef.current.setState(function (state) {
            return __assign(__assign({}, state), { pivoting: __assign(__assign({}, state.pivoting), computePivotingState(state.pivoting)) });
        });
    }, [apiRef, computePivotingState, isPivotingAvailable, nonPivotDataRef]);
    var addPivotingPanel = React.useCallback(function (initialValue, value) {
        if (isPivotingAvailable && value === sidebar_1.GridSidebarValue.Pivot) {
            return <pivotPanel_1.GridPivotPanel />;
        }
        return initialValue;
    }, [isPivotingAvailable]);
    (0, internals_1.useGridRegisterPipeProcessor)(apiRef, 'sidebar', addPivotingPanel);
    (0, internals_1.useGridApiMethod)(apiRef, { setPivotModel: setPivotModel, setPivotActive: setPivotActive, setPivotPanelOpen: setPivotPanelOpen }, 'public');
    (0, internals_1.useGridApiMethod)(apiRef, { updatePivotModel: updatePivotModel, updateNonPivotColumns: updateNonPivotColumns, updateNonPivotRows: updateNonPivotRows }, 'private');
    (0, useEnhancedEffect_1.default)(function () {
        apiRef.current.updateNonPivotColumns(originalColumnsProp, false);
    }, [originalColumnsProp, apiRef]);
    (0, useEnhancedEffect_1.default)(function () {
        apiRef.current.updateNonPivotRows(originalRowsProp, false);
        if (nonPivotDataRef.current) {
            nonPivotDataRef.current.originalRowsProp = originalRowsProp;
        }
    }, [originalRowsProp, apiRef, nonPivotDataRef]);
    (0, useEnhancedEffect_1.default)(function () {
        if (props.pivotModel !== undefined) {
            apiRef.current.setPivotModel(props.pivotModel);
        }
    }, [apiRef, props.pivotModel]);
    (0, useEnhancedEffect_1.default)(function () {
        if (props.pivotActive !== undefined) {
            apiRef.current.setPivotActive(props.pivotActive);
        }
    }, [apiRef, props.pivotActive]);
    (0, useEnhancedEffect_1.default)(function () {
        if (props.pivotPanelOpen !== undefined) {
            apiRef.current.setPivotPanelOpen(props.pivotPanelOpen);
        }
    }, [apiRef, props.pivotPanelOpen]);
};
exports.useGridPivoting = useGridPivoting;
var useGridPivotingExportState = function (apiRef) {
    var stateExportPreProcessing = React.useCallback(function (state) {
        var isPivotActive = (0, gridPivotingSelectors_1.gridPivotActiveSelector)(apiRef);
        if (!isPivotActive) {
            return state;
        }
        // To-do: implement context.exportOnlyDirtyModels
        var newState = __assign(__assign(__assign({}, state), apiRef.current.caches.pivoting.exportedStateRef.current), { sorting: state.sorting });
        return newState;
    }, [apiRef]);
    (0, internals_1.useGridRegisterPipeProcessor)(apiRef, 'exportState', stateExportPreProcessing);
};
exports.useGridPivotingExportState = useGridPivotingExportState;
