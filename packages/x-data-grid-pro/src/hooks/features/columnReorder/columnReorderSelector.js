"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gridColumnReorderDragColSelector = exports.gridColumnReorderSelector = void 0;
var internals_1 = require("@mui/x-data-grid/internals");
exports.gridColumnReorderSelector = (0, internals_1.createRootSelector)(function (state) { return state.columnReorder; });
exports.gridColumnReorderDragColSelector = (0, internals_1.createSelector)(exports.gridColumnReorderSelector, function (columnReorder) { return columnReorder.dragCol; });
