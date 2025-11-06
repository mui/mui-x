"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultGetRowsToExport = exports.getColumnsToExport = void 0;
var columns_1 = require("../columns");
var filter_1 = require("../filter");
var gridRowsSelector_1 = require("../rows/gridRowsSelector");
var gridRowSelectionSelector_1 = require("../rowSelection/gridRowSelectionSelector");
var getColumnsToExport = function (_a) {
    var apiRef = _a.apiRef, options = _a.options;
    var columns = (0, columns_1.gridColumnDefinitionsSelector)(apiRef);
    if (options.fields) {
        return options.fields.reduce(function (currentColumns, field) {
            var column = columns.find(function (col) { return col.field === field; });
            if (column) {
                currentColumns.push(column);
            }
            return currentColumns;
        }, []);
    }
    var validColumns = options.allColumns ? columns : (0, columns_1.gridVisibleColumnDefinitionsSelector)(apiRef);
    return validColumns.filter(function (column) { return column.disableExport !== true; });
};
exports.getColumnsToExport = getColumnsToExport;
var defaultGetRowsToExport = function (_a) {
    var _b, _c;
    var apiRef = _a.apiRef;
    var filteredSortedRowIds = (0, filter_1.gridFilteredSortedRowIdsSelector)(apiRef);
    var rowTree = (0, gridRowsSelector_1.gridRowTreeSelector)(apiRef);
    var selectedRowsCount = (0, gridRowSelectionSelector_1.gridRowSelectionCountSelector)(apiRef);
    var bodyRows = filteredSortedRowIds.filter(function (id) { return rowTree[id].type !== 'footer'; });
    var pinnedRows = (0, gridRowsSelector_1.gridPinnedRowsSelector)(apiRef);
    var topPinnedRowsIds = ((_b = pinnedRows === null || pinnedRows === void 0 ? void 0 : pinnedRows.top) === null || _b === void 0 ? void 0 : _b.map(function (row) { return row.id; })) || [];
    var bottomPinnedRowsIds = ((_c = pinnedRows === null || pinnedRows === void 0 ? void 0 : pinnedRows.bottom) === null || _c === void 0 ? void 0 : _c.map(function (row) { return row.id; })) || [];
    bodyRows.unshift.apply(bodyRows, topPinnedRowsIds);
    bodyRows.push.apply(bodyRows, bottomPinnedRowsIds);
    if (selectedRowsCount > 0) {
        var selectedRows_1 = (0, gridRowSelectionSelector_1.gridRowSelectionIdsSelector)(apiRef);
        return bodyRows.filter(function (id) { return selectedRows_1.has(id); });
    }
    return bodyRows;
};
exports.defaultGetRowsToExport = defaultGetRowsToExport;
