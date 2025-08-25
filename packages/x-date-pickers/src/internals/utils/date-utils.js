"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWeekdays = exports.resolveDateFormat = exports.isDatePickerView = exports.DATE_VIEWS = exports.formatMeridiem = exports.getTodayDate = exports.getMonthsInYear = exports.areDatesEqual = exports.applyDefaultDate = exports.replaceInvalidDateByNull = exports.findClosestEnabledDate = exports.mergeDateAndTime = void 0;
var views_1 = require("./views");
var mergeDateAndTime = function (adapter, dateParam, timeParam) {
    var mergedDate = dateParam;
    mergedDate = adapter.setHours(mergedDate, adapter.getHours(timeParam));
    mergedDate = adapter.setMinutes(mergedDate, adapter.getMinutes(timeParam));
    mergedDate = adapter.setSeconds(mergedDate, adapter.getSeconds(timeParam));
    mergedDate = adapter.setMilliseconds(mergedDate, adapter.getMilliseconds(timeParam));
    return mergedDate;
};
exports.mergeDateAndTime = mergeDateAndTime;
var findClosestEnabledDate = function (_a) {
    var date = _a.date, disableFuture = _a.disableFuture, disablePast = _a.disablePast, maxDate = _a.maxDate, minDate = _a.minDate, isDateDisabled = _a.isDateDisabled, adapter = _a.adapter, timezone = _a.timezone;
    var today = (0, exports.mergeDateAndTime)(adapter, adapter.date(undefined, timezone), date);
    if (disablePast && adapter.isBefore(minDate, today)) {
        minDate = today;
    }
    if (disableFuture && adapter.isAfter(maxDate, today)) {
        maxDate = today;
    }
    var forward = date;
    var backward = date;
    if (adapter.isBefore(date, minDate)) {
        forward = minDate;
        backward = null;
    }
    if (adapter.isAfter(date, maxDate)) {
        if (backward) {
            backward = maxDate;
        }
        forward = null;
    }
    while (forward || backward) {
        if (forward && adapter.isAfter(forward, maxDate)) {
            forward = null;
        }
        if (backward && adapter.isBefore(backward, minDate)) {
            backward = null;
        }
        if (forward) {
            if (!isDateDisabled(forward)) {
                return forward;
            }
            forward = adapter.addDays(forward, 1);
        }
        if (backward) {
            if (!isDateDisabled(backward)) {
                return backward;
            }
            backward = adapter.addDays(backward, -1);
        }
    }
    return null;
};
exports.findClosestEnabledDate = findClosestEnabledDate;
var replaceInvalidDateByNull = function (adapter, value) { return (!adapter.isValid(value) ? null : value); };
exports.replaceInvalidDateByNull = replaceInvalidDateByNull;
var applyDefaultDate = function (adapter, value, defaultValue) {
    if (value == null || !adapter.isValid(value)) {
        return defaultValue;
    }
    return value;
};
exports.applyDefaultDate = applyDefaultDate;
var areDatesEqual = function (adapter, a, b) {
    if (!adapter.isValid(a) && a != null && !adapter.isValid(b) && b != null) {
        return true;
    }
    return adapter.isEqual(a, b);
};
exports.areDatesEqual = areDatesEqual;
var getMonthsInYear = function (adapter, year) {
    var firstMonth = adapter.startOfYear(year);
    var months = [firstMonth];
    while (months.length < 12) {
        var prevMonth = months[months.length - 1];
        months.push(adapter.addMonths(prevMonth, 1));
    }
    return months;
};
exports.getMonthsInYear = getMonthsInYear;
var getTodayDate = function (adapter, timezone, valueType) {
    return valueType === 'date'
        ? adapter.startOfDay(adapter.date(undefined, timezone))
        : adapter.date(undefined, timezone);
};
exports.getTodayDate = getTodayDate;
var formatMeridiem = function (adapter, meridiem) {
    var date = adapter.setHours(adapter.date(), meridiem === 'am' ? 2 : 14);
    return adapter.format(date, 'meridiem');
};
exports.formatMeridiem = formatMeridiem;
exports.DATE_VIEWS = ['year', 'month', 'day'];
var isDatePickerView = function (view) {
    return exports.DATE_VIEWS.includes(view);
};
exports.isDatePickerView = isDatePickerView;
var resolveDateFormat = function (adapter, _a, isInToolbar) {
    var format = _a.format, views = _a.views;
    if (format != null) {
        return format;
    }
    var formats = adapter.formats;
    if ((0, views_1.areViewsEqual)(views, ['year'])) {
        return formats.year;
    }
    if ((0, views_1.areViewsEqual)(views, ['month'])) {
        return formats.month;
    }
    if ((0, views_1.areViewsEqual)(views, ['day'])) {
        return formats.dayOfMonth;
    }
    if ((0, views_1.areViewsEqual)(views, ['month', 'year'])) {
        return "".concat(formats.month, " ").concat(formats.year);
    }
    if ((0, views_1.areViewsEqual)(views, ['day', 'month'])) {
        return "".concat(formats.month, " ").concat(formats.dayOfMonth);
    }
    if (isInToolbar) {
        // Little localization hack (Google is doing the same for android native pickers):
        // For english localization it is convenient to include weekday into the date "Mon, Jun 1".
        // For other locales using strings like "June 1", without weekday.
        return /en/.test(adapter.getCurrentLocaleCode())
            ? formats.normalDateWithWeekday
            : formats.normalDate;
    }
    return formats.keyboardDate;
};
exports.resolveDateFormat = resolveDateFormat;
var getWeekdays = function (adapter, date) {
    var start = adapter.startOfWeek(date);
    return [0, 1, 2, 3, 4, 5, 6].map(function (diff) { return adapter.addDays(start, diff); });
};
exports.getWeekdays = getWeekdays;
