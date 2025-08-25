"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGridStringOperators = exports.getGridStringQuickFilterFn = void 0;
var GridFilterInputValue_1 = require("../components/panel/filterPanel/GridFilterInputValue");
var utils_1 = require("../utils/utils");
var GridFilterInputMultipleValue_1 = require("../components/panel/filterPanel/GridFilterInputMultipleValue");
var gridFilterUtils_1 = require("../hooks/features/filter/gridFilterUtils");
var getGridStringQuickFilterFn = function (value) {
    if (!value) {
        return null;
    }
    var filterRegex = new RegExp((0, utils_1.escapeRegExp)(value), 'i');
    return function (_, row, column, apiRef) {
        var columnValue = apiRef.current.getRowFormattedValue(row, column);
        if (apiRef.current.ignoreDiacritics) {
            columnValue = (0, gridFilterUtils_1.removeDiacritics)(columnValue);
        }
        return columnValue != null ? filterRegex.test(columnValue.toString()) : false;
    };
};
exports.getGridStringQuickFilterFn = getGridStringQuickFilterFn;
var createContainsFilterFn = function (disableTrim, negate) { return function (filterItem) {
    if (!filterItem.value) {
        return null;
    }
    var trimmedValue = disableTrim ? filterItem.value : filterItem.value.trim();
    var filterRegex = new RegExp((0, utils_1.escapeRegExp)(trimmedValue), 'i');
    return function (value) {
        if (value == null) {
            return negate;
        }
        var matches = filterRegex.test(String(value));
        return negate ? !matches : matches;
    };
}; };
var createEqualityFilterFn = function (disableTrim, negate) { return function (filterItem) {
    if (!filterItem.value) {
        return null;
    }
    var trimmedValue = disableTrim ? filterItem.value : filterItem.value.trim();
    var collator = new Intl.Collator(undefined, { sensitivity: 'base', usage: 'search' });
    return function (value) {
        if (value == null) {
            return negate;
        }
        var isEqual = collator.compare(trimmedValue, value.toString()) === 0;
        return negate ? !isEqual : isEqual;
    };
}; };
var createEmptyFilterFn = function (negate) { return function () {
    return function (value) {
        var isEmpty = value === '' || value == null;
        return negate ? !isEmpty : isEmpty;
    };
}; };
var getGridStringOperators = function (disableTrim) {
    if (disableTrim === void 0) { disableTrim = false; }
    return [
        {
            value: 'contains',
            getApplyFilterFn: createContainsFilterFn(disableTrim, false),
            InputComponent: GridFilterInputValue_1.GridFilterInputValue,
        },
        {
            value: 'doesNotContain',
            getApplyFilterFn: createContainsFilterFn(disableTrim, true),
            InputComponent: GridFilterInputValue_1.GridFilterInputValue,
        },
        {
            value: 'equals',
            getApplyFilterFn: createEqualityFilterFn(disableTrim, false),
            InputComponent: GridFilterInputValue_1.GridFilterInputValue,
        },
        {
            value: 'doesNotEqual',
            getApplyFilterFn: createEqualityFilterFn(disableTrim, true),
            InputComponent: GridFilterInputValue_1.GridFilterInputValue,
        },
        {
            value: 'startsWith',
            getApplyFilterFn: function (filterItem) {
                if (!filterItem.value) {
                    return null;
                }
                var filterItemValue = disableTrim ? filterItem.value : filterItem.value.trim();
                var filterRegex = new RegExp("^".concat((0, utils_1.escapeRegExp)(filterItemValue), ".*$"), 'i');
                return function (value) {
                    return value != null ? filterRegex.test(value.toString()) : false;
                };
            },
            InputComponent: GridFilterInputValue_1.GridFilterInputValue,
        },
        {
            value: 'endsWith',
            getApplyFilterFn: function (filterItem) {
                if (!filterItem.value) {
                    return null;
                }
                var filterItemValue = disableTrim ? filterItem.value : filterItem.value.trim();
                var filterRegex = new RegExp(".*".concat((0, utils_1.escapeRegExp)(filterItemValue), "$"), 'i');
                return function (value) {
                    return value != null ? filterRegex.test(value.toString()) : false;
                };
            },
            InputComponent: GridFilterInputValue_1.GridFilterInputValue,
        },
        {
            value: 'isEmpty',
            getApplyFilterFn: createEmptyFilterFn(false),
            requiresFilterValue: false,
        },
        {
            value: 'isNotEmpty',
            getApplyFilterFn: createEmptyFilterFn(true),
            requiresFilterValue: false,
        },
        {
            value: 'isAnyOf',
            getApplyFilterFn: function (filterItem) {
                if (!Array.isArray(filterItem.value) || filterItem.value.length === 0) {
                    return null;
                }
                var filterItemValue = disableTrim
                    ? filterItem.value
                    : filterItem.value.map(function (val) { return val.trim(); });
                var collator = new Intl.Collator(undefined, { sensitivity: 'base', usage: 'search' });
                return function (value) {
                    return value != null
                        ? filterItemValue.some(function (filterValue) {
                            return collator.compare(filterValue, value.toString() || '') === 0;
                        })
                        : false;
                };
            },
            InputComponent: GridFilterInputMultipleValue_1.GridFilterInputMultipleValue,
        },
    ];
};
exports.getGridStringOperators = getGridStringOperators;
