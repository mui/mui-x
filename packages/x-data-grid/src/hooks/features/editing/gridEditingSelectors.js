"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gridEditCellStateSelector = exports.gridRowIsEditingSelector = exports.gridEditRowsStateSelector = void 0;
var createSelector_1 = require("../../../utils/createSelector");
var gridEditRowModel_1 = require("../../../models/gridEditRowModel");
/**
 * Select the row editing state.
 */
exports.gridEditRowsStateSelector = (0, createSelector_1.createRootSelector)(function (state) { return state.editRows; });
exports.gridRowIsEditingSelector = (0, createSelector_1.createSelector)(exports.gridEditRowsStateSelector, function (editRows, _a) {
    var rowId = _a.rowId, editMode = _a.editMode;
    return editMode === gridEditRowModel_1.GridEditModes.Row && Boolean(editRows[rowId]);
});
exports.gridEditCellStateSelector = (0, createSelector_1.createSelector)(exports.gridEditRowsStateSelector, function (editRows, _a) {
    var _b, _c;
    var rowId = _a.rowId, field = _a.field;
    return (_c = (_b = editRows[rowId]) === null || _b === void 0 ? void 0 : _b[field]) !== null && _c !== void 0 ? _c : null;
});
