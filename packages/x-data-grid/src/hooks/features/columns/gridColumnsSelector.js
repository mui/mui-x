"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gridHasColSpanSelector = exports.gridFilterableColumnLookupSelector = exports.gridFilterableColumnDefinitionsSelector = exports.gridColumnPositionsSelector = exports.gridVisiblePinnedColumnDefinitionsSelector = exports.gridExistingPinnedColumnSelector = exports.gridPinnedColumnsSelector = exports.gridVisibleColumnFieldsSelector = exports.gridVisibleColumnDefinitionsSelector = exports.gridInitialColumnVisibilityModelSelector = exports.gridColumnVisibilityModelSelector = exports.gridColumnDefinitionsSelector = exports.gridColumnLookupSelector = exports.gridColumnFieldsSelector = exports.gridColumnsStateSelector = void 0;
var createSelector_1 = require("../../../utils/createSelector");
var gridColumnsInterfaces_1 = require("./gridColumnsInterfaces");
var gridCoreSelector_1 = require("../../core/gridCoreSelector");
var listView_1 = require("../listView");
/**
 * Get the columns state
 * @category Columns
 */
exports.gridColumnsStateSelector = (0, createSelector_1.createRootSelector)(function (state) { return state.columns; });
/**
 * Get an array of column fields in the order rendered on screen.
 * @category Columns
 */
exports.gridColumnFieldsSelector = (0, createSelector_1.createSelector)(exports.gridColumnsStateSelector, function (columnsState) { return columnsState.orderedFields; });
/**
 * Get the columns as a lookup (an object containing the field for keys and the definition for values).
 * @category Columns
 */
exports.gridColumnLookupSelector = (0, createSelector_1.createSelector)(exports.gridColumnsStateSelector, function (columnsState) { return columnsState.lookup; });
/**
 * Get an array of column definitions in the order rendered on screen..
 * @category Columns
 */
exports.gridColumnDefinitionsSelector = (0, createSelector_1.createSelectorMemoized)(exports.gridColumnFieldsSelector, exports.gridColumnLookupSelector, function (allFields, lookup) { return allFields.map(function (field) { return lookup[field]; }); });
/**
 * Get the column visibility model, containing the visibility status of each column.
 * If a column is not registered in the model, it is visible.
 * @category Visible Columns
 */
exports.gridColumnVisibilityModelSelector = (0, createSelector_1.createSelector)(exports.gridColumnsStateSelector, function (columnsState) { return columnsState.columnVisibilityModel; });
/**
 * Get the "initial" column visibility model, containing the visibility status of each column.
 * It is updated when the `columns` prop is updated or when `updateColumns` API method is called.
 * If a column is not registered in the model, it is visible.
 * @category Visible Columns
 */
exports.gridInitialColumnVisibilityModelSelector = (0, createSelector_1.createSelector)(exports.gridColumnsStateSelector, function (columnsState) { return columnsState.initialColumnVisibilityModel; });
/**
 * Get the visible columns as a lookup (an object containing the field for keys and the definition for values).
 * @category Visible Columns
 */
exports.gridVisibleColumnDefinitionsSelector = (0, createSelector_1.createSelectorMemoized)(exports.gridColumnDefinitionsSelector, exports.gridColumnVisibilityModelSelector, listView_1.gridListViewSelector, listView_1.gridListColumnSelector, function (columns, columnVisibilityModel, listView, listColumn) {
    return listView && listColumn
        ? [listColumn]
        : columns.filter(function (column) { return columnVisibilityModel[column.field] !== false; });
});
/**
 * Get the field of each visible column.
 * @category Visible Columns
 */
exports.gridVisibleColumnFieldsSelector = (0, createSelector_1.createSelectorMemoized)(exports.gridVisibleColumnDefinitionsSelector, function (visibleColumns) { return visibleColumns.map(function (column) { return column.field; }); });
/**
 * Get the visible pinned columns model.
 * @category Visible Columns
 */
exports.gridPinnedColumnsSelector = (0, createSelector_1.createRootSelector)(function (state) { return state.pinnedColumns; });
/**
 * Get all existing pinned columns. Place the columns on the side that depends on the rtl state.
 * @category Pinned Columns
 * @ignore - Do not document
 */
exports.gridExistingPinnedColumnSelector = (0, createSelector_1.createSelectorMemoized)(exports.gridPinnedColumnsSelector, exports.gridColumnFieldsSelector, gridCoreSelector_1.gridIsRtlSelector, function (model, orderedFields, isRtl) { return filterMissingColumns(model, orderedFields, isRtl); });
/**
 * Get the visible pinned columns.
 * @category Visible Columns
 */
exports.gridVisiblePinnedColumnDefinitionsSelector = (0, createSelector_1.createSelectorMemoized)(exports.gridColumnsStateSelector, exports.gridPinnedColumnsSelector, exports.gridVisibleColumnFieldsSelector, gridCoreSelector_1.gridIsRtlSelector, listView_1.gridListViewSelector, function (columnsState, model, visibleColumnFields, isRtl, listView) {
    if (listView) {
        return gridColumnsInterfaces_1.EMPTY_PINNED_COLUMN_FIELDS;
    }
    var visiblePinnedFields = filterMissingColumns(model, visibleColumnFields, isRtl);
    var visiblePinnedColumns = {
        left: visiblePinnedFields.left.map(function (field) { return columnsState.lookup[field]; }),
        right: visiblePinnedFields.right.map(function (field) { return columnsState.lookup[field]; }),
    };
    return visiblePinnedColumns;
});
function filterMissingColumns(pinnedColumns, columns, invert) {
    var _a, _b;
    if (!Array.isArray(pinnedColumns.left) && !Array.isArray(pinnedColumns.right)) {
        return gridColumnsInterfaces_1.EMPTY_PINNED_COLUMN_FIELDS;
    }
    if (((_a = pinnedColumns.left) === null || _a === void 0 ? void 0 : _a.length) === 0 && ((_b = pinnedColumns.right) === null || _b === void 0 ? void 0 : _b.length) === 0) {
        return gridColumnsInterfaces_1.EMPTY_PINNED_COLUMN_FIELDS;
    }
    var filter = function (newPinnedColumns, remainingColumns) {
        if (!Array.isArray(newPinnedColumns)) {
            return [];
        }
        return newPinnedColumns.filter(function (field) { return remainingColumns.includes(field); });
    };
    var leftPinnedColumns = filter(pinnedColumns.left, columns);
    var columnsWithoutLeftPinnedColumns = columns.filter(
    // Filter out from the remaining columns those columns already pinned to the left
    function (field) { return !leftPinnedColumns.includes(field); });
    var rightPinnedColumns = filter(pinnedColumns.right, columnsWithoutLeftPinnedColumns);
    if (invert) {
        return { left: rightPinnedColumns, right: leftPinnedColumns };
    }
    return { left: leftPinnedColumns, right: rightPinnedColumns };
}
/**
 * Get the left position in pixel of each visible columns relative to the left of the first column.
 * @category Visible Columns
 */
exports.gridColumnPositionsSelector = (0, createSelector_1.createSelectorMemoized)(exports.gridVisibleColumnDefinitionsSelector, function (visibleColumns) {
    var positions = [];
    var currentPosition = 0;
    for (var i = 0; i < visibleColumns.length; i += 1) {
        positions.push(currentPosition);
        currentPosition += visibleColumns[i].computedWidth;
    }
    return positions;
});
/**
 * Get the filterable columns as an array.
 * @category Columns
 */
exports.gridFilterableColumnDefinitionsSelector = (0, createSelector_1.createSelectorMemoized)(exports.gridColumnDefinitionsSelector, function (columns) { return columns.filter(function (col) { return col.filterable; }); });
/**
 * Get the filterable columns as a lookup (an object containing the field for keys and the definition for values).
 * @category Columns
 */
exports.gridFilterableColumnLookupSelector = (0, createSelector_1.createSelectorMemoized)(exports.gridColumnDefinitionsSelector, function (columns) {
    return columns.reduce(function (acc, col) {
        if (col.filterable) {
            acc[col.field] = col;
        }
        return acc;
    }, {});
});
/**
 * Checks if some column has a colSpan field.
 * @category Columns
 * @ignore - Do not document
 */
exports.gridHasColSpanSelector = (0, createSelector_1.createSelectorMemoized)(exports.gridColumnDefinitionsSelector, function (columns) { return columns.some(function (column) { return column.colSpan !== undefined; }); });
