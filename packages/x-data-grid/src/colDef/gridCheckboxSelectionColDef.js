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
exports.GRID_CHECKBOX_SELECTION_COL_DEF = exports.GRID_CHECKBOX_SELECTION_FIELD = void 0;
var React = require("react");
var GridCellCheckboxRenderer_1 = require("../components/columnSelection/GridCellCheckboxRenderer");
var GridHeaderCheckbox_1 = require("../components/columnSelection/GridHeaderCheckbox");
var gridBooleanColDef_1 = require("./gridBooleanColDef");
var gridPropsSelectors_1 = require("../hooks/core/gridPropsSelectors");
exports.GRID_CHECKBOX_SELECTION_FIELD = '__check__';
exports.GRID_CHECKBOX_SELECTION_COL_DEF = __assign(__assign({}, gridBooleanColDef_1.GRID_BOOLEAN_COL_DEF), { type: 'custom', field: exports.GRID_CHECKBOX_SELECTION_FIELD, width: 50, resizable: false, sortable: false, filterable: false, 
    // @ts-ignore
    aggregable: false, disableColumnMenu: true, disableReorder: true, disableExport: true, getApplyQuickFilterFn: function () { return null; }, display: 'flex', valueGetter: function (value, row, column, apiRef) {
        var rowId = (0, gridPropsSelectors_1.gridRowIdSelector)(apiRef, row);
        return apiRef.current.isRowSelected(rowId);
    }, rowSpanValueGetter: function (_, row, column, apiRef) { return (0, gridPropsSelectors_1.gridRowIdSelector)(apiRef, row); }, renderHeader: function (params) { return <GridHeaderCheckbox_1.GridHeaderCheckbox {...params}/>; }, renderCell: function (params) { return <GridCellCheckboxRenderer_1.GridCellCheckboxRenderer {...params}/>; } });
