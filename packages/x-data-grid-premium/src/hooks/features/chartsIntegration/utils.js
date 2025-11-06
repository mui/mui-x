"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBlockedForSection = exports.getBlockedSections = void 0;
var columnGroups_1 = require("../../../constants/columnGroups");
var getBlockedSections = function (column, rowGroupingModel, pivotModel) {
    // with pivoting, columns that are pivot values can only be added to the chart values
    // grid columns that are pivot rows can only be added to the chart dimensions
    // the rest of the columns can be added anywhere
    // pivoting columns are already filtered out by the chartable columns selector
    if (pivotModel) {
        var sections = [];
        var rows = pivotModel.rows.filter(function (item) { return item.hidden !== true; }).map(function (item) { return item.field; });
        var values = pivotModel.values
            .filter(function (item) { return item.hidden !== true; })
            .map(function (item) { return item.field; });
        // field names in the values contain the group path. We are comparing the last part of it (the actual field name used for the value)
        var unwrappedFieldName = column.field.split(columnGroups_1.COLUMN_GROUP_ID_SEPARATOR).pop();
        if (values.includes(unwrappedFieldName)) {
            sections.push('dimensions');
        }
        if (rows.includes(column.field)) {
            sections.push('values');
        }
        return sections;
    }
    // field that is already used for grouping cannot be added to the values
    if (rowGroupingModel.length > 0) {
        return rowGroupingModel.includes(column.field) ? ['values'] : [];
    }
    // without pivoting and row grouping the only constraint is that non-number columns cannot be added to the values
    if (column.type !== 'number') {
        return ['values'];
    }
    return [];
};
exports.getBlockedSections = getBlockedSections;
var isBlockedForSection = function (column, section, rowGroupingModel, pivotModel) { return (0, exports.getBlockedSections)(column, rowGroupingModel, pivotModel).includes(section); };
exports.isBlockedForSection = isBlockedForSection;
