"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gridRowGroupingSanitizedModelSelector = exports.gridRowGroupingModelSelector = void 0;
var x_data_grid_pro_1 = require("@mui/x-data-grid-pro");
var internals_1 = require("@mui/x-data-grid-pro/internals");
var gridRowGroupingStateSelector = (0, internals_1.createRootSelector)(function (state) { return state.rowGrouping; });
exports.gridRowGroupingModelSelector = (0, internals_1.createSelector)(gridRowGroupingStateSelector, function (rowGrouping) { return rowGrouping.model; });
exports.gridRowGroupingSanitizedModelSelector = (0, internals_1.createSelectorMemoized)(exports.gridRowGroupingModelSelector, x_data_grid_pro_1.gridColumnLookupSelector, function (model, columnsLookup) { return model.filter(function (field) { return !!columnsLookup[field]; }); });
