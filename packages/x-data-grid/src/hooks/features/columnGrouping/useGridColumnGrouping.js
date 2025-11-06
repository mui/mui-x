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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGridColumnGrouping = exports.columnGroupsStateInitializer = void 0;
var React = require("react");
var gridColumnGroupsSelector_1 = require("./gridColumnGroupsSelector");
var useGridApiMethod_1 = require("../../utils/useGridApiMethod");
var gridColumnGroupsUtils_1 = require("./gridColumnGroupsUtils");
var useGridEvent_1 = require("../../utils/useGridEvent");
var columns_1 = require("../columns");
var columnGroupsStateInitializer = function (state, props, apiRef) {
    var _a, _b, _c;
    apiRef.current.caches.columnGrouping = {
        lastColumnGroupingModel: props.columnGroupingModel,
    };
    if (!props.columnGroupingModel) {
        return state;
    }
    var columnFields = (0, columns_1.gridColumnFieldsSelector)(apiRef);
    var visibleColumnFields = (0, columns_1.gridVisibleColumnFieldsSelector)(apiRef);
    var groupLookup = (0, gridColumnGroupsUtils_1.createGroupLookup)((_a = props.columnGroupingModel) !== null && _a !== void 0 ? _a : []);
    var unwrappedGroupingModel = (0, gridColumnGroupsUtils_1.unwrapGroupingColumnModel)((_b = props.columnGroupingModel) !== null && _b !== void 0 ? _b : []);
    var columnGroupsHeaderStructure = (0, gridColumnGroupsUtils_1.getColumnGroupsHeaderStructure)(columnFields, unwrappedGroupingModel, (_c = apiRef.current.state.pinnedColumns) !== null && _c !== void 0 ? _c : {});
    var maxDepth = visibleColumnFields.length === 0
        ? 0
        : Math.max.apply(Math, visibleColumnFields.map(function (field) { var _a, _b; return (_b = (_a = unwrappedGroupingModel[field]) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0; }));
    return __assign(__assign({}, state), { columnGrouping: {
            lookup: groupLookup,
            unwrappedGroupingModel: unwrappedGroupingModel,
            headerStructure: columnGroupsHeaderStructure,
            maxDepth: maxDepth,
        } });
};
exports.columnGroupsStateInitializer = columnGroupsStateInitializer;
/**
 * @requires useGridColumns (method, event)
 * @requires useGridParamsApi (method)
 */
var useGridColumnGrouping = function (apiRef, props) {
    /**
     * API METHODS
     */
    var getColumnGroupPath = React.useCallback(function (field) {
        var _a;
        var unwrappedGroupingModel = (0, gridColumnGroupsSelector_1.gridColumnGroupsUnwrappedModelSelector)(apiRef);
        return (_a = unwrappedGroupingModel[field]) !== null && _a !== void 0 ? _a : [];
    }, [apiRef]);
    var getAllGroupDetails = React.useCallback(function () {
        var columnGroupLookup = (0, gridColumnGroupsSelector_1.gridColumnGroupsLookupSelector)(apiRef);
        return columnGroupLookup;
    }, [apiRef]);
    var columnGroupingApi = {
        getColumnGroupPath: getColumnGroupPath,
        getAllGroupDetails: getAllGroupDetails,
    };
    (0, useGridApiMethod_1.useGridApiMethod)(apiRef, columnGroupingApi, 'public');
    var handleColumnIndexChange = React.useCallback(function () {
        var _a;
        var unwrappedGroupingModel = (0, gridColumnGroupsUtils_1.unwrapGroupingColumnModel)((_a = props.columnGroupingModel) !== null && _a !== void 0 ? _a : []);
        apiRef.current.setState(function (state) {
            var _a, _b, _c;
            var orderedFields = (_b = (_a = state.columns) === null || _a === void 0 ? void 0 : _a.orderedFields) !== null && _b !== void 0 ? _b : [];
            var pinnedColumns = (_c = state.pinnedColumns) !== null && _c !== void 0 ? _c : {};
            var columnGroupsHeaderStructure = (0, gridColumnGroupsUtils_1.getColumnGroupsHeaderStructure)(orderedFields, unwrappedGroupingModel, pinnedColumns);
            return __assign(__assign({}, state), { columnGrouping: __assign(__assign({}, state.columnGrouping), { headerStructure: columnGroupsHeaderStructure }) });
        });
    }, [apiRef, props.columnGroupingModel]);
    var updateColumnGroupingState = React.useCallback(function (columnGroupingModel) {
        var _a, _b, _c;
        apiRef.current.caches.columnGrouping.lastColumnGroupingModel = columnGroupingModel;
        // @ts-expect-error Move this logic to `Pro` package
        var pinnedColumns = (_c = (_b = (_a = apiRef.current).getPinnedColumns) === null || _b === void 0 ? void 0 : _b.call(_a)) !== null && _c !== void 0 ? _c : {};
        var columnFields = (0, columns_1.gridColumnFieldsSelector)(apiRef);
        var visibleColumnFields = (0, columns_1.gridVisibleColumnFieldsSelector)(apiRef);
        var groupLookup = (0, gridColumnGroupsUtils_1.createGroupLookup)(columnGroupingModel !== null && columnGroupingModel !== void 0 ? columnGroupingModel : []);
        var unwrappedGroupingModel = (0, gridColumnGroupsUtils_1.unwrapGroupingColumnModel)(columnGroupingModel !== null && columnGroupingModel !== void 0 ? columnGroupingModel : []);
        var columnGroupsHeaderStructure = (0, gridColumnGroupsUtils_1.getColumnGroupsHeaderStructure)(columnFields, unwrappedGroupingModel, pinnedColumns);
        var maxDepth = visibleColumnFields.length === 0
            ? 0
            : Math.max.apply(Math, visibleColumnFields.map(function (field) { var _a, _b; return (_b = (_a = unwrappedGroupingModel[field]) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0; }));
        apiRef.current.setState(function (state) {
            return __assign(__assign({}, state), { columnGrouping: {
                    lookup: groupLookup,
                    unwrappedGroupingModel: unwrappedGroupingModel,
                    headerStructure: columnGroupsHeaderStructure,
                    maxDepth: maxDepth,
                } });
        });
    }, [apiRef]);
    (0, useGridEvent_1.useGridEvent)(apiRef, 'columnIndexChange', handleColumnIndexChange);
    (0, useGridEvent_1.useGridEvent)(apiRef, 'columnsChange', function () {
        updateColumnGroupingState(props.columnGroupingModel);
    });
    (0, useGridEvent_1.useGridEvent)(apiRef, 'columnVisibilityModelChange', function () {
        updateColumnGroupingState(props.columnGroupingModel);
    });
    /**
     * EFFECTS
     */
    React.useEffect(function () {
        if (props.columnGroupingModel === apiRef.current.caches.columnGrouping.lastColumnGroupingModel) {
            return;
        }
        updateColumnGroupingState(props.columnGroupingModel);
    }, [apiRef, updateColumnGroupingState, props.columnGroupingModel]);
};
exports.useGridColumnGrouping = useGridColumnGrouping;
