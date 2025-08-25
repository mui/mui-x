"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gridFilterActiveItemsLookupSelector = exports.gridFilterActiveItemsSelector = exports.gridFilteredDescendantRowCountSelector = exports.gridFilteredRowCountSelector = exports.gridFilteredTopLevelRowCountSelector = exports.gridExpandedRowCountSelector = exports.gridFilteredSortedTopLevelRowEntriesSelector = exports.gridExpandedSortedRowTreeLevelPositionLookupSelector = exports.gridFilteredSortedRowIdsSelector = exports.gridFilteredSortedRowEntriesSelector = exports.gridExpandedSortedRowIdsSelector = exports.gridExpandedSortedRowEntriesSelector = exports.gridFilteredDescendantCountLookupSelector = exports.gridFilteredChildrenCountLookupSelector = exports.gridFilteredRowsLookupSelector = exports.gridVisibleRowsLookupSelector = exports.gridQuickFilterValuesSelector = exports.gridFilterModelSelector = void 0;
var isObjectEmpty_1 = require("@mui/x-internals/isObjectEmpty");
var createSelector_1 = require("../../../utils/createSelector");
var gridSortingSelector_1 = require("../sorting/gridSortingSelector");
var gridColumnsSelector_1 = require("../columns/gridColumnsSelector");
var gridRowsSelector_1 = require("../rows/gridRowsSelector");
/**
 * @category Filtering
 */
var gridFilterStateSelector = (0, createSelector_1.createRootSelector)(function (state) { return state.filter; });
/**
 * Get the current filter model.
 * @category Filtering
 */
exports.gridFilterModelSelector = (0, createSelector_1.createSelector)(gridFilterStateSelector, function (filterState) { return filterState.filterModel; });
/**
 * Get the current quick filter values.
 * @category Filtering
 */
exports.gridQuickFilterValuesSelector = (0, createSelector_1.createSelector)(exports.gridFilterModelSelector, function (filterModel) { return filterModel.quickFilterValues; });
/**
 * @category Visible rows
 * @ignore - do not document.
 */
exports.gridVisibleRowsLookupSelector = (0, createSelector_1.createRootSelector)(function (state) { return state.visibleRowsLookup; });
/**
 * @category Filtering
 * @ignore - do not document.
 */
exports.gridFilteredRowsLookupSelector = (0, createSelector_1.createSelector)(gridFilterStateSelector, function (filterState) { return filterState.filteredRowsLookup; });
/**
 * @category Filtering
 * @ignore - do not document.
 */
exports.gridFilteredChildrenCountLookupSelector = (0, createSelector_1.createSelector)(gridFilterStateSelector, function (filterState) { return filterState.filteredChildrenCountLookup; });
/**
 * @category Filtering
 * @ignore - do not document.
 */
exports.gridFilteredDescendantCountLookupSelector = (0, createSelector_1.createSelector)(gridFilterStateSelector, function (filterState) { return filterState.filteredDescendantCountLookup; });
/**
 * Get the id and the model of the rows accessible after the filtering process.
 * Does not contain the collapsed children.
 * @category Filtering
 */
exports.gridExpandedSortedRowEntriesSelector = (0, createSelector_1.createSelectorMemoized)(exports.gridVisibleRowsLookupSelector, gridSortingSelector_1.gridSortedRowEntriesSelector, function (visibleRowsLookup, sortedRows) {
    if ((0, isObjectEmpty_1.isObjectEmpty)(visibleRowsLookup)) {
        return sortedRows;
    }
    return sortedRows.filter(function (row) { return visibleRowsLookup[row.id] !== false; });
});
/**
 * Get the id of the rows accessible after the filtering process.
 * Does not contain the collapsed children.
 * @category Filtering
 */
exports.gridExpandedSortedRowIdsSelector = (0, createSelector_1.createSelectorMemoized)(exports.gridExpandedSortedRowEntriesSelector, function (visibleSortedRowEntries) { return visibleSortedRowEntries.map(function (row) { return row.id; }); });
/**
 * Get the id and the model of the rows accessible after the filtering process.
 * Contains the collapsed children.
 * @category Filtering
 */
exports.gridFilteredSortedRowEntriesSelector = (0, createSelector_1.createSelectorMemoized)(exports.gridFilteredRowsLookupSelector, gridSortingSelector_1.gridSortedRowEntriesSelector, function (filteredRowsLookup, sortedRows) {
    return (0, isObjectEmpty_1.isObjectEmpty)(filteredRowsLookup)
        ? sortedRows
        : sortedRows.filter(function (row) { return filteredRowsLookup[row.id] !== false; });
});
/**
 * Get the id of the rows accessible after the filtering process.
 * Contains the collapsed children.
 * @category Filtering
 */
exports.gridFilteredSortedRowIdsSelector = (0, createSelector_1.createSelectorMemoized)(exports.gridFilteredSortedRowEntriesSelector, function (filteredSortedRowEntries) { return filteredSortedRowEntries.map(function (row) { return row.id; }); });
/**
 * Get the ids to position in the current tree level lookup of the rows accessible after the filtering process.
 * Does not contain the collapsed children.
 * @category Filtering
 * @ignore - do not document.
 */
exports.gridExpandedSortedRowTreeLevelPositionLookupSelector = (0, createSelector_1.createSelectorMemoized)(exports.gridExpandedSortedRowIdsSelector, gridRowsSelector_1.gridRowTreeSelector, function (visibleSortedRowIds, rowTree) {
    var depthPositionCounter = {};
    var lastDepth = 0;
    return visibleSortedRowIds.reduce(function (acc, rowId) {
        var rowNode = rowTree[rowId];
        if (!depthPositionCounter[rowNode.depth]) {
            depthPositionCounter[rowNode.depth] = 0;
        }
        // going deeper in the tree should reset the counter
        // since it might have been used in some other branch at the same level, up in the tree
        // going back up should keep the counter and continue where it left off
        if (rowNode.depth > lastDepth) {
            depthPositionCounter[rowNode.depth] = 0;
        }
        lastDepth = rowNode.depth;
        depthPositionCounter[rowNode.depth] += 1;
        acc[rowId] = depthPositionCounter[rowNode.depth];
        return acc;
    }, {});
});
/**
 * Get the id and the model of the top level rows accessible after the filtering process.
 * @category Filtering
 */
exports.gridFilteredSortedTopLevelRowEntriesSelector = (0, createSelector_1.createSelectorMemoized)(exports.gridExpandedSortedRowEntriesSelector, gridRowsSelector_1.gridRowTreeSelector, gridRowsSelector_1.gridRowMaximumTreeDepthSelector, function (visibleSortedRows, rowTree, rowTreeDepth) {
    if (rowTreeDepth < 2) {
        return visibleSortedRows;
    }
    return visibleSortedRows.filter(function (row) { var _a; return ((_a = rowTree[row.id]) === null || _a === void 0 ? void 0 : _a.depth) === 0; });
});
/**
 * Get the amount of rows accessible after the filtering process.
 * @category Filtering
 */
exports.gridExpandedRowCountSelector = (0, createSelector_1.createSelector)(exports.gridExpandedSortedRowEntriesSelector, function (visibleSortedRows) { return visibleSortedRows.length; });
/**
 * Get the amount of top level rows accessible after the filtering process.
 * @category Filtering
 */
exports.gridFilteredTopLevelRowCountSelector = (0, createSelector_1.createSelector)(exports.gridFilteredSortedTopLevelRowEntriesSelector, function (visibleSortedTopLevelRows) { return visibleSortedTopLevelRows.length; });
/**
 * Get the amount of rows accessible after the filtering process.
 * Includes top level and descendant rows.
 * @category Filtering
 */
exports.gridFilteredRowCountSelector = (0, createSelector_1.createSelector)(exports.gridFilteredSortedRowEntriesSelector, function (filteredSortedRowEntries) { return filteredSortedRowEntries.length; });
/**
 * Get the amount of descendant rows accessible after the filtering process.
 * @category Filtering
 */
exports.gridFilteredDescendantRowCountSelector = (0, createSelector_1.createSelector)(exports.gridFilteredRowCountSelector, exports.gridFilteredTopLevelRowCountSelector, function (totalRowCount, topLevelRowCount) { return totalRowCount - topLevelRowCount; });
/**
 * @category Filtering
 * @ignore - do not document.
 */
exports.gridFilterActiveItemsSelector = (0, createSelector_1.createSelectorMemoized)(exports.gridFilterModelSelector, gridColumnsSelector_1.gridColumnLookupSelector, function (filterModel, columnLookup) {
    var _a;
    return (_a = filterModel.items) === null || _a === void 0 ? void 0 : _a.filter(function (item) {
        var _a, _b;
        if (!item.field) {
            return false;
        }
        var column = columnLookup[item.field];
        if (!(column === null || column === void 0 ? void 0 : column.filterOperators) || ((_a = column === null || column === void 0 ? void 0 : column.filterOperators) === null || _a === void 0 ? void 0 : _a.length) === 0) {
            return false;
        }
        var filterOperator = column.filterOperators.find(function (operator) { return operator.value === item.operator; });
        if (!filterOperator) {
            return false;
        }
        return (!filterOperator.InputComponent || (item.value != null && ((_b = item.value) === null || _b === void 0 ? void 0 : _b.toString()) !== ''));
    });
});
/**
 * @category Filtering
 * @ignore - do not document.
 */
exports.gridFilterActiveItemsLookupSelector = (0, createSelector_1.createSelectorMemoized)(exports.gridFilterActiveItemsSelector, function (activeFilters) {
    var result = activeFilters.reduce(function (res, filterItem) {
        if (!res[filterItem.field]) {
            res[filterItem.field] = [filterItem];
        }
        else {
            res[filterItem.field].push(filterItem);
        }
        return res;
    }, {});
    return result;
});
