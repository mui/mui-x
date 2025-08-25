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
exports.GRID_ACTIONS_COL_DEF = exports.GRID_ACTIONS_COLUMN_TYPE = void 0;
var gridStringColDef_1 = require("./gridStringColDef");
var GridActionsCell_1 = require("../components/cell/GridActionsCell");
exports.GRID_ACTIONS_COLUMN_TYPE = 'actions';
exports.GRID_ACTIONS_COL_DEF = __assign(__assign({}, gridStringColDef_1.GRID_STRING_COL_DEF), { sortable: false, filterable: false, 
    // @ts-ignore
    aggregable: false, width: 100, display: 'flex', align: 'center', headerAlign: 'center', headerName: '', disableColumnMenu: true, disableExport: true, renderCell: GridActionsCell_1.renderActionsCell, getApplyQuickFilterFn: function () { return null; } });
