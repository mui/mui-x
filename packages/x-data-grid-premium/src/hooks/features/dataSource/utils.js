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
exports.fetchParents = exports.getPropsOverrides = void 0;
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var getPropsOverrides = function (pivotColumns, pivotingColDef, pivotModel, initialColumns, apiRef) {
    var visiblePivotColumns = pivotModel.columns.filter(function (column) { return !column.hidden; });
    var visiblePivotValues = pivotModel.values.filter(function (value) { return !value.hidden; });
    var columns = Array.from(initialColumns.values());
    // Build column grouping model from pivot column paths
    var columnGroupingModel = [];
    var columnGroupingModelLookup = new Map();
    // Build new columns lookup and ordered fields
    var newColumns = {};
    // Build aggregation model
    var aggregationModel = {};
    // Create unique combinations of all values from pivotColumns and pivotValues
    var uniquePaths = [];
    var processPath = function (currentPath, remainingColumns, level) {
        if (level === visiblePivotColumns.length) {
            uniquePaths.push(__spreadArray([], currentPath, true));
            return;
        }
        remainingColumns.forEach(function (column) {
            processPath(__spreadArray(__spreadArray([], currentPath, true), [
                { key: column.key, field: visiblePivotColumns[level].field, value: column.group },
            ], false), column.children || [], level + 1);
        });
    };
    processPath([], pivotColumns, 0);
    /**
     * Column group headers are sorted by the leaf columns order in the column definition.
     * Store the values of each column group path to be able to sort them by pivot column sort order.
     * The values are stored by the column group level which allows easier sorting by going through the column group levels in reverse order.
     * Store raw value to be able to determine if the value was formatted on the client using `getRowValue`.
     * Values sent from the server as strings will not be sorted on the client.
     */
    var columnGroupPathValues = [];
    uniquePaths.forEach(function (columnPath) {
        var columnPathKeys = columnPath.map(function (path) { return path.key; });
        var columnPathValues = columnPath.map(function (path) { return path.value; });
        visiblePivotValues.forEach(function (pivotValue) {
            // Find the original column definition for the last field
            var originalColumn = initialColumns.get(pivotValue.field);
            // get the overrides defined from the data source definition
            var overrides = pivotingColDef(pivotValue.field, columnPathKeys);
            // Create new column definition based on original column
            var newColumnDef = __assign(__assign(__assign({}, originalColumn), overrides), { aggregable: false, groupable: false, filterable: false, hideable: false, editable: false, disableReorder: true });
            var pivotFieldName = newColumnDef.field;
            newColumns[pivotFieldName] = newColumnDef;
            aggregationModel[pivotFieldName] = pivotValue.aggFunc;
            // Build column grouping model
            var combinedPathValues = __spreadArray(__spreadArray([], columnPathValues, true), [pivotValue.field], false).map(function (path, index) {
                return typeof path === 'string'
                    ? path
                    : apiRef.current.getRowValue(path, initialColumns.get(visiblePivotColumns[index].field));
            });
            columnGroupPathValues.push({
                field: pivotFieldName,
                pathValues: combinedPathValues.slice(0, -1),
                pathValuesRaw: columnPathValues,
            });
            // Build the hierarchy for column groups
            for (var i = 0; i < combinedPathValues.length - 1; i += 1) {
                var currentField = visiblePivotColumns[i].field;
                var groupPath = combinedPathValues.slice(0, i + 1);
                var groupId = groupPath.join('-');
                var headerName = columnPathValues[groupPath.length - 1];
                if (typeof headerName !== 'string') {
                    headerName = apiRef.current.getRowFormattedValue(headerName, initialColumns.get(currentField));
                }
                if (typeof headerName === 'number') {
                    headerName = String(headerName);
                }
                if (typeof headerName !== 'string') {
                    throw new Error("MUI X: Header name for a column group based on ".concat(currentField, " cannot be converted to a string."));
                }
                if (!columnGroupingModelLookup.has(groupId)) {
                    var columnGroup = {
                        groupId: groupId,
                        headerName: headerName,
                        children: [],
                    };
                    columnGroupingModelLookup.set(groupId, columnGroup);
                    if (i === 0) {
                        columnGroupingModel.push(columnGroup);
                    }
                    else {
                        var parentGroupId_1 = groupPath.slice(0, -1).join('-');
                        var parentGroup_1 = columnGroupingModelLookup.get(parentGroupId_1);
                        if (parentGroup_1) {
                            parentGroup_1.children.push(columnGroup);
                        }
                    }
                }
            }
            // Add the final column to the appropriate group
            var parentGroupId = combinedPathValues.slice(0, -1).join('-');
            var parentGroup = columnGroupingModelLookup.get(parentGroupId);
            if (parentGroup) {
                parentGroup.children.push({ field: pivotFieldName });
            }
        });
    });
    var _loop_1 = function (i) {
        var sort = visiblePivotColumns[i].sort;
        if (!sort) {
            return "continue";
        }
        columnGroupPathValues.sort(function (a, b) {
            // Do not sort values that are returned as strings
            if (typeof a.pathValuesRaw[i] === 'string' && typeof b.pathValuesRaw[i] === 'string') {
                return 0;
            }
            return ((sort === 'asc' ? 1 : -1) *
                (0, x_data_grid_pro_1.gridStringOrNumberComparator)(a.pathValues[i], b.pathValues[i], {}, {}));
        });
    };
    for (var i = visiblePivotColumns.length - 1; i >= 0; i -= 1) {
        _loop_1(i);
    }
    if (visiblePivotColumns.length > 0) {
        for (var i = 0; i < columnGroupPathValues.length; i += 1) {
            columns.push(newColumns[columnGroupPathValues[i].field]);
        }
    }
    return {
        columns: columns,
        columnGroupingModel: columnGroupingModel,
        aggregationModel: aggregationModel,
    };
};
exports.getPropsOverrides = getPropsOverrides;
var fetchParents = function (rowTree, rowId, fetchHandler) {
    var parents = [];
    // collect all parents ids
    var currentId = rowId;
    while (currentId !== undefined && currentId !== x_data_grid_pro_1.GRID_ROOT_GROUP_ID) {
        var parentId = rowTree[currentId].parent;
        parents.push(parentId);
        currentId = parentId;
    }
    return Promise.all(parents.reverse().map(fetchHandler));
};
exports.fetchParents = fetchParents;
