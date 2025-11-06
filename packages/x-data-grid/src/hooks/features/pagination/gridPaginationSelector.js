"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gridVisibleRowsSelector = exports.gridPaginatedVisibleSortedGridRowIdsSelector = exports.gridPaginatedVisibleSortedGridRowEntriesSelector = exports.gridPaginationRowRangeSelector = exports.gridPageCountSelector = exports.gridPageSizeSelector = exports.gridPageSelector = exports.gridPaginationMetaSelector = exports.gridPaginationRowCountSelector = exports.gridPaginationModelSelector = exports.gridPaginationEnabledClientSideSelector = exports.gridPaginationSelector = void 0;
var createSelector_1 = require("../../../utils/createSelector");
var gridFilterSelector_1 = require("../filter/gridFilterSelector");
var gridRowsSelector_1 = require("../rows/gridRowsSelector");
var gridPaginationUtils_1 = require("./gridPaginationUtils");
var ALL_RESULTS_PAGE_VALUE = -1;
/**
 * @category Pagination
 * @ignore - do not document.
 */
exports.gridPaginationSelector = (0, createSelector_1.createRootSelector)(function (state) { return state.pagination; });
/**
 * @category Pagination
 * @ignore - do not document.
 */
exports.gridPaginationEnabledClientSideSelector = (0, createSelector_1.createSelector)(exports.gridPaginationSelector, function (pagination) { return pagination.enabled && pagination.paginationMode === 'client'; });
/**
 * Get the pagination model
 * @category Pagination
 */
exports.gridPaginationModelSelector = (0, createSelector_1.createSelector)(exports.gridPaginationSelector, function (pagination) { return pagination.paginationModel; });
/**
 * Get the row count
 * @category Pagination
 */
exports.gridPaginationRowCountSelector = (0, createSelector_1.createSelector)(exports.gridPaginationSelector, function (pagination) { return pagination.rowCount; });
/**
 * Get the pagination meta
 * @category Pagination
 */
exports.gridPaginationMetaSelector = (0, createSelector_1.createSelector)(exports.gridPaginationSelector, function (pagination) { return pagination.meta; });
/**
 * Get the index of the page to render if the pagination is enabled
 * @category Pagination
 */
exports.gridPageSelector = (0, createSelector_1.createSelector)(exports.gridPaginationModelSelector, function (paginationModel) { return paginationModel.page; });
/**
 * Get the maximum amount of rows to display on a single page if the pagination is enabled
 * @category Pagination
 */
exports.gridPageSizeSelector = (0, createSelector_1.createSelector)(exports.gridPaginationModelSelector, function (paginationModel) { return paginationModel.pageSize; });
/**
 * Get the amount of pages needed to display all the rows if the pagination is enabled
 * @category Pagination
 */
exports.gridPageCountSelector = (0, createSelector_1.createSelector)(exports.gridPaginationModelSelector, exports.gridPaginationRowCountSelector, function (paginationModel, rowCount) {
    return (0, gridPaginationUtils_1.getPageCount)(rowCount, paginationModel.pageSize, paginationModel.page);
});
/**
 * Get the index of the first and the last row to include in the current page if the pagination is enabled.
 * @category Pagination
 */
exports.gridPaginationRowRangeSelector = (0, createSelector_1.createSelectorMemoized)(exports.gridPaginationEnabledClientSideSelector, exports.gridPaginationModelSelector, gridRowsSelector_1.gridRowTreeSelector, gridRowsSelector_1.gridRowMaximumTreeDepthSelector, gridFilterSelector_1.gridExpandedSortedRowEntriesSelector, gridFilterSelector_1.gridFilteredSortedTopLevelRowEntriesSelector, function (clientSidePaginationEnabled, paginationModel, rowTree, rowTreeDepth, visibleSortedRowEntries, visibleSortedTopLevelRowEntries) {
    var _a;
    if (!clientSidePaginationEnabled) {
        return null;
    }
    var visibleTopLevelRowCount = visibleSortedTopLevelRowEntries.length;
    var topLevelFirstRowIndex = Math.min(paginationModel.pageSize * paginationModel.page, visibleTopLevelRowCount - 1);
    var topLevelLastRowIndex = paginationModel.pageSize === ALL_RESULTS_PAGE_VALUE
        ? visibleTopLevelRowCount - 1
        : Math.min(topLevelFirstRowIndex + paginationModel.pageSize - 1, visibleTopLevelRowCount - 1);
    // The range contains no element
    if (topLevelFirstRowIndex === -1 || topLevelLastRowIndex === -1) {
        return null;
    }
    // The tree is flat, there is no need to look for children
    if (rowTreeDepth < 2) {
        return { firstRowIndex: topLevelFirstRowIndex, lastRowIndex: topLevelLastRowIndex };
    }
    var topLevelFirstRow = visibleSortedTopLevelRowEntries[topLevelFirstRowIndex];
    var topLevelRowsInCurrentPageCount = topLevelLastRowIndex - topLevelFirstRowIndex + 1;
    var firstRowIndex = visibleSortedRowEntries.findIndex(function (row) { return row.id === topLevelFirstRow.id; });
    var lastRowIndex = firstRowIndex;
    var topLevelRowAdded = 0;
    while (lastRowIndex < visibleSortedRowEntries.length &&
        topLevelRowAdded <= topLevelRowsInCurrentPageCount) {
        var row = visibleSortedRowEntries[lastRowIndex];
        var depth = (_a = rowTree[row.id]) === null || _a === void 0 ? void 0 : _a.depth;
        if (depth === undefined) {
            lastRowIndex += 1;
        }
        else {
            if (topLevelRowAdded < topLevelRowsInCurrentPageCount || depth > 0) {
                lastRowIndex += 1;
            }
            if (depth === 0) {
                topLevelRowAdded += 1;
            }
        }
    }
    return { firstRowIndex: firstRowIndex, lastRowIndex: lastRowIndex - 1 };
});
/**
 * Get the id and the model of each row to include in the current page if the pagination is enabled.
 * @category Pagination
 */
exports.gridPaginatedVisibleSortedGridRowEntriesSelector = (0, createSelector_1.createSelectorMemoized)(gridFilterSelector_1.gridExpandedSortedRowEntriesSelector, exports.gridPaginationRowRangeSelector, function (visibleSortedRowEntries, paginationRange) {
    if (!paginationRange) {
        return [];
    }
    return visibleSortedRowEntries.slice(paginationRange.firstRowIndex, paginationRange.lastRowIndex + 1);
});
/**
 * Get the id of each row to include in the current page if the pagination is enabled.
 * @category Pagination
 */
exports.gridPaginatedVisibleSortedGridRowIdsSelector = (0, createSelector_1.createSelectorMemoized)(gridFilterSelector_1.gridExpandedSortedRowIdsSelector, exports.gridPaginationRowRangeSelector, function (visibleSortedRowIds, paginationRange) {
    if (!paginationRange) {
        return [];
    }
    return visibleSortedRowIds.slice(paginationRange.firstRowIndex, paginationRange.lastRowIndex + 1);
});
/**
 * Get the rows, range and rowIndex lookup map after filtering and sorting.
 * Does not contain the collapsed children.
 * @category Pagination
 */
exports.gridVisibleRowsSelector = (0, createSelector_1.createSelectorMemoized)(exports.gridPaginationEnabledClientSideSelector, exports.gridPaginationRowRangeSelector, exports.gridPaginatedVisibleSortedGridRowEntriesSelector, gridFilterSelector_1.gridExpandedSortedRowEntriesSelector, function (clientPaginationEnabled, paginationRowRange, paginationRows, expandedSortedRowEntries) {
    if (clientPaginationEnabled) {
        return {
            rows: paginationRows,
            range: paginationRowRange,
            rowIdToIndexMap: paginationRows.reduce(function (lookup, row, index) {
                lookup.set(row.id, index);
                return lookup;
            }, new Map()),
        };
    }
    return {
        rows: expandedSortedRowEntries,
        range: expandedSortedRowEntries.length === 0
            ? null
            : {
                firstRowIndex: 0,
                lastRowIndex: expandedSortedRowEntries.length - 1,
            },
        rowIdToIndexMap: expandedSortedRowEntries.reduce(function (lookup, row, index) {
            lookup.set(row.id, index);
            return lookup;
        }, new Map()),
    };
});
