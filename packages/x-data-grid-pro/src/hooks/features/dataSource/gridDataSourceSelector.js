"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gridDataSourceErrorSelector = exports.gridDataSourceErrorsSelector = exports.gridDataSourceLoadingIdSelector = exports.gridDataSourceLoadingSelector = exports.gridDataSourceStateSelector = void 0;
var internals_1 = require("@mui/x-data-grid/internals");
exports.gridDataSourceStateSelector = (0, internals_1.createRootSelector)(function (state) { return state.dataSource; });
exports.gridDataSourceLoadingSelector = (0, internals_1.createSelector)(exports.gridDataSourceStateSelector, function (dataSource) { return dataSource.loading; });
exports.gridDataSourceLoadingIdSelector = (0, internals_1.createSelector)(exports.gridDataSourceStateSelector, function (dataSource, id) { var _a; return (_a = dataSource.loading[id]) !== null && _a !== void 0 ? _a : false; });
exports.gridDataSourceErrorsSelector = (0, internals_1.createSelector)(exports.gridDataSourceStateSelector, function (dataSource) { return dataSource.errors; });
exports.gridDataSourceErrorSelector = (0, internals_1.createSelector)(exports.gridDataSourceStateSelector, function (dataSource, id) { return dataSource.errors[id]; });
