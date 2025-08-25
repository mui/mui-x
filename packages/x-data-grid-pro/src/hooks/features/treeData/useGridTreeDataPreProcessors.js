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
exports.useGridTreeDataPreProcessors = void 0;
var React = require("react");
var x_data_grid_1 = require("@mui/x-data-grid");
var internals_1 = require("@mui/x-data-grid/internals");
var gridTreeDataGroupColDef_1 = require("./gridTreeDataGroupColDef");
var gridTreeDataUtils_1 = require("./gridTreeDataUtils");
var components_1 = require("../../../components");
var createRowTree_1 = require("../../../utils/tree/createRowTree");
var sortRowTree_1 = require("../../../utils/tree/sortRowTree");
var updateRowTree_1 = require("../../../utils/tree/updateRowTree");
var utils_1 = require("../../../utils/tree/utils");
var useGridTreeDataPreProcessors = function (privateApiRef, props) {
    var setStrategyAvailability = React.useCallback(function () {
        privateApiRef.current.setStrategyAvailability(internals_1.GridStrategyGroup.RowTree, gridTreeDataUtils_1.TreeDataStrategy.Default, props.treeData && !props.dataSource ? function () { return true; } : function () { return false; });
    }, [privateApiRef, props.treeData, props.dataSource]);
    var getGroupingColDef = React.useCallback(function () {
        var groupingColDefProp = props.groupingColDef;
        var colDefOverride;
        if (typeof groupingColDefProp === 'function') {
            var params = {
                groupingName: gridTreeDataUtils_1.TreeDataStrategy.Default,
                fields: [],
            };
            colDefOverride = groupingColDefProp(params);
        }
        else {
            colDefOverride = groupingColDefProp;
        }
        var _a = colDefOverride !== null && colDefOverride !== void 0 ? colDefOverride : {}, hideDescendantCount = _a.hideDescendantCount, colDefOverrideProperties = __rest(_a, ["hideDescendantCount"]);
        var commonProperties = __assign(__assign({}, gridTreeDataGroupColDef_1.GRID_TREE_DATA_GROUPING_COL_DEF), { renderCell: function (params) { return (<components_1.GridTreeDataGroupingCell {...params} hideDescendantCount={hideDescendantCount}/>); }, headerName: privateApiRef.current.getLocaleText('treeDataGroupingHeaderName') });
        return __assign(__assign(__assign({}, commonProperties), colDefOverrideProperties), gridTreeDataGroupColDef_1.GRID_TREE_DATA_GROUPING_COL_DEF_FORCED_PROPERTIES);
    }, [privateApiRef, props.groupingColDef]);
    var updateGroupingColumn = React.useCallback(function (columnsState) {
        if (props.dataSource) {
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
        if (!props.getTreeDataPath) {
            throw new Error('MUI X: No getTreeDataPath given.');
        }
        var getRowTreeBuilderNode = function (rowId) { return ({
            id: rowId,
            path: props.getTreeDataPath(params.dataRowIdToModelLookup[rowId]).map(function (key) { return ({ key: key, field: null }); }),
        }); };
        var onDuplicatePath = function (firstId, secondId, path) {
            throw new Error([
                'MUI X: The path returned by `getTreeDataPath` should be unique.',
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
                groupingName: gridTreeDataUtils_1.TreeDataStrategy.Default,
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
            previousTreeDepth: params.previousTreeDepths,
            defaultGroupingExpansionDepth: props.defaultGroupingExpansionDepth,
            isGroupExpandedByDefault: props.isGroupExpandedByDefault,
            groupingName: gridTreeDataUtils_1.TreeDataStrategy.Default,
        });
    }, [props.getTreeDataPath, props.defaultGroupingExpansionDepth, props.isGroupExpandedByDefault]);
    var filterRows = React.useCallback(function (params) {
        var rowTree = (0, x_data_grid_1.gridRowTreeSelector)(privateApiRef);
        return (0, gridTreeDataUtils_1.filterRowTreeFromTreeData)({
            rowTree: rowTree,
            isRowMatchingFilters: params.isRowMatchingFilters,
            disableChildrenFiltering: props.disableChildrenFiltering,
            filterModel: params.filterModel,
            apiRef: privateApiRef,
        });
    }, [privateApiRef, props.disableChildrenFiltering]);
    var sortRows = React.useCallback(function (params) {
        var rowTree = (0, x_data_grid_1.gridRowTreeSelector)(privateApiRef);
        return (0, sortRowTree_1.sortRowTree)({
            rowTree: rowTree,
            sortRowList: params.sortRowList,
            disableChildrenSorting: props.disableChildrenSorting,
            shouldRenderGroupBelowLeaves: false,
        });
    }, [privateApiRef, props.disableChildrenSorting]);
    (0, internals_1.useGridRegisterPipeProcessor)(privateApiRef, 'hydrateColumns', updateGroupingColumn);
    (0, internals_1.useGridRegisterStrategyProcessor)(privateApiRef, gridTreeDataUtils_1.TreeDataStrategy.Default, 'rowTreeCreation', createRowTreeForTreeData);
    (0, internals_1.useGridRegisterStrategyProcessor)(privateApiRef, gridTreeDataUtils_1.TreeDataStrategy.Default, 'filtering', filterRows);
    (0, internals_1.useGridRegisterStrategyProcessor)(privateApiRef, gridTreeDataUtils_1.TreeDataStrategy.Default, 'sorting', sortRows);
    (0, internals_1.useGridRegisterStrategyProcessor)(privateApiRef, gridTreeDataUtils_1.TreeDataStrategy.Default, 'visibleRowsLookupCreation', utils_1.getVisibleRowsLookup);
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
exports.useGridTreeDataPreProcessors = useGridTreeDataPreProcessors;
