"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GRID_TEXT_COL_DEF = void 0;
var GridEditTextareaCell_1 = require("../components/cell/GridEditTextareaCell");
var gridSortingUtils_1 = require("../hooks/features/sorting/gridSortingUtils");
var gridStringOperators_1 = require("./gridStringOperators");
/**
 * TODO: Move pro and premium properties outside of this Community file
 */
exports.GRID_TEXT_COL_DEF = {
    width: 100,
    minWidth: 50,
    maxWidth: Infinity,
    hideable: true,
    sortable: true,
    resizable: true,
    filterable: true,
    groupable: true,
    pinnable: true,
    // @ts-ignore
    aggregable: true,
    chartable: true,
    editable: false,
    sortComparator: gridSortingUtils_1.gridStringOrNumberComparator,
    type: 'text',
    align: 'left',
    filterOperators: (0, gridStringOperators_1.getGridStringOperators)(),
    renderEditCell: GridEditTextareaCell_1.renderEditTextareaCell,
    getApplyQuickFilterFn: gridStringOperators_1.getGridStringQuickFilterFn,
};
