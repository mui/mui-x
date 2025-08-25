"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGridDateOperators = void 0;
var GridFilterInputDate_1 = require("../components/panel/filterPanel/GridFilterInputDate");
function buildApplyFilterFn(filterItem, compareFn, showTime, keepHours) {
    if (!filterItem.value) {
        return null;
    }
    var date = new Date(filterItem.value);
    if (showTime) {
        date.setSeconds(0, 0);
    }
    else {
        // In GMT-X timezone, the date will be one day behind.
        // For 2022-08-16:
        // GMT+2: Tue Aug 16 2022 02:00:00 GMT+0200
        // GMT-4: Mon Aug 15 2022 20:00:00 GMT-0400
        //
        // We need to add the offset before resetting the hours.
        date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
        date.setHours(0, 0, 0, 0);
    }
    var time = date.getTime();
    return function (value) {
        if (!value) {
            return false;
        }
        if (keepHours) {
            return compareFn(value.getTime(), time);
        }
        // Make a copy of the date to not reset the hours in the original object
        var dateCopy = new Date(value);
        if (showTime) {
            dateCopy.setSeconds(0, 0);
        }
        else {
            dateCopy.setHours(0, 0, 0, 0);
        }
        return compareFn(dateCopy.getTime(), time);
    };
}
var getGridDateOperators = function (showTime) { return [
    {
        value: 'is',
        getApplyFilterFn: function (filterItem) {
            return buildApplyFilterFn(filterItem, function (value1, value2) { return value1 === value2; }, showTime);
        },
        InputComponent: GridFilterInputDate_1.GridFilterInputDate,
        InputComponentProps: { type: showTime ? 'datetime-local' : 'date' },
    },
    {
        value: 'not',
        getApplyFilterFn: function (filterItem) {
            return buildApplyFilterFn(filterItem, function (value1, value2) { return value1 !== value2; }, showTime);
        },
        InputComponent: GridFilterInputDate_1.GridFilterInputDate,
        InputComponentProps: { type: showTime ? 'datetime-local' : 'date' },
    },
    {
        value: 'after',
        getApplyFilterFn: function (filterItem) {
            return buildApplyFilterFn(filterItem, function (value1, value2) { return value1 > value2; }, showTime);
        },
        InputComponent: GridFilterInputDate_1.GridFilterInputDate,
        InputComponentProps: { type: showTime ? 'datetime-local' : 'date' },
    },
    {
        value: 'onOrAfter',
        getApplyFilterFn: function (filterItem) {
            return buildApplyFilterFn(filterItem, function (value1, value2) { return value1 >= value2; }, showTime);
        },
        InputComponent: GridFilterInputDate_1.GridFilterInputDate,
        InputComponentProps: { type: showTime ? 'datetime-local' : 'date' },
    },
    {
        value: 'before',
        getApplyFilterFn: function (filterItem) {
            return buildApplyFilterFn(filterItem, function (value1, value2) { return value1 < value2; }, showTime, !showTime);
        },
        InputComponent: GridFilterInputDate_1.GridFilterInputDate,
        InputComponentProps: { type: showTime ? 'datetime-local' : 'date' },
    },
    {
        value: 'onOrBefore',
        getApplyFilterFn: function (filterItem) {
            return buildApplyFilterFn(filterItem, function (value1, value2) { return value1 <= value2; }, showTime);
        },
        InputComponent: GridFilterInputDate_1.GridFilterInputDate,
        InputComponentProps: { type: showTime ? 'datetime-local' : 'date' },
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
]; };
exports.getGridDateOperators = getGridDateOperators;
