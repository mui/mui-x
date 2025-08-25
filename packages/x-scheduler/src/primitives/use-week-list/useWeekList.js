"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWeekList = useWeekList;
var React = require("react");
var useAdapter_1 = require("../utils/adapter/useAdapter");
function useWeekList() {
    var adapter = (0, useAdapter_1.useAdapter)();
    return React.useCallback(function (_a) {
        var date = _a.date, amount = _a.amount;
        if (process.env.NODE_ENV !== 'production') {
            if (typeof amount === 'number' && amount <= 0) {
                throw new Error("useWeekList: The 'amount' parameter must be a positive number, but received ".concat(amount, "."));
            }
        }
        var start = adapter.startOfWeek(date);
        var end = amount === 'end-of-month'
            ? adapter.endOfWeek(adapter.endOfMonth(date))
            : adapter.endOfWeek(adapter.addWeeks(start, amount - 1));
        var current = start;
        var currentWeekNumber = adapter.getWeekNumber(current);
        var weeks = [];
        while (adapter.isBefore(current, end)) {
            weeks.push(current);
            var prevWeekNumber = currentWeekNumber;
            current = adapter.addWeeks(current, 1);
            currentWeekNumber = adapter.getWeekNumber(current);
            // If there is a TZ change at midnight, adding 1 week may only increase the date by 6 days and 23 hours to 11pm
            // To fix, bump the date into the next day (add 12 hours) and then revert to the start of the day
            // See https://github.com/moment/moment/issues/4743#issuecomment-811306874 for context.
            if (prevWeekNumber === currentWeekNumber) {
                current = adapter.startOfDay(adapter.addHours(current, 12));
            }
        }
        return weeks;
    }, [adapter]);
}
