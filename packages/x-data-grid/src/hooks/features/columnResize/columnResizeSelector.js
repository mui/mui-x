"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gridResizingColumnFieldSelector = exports.gridColumnResizeSelector = void 0;
var createSelector_1 = require("../../../utils/createSelector");
exports.gridColumnResizeSelector = (0, createSelector_1.createRootSelector)(function (state) { return state.columnResize; });
exports.gridResizingColumnFieldSelector = (0, createSelector_1.createSelector)(exports.gridColumnResizeSelector, function (columnResize) { return columnResize.resizingColumnField; });
