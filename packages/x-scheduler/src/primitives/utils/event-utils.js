"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEventWithLargestRowIndex = getEventWithLargestRowIndex;
exports.isDayWithinRange = isDayWithinRange;
exports.getEventRowIndex = getEventRowIndex;
exports.getEventDays = getEventDays;
/**
 *  Returns the largest `eventRowIndex` among all-day occurrences.
 *  Useful to know how many stacked rows are already used for a given day.
 *  @returns Highest row index found, or 0 if none.
 */
function getEventWithLargestRowIndex(events) {
    return (events.reduce(function (maxEvent, event) { var _a, _b; return ((_a = event === null || event === void 0 ? void 0 : event.eventRowIndex) !== null && _a !== void 0 ? _a : 0) > ((_b = maxEvent.eventRowIndex) !== null && _b !== void 0 ? _b : 0) ? event : maxEvent; }, { eventRowIndex: 0 }).eventRowIndex || 0);
}
function isDayWithinRange(day, eventFirstDay, eventLastDay, adapter) {
    return (adapter.isSameDay(day, eventFirstDay) ||
        adapter.isSameDay(day, eventLastDay) ||
        (adapter.isAfter(day, eventFirstDay) && adapter.isBefore(day, eventLastDay)));
}
/**
 *  Computes the vertical row for an all-day occurrence on `day`.
 *  If the event started before the visible range, reuses the row chosen on the first visible day.
 *  Otherwise, assigns the first free row index in that day’s all-day stack.
 *  @returns 1-based row index.
 */
function getEventRowIndex(event, day, days, daysMap, adapter) {
    var _a, _b, _c, _d;
    var dayKey = adapter.format(day, 'keyboardDate');
    var eventFirstDay = adapter.startOfDay(event.start);
    // If the event starts before the current day, we need to find the row index of the first day of the event
    var isBeforeVisibleRange = adapter.isBefore(eventFirstDay, day) && !adapter.isSameDay(days[0], day);
    if (isBeforeVisibleRange) {
        var firstDayKey = adapter.format(adapter.isBefore(eventFirstDay, days[0]) ? days[0] : eventFirstDay, 'keyboardDate');
        // Try to find the row index from the original event placement on the first visible day
        var existingRowIndex = (_b = (_a = daysMap
            .get(firstDayKey)) === null || _a === void 0 ? void 0 : _a.allDayEvents.find(function (currentEvent) { return currentEvent.key === event.key; })) === null || _b === void 0 ? void 0 : _b.eventRowIndex;
        return existingRowIndex !== null && existingRowIndex !== void 0 ? existingRowIndex : 1;
    }
    // Otherwise, we just render the event on the first available row in the column
    var usedIndexes = new Set((_d = (_c = daysMap.get(dayKey)) === null || _c === void 0 ? void 0 : _c.allDayEvents.map(function (item) { return item.eventRowIndex; })) !== null && _d !== void 0 ? _d : []);
    var i = 1;
    while (usedIndexes.has(i)) {
        i += 1;
    }
    return i;
}
/**
 *  Returns the list of visible days an event should render on.
 *  When `shouldOnlyRenderEventInOneCell` is true, collapses multi-day to a single cell
 *  (first visible day, or the event’s start if it is inside the range).
 */
function getEventDays(event, days, adapter, shouldOnlyRenderEventInOneCell) {
    var eventFirstDay = adapter.startOfDay(event.start);
    var eventLastDay = adapter.endOfDay(event.end);
    if (shouldOnlyRenderEventInOneCell) {
        if (adapter.isBefore(eventFirstDay, days[0])) {
            return [days[0]];
        }
        return [eventFirstDay];
    }
    return days.filter(function (day) { return isDayWithinRange(day, eventFirstDay, eventLastDay, adapter); });
}
