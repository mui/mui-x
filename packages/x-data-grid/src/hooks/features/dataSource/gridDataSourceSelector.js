"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gridGetRowsParamsSelector = void 0;
var gridFilterSelector_1 = require("../filter/gridFilterSelector");
var gridSortingSelector_1 = require("../sorting/gridSortingSelector");
var gridPaginationSelector_1 = require("../pagination/gridPaginationSelector");
var createSelector_1 = require("../../../utils/createSelector");
exports.gridGetRowsParamsSelector = (0, createSelector_1.createSelector)(gridFilterSelector_1.gridFilterModelSelector, gridSortingSelector_1.gridSortModelSelector, gridPaginationSelector_1.gridPaginationModelSelector, function (filterModel, sortModel, paginationModel) { return ({
    groupKeys: [],
    paginationModel: paginationModel,
    sortModel: sortModel,
    filterModel: filterModel,
    start: paginationModel.page * paginationModel.pageSize,
    end: paginationModel.page * paginationModel.pageSize + paginationModel.pageSize - 1,
}); });
