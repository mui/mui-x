"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGridNumericOperators = exports.getGridNumericQuickFilterFn = void 0;
var GridFilterInputValue_1 = require("../components/panel/filterPanel/GridFilterInputValue");
var GridFilterInputMultipleValue_1 = require("../components/panel/filterPanel/GridFilterInputMultipleValue");
var parseNumericValue = function (value) {
    if (value == null) {
        return null;
    }
    return Number(value);
};
var getGridNumericQuickFilterFn = function (value) {
    if (value == null || Number.isNaN(value) || value === '') {
        return null;
    }
    return function (columnValue) {
        return parseNumericValue(columnValue) === parseNumericValue(value);
    };
};
exports.getGridNumericQuickFilterFn = getGridNumericQuickFilterFn;
var getGridNumericOperators = function () { return [
    {
        value: '=',
        getApplyFilterFn: function (filterItem) {
            if (filterItem.value == null || Number.isNaN(filterItem.value)) {
                return null;
            }
            return function (value) {
                return parseNumericValue(value) === filterItem.value;
            };
        },
        InputComponent: GridFilterInputValue_1.GridFilterInputValue,
        InputComponentProps: { type: 'number' },
    },
    {
        value: '!=',
        getApplyFilterFn: function (filterItem) {
            if (filterItem.value == null || Number.isNaN(filterItem.value)) {
                return null;
            }
            return function (value) {
                return parseNumericValue(value) !== filterItem.value;
            };
        },
        InputComponent: GridFilterInputValue_1.GridFilterInputValue,
        InputComponentProps: { type: 'number' },
    },
    {
        value: '>',
        getApplyFilterFn: function (filterItem) {
            if (filterItem.value == null || Number.isNaN(filterItem.value)) {
                return null;
            }
            return function (value) {
                if (value == null) {
                    return false;
                }
                return parseNumericValue(value) > filterItem.value;
            };
        },
        InputComponent: GridFilterInputValue_1.GridFilterInputValue,
        InputComponentProps: { type: 'number' },
    },
    {
        value: '>=',
        getApplyFilterFn: function (filterItem) {
            if (filterItem.value == null || Number.isNaN(filterItem.value)) {
                return null;
            }
            return function (value) {
                if (value == null) {
                    return false;
                }
                return parseNumericValue(value) >= filterItem.value;
            };
        },
        InputComponent: GridFilterInputValue_1.GridFilterInputValue,
        InputComponentProps: { type: 'number' },
    },
    {
        value: '<',
        getApplyFilterFn: function (filterItem) {
            if (filterItem.value == null || Number.isNaN(filterItem.value)) {
                return null;
            }
            return function (value) {
                if (value == null) {
                    return false;
                }
                return parseNumericValue(value) < filterItem.value;
            };
        },
        InputComponent: GridFilterInputValue_1.GridFilterInputValue,
        InputComponentProps: { type: 'number' },
    },
    {
        value: '<=',
        getApplyFilterFn: function (filterItem) {
            if (filterItem.value == null || Number.isNaN(filterItem.value)) {
                return null;
            }
            return function (value) {
                if (value == null) {
                    return false;
                }
                return parseNumericValue(value) <= filterItem.value;
            };
        },
        InputComponent: GridFilterInputValue_1.GridFilterInputValue,
        InputComponentProps: { type: 'number' },
    },
    {
        value: 'isEmpty',
        getApplyFilterFn: function () {
            return function (value) {
                return value == null;
            };
        },
        requiresFilterValue: false,
    },
    {
        value: 'isNotEmpty',
        getApplyFilterFn: function () {
            return function (value) {
                return value != null;
            };
        },
        requiresFilterValue: false,
    },
    {
        value: 'isAnyOf',
        getApplyFilterFn: function (filterItem) {
            if (!Array.isArray(filterItem.value) || filterItem.value.length === 0) {
                return null;
            }
            return function (value) {
                return value != null && filterItem.value.includes(Number(value));
            };
        },
        InputComponent: GridFilterInputMultipleValue_1.GridFilterInputMultipleValue,
        InputComponentProps: { type: 'number' },
    },
]; };
exports.getGridNumericOperators = getGridNumericOperators;
