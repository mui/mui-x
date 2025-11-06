"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gridRowSelectionIdsSelector = exports.gridRowSelectionCountSelector = exports.gridRowSelectionManagerSelector = exports.gridRowSelectionStateSelector = void 0;
var createSelector_1 = require("../../../utils/createSelector");
var gridRowsSelector_1 = require("../rows/gridRowsSelector");
var gridFilterSelector_1 = require("../filter/gridFilterSelector");
var gridRowSelectionManager_1 = require("../../../models/gridRowSelectionManager");
exports.gridRowSelectionStateSelector = (0, createSelector_1.createRootSelector)(function (state) { return state.rowSelection; });
exports.gridRowSelectionManagerSelector = (0, createSelector_1.createSelectorMemoized)(exports.gridRowSelectionStateSelector, gridRowSelectionManager_1.createRowSelectionManager);
exports.gridRowSelectionCountSelector = (0, createSelector_1.createSelector)(exports.gridRowSelectionStateSelector, gridFilterSelector_1.gridFilteredRowCountSelector, function (selection, filteredRowCount) {
    if (selection.type === 'include') {
        return selection.ids.size;
    }
    // In exclude selection, all rows are selectable.
    return filteredRowCount - selection.ids.size;
});
exports.gridRowSelectionIdsSelector = (0, createSelector_1.createSelectorMemoized)(exports.gridRowSelectionStateSelector, gridRowsSelector_1.gridRowsLookupSelector, gridRowsSelector_1.gridDataRowIdsSelector, function (selectionModel, rowsLookup, rowIds) {
    var map = new Map();
    if (selectionModel.type === 'include') {
        for (var _i = 0, _a = selectionModel.ids; _i < _a.length; _i++) {
            var id = _a[_i];
            map.set(id, rowsLookup[id]);
        }
    }
    else {
        for (var i = 0; i < rowIds.length; i += 1) {
            var id = rowIds[i];
            if (!selectionModel.ids.has(id)) {
                map.set(id, rowsLookup[id]);
            }
        }
    }
    return map;
});
