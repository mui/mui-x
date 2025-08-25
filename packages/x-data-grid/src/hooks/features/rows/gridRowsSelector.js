"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gridPinnedRowsCountSelector = exports.gridPinnedRowsSelector = exports.gridAdditionalRowGroupsSelector = exports.gridDataRowsSelector = exports.gridDataRowIdsSelector = exports.gridRowMaximumTreeDepthSelector = exports.gridRowTreeDepthsSelector = exports.gridRowGroupingNameSelector = exports.gridRowGroupsToFetchSelector = exports.gridRowNodeSelector = exports.gridRowTreeSelector = exports.gridRowSelector = exports.gridRowsLookupSelector = exports.gridTopLevelRowCountSelector = exports.gridRowsLoadingSelector = exports.gridRowCountSelector = exports.gridRowsStateSelector = void 0;
var createSelector_1 = require("../../../utils/createSelector");
exports.gridRowsStateSelector = (0, createSelector_1.createRootSelector)(function (state) { return state.rows; });
exports.gridRowCountSelector = (0, createSelector_1.createSelector)(exports.gridRowsStateSelector, function (rows) { return rows.totalRowCount; });
exports.gridRowsLoadingSelector = (0, createSelector_1.createSelector)(exports.gridRowsStateSelector, function (rows) { return rows.loading; });
exports.gridTopLevelRowCountSelector = (0, createSelector_1.createSelector)(exports.gridRowsStateSelector, function (rows) { return rows.totalTopLevelRowCount; });
// TODO rows v6: Rename
exports.gridRowsLookupSelector = (0, createSelector_1.createSelector)(exports.gridRowsStateSelector, function (rows) { return rows.dataRowIdToModelLookup; });
exports.gridRowSelector = (0, createSelector_1.createSelector)(exports.gridRowsLookupSelector, function (rows, id) { return rows[id]; });
exports.gridRowTreeSelector = (0, createSelector_1.createSelector)(exports.gridRowsStateSelector, function (rows) { return rows.tree; });
exports.gridRowNodeSelector = (0, createSelector_1.createSelector)(exports.gridRowTreeSelector, function (rowTree, rowId) { return rowTree[rowId]; });
exports.gridRowGroupsToFetchSelector = (0, createSelector_1.createSelector)(exports.gridRowsStateSelector, function (rows) { return rows.groupsToFetch; });
exports.gridRowGroupingNameSelector = (0, createSelector_1.createSelector)(exports.gridRowsStateSelector, function (rows) { return rows.groupingName; });
exports.gridRowTreeDepthsSelector = (0, createSelector_1.createSelector)(exports.gridRowsStateSelector, function (rows) { return rows.treeDepths; });
exports.gridRowMaximumTreeDepthSelector = (0, createSelector_1.createSelectorMemoized)(exports.gridRowsStateSelector, function (rows) {
    var _a;
    var entries = Object.entries(rows.treeDepths);
    if (entries.length === 0) {
        return 1;
    }
    return (((_a = entries
        .filter(function (_a) {
        var nodeCount = _a[1];
        return nodeCount > 0;
    })
        .map(function (_a) {
        var depth = _a[0];
        return Number(depth);
    })
        .sort(function (a, b) { return b - a; })[0]) !== null && _a !== void 0 ? _a : 0) + 1);
});
exports.gridDataRowIdsSelector = (0, createSelector_1.createSelector)(exports.gridRowsStateSelector, function (rows) { return rows.dataRowIds; });
exports.gridDataRowsSelector = (0, createSelector_1.createSelectorMemoized)(exports.gridDataRowIdsSelector, exports.gridRowsLookupSelector, function (dataRowIds, rowsLookup) {
    return dataRowIds.reduce(function (acc, id) {
        if (!rowsLookup[id]) {
            return acc;
        }
        acc.push(rowsLookup[id]);
        return acc;
    }, []);
});
/**
 * @ignore - do not document.
 */
exports.gridAdditionalRowGroupsSelector = (0, createSelector_1.createSelector)(exports.gridRowsStateSelector, function (rows) { return rows === null || rows === void 0 ? void 0 : rows.additionalRowGroups; });
/**
 * @ignore - do not document.
 */
exports.gridPinnedRowsSelector = (0, createSelector_1.createSelectorMemoized)(exports.gridAdditionalRowGroupsSelector, function (additionalRowGroups) {
    var _a, _b, _c, _d;
    var rawPinnedRows = additionalRowGroups === null || additionalRowGroups === void 0 ? void 0 : additionalRowGroups.pinnedRows;
    return {
        bottom: (_b = (_a = rawPinnedRows === null || rawPinnedRows === void 0 ? void 0 : rawPinnedRows.bottom) === null || _a === void 0 ? void 0 : _a.map(function (rowEntry) {
            var _a;
            return ({
                id: rowEntry.id,
                model: (_a = rowEntry.model) !== null && _a !== void 0 ? _a : {},
            });
        })) !== null && _b !== void 0 ? _b : [],
        top: (_d = (_c = rawPinnedRows === null || rawPinnedRows === void 0 ? void 0 : rawPinnedRows.top) === null || _c === void 0 ? void 0 : _c.map(function (rowEntry) {
            var _a;
            return ({
                id: rowEntry.id,
                model: (_a = rowEntry.model) !== null && _a !== void 0 ? _a : {},
            });
        })) !== null && _d !== void 0 ? _d : [],
    };
});
/**
 * @ignore - do not document.
 */
exports.gridPinnedRowsCountSelector = (0, createSelector_1.createSelector)(exports.gridPinnedRowsSelector, function (pinnedRows) {
    var _a, _b;
    return (((_a = pinnedRows === null || pinnedRows === void 0 ? void 0 : pinnedRows.top) === null || _a === void 0 ? void 0 : _a.length) || 0) + (((_b = pinnedRows === null || pinnedRows === void 0 ? void 0 : pinnedRows.bottom) === null || _b === void 0 ? void 0 : _b.length) || 0);
});
