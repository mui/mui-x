"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGridSingleSelectOperators = void 0;
var GridFilterInputSingleSelect_1 = require("../components/panel/filterPanel/GridFilterInputSingleSelect");
var GridFilterInputMultipleSingleSelect_1 = require("../components/panel/filterPanel/GridFilterInputMultipleSingleSelect");
var utils_1 = require("../utils/utils");
var parseObjectValue = function (value) {
    if (value == null || !(0, utils_1.isObject)(value)) {
        return value;
    }
    return value.value;
};
var getGridSingleSelectOperators = function () { return [
    {
        value: 'is',
        getApplyFilterFn: function (filterItem) {
            if (filterItem.value == null || filterItem.value === '') {
                return null;
            }
            return function (value) { return parseObjectValue(value) === parseObjectValue(filterItem.value); };
        },
        InputComponent: GridFilterInputSingleSelect_1.GridFilterInputSingleSelect,
    },
    {
        value: 'not',
        getApplyFilterFn: function (filterItem) {
            if (filterItem.value == null || filterItem.value === '') {
                return null;
            }
            return function (value) { return parseObjectValue(value) !== parseObjectValue(filterItem.value); };
        },
        InputComponent: GridFilterInputSingleSelect_1.GridFilterInputSingleSelect,
    },
    {
        value: 'isAnyOf',
        getApplyFilterFn: function (filterItem) {
            if (!Array.isArray(filterItem.value) || filterItem.value.length === 0) {
                return null;
            }
            var filterItemValues = filterItem.value.map(parseObjectValue);
            return function (value) { return filterItemValues.includes(parseObjectValue(value)); };
        },
        InputComponent: GridFilterInputMultipleSingleSelect_1.GridFilterInputMultipleSingleSelect,
    },
]; };
exports.getGridSingleSelectOperators = getGridSingleSelectOperators;
