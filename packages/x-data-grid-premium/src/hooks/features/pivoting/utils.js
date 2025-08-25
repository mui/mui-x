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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPivotedData = exports.getInitialColumns = exports.defaultGetPivotDerivedColumns = exports.isPivotingAvailable = void 0;
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var internals_1 = require("@mui/x-data-grid-pro/internals");
var rowGrouping_1 = require("../rowGrouping");
var gridAggregationUtils_1 = require("../aggregation/gridAggregationUtils");
var columnGroupIdSeparator = '>->';
var isPivotingAvailable = function (props) {
    return !props.disablePivoting;
};
exports.isPivotingAvailable = isPivotingAvailable;
var defaultGetPivotDerivedColumns = function (column, getLocaleText) {
    if (column.type === 'date') {
        var field_1 = column.field;
        return [
            {
                // String column type to avoid formatting the value as 2,025 instead of 2025
                field: "".concat(field_1, "-year"),
                headerName: "".concat(column.headerName, " ").concat(getLocaleText('pivotYearColumnHeaderName')),
                valueGetter: function (value, row) { return new Date(row[field_1]).getFullYear(); },
            },
            {
                field: "".concat(field_1, "-quarter"),
                headerName: "".concat(column.headerName, " ").concat(getLocaleText('pivotQuarterColumnHeaderName')),
                valueGetter: function (value, row) { return "Q".concat(Math.floor(new Date(row[field_1]).getMonth() / 3) + 1); },
            },
        ];
    }
    return undefined;
};
exports.defaultGetPivotDerivedColumns = defaultGetPivotDerivedColumns;
var getInitialColumns = function (originalColumns, getPivotDerivedColumns, getLocaleText) {
    var initialColumns = new Map();
    for (var i = 0; i < originalColumns.length; i += 1) {
        var originalColumn = originalColumns[i];
        var column = __assign(__assign({}, (0, internals_1.getDefaultColTypeDef)(originalColumn.type)), originalColumn);
        var field = column.field;
        if (!(0, rowGrouping_1.isGroupingColumn)(field)) {
            initialColumns.set(field, column);
            var derivedColumns = getPivotDerivedColumns === null || getPivotDerivedColumns === void 0 ? void 0 : getPivotDerivedColumns(column, getLocaleText);
            if (derivedColumns) {
                derivedColumns.forEach(function (col) { return initialColumns.set(col.field, col); });
            }
        }
    }
    return initialColumns;
};
exports.getInitialColumns = getInitialColumns;
function sortColumnGroups(columnGroups, pivotModelColumns, depth) {
    if (depth === void 0) { depth = 0; }
    if (depth > pivotModelColumns.length - 1) {
        return;
    }
    var sort = pivotModelColumns[depth].sort;
    columnGroups.sort(function (a, b) {
        if ((0, x_data_grid_pro_1.isLeaf)(a) || (0, x_data_grid_pro_1.isLeaf)(b)) {
            return 0;
        }
        if (a.children) {
            sortColumnGroups(a.children, pivotModelColumns, depth + 1);
        }
        if (b.children) {
            sortColumnGroups(b.children, pivotModelColumns, depth + 1);
        }
        if (sort === undefined) {
            return 0;
        }
        return ((sort === 'asc' ? 1 : -1) *
            (0, x_data_grid_pro_1.gridStringOrNumberComparator)(a.rawHeaderName, b.rawHeaderName, {}, {}));
    });
}
var getPivotedData = function (_a) {
    var _b;
    var rows = _a.rows, columns = _a.columns, pivotModel = _a.pivotModel, apiRef = _a.apiRef, pivotingColDef = _a.pivotingColDef, groupingColDef = _a.groupingColDef;
    var visibleColumns = pivotModel.columns.filter(function (column) { return !column.hidden; });
    var visibleRows = pivotModel.rows.filter(function (row) { return !row.hidden; });
    var visibleValues = pivotModel.values.filter(function (value) { return !value.hidden; });
    var pivotColumns = [];
    var columnVisibilityModel = {};
    var pivotColumnsIncludedInPivotValues = [];
    var initialColumns = new Map();
    var _loop_1 = function (column) {
        if (!(0, rowGrouping_1.isGroupingColumn)(column.field)) {
            initialColumns.set(column.field, column);
            var pivotValueIndex = visibleValues.findIndex(function (_a) {
                var field = _a.field;
                return field === column.field;
            });
            var isVisiblePivotValueField = pivotValueIndex !== -1;
            var columnToAdd = __assign(__assign({}, column), { aggregable: false, groupable: false, hideable: false, editable: false, disableReorder: true });
            if (isVisiblePivotValueField) {
                // Store columns that are used as pivot values in a temporary array to keep them in the same order as in pivotModel.values, not in the order of the initial columns.
                // `pivotColumnsIncludedInPivotValues` is concatenated to pivotColumns later.
                pivotColumnsIncludedInPivotValues[pivotValueIndex] = columnToAdd;
            }
            else {
                pivotColumns.push(columnToAdd);
            }
            columnVisibilityModel[column.field] = false;
        }
    };
    for (var _i = 0, _c = columns.values(); _i < _c.length; _i++) {
        var column = _c[_i];
        _loop_1(column);
    }
    pivotColumns = pivotColumns.concat(pivotColumnsIncludedInPivotValues);
    var getAttributesFromInitialColumn = function (field) {
        var initialColumn = initialColumns.get(field);
        if (!initialColumn) {
            return undefined;
        }
        var attributes = {
            width: initialColumn.width,
            minWidth: initialColumn.minWidth,
            maxWidth: initialColumn.maxWidth,
            valueFormatter: initialColumn.valueFormatter,
            headerName: initialColumn.headerName,
            renderCell: initialColumn.renderCell,
            display: initialColumn.display,
        };
        return attributes;
    };
    var aggregationModel = {};
    var columnGroupingModel = [];
    var columnGroupingModelLookup = new Map();
    var newRows = [];
    if (visibleColumns.length === 0) {
        newRows = rows;
        visibleValues.forEach(function (pivotValue) {
            aggregationModel[pivotValue.field] = pivotValue.aggFunc;
            delete columnVisibilityModel[pivotValue.field];
        });
    }
    else {
        var _loop_2 = function (i) {
            var row = rows[i];
            var newRow = __assign({}, row);
            var columnGroupPath = [];
            for (var j = 0; j < visibleColumns.length; j += 1) {
                var colGroupField = visibleColumns[j].field;
                var depth = j;
                var column = initialColumns.get(colGroupField);
                if (!column) {
                    continue;
                }
                var colValue = (_b = apiRef.current.getRowValue(row, column)) !== null && _b !== void 0 ? _b : '(No value)';
                if (column.type === 'singleSelect') {
                    var singleSelectColumn = column;
                    if (singleSelectColumn.getOptionLabel) {
                        colValue = singleSelectColumn.getOptionLabel(colValue);
                    }
                }
                if (column.type !== 'number') {
                    colValue = String(colValue);
                }
                var formattedHeaderName = apiRef.current.getRowFormattedValue(row, column) || colValue;
                columnGroupPath.push(colValue);
                var groupId = columnGroupPath.join(columnGroupIdSeparator);
                if (!columnGroupingModelLookup.has(groupId)) {
                    var columnGroup = {
                        groupId: groupId,
                        headerName: formattedHeaderName,
                        rawHeaderName: colValue,
                        children: [],
                    };
                    columnGroupingModelLookup.set(groupId, columnGroup);
                    if (depth === 0) {
                        columnGroupingModel.push(columnGroup);
                    }
                    else {
                        var parentGroupId = columnGroupPath.slice(0, -1).join(columnGroupIdSeparator);
                        var parentGroup = columnGroupingModelLookup.get(parentGroupId);
                        if (parentGroup) {
                            parentGroup.children.push(columnGroup);
                        }
                    }
                }
                var isLastColumnGroupLevel = depth === visibleColumns.length - 1;
                if (isLastColumnGroupLevel) {
                    visibleValues.forEach(function (pivotValue) {
                        var valueField = pivotValue.field;
                        var originalColumn = initialColumns.get(valueField);
                        if (!originalColumn) {
                            return;
                        }
                        var valueKey = "".concat(columnGroupPath.join(columnGroupIdSeparator)).concat(columnGroupIdSeparator).concat(valueField);
                        newRow[valueKey] = apiRef.current.getRowValue(row, originalColumn);
                    });
                }
            }
            newRows.push(newRow);
        };
        for (var i = 0; i < rows.length; i += 1) {
            _loop_2(i);
        }
        sortColumnGroups(columnGroupingModel, visibleColumns);
    }
    function createColumns(columnGroups, depth) {
        if (depth === void 0) { depth = 0; }
        var _loop_3 = function (i) {
            var columnGroup = columnGroups[i];
            if ((0, x_data_grid_pro_1.isLeaf)(columnGroup)) {
                return "continue";
            }
            var isLastColumnGroupLevel = depth === visibleColumns.length - 1;
            if (isLastColumnGroupLevel) {
                if (visibleValues.length === 0) {
                    // If there are no visible values, there are no actual columns added to the data grid, which leads to column groups not being visible.
                    // Adding an empty column to each column group ensures that the column groups are visible.
                    var emptyColumnField = "".concat(columnGroup.groupId).concat(columnGroupIdSeparator, "empty");
                    var emptyColumn = {
                        field: emptyColumnField,
                        headerName: '',
                        sortable: false,
                        filterable: false,
                        groupable: false,
                        aggregable: false,
                        hideable: false,
                        disableColumnMenu: true,
                    };
                    pivotColumns.push(emptyColumn);
                    if (columnGroup) {
                        columnGroup.children.push({ field: emptyColumnField });
                    }
                }
                else {
                    visibleValues.forEach(function (pivotValue) {
                        var valueField = pivotValue.field;
                        var mapValueKey = "".concat(columnGroup.groupId).concat(columnGroupIdSeparator).concat(valueField);
                        var overrides = typeof pivotingColDef === 'function'
                            ? pivotingColDef(valueField, columnGroup.groupId.split(columnGroupIdSeparator))
                            : pivotingColDef;
                        var column = __assign(__assign(__assign({ headerName: String(valueField) }, getAttributesFromInitialColumn(pivotValue.field)), overrides), { field: mapValueKey, aggregable: false, groupable: false, filterable: false, hideable: false, editable: false, disableReorder: true, availableAggregationFunctions: [pivotValue.aggFunc] });
                        pivotColumns.push(column);
                        aggregationModel[mapValueKey] = pivotValue.aggFunc;
                        if (columnGroup) {
                            columnGroup.children.push({ field: mapValueKey });
                        }
                    });
                }
            }
            else {
                createColumns(columnGroup.children, depth + 1);
            }
        };
        for (var i = 0; i < columnGroups.length; i += 1) {
            _loop_3(i);
        }
    }
    createColumns(columnGroupingModel);
    var groupingColDefOverrides = function (params) { return (__assign(__assign({}, (typeof groupingColDef === 'function' ? groupingColDef(params) : groupingColDef || {})), {
        filterable: false,
        aggregable: false,
        hideable: false,
    })); };
    return {
        rows: visibleRows.length > 0 ? newRows : [],
        columns: pivotColumns,
        rowGroupingModel: visibleRows.map(function (row) { return row.field; }),
        aggregationModel: aggregationModel,
        getAggregationPosition: gridAggregationUtils_1.defaultGetAggregationPosition,
        columnVisibilityModel: columnVisibilityModel,
        columnGroupingModel: columnGroupingModel,
        groupingColDef: groupingColDefOverrides,
        headerFilters: false,
        disableAggregation: false,
        disableRowGrouping: false,
    };
};
exports.getPivotedData = getPivotedData;
