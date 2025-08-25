"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDayList = useDayList;
var React = require("react");
var date_utils_1 = require("../utils/date-utils");
var useAdapter_1 = require("../utils/adapter/useAdapter");
function useDayList() {
    var adapter = (0, useAdapter_1.useAdapter)();
    return React.useCallback(function (_a) {
        var date = _a.date, amount = _a.amount, excludeWeekends = _a.excludeWeekends;
        if (process.env.NODE_ENV !== 'production') {
            if (typeof amount === 'number' && amount <= 0) {
                throw new Error("useDayList: The 'amount' parameter must be a positive number, but received ".concat(amount, "."));
            }
        }
        var start = adapter.startOfDay(date);
        var current = start;
        var currentDayNumber = adapter.getDayOfWeek(current);
        var days = [];
        var isDayCollectionComplete = typeof amount === 'number'
            ? function () { return days.length >= amount; }
            : function () { return adapter.isAfter(current, adapter.endOfDay(adapter.addDays(start, 6))); };
        while (!isDayCollectionComplete()) {
            if (!excludeWeekends || !(0, date_utils_1.isWeekend)(adapter, current)) {
                days.push(current);
            }
            var prevDayNumber = currentDayNumber;
            current = adapter.addDays(current, 1);
            currentDayNumber = adapter.getDayOfWeek(current);
            // If there is a TZ change at midnight, adding 1 day may only increase the date by 23 hours to 11pm
            // To fix, bump the date into the next day (add 12 hours) and then revert to the start of the day
            // See https://github.com/moment/moment/issues/4743#issuecomment-811306874 for context.
            if (prevDayNumber === currentDayNumber) {
                current = adapter.startOfDay(adapter.addHours(current, 12));
            }
        }
        return days;
    }, [adapter]);
}
