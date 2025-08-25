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
exports.GRID_DATETIME_COL_DEF = exports.GRID_DATE_COL_DEF = exports.gridDateTimeFormatter = exports.gridDateFormatter = void 0;
var gridSortingUtils_1 = require("../hooks/features/sorting/gridSortingUtils");
var gridDateOperators_1 = require("./gridDateOperators");
var gridStringColDef_1 = require("./gridStringColDef");
var GridEditDateCell_1 = require("../components/cell/GridEditDateCell");
var gridPropsSelectors_1 = require("../hooks/core/gridPropsSelectors");
function throwIfNotDateObject(_a) {
    var value = _a.value, columnType = _a.columnType, rowId = _a.rowId, field = _a.field;
    if (!(value instanceof Date)) {
        throw new Error([
            "MUI X: `".concat(columnType, "` column type only accepts `Date` objects as values."),
            'Use `valueGetter` to transform the value into a `Date` object.',
            "Row ID: ".concat(rowId, ", field: \"").concat(field, "\"."),
        ].join('\n'));
    }
}
var gridDateFormatter = function (value, row, column, apiRef) {
    if (!value) {
        return '';
    }
    var rowId = (0, gridPropsSelectors_1.gridRowIdSelector)(apiRef, row);
    throwIfNotDateObject({ value: value, columnType: 'date', rowId: rowId, field: column.field });
    return value.toLocaleDateString();
};
exports.gridDateFormatter = gridDateFormatter;
var gridDateTimeFormatter = function (value, row, column, apiRef) {
    if (!value) {
        return '';
    }
    var rowId = (0, gridPropsSelectors_1.gridRowIdSelector)(apiRef, row);
    throwIfNotDateObject({ value: value, columnType: 'dateTime', rowId: rowId, field: column.field });
    return value.toLocaleString();
};
exports.gridDateTimeFormatter = gridDateTimeFormatter;
exports.GRID_DATE_COL_DEF = __assign(__assign({}, gridStringColDef_1.GRID_STRING_COL_DEF), { type: 'date', sortComparator: gridSortingUtils_1.gridDateComparator, valueFormatter: exports.gridDateFormatter, filterOperators: (0, gridDateOperators_1.getGridDateOperators)(), renderEditCell: GridEditDateCell_1.renderEditDateCell, 
    // @ts-ignore
    pastedValueParser: function (value) { return new Date(value); } });
exports.GRID_DATETIME_COL_DEF = __assign(__assign({}, gridStringColDef_1.GRID_STRING_COL_DEF), { type: 'dateTime', sortComparator: gridSortingUtils_1.gridDateComparator, valueFormatter: exports.gridDateTimeFormatter, filterOperators: (0, gridDateOperators_1.getGridDateOperators)(true), renderEditCell: GridEditDateCell_1.renderEditDateCell, 
    // @ts-ignore
    pastedValueParser: function (value) { return new Date(value); } });
