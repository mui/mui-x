"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveTimeFormat = exports.createIsAfterIgnoreDatePart = exports.getSecondsInDay = exports.convertToMeridiem = exports.convertValueToMeridiem = exports.getMeridiem = exports.isInternalTimeView = exports.isTimeView = exports.TIME_VIEWS = exports.EXPORTED_TIME_VIEWS = void 0;
var views_1 = require("./views");
exports.EXPORTED_TIME_VIEWS = ['hours', 'minutes', 'seconds'];
exports.TIME_VIEWS = ['hours', 'minutes', 'seconds', 'meridiem'];
var isTimeView = function (view) {
    return exports.EXPORTED_TIME_VIEWS.includes(view);
};
exports.isTimeView = isTimeView;
var isInternalTimeView = function (view) { return exports.TIME_VIEWS.includes(view); };
exports.isInternalTimeView = isInternalTimeView;
var getMeridiem = function (date, adapter) {
    if (!date) {
        return null;
    }
    return adapter.getHours(date) >= 12 ? 'pm' : 'am';
};
exports.getMeridiem = getMeridiem;
var convertValueToMeridiem = function (value, meridiem, ampm) {
    if (ampm) {
        var currentMeridiem = value >= 12 ? 'pm' : 'am';
        if (currentMeridiem !== meridiem) {
            return meridiem === 'am' ? value - 12 : value + 12;
        }
    }
    return value;
};
exports.convertValueToMeridiem = convertValueToMeridiem;
var convertToMeridiem = function (time, meridiem, ampm, adapter) {
    var newHoursAmount = (0, exports.convertValueToMeridiem)(adapter.getHours(time), meridiem, ampm);
    return adapter.setHours(time, newHoursAmount);
};
exports.convertToMeridiem = convertToMeridiem;
var getSecondsInDay = function (date, adapter) {
    return adapter.getHours(date) * 3600 + adapter.getMinutes(date) * 60 + adapter.getSeconds(date);
};
exports.getSecondsInDay = getSecondsInDay;
var createIsAfterIgnoreDatePart = function (disableIgnoringDatePartForTimeValidation, adapter) {
    return function (dateLeft, dateRight) {
        if (disableIgnoringDatePartForTimeValidation) {
            return adapter.isAfter(dateLeft, dateRight);
        }
        return (0, exports.getSecondsInDay)(dateLeft, adapter) > (0, exports.getSecondsInDay)(dateRight, adapter);
    };
};
exports.createIsAfterIgnoreDatePart = createIsAfterIgnoreDatePart;
var resolveTimeFormat = function (adapter, _a) {
    var format = _a.format, views = _a.views, ampm = _a.ampm;
    if (format != null) {
        return format;
    }
    var formats = adapter.formats;
    if ((0, views_1.areViewsEqual)(views, ['hours'])) {
        return ampm ? "".concat(formats.hours12h, " ").concat(formats.meridiem) : formats.hours24h;
    }
    if ((0, views_1.areViewsEqual)(views, ['minutes'])) {
        return formats.minutes;
    }
    if ((0, views_1.areViewsEqual)(views, ['seconds'])) {
        return formats.seconds;
    }
    if ((0, views_1.areViewsEqual)(views, ['minutes', 'seconds'])) {
        return "".concat(formats.minutes, ":").concat(formats.seconds);
    }
    if ((0, views_1.areViewsEqual)(views, ['hours', 'minutes', 'seconds'])) {
        return ampm
            ? "".concat(formats.hours12h, ":").concat(formats.minutes, ":").concat(formats.seconds, " ").concat(formats.meridiem)
            : "".concat(formats.hours24h, ":").concat(formats.minutes, ":").concat(formats.seconds);
    }
    return ampm
        ? "".concat(formats.hours12h, ":").concat(formats.minutes, " ").concat(formats.meridiem)
        : "".concat(formats.hours24h, ":").concat(formats.minutes);
};
exports.resolveTimeFormat = resolveTimeFormat;
