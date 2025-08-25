"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveReferenceDate = resolveReferenceDate;
exports.calculateRangeChange = calculateRangeChange;
exports.calculateRangePreview = calculateRangePreview;
var internals_1 = require("@mui/x-date-pickers/internals");
function resolveReferenceDate(referenceDate, rangePosition) {
    if (Array.isArray(referenceDate)) {
        return rangePosition === 'start' ? referenceDate[0] : referenceDate[1];
    }
    return referenceDate;
}
function calculateRangeChange(_a) {
    var adapter = _a.adapter, range = _a.range, selectedDate = _a.newDate, rangePosition = _a.rangePosition, _b = _a.allowRangeFlip, allowRangeFlip = _b === void 0 ? false : _b, _c = _a.shouldMergeDateAndTime, shouldMergeDateAndTime = _c === void 0 ? false : _c, referenceDate = _a.referenceDate;
    var start = !adapter.isValid(range[0]) ? null : range[0];
    var end = !adapter.isValid(range[1]) ? null : range[1];
    if (shouldMergeDateAndTime && selectedDate) {
        // If there is a date already selected, then we want to keep its time
        if (start && rangePosition === 'start') {
            selectedDate = (0, internals_1.mergeDateAndTime)(adapter, selectedDate, start);
        }
        if (end && rangePosition === 'end') {
            selectedDate = (0, internals_1.mergeDateAndTime)(adapter, selectedDate, end);
        }
    }
    var newSelectedDate = referenceDate && selectedDate && shouldMergeDateAndTime
        ? (0, internals_1.mergeDateAndTime)(adapter, selectedDate, resolveReferenceDate(referenceDate, rangePosition))
        : selectedDate;
    if (rangePosition === 'start') {
        var truthyResult_1 = allowRangeFlip
            ? { nextSelection: 'start', newRange: [end, newSelectedDate] }
            : { nextSelection: 'end', newRange: [newSelectedDate, null] };
        return Boolean(end) && adapter.isAfter(newSelectedDate, end)
            ? truthyResult_1
            : { nextSelection: 'end', newRange: [newSelectedDate, end] };
    }
    var truthyResult = allowRangeFlip
        ? { nextSelection: 'end', newRange: [newSelectedDate, start] }
        : { nextSelection: 'end', newRange: [newSelectedDate, null] };
    return Boolean(start) && adapter.isBeforeDay(newSelectedDate, start)
        ? truthyResult
        : { nextSelection: 'start', newRange: [start, newSelectedDate] };
}
function calculateRangePreview(options) {
    if (options.newDate == null) {
        return [null, null];
    }
    var _a = options.range, start = _a[0], end = _a[1];
    var newRange = calculateRangeChange(options).newRange;
    if (!start || !end) {
        return newRange;
    }
    var previewStart = newRange[0], previewEnd = newRange[1];
    return options.rangePosition === 'end' ? [end, previewEnd] : [previewStart, start];
}
