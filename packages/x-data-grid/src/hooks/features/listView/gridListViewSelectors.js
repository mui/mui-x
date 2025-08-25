"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gridListColumnSelector = exports.gridListViewSelector = void 0;
var createSelector_1 = require("../../../utils/createSelector");
/**
 * Get the list view state
 * @category List View
 * @ignore - Do not document
 */
exports.gridListViewSelector = (0, createSelector_1.createRootSelector)(function (state) { var _a; return (_a = state.props.listView) !== null && _a !== void 0 ? _a : false; });
/**
 * Get the list column definition
 * @category List View
 * @ignore - Do not document
 */
exports.gridListColumnSelector = (0, createSelector_1.createRootSelector)(function (state) { return state.listViewColumn; });
