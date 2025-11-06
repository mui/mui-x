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
exports.GRID_TREE_DATA_GROUPING_COL_DEF_FORCED_PROPERTIES = exports.GRID_TREE_DATA_GROUPING_FIELD = exports.GRID_TREE_DATA_GROUPING_COL_DEF = void 0;
var x_data_grid_1 = require("@mui/x-data-grid");
var internals_1 = require("@mui/x-data-grid/internals");
Object.defineProperty(exports, "GRID_TREE_DATA_GROUPING_FIELD", { enumerable: true, get: function () { return internals_1.GRID_TREE_DATA_GROUPING_FIELD; } });
/**
 * TODO: Add sorting and filtering on the value and the filteredDescendantCount
 */
exports.GRID_TREE_DATA_GROUPING_COL_DEF = __assign(__assign({}, x_data_grid_1.GRID_STRING_COL_DEF), { type: 'custom', sortable: false, filterable: false, disableColumnMenu: true, disableReorder: true, align: 'left', width: 200, valueGetter: function (value, row, column, apiRef) {
        var rowId = (0, x_data_grid_1.gridRowIdSelector)(apiRef, row);
        var rowNode = (0, x_data_grid_1.gridRowNodeSelector)(apiRef, rowId);
        return (rowNode === null || rowNode === void 0 ? void 0 : rowNode.type) === 'group' || (rowNode === null || rowNode === void 0 ? void 0 : rowNode.type) === 'leaf' ? rowNode.groupingKey : undefined;
    } });
exports.GRID_TREE_DATA_GROUPING_COL_DEF_FORCED_PROPERTIES = {
    field: internals_1.GRID_TREE_DATA_GROUPING_FIELD,
    editable: false,
    groupable: false,
};
