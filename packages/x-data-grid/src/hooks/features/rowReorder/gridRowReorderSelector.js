"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gridIsRowDragActiveSelector = exports.gridRowReorderStateSelector = void 0;
var createSelector_1 = require("../../../utils/createSelector");
exports.gridRowReorderStateSelector = (0, createSelector_1.createRootSelector)(function (state) { return state.rowReorder; });
exports.gridIsRowDragActiveSelector = (0, createSelector_1.createSelector)(exports.gridRowReorderStateSelector, function (rowReorder) { var _a; return (_a = rowReorder === null || rowReorder === void 0 ? void 0 : rowReorder.isActive) !== null && _a !== void 0 ? _a : false; });
