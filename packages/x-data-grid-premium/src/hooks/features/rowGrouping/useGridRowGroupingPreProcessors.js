"use strict";
'use client';
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
exports.useGridRowGroupingPreProcessors = void 0;
var React = require("react");
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var internals_1 = require("@mui/x-data-grid-pro/internals");
var gridRowGroupingSelector_1 = require("./gridRowGroupingSelector");
var createGroupingColDef_1 = require("./createGroupingColDef");
var gridRowGroupingUtils_1 = require("./gridRowGroupingUtils");
var useGridRowGroupingPreProcessors = function (apiRef, props) {
    var getGroupingColDefs = React.useCallback(function (columnsState) {
        if (props.disableRowGrouping) {
            return [];
        }
        var strategy = props.dataSource
            ? internals_1.RowGroupingStrategy.DataSource
            : internals_1.RowGroupingStrategy.Default;
        var groupingColDefProp = props.groupingColDef;
        // We can't use `gridGroupingRowsSanitizedModelSelector` here because the new columns are not in the state yet
        var rowGroupingModel = (0, gridRowGroupingSelector_1.gridRowGroupingModelSelector)(apiRef).filter(function (field) { return !!columnsState.lookup[field]; });
        if (rowGroupingModel.length === 0) {
            return [];
        }
        switch (props.rowGroupingColumnMode) {
            case 'single': {
                return [
                    (0, createGroupingColDef_1.createGroupingColDefForAllGroupingCriteria)({
                        apiRef: apiRef,
                        rowGroupingModel: rowGroupingModel,
                        colDefOverride: (0, gridRowGroupingUtils_1.getColDefOverrides)(groupingColDefProp, rowGroupingModel, strategy),
                        columnsLookup: columnsState.lookup,
                        strategy: strategy,
                    }),
                ];
            }
            case 'multiple': {
                return rowGroupingModel.map(function (groupingCriteria) {
                    return (0, createGroupingColDef_1.createGroupingColDefForOneGroupingCriteria)({
                        groupingCriteria: groupingCriteria,
                        colDefOverride: (0, gridRowGroupingUtils_1.getColDefOverrides)(groupingColDefProp, [groupingCriteria]),
                        groupedByColDef: columnsState.lookup[groupingCriteria],
                        columnsLookup: columnsState.lookup,
                        strategy: strategy,
                    });
                });
            }
            default: {
                return [];
            }
        }
    }, [
        apiRef,
        props.groupingColDef,
        props.rowGroupingColumnMode,
        props.disableRowGrouping,
        props.dataSource,
    ]);
    var updateGroupingColumn = React.useCallback(function (columnsState) {
        var groupingColDefs = getGroupingColDefs(columnsState);
        var newColumnFields = [];
        var newColumnsLookup = {};
        // We only keep the non-grouping columns
        columnsState.orderedFields.forEach(function (field) {
            if (!(0, gridRowGroupingUtils_1.isGroupingColumn)(field)) {
                newColumnFields.push(field);
                newColumnsLookup[field] = columnsState.lookup[field];
            }
        });
        // We add the grouping column
        groupingColDefs.forEach(function (groupingColDef) {
            var matchingGroupingColDef = columnsState.lookup[groupingColDef.field];
            if (matchingGroupingColDef) {
                groupingColDef.width = matchingGroupingColDef.width;
                groupingColDef.flex = matchingGroupingColDef.flex;
            }
            newColumnsLookup[groupingColDef.field] = groupingColDef;
        });
        newColumnFields = __spreadArray(__spreadArray([], groupingColDefs.map(function (colDef) { return colDef.field; }), true), newColumnFields, true);
        columnsState.orderedFields = newColumnFields;
        columnsState.lookup = newColumnsLookup;
        return columnsState;
    }, [getGroupingColDefs]);
    var createRowTreeForRowGrouping = React.useCallback(function (params) {
        var sanitizedRowGroupingModel = (0, gridRowGroupingSelector_1.gridRowGroupingSanitizedModelSelector)(apiRef);
        var columnsLookup = (0, x_data_grid_pro_1.gridColumnLookupSelector)(apiRef);
        var groupingRules = (0, gridRowGroupingUtils_1.getGroupingRules)({
            sanitizedRowGroupingModel: sanitizedRowGroupingModel,
            columnsLookup: columnsLookup,
        });
        apiRef.current.caches.rowGrouping.rulesOnLastRowTreeCreation = groupingRules;
        var getRowTreeBuilderNode = function (rowId) {
            var row = params.dataRowIdToModelLookup[rowId];
            var parentPath = groupingRules
                .map(function (groupingRule) {
                return (0, gridRowGroupingUtils_1.getCellGroupingCriteria)({
                    row: row,
                    groupingRule: groupingRule,
                    colDef: columnsLookup[groupingRule.field],
                    apiRef: apiRef,
                });
            })
                .filter(function (cell) { return cell.key != null; });
            var leafGroupingCriteria = {
                key: rowId.toString(),
                field: null,
            };
            return {
                path: __spreadArray(__spreadArray([], parentPath, true), [leafGroupingCriteria], false),
                id: rowId,
            };
        };
        if (params.updates.type === 'full') {
            return (0, internals_1.createRowTree)({
                previousTree: params.previousTree,
                nodes: params.updates.rows.map(getRowTreeBuilderNode),
                defaultGroupingExpansionDepth: props.defaultGroupingExpansionDepth,
                isGroupExpandedByDefault: props.isGroupExpandedByDefault,
                groupingName: internals_1.RowGroupingStrategy.Default,
            });
        }
        return (0, internals_1.updateRowTree)({
            nodes: {
                inserted: params.updates.actions.insert.map(getRowTreeBuilderNode),
                modified: params.updates.actions.modify.map(getRowTreeBuilderNode),
                removed: params.updates.actions.remove,
            },
            previousTree: params.previousTree,
            previousTreeDepth: params.previousTreeDepths,
            defaultGroupingExpansionDepth: props.defaultGroupingExpansionDepth,
            isGroupExpandedByDefault: props.isGroupExpandedByDefault,
            groupingName: internals_1.RowGroupingStrategy.Default,
        });
    }, [apiRef, props.defaultGroupingExpansionDepth, props.isGroupExpandedByDefault]);
    var filterRows = React.useCallback(function (params) {
        var rowTree = (0, x_data_grid_pro_1.gridRowTreeSelector)(apiRef);
        return (0, gridRowGroupingUtils_1.filterRowTreeFromGroupingColumns)({
            rowTree: rowTree,
            isRowMatchingFilters: params.isRowMatchingFilters,
            filterModel: params.filterModel,
            apiRef: apiRef,
        });
    }, [apiRef]);
    var sortRows = React.useCallback(function (params) {
        var rowTree = (0, x_data_grid_pro_1.gridRowTreeSelector)(apiRef);
        return (0, internals_1.sortRowTree)({
            rowTree: rowTree,
            sortRowList: params.sortRowList,
            disableChildrenSorting: false,
            shouldRenderGroupBelowLeaves: true,
        });
    }, [apiRef]);
    (0, internals_1.useGridRegisterPipeProcessor)(apiRef, 'hydrateColumns', updateGroupingColumn);
    (0, internals_1.useGridRegisterStrategyProcessor)(apiRef, internals_1.RowGroupingStrategy.Default, 'rowTreeCreation', createRowTreeForRowGrouping);
    (0, internals_1.useGridRegisterStrategyProcessor)(apiRef, internals_1.RowGroupingStrategy.Default, 'filtering', filterRows);
    (0, internals_1.useGridRegisterStrategyProcessor)(apiRef, internals_1.RowGroupingStrategy.Default, 'sorting', sortRows);
    (0, internals_1.useGridRegisterStrategyProcessor)(apiRef, internals_1.RowGroupingStrategy.Default, 'visibleRowsLookupCreation', internals_1.getVisibleRowsLookup);
    (0, x_data_grid_pro_1.useFirstRender)(function () {
        (0, gridRowGroupingUtils_1.setStrategyAvailability)(apiRef, props.disableRowGrouping, props.dataSource);
    });
    var isFirstRender = React.useRef(true);
    React.useEffect(function () {
        if (!isFirstRender.current) {
            (0, gridRowGroupingUtils_1.setStrategyAvailability)(apiRef, props.disableRowGrouping, props.dataSource);
        }
        else {
            isFirstRender.current = false;
        }
    }, [apiRef, props.disableRowGrouping, props.dataSource]);
};
exports.useGridRowGroupingPreProcessors = useGridRowGroupingPreProcessors;
