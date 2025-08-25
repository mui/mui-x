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
exports.gridFocusedVirtualCellSelector = void 0;
var createSelector_1 = require("../../../utils/createSelector");
var gridColumnsSelector_1 = require("../columns/gridColumnsSelector");
var gridVirtualizationSelectors_1 = require("./gridVirtualizationSelectors");
var focus_1 = require("../focus");
var pagination_1 = require("../pagination");
var gridIsFocusedCellOutOfContext = (0, createSelector_1.createSelector)(focus_1.gridFocusCellSelector, gridVirtualizationSelectors_1.gridRenderContextSelector, pagination_1.gridVisibleRowsSelector, gridColumnsSelector_1.gridVisibleColumnDefinitionsSelector, function (focusedCell, renderContext, currentPage, visibleColumns) {
    if (!focusedCell) {
        return false;
    }
    var rowIndex = currentPage.rowIdToIndexMap.get(focusedCell.id);
    var columnIndex = visibleColumns
        .slice(renderContext.firstColumnIndex, renderContext.lastColumnIndex)
        .findIndex(function (column) { return column.field === focusedCell.field; });
    var isInRenderContext = rowIndex !== undefined &&
        columnIndex !== -1 &&
        rowIndex >= renderContext.firstRowIndex &&
        rowIndex <= renderContext.lastRowIndex;
    return !isInRenderContext;
});
exports.gridFocusedVirtualCellSelector = (0, createSelector_1.createSelectorMemoized)(gridIsFocusedCellOutOfContext, gridColumnsSelector_1.gridVisibleColumnDefinitionsSelector, pagination_1.gridVisibleRowsSelector, focus_1.gridFocusCellSelector, function (isFocusedCellOutOfRenderContext, visibleColumns, currentPage, focusedCell) {
    if (!isFocusedCellOutOfRenderContext) {
        return null;
    }
    var rowIndex = currentPage.rowIdToIndexMap.get(focusedCell.id);
    if (rowIndex === undefined) {
        return null;
    }
    var columnIndex = visibleColumns.findIndex(function (column) { return column.field === focusedCell.field; });
    if (columnIndex === -1) {
        return null;
    }
    return __assign(__assign({}, focusedCell), { rowIndex: rowIndex, columnIndex: columnIndex });
});
