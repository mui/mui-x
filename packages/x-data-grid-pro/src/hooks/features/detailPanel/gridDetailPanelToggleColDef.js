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
exports.GRID_DETAIL_PANEL_TOGGLE_COL_DEF = exports.GRID_DETAIL_PANEL_TOGGLE_FIELD = void 0;
var React = require("react");
var x_data_grid_1 = require("@mui/x-data-grid");
var internals_1 = require("@mui/x-data-grid/internals");
Object.defineProperty(exports, "GRID_DETAIL_PANEL_TOGGLE_FIELD", { enumerable: true, get: function () { return internals_1.GRID_DETAIL_PANEL_TOGGLE_FIELD; } });
var GridDetailPanelToggleCell_1 = require("../../../components/GridDetailPanelToggleCell");
var gridDetailPanelSelector_1 = require("./gridDetailPanelSelector");
exports.GRID_DETAIL_PANEL_TOGGLE_COL_DEF = __assign(__assign({}, x_data_grid_1.GRID_STRING_COL_DEF), { type: 'custom', field: internals_1.GRID_DETAIL_PANEL_TOGGLE_FIELD, editable: false, sortable: false, filterable: false, resizable: false, 
    // @ts-ignore
    aggregable: false, disableColumnMenu: true, disableReorder: true, disableExport: true, align: 'left', width: 40, valueGetter: function (value, row, column, apiRef) {
        var rowId = (0, x_data_grid_1.gridRowIdSelector)(apiRef, row);
        var expandedRowIds = (0, gridDetailPanelSelector_1.gridDetailPanelExpandedRowIdsSelector)(apiRef);
        return expandedRowIds.has(rowId);
    }, rowSpanValueGetter: function (_, row, __, apiRef) { return (0, x_data_grid_1.gridRowIdSelector)(apiRef, row); }, renderCell: function (params) { return <GridDetailPanelToggleCell_1.GridDetailPanelToggleCell {...params}/>; }, renderHeader: function (_a) {
        var colDef = _a.colDef;
        return <div aria-label={colDef.headerName}/>;
    } });
