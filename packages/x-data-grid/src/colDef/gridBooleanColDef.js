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
exports.GRID_BOOLEAN_COL_DEF = void 0;
var gridStringColDef_1 = require("./gridStringColDef");
var GridBooleanCell_1 = require("../components/cell/GridBooleanCell");
var GridEditBooleanCell_1 = require("../components/cell/GridEditBooleanCell");
var gridSortingUtils_1 = require("../hooks/features/sorting/gridSortingUtils");
var gridBooleanOperators_1 = require("./gridBooleanOperators");
var gridBooleanFormatter = function (value, row, column, apiRef) {
    return value
        ? apiRef.current.getLocaleText('booleanCellTrueLabel')
        : apiRef.current.getLocaleText('booleanCellFalseLabel');
};
var stringToBoolean = function (value) {
    switch (value.toLowerCase().trim()) {
        case 'true':
        case 'yes':
        case '1':
            return true;
        case 'false':
        case 'no':
        case '0':
        case 'null':
        case 'undefined':
            return false;
        default:
            return undefined;
    }
};
exports.GRID_BOOLEAN_COL_DEF = __assign(__assign({}, gridStringColDef_1.GRID_STRING_COL_DEF), { type: 'boolean', display: 'flex', align: 'center', headerAlign: 'center', renderCell: GridBooleanCell_1.renderBooleanCell, renderEditCell: GridEditBooleanCell_1.renderEditBooleanCell, sortComparator: gridSortingUtils_1.gridNumberComparator, valueFormatter: gridBooleanFormatter, filterOperators: (0, gridBooleanOperators_1.getGridBooleanOperators)(), getApplyQuickFilterFn: function () { return null; }, 
    // @ts-ignore
    aggregable: false, 
    // @ts-ignore
    pastedValueParser: function (value) { return stringToBoolean(value); } });
