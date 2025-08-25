"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isGroupingColumn = exports.getRowGroupingCriteriaFromGroupingField = void 0;
var constants_1 = require("../constants");
var getRowGroupingCriteriaFromGroupingField = function (groupingColDefField) {
    var match = groupingColDefField.match(/^__row_group_by_columns_group_(.*)__$/);
    if (!match) {
        return null;
    }
    return match[1];
};
exports.getRowGroupingCriteriaFromGroupingField = getRowGroupingCriteriaFromGroupingField;
var isGroupingColumn = function (field) {
    return field === constants_1.GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD ||
        (0, exports.getRowGroupingCriteriaFromGroupingField)(field) !== null;
};
exports.isGroupingColumn = isGroupingColumn;
