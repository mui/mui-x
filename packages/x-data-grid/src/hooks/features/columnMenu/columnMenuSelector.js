"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gridColumnMenuSelector = void 0;
var createSelector_1 = require("../../../utils/createSelector");
exports.gridColumnMenuSelector = (0, createSelector_1.createRootSelector)(function (state) { return state.columnMenu; });
