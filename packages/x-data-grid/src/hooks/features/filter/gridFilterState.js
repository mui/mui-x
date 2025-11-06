"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultGridFilterModel = exports.defaultGridFilterLookup = void 0;
var gridFilterItem_1 = require("../../../models/gridFilterItem");
exports.defaultGridFilterLookup = {
    filteredRowsLookup: {},
    filteredChildrenCountLookup: {},
    filteredDescendantCountLookup: {},
};
var getDefaultGridFilterModel = function () { return ({
    items: [],
    logicOperator: gridFilterItem_1.GridLogicOperator.And,
    quickFilterValues: [],
    quickFilterLogicOperator: gridFilterItem_1.GridLogicOperator.And,
}); };
exports.getDefaultGridFilterModel = getDefaultGridFilterModel;
