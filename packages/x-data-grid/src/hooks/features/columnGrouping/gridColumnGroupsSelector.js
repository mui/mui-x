"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gridColumnGroupsHeaderMaxDepthSelector = exports.gridColumnGroupsHeaderStructureSelector = exports.gridColumnGroupsLookupSelector = exports.gridColumnGroupsUnwrappedModelSelector = exports.gridColumnGroupingSelector = void 0;
var createSelector_1 = require("../../../utils/createSelector");
/**
 * @category ColumnGrouping
 * @ignore - do not document.
 */
exports.gridColumnGroupingSelector = (0, createSelector_1.createRootSelector)(function (state) { return state.columnGrouping; });
exports.gridColumnGroupsUnwrappedModelSelector = (0, createSelector_1.createSelectorMemoized)(exports.gridColumnGroupingSelector, function (columnGrouping) { var _a; return (_a = columnGrouping === null || columnGrouping === void 0 ? void 0 : columnGrouping.unwrappedGroupingModel) !== null && _a !== void 0 ? _a : {}; });
exports.gridColumnGroupsLookupSelector = (0, createSelector_1.createSelectorMemoized)(exports.gridColumnGroupingSelector, function (columnGrouping) { var _a; return (_a = columnGrouping === null || columnGrouping === void 0 ? void 0 : columnGrouping.lookup) !== null && _a !== void 0 ? _a : {}; });
exports.gridColumnGroupsHeaderStructureSelector = (0, createSelector_1.createSelectorMemoized)(exports.gridColumnGroupingSelector, function (columnGrouping) { var _a; return (_a = columnGrouping === null || columnGrouping === void 0 ? void 0 : columnGrouping.headerStructure) !== null && _a !== void 0 ? _a : []; });
exports.gridColumnGroupsHeaderMaxDepthSelector = (0, createSelector_1.createSelector)(exports.gridColumnGroupingSelector, function (columnGrouping) { var _a; return (_a = columnGrouping === null || columnGrouping === void 0 ? void 0 : columnGrouping.maxDepth) !== null && _a !== void 0 ? _a : 0; });
