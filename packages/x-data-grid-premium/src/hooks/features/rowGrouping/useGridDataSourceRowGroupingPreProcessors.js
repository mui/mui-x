"use strict";
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
exports.useGridDataSourceRowGroupingPreProcessors = void 0;
var React = require("react");
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var internals_1 = require("@mui/x-data-grid-pro/internals");
var gridRowGroupingUtils_1 = require("./gridRowGroupingUtils");
var gridRowGroupingSelector_1 = require("./gridRowGroupingSelector");
var useGridDataSourceRowGroupingPreProcessors = function (apiRef, props) {
    var createRowTreeForRowGrouping = React.useCallback(function (params) {
        var _a, _b;
        var getGroupKey = (_a = props.dataSource) === null || _a === void 0 ? void 0 : _a.getGroupKey;
        if (!getGroupKey) {
            throw new Error('MUI X: No `getGroupKey` method provided with the dataSource.');
        }
        var getChildrenCount = (_b = props.dataSource) === null || _b === void 0 ? void 0 : _b.getChildrenCount;
        if (!getChildrenCount) {
            throw new Error('MUI X: No `getChildrenCount` method provided with the dataSource.');
        }
        var sanitizedRowGroupingModel = (0, gridRowGroupingSelector_1.gridRowGroupingSanitizedModelSelector)(apiRef);
        var columnsLookup = (0, x_data_grid_pro_1.gridColumnLookupSelector)(apiRef);
        var groupingRules = (0, gridRowGroupingUtils_1.getGroupingRules)({
            sanitizedRowGroupingModel: sanitizedRowGroupingModel,
            columnsLookup: columnsLookup,
        });
        apiRef.current.caches.rowGrouping.rulesOnLastRowTreeCreation = groupingRules;
        var getRowTreeBuilderNode = function (rowId) {
            var _a, _b;
            var parentPath = (_a = params.updates.groupKeys) !== null && _a !== void 0 ? _a : (0, internals_1.getParentPath)(rowId, params);
            var leafKey = getGroupKey(params.dataRowIdToModelLookup[rowId]);
            return {
                id: rowId,
                path: __spreadArray(__spreadArray([], parentPath, true), [leafKey !== null && leafKey !== void 0 ? leafKey : rowId.toString()], false).map(function (key, i) {
                    var _a, _b;
                    return ({
                        key: key,
                        field: (_b = (_a = groupingRules[i]) === null || _a === void 0 ? void 0 : _a.field) !== null && _b !== void 0 ? _b : null,
                    });
                }),
                serverChildrenCount: (_b = getChildrenCount(params.dataRowIdToModelLookup[rowId])) !== null && _b !== void 0 ? _b : 0,
            };
        };
        if (params.updates.type === 'full') {
            return (0, internals_1.createRowTree)({
                previousTree: params.previousTree,
                nodes: params.updates.rows.map(getRowTreeBuilderNode),
                defaultGroupingExpansionDepth: props.defaultGroupingExpansionDepth,
                isGroupExpandedByDefault: props.isGroupExpandedByDefault,
                groupingName: internals_1.RowGroupingStrategy.DataSource,
            });
        }
        return (0, internals_1.updateRowTree)({
            nodes: {
                inserted: params.updates.actions.insert.map(getRowTreeBuilderNode),
                modified: params.updates.actions.modify.map(getRowTreeBuilderNode),
                removed: params.updates.actions.remove,
            },
            previousTree: params.previousTree,
            previousGroupsToFetch: params.previousGroupsToFetch,
            previousTreeDepth: params.previousTreeDepths,
            defaultGroupingExpansionDepth: props.defaultGroupingExpansionDepth,
            isGroupExpandedByDefault: props.isGroupExpandedByDefault,
            groupingName: internals_1.RowGroupingStrategy.DataSource,
        });
    }, [apiRef, props.dataSource, props.defaultGroupingExpansionDepth, props.isGroupExpandedByDefault]);
    var filterRows = React.useCallback(function () {
        var rowTree = (0, x_data_grid_pro_1.gridRowTreeSelector)(apiRef);
        return (0, internals_1.skipFiltering)(rowTree);
    }, [apiRef]);
    var sortRows = React.useCallback(function () {
        var rowTree = (0, x_data_grid_pro_1.gridRowTreeSelector)(apiRef);
        return (0, internals_1.skipSorting)(rowTree);
    }, [apiRef]);
    (0, internals_1.useGridRegisterStrategyProcessor)(apiRef, internals_1.RowGroupingStrategy.DataSource, 'rowTreeCreation', createRowTreeForRowGrouping);
    (0, internals_1.useGridRegisterStrategyProcessor)(apiRef, internals_1.RowGroupingStrategy.DataSource, 'filtering', filterRows);
    (0, internals_1.useGridRegisterStrategyProcessor)(apiRef, internals_1.RowGroupingStrategy.DataSource, 'sorting', sortRows);
    (0, internals_1.useGridRegisterStrategyProcessor)(apiRef, internals_1.RowGroupingStrategy.DataSource, 'visibleRowsLookupCreation', internals_1.getVisibleRowsLookup);
};
exports.useGridDataSourceRowGroupingPreProcessors = useGridDataSourceRowGroupingPreProcessors;
