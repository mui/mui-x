"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gridPivotInitialColumnsSelector = exports.gridPivotActiveSelector = void 0;
var createSelector_1 = require("../../../utils/createSelector");
var gridPivotingStateSelector = (0, createSelector_1.createRootSelector)(
// @ts-ignore
function (state) { return state.pivoting; });
exports.gridPivotActiveSelector = (0, createSelector_1.createSelector)(gridPivotingStateSelector, function (pivoting) { return pivoting === null || pivoting === void 0 ? void 0 : pivoting.active; });
var emptyColumns = new Map();
exports.gridPivotInitialColumnsSelector = (0, createSelector_1.createSelector)(gridPivotingStateSelector, function (pivoting) { return (pivoting === null || pivoting === void 0 ? void 0 : pivoting.initialColumns) || emptyColumns; });
