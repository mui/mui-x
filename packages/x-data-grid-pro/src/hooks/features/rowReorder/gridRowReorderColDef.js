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
exports.GRID_REORDER_COL_DEF = void 0;
var x_data_grid_1 = require("@mui/x-data-grid");
var GridRowReorderCell_1 = require("../../../components/GridRowReorderCell");
exports.GRID_REORDER_COL_DEF = __assign(__assign({}, x_data_grid_1.GRID_STRING_COL_DEF), { type: 'custom', field: '__reorder__', sortable: false, filterable: false, width: 50, align: 'center', headerAlign: 'center', disableColumnMenu: true, disableExport: true, disableReorder: true, resizable: false, 
    // @ts-ignore
    aggregable: false, renderHeader: function () { return ' '; }, renderCell: GridRowReorderCell_1.renderRowReorderCell, rowSpanValueGetter: function (_, row, __, apiRef) { return (0, x_data_grid_1.gridRowIdSelector)(apiRef, row); } });
