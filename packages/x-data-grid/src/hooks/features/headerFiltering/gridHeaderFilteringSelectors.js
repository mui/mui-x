"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gridHeaderFilteringMenuSelector = exports.gridHeaderFilteringEditFieldSelector = exports.gridHeaderFilteringEnabledSelector = exports.gridHeaderFilteringStateSelector = void 0;
var createSelector_1 = require("../../../utils/createSelector");
exports.gridHeaderFilteringStateSelector = (0, createSelector_1.createRootSelector)(function (state) { return state.headerFiltering; });
exports.gridHeaderFilteringEnabledSelector = (0, createSelector_1.createSelector)(exports.gridHeaderFilteringStateSelector, 
// No initialization in MIT, so we need to default to false to be used by `getTotalHeaderHeight`
function (headerFilteringState) { var _a; return (_a = headerFilteringState === null || headerFilteringState === void 0 ? void 0 : headerFilteringState.enabled) !== null && _a !== void 0 ? _a : false; });
exports.gridHeaderFilteringEditFieldSelector = (0, createSelector_1.createSelector)(exports.gridHeaderFilteringStateSelector, function (headerFilteringState) { return headerFilteringState.editing; });
exports.gridHeaderFilteringMenuSelector = (0, createSelector_1.createSelector)(exports.gridHeaderFilteringStateSelector, function (headerFilteringState) { return headerFilteringState.menuOpen; });
