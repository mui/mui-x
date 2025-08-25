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
exports.GRID_NUMERIC_COL_DEF = void 0;
var gridSortingUtils_1 = require("../hooks/features/sorting/gridSortingUtils");
var utils_1 = require("../utils/utils");
var gridNumericOperators_1 = require("./gridNumericOperators");
var gridStringColDef_1 = require("./gridStringColDef");
exports.GRID_NUMERIC_COL_DEF = __assign(__assign({}, gridStringColDef_1.GRID_STRING_COL_DEF), { type: 'number', align: 'right', headerAlign: 'right', sortComparator: gridSortingUtils_1.gridNumberComparator, valueParser: function (value) { return (value === '' ? null : Number(value)); }, valueFormatter: function (value) { return ((0, utils_1.isNumber)(value) ? value.toLocaleString() : value || ''); }, filterOperators: (0, gridNumericOperators_1.getGridNumericOperators)(), getApplyQuickFilterFn: gridNumericOperators_1.getGridNumericQuickFilterFn });
