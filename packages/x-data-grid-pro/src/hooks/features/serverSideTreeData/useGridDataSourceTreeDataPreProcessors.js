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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
exports.useGridDataSourceTreeDataPreProcessors = void 0;
var React = require("react");
var x_data_grid_1 = require("@mui/x-data-grid");
var internals_1 = require("@mui/x-data-grid/internals");
var gridTreeDataGroupColDef_1 = require("../treeData/gridTreeDataGroupColDef");
var utils_1 = require("./utils");
var GridDataSourceTreeDataGroupingCell_1 = require("../../../components/GridDataSourceTreeDataGroupingCell");
var createRowTree_1 = require("../../../utils/tree/createRowTree");
var updateRowTree_1 = require("../../../utils/tree/updateRowTree");
var utils_2 = require("../../../utils/tree/utils");
var gridTreeDataUtils_1 = require("../treeData/gridTreeDataUtils");
var useGridDataSourceTreeDataPreProcessors = function (privateApiRef, props) {
    var setStrategyAvailability = React.useCallback(function () {
        privateApiRef.current.setStrategyAvailability(internals_1.GridStrategyGroup.RowTree, gridTreeDataUtils_1.TreeDataStrategy.DataSource, props.treeData && props.dataSource ? function () { return true; } : function () { return false; });
    }, [privateApiRef, props.treeData, props.dataSource]);
    var getGroupingColDef = React.useCallback(function () {
        var groupingColDefProp = props.groupingColDef;
        var colDefOverride;
        if (typeof groupingColDefProp === 'function') {
            var params = {
                groupingName: gridTreeDataUtils_1.TreeDataStrategy.DataSource,
                fields: [],
            };
            colDefOverride = groupingColDefProp(params);
        }
        else {
            colDefOverride = groupingColDefProp;
        }
        var _a = colDefOverride !== null && colDefOverride !== void 0 ? colDefOverride : {}, hideDescendantCount = _a.hideDescendantCount, colDefOverrideProperties = __rest(_a, ["hideDescendantCount"]);
        var commonProperties = __assign(__assign({}, gridTreeDataGroupColDef_1.GRID_TREE_DATA_GROUPING_COL_DEF), { renderCell: function (params) { return (<GridDataSourceTreeDataGroupingCell_1.GridDataSourceTreeDataGroupingCell {...params} hideDescendantCount={hideDescendantCount}/>); }, headerName: privateApiRef.current.getLocaleText('treeDataGroupingHeaderName') });
        return __assign(__assign(__assign({}, commonProperties), colDefOverrideProperties), gridTreeDataGroupColDef_1.GRID_TREE_DATA_GROUPING_COL_DEF_FORCED_PROPERTIES);
    }, [privateApiRef, props.groupingColDef]);
    var updateGroupingColumn = React.useCallback(function (columnsState) {
        if (!props.dataSource) {
            return columnsState;
        }
        var groupingColDefField = gridTreeDataGroupColDef_1.GRID_TREE_DATA_GROUPING_COL_DEF_FORCED_PROPERTIES.field;
        var shouldHaveGroupingColumn = props.treeData;
        var prevGroupingColumn = columnsState.lookup[groupingColDefField];
        if (shouldHaveGroupingColumn) {
            var newGroupingColumn = getGroupingColDef();
            if (prevGroupingColumn) {
                newGroupingColumn.width = prevGroupingColumn.width;
                newGroupingColumn.flex = prevGroupingColumn.flex;
            }
            columnsState.lookup[groupingColDefField] = newGroupingColumn;
            if (prevGroupingColumn == null) {
                columnsState.orderedFields = __spreadArray([groupingColDefField], columnsState.orderedFields, true);
            }
        }
        else if (!shouldHaveGroupingColumn && prevGroupingColumn) {
            delete columnsState.lookup[groupingColDefField];
            columnsState.orderedFields = columnsState.orderedFields.filter(function (field) { return field !== groupingColDefField; });
        }
        return columnsState;
    }, [props.treeData, props.dataSource, getGroupingColDef]);
    var createRowTreeForTreeData = React.useCallback(function (params) {
        var _a, _b;
        var getGroupKey = (_a = props.dataSource) === null || _a === void 0 ? void 0 : _a.getGroupKey;
        if (!getGroupKey) {
            throw new Error('MUI X: No `getGroupKey` method provided with the dataSource.');
        }
        var getChildrenCount = (_b = props.dataSource) === null || _b === void 0 ? void 0 : _b.getChildrenCount;
        if (!getChildrenCount) {
            throw new Error('MUI X: No `getChildrenCount` method provided with the dataSource.');
        }
        var getRowTreeBuilderNode = function (rowId) {
            var _a;
            var parentPath = (_a = params.updates.groupKeys) !== null && _a !== void 0 ? _a : (0, utils_1.getParentPath)(rowId, params);
            var count = getChildrenCount(params.dataRowIdToModelLookup[rowId]);
            return {
                id: rowId,
                path: __spreadArray(__spreadArray([], parentPath, true), [getGroupKey(params.dataRowIdToModelLookup[rowId])], false).map(function (key) { return ({ key: key, field: null }); }),
                serverChildrenCount: count,
            };
        };
        var onDuplicatePath = function (firstId, secondId, path) {
            throw new Error([
                'MUI X: The values returned by `getGroupKey` for all the sibling rows should be unique.',
                "The rows with id #".concat(firstId, " and #").concat(secondId, " have the same."),
                "Path: ".concat(JSON.stringify(path.map(function (step) { return step.key; })), "."),
            ].join('\n'));
        };
        if (params.updates.type === 'full') {
            return (0, createRowTree_1.createRowTree)({
                previousTree: params.previousTree,
                nodes: params.updates.rows.map(getRowTreeBuilderNode),
                defaultGroupingExpansionDepth: props.defaultGroupingExpansionDepth,
                isGroupExpandedByDefault: props.isGroupExpandedByDefault,
                groupingName: gridTreeDataUtils_1.TreeDataStrategy.DataSource,
                onDuplicatePath: onDuplicatePath,
            });
        }
        return (0, updateRowTree_1.updateRowTree)({
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
            groupingName: gridTreeDataUtils_1.TreeDataStrategy.DataSource,
        });
    }, [props.dataSource, props.defaultGroupingExpansionDepth, props.isGroupExpandedByDefault]);
    var filterRows = React.useCallback(function () {
        var rowTree = (0, x_data_grid_1.gridRowTreeSelector)(privateApiRef);
        return (0, utils_1.skipFiltering)(rowTree);
    }, [privateApiRef]);
    var sortRows = React.useCallback(function () {
        var rowTree = (0, x_data_grid_1.gridRowTreeSelector)(privateApiRef);
        return (0, utils_1.skipSorting)(rowTree);
    }, [privateApiRef]);
    (0, internals_1.useGridRegisterPipeProcessor)(privateApiRef, 'hydrateColumns', updateGroupingColumn);
    (0, internals_1.useGridRegisterStrategyProcessor)(privateApiRef, gridTreeDataUtils_1.TreeDataStrategy.DataSource, 'rowTreeCreation', createRowTreeForTreeData);
    (0, internals_1.useGridRegisterStrategyProcessor)(privateApiRef, gridTreeDataUtils_1.TreeDataStrategy.DataSource, 'filtering', filterRows);
    (0, internals_1.useGridRegisterStrategyProcessor)(privateApiRef, gridTreeDataUtils_1.TreeDataStrategy.DataSource, 'sorting', sortRows);
    (0, internals_1.useGridRegisterStrategyProcessor)(privateApiRef, gridTreeDataUtils_1.TreeDataStrategy.DataSource, 'visibleRowsLookupCreation', utils_2.getVisibleRowsLookup);
    /**
     * 1ST RENDER
     */
    (0, x_data_grid_1.useFirstRender)(function () {
        setStrategyAvailability();
    });
    /**
     * EFFECTS
     */
    var isFirstRender = React.useRef(true);
    React.useEffect(function () {
        if (!isFirstRender.current) {
            setStrategyAvailability();
        }
        else {
            isFirstRender.current = false;
        }
    }, [setStrategyAvailability]);
};
exports.useGridDataSourceTreeDataPreProcessors = useGridDataSourceTreeDataPreProcessors;
