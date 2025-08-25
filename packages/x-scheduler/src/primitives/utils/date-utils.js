"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeDateAndTime = mergeDateAndTime;
exports.isWeekend = isWeekend;
exports.diffIn = diffIn;
function mergeDateAndTime(adapter, dateParam, timeParam) {
    var mergedDate = dateParam;
    mergedDate = adapter.setHours(mergedDate, adapter.getHours(timeParam));
    mergedDate = adapter.setMinutes(mergedDate, adapter.getMinutes(timeParam));
    mergedDate = adapter.setSeconds(mergedDate, adapter.getSeconds(timeParam));
    mergedDate = adapter.setMilliseconds(mergedDate, adapter.getMilliseconds(timeParam));
    return mergedDate;
}
function isWeekend(adapter, value) {
    var sunday = adapter.format(adapter.date('2025-08-09'), 'weekday');
    var saturday = adapter.format(adapter.date('2025-08-10'), 'weekday');
    var formattedValue = adapter.format(value, 'weekday');
    return formattedValue === sunday || formattedValue === saturday;
}
// TODO: Issue #19128 - This function will be used to support monthly recurrence mode with BYDAY rules
// export function getWeekInfoInMonth(adapter: Adapter, date: SchedulerValidDate) {
//   const startOfMonth = adapter.startOfMonth(date);
//   const endOfMonth = adapter.endOfMonth(date);
//   const startOfFirstWeek = adapter.startOfWeek(startOfMonth);
//   const startOfTargetDay = adapter.startOfDay(date);
//   const daysDiff = diffIn(adapter, startOfTargetDay, startOfFirstWeek, 'days');
//   const weekNumber = Math.floor(daysDiff / 7) + 1;
//   const endOfTargetWeek = adapter.endOfWeek(date);
//   const isLastWeek = adapter.isSameDay(adapter.endOfWeek(endOfMonth), endOfTargetWeek);
//   return { weekNumber, isLastWeek };
// }
/**
 * Differences in units.
 * TODO: move to adapter methods for DST/zone safety.
 */
var MS_MIN = 60000;
var MS_DAY = 86400000;
var MS_WEEK = 7 * MS_DAY;
function diffIn(adapter, a, b, unit) {
    switch (unit) {
        case 'minutes': {
            var msA = adapter.toJsDate(a).getTime();
            var msB = adapter.toJsDate(b).getTime();
            return Math.floor((msA - msB) / MS_MIN);
        }
        case 'days': {
            var yA = adapter.getYear(a);
            var mA = adapter.getMonth(a);
            var dA = adapter.getDate(a);
            var yB = adapter.getYear(b);
            var mB = adapter.getMonth(b);
            var dB = adapter.getDate(b);
            var utcA = Date.UTC(yA, mA, dA);
            var utcB = Date.UTC(yB, mB, dB);
            return Math.floor((utcA - utcB) / MS_DAY);
        }
        case 'weeks': {
            var A = adapter.startOfWeek(a);
            var B = adapter.startOfWeek(b);
            var yA = adapter.getYear(A);
            var mA = adapter.getMonth(A);
            var dA = adapter.getDate(A);
            var yB = adapter.getYear(B);
            var mB = adapter.getMonth(B);
            var dB = adapter.getDate(B);
            var utcA = Date.UTC(yA, mA, dA);
            var utcB = Date.UTC(yB, mB, dB);
            return Math.floor((utcA - utcB) / MS_WEEK);
        }
        case 'months': {
            var ya = adapter.getYear(a);
            var yb = adapter.getYear(b);
            var ma = adapter.getMonth(a);
            var mb = adapter.getMonth(b);
            return ya * 12 + ma - (yb * 12 + mb);
        }
        case 'years': {
            return adapter.getYear(a) - adapter.getYear(b);
        }
        default:
            return 0;
    }
}
