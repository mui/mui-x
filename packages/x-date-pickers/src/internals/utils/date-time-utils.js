"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveDateTimeFormat = void 0;
exports.resolveTimeViewsResponse = resolveTimeViewsResponse;
var time_utils_1 = require("./time-utils");
var date_utils_1 = require("./date-utils");
var resolveDateTimeFormat = function (adapter, _a, ignoreDateResolving) {
    var views = _a.views, format = _a.format, other = __rest(_a, ["views", "format"]);
    if (format) {
        return format;
    }
    var dateViews = [];
    var timeViews = [];
    views.forEach(function (view) {
        if ((0, time_utils_1.isTimeView)(view)) {
            timeViews.push(view);
        }
        else if ((0, date_utils_1.isDatePickerView)(view)) {
            dateViews.push(view);
        }
    });
    if (timeViews.length === 0) {
        return (0, date_utils_1.resolveDateFormat)(adapter, __assign({ views: dateViews }, other), false);
    }
    if (dateViews.length === 0) {
        return (0, time_utils_1.resolveTimeFormat)(adapter, __assign({ views: timeViews }, other));
    }
    var timeFormat = (0, time_utils_1.resolveTimeFormat)(adapter, __assign({ views: timeViews }, other));
    var dateFormat = ignoreDateResolving
        ? adapter.formats.keyboardDate
        : (0, date_utils_1.resolveDateFormat)(adapter, __assign({ views: dateViews }, other), false);
    return "".concat(dateFormat, " ").concat(timeFormat);
};
exports.resolveDateTimeFormat = resolveDateTimeFormat;
var resolveViews = function (ampm, views, shouldUseSingleColumn) {
    if (shouldUseSingleColumn) {
        return views.filter(function (view) { return !(0, time_utils_1.isInternalTimeView)(view) || view === 'hours'; });
    }
    return (ampm ? __spreadArray(__spreadArray([], views, true), ['meridiem'], false) : views);
};
var resolveShouldRenderTimeInASingleColumn = function (timeSteps, threshold) { var _a, _b; return (24 * 60) / (((_a = timeSteps.hours) !== null && _a !== void 0 ? _a : 1) * ((_b = timeSteps.minutes) !== null && _b !== void 0 ? _b : 5)) <= threshold; };
function resolveTimeViewsResponse(_a) {
    var inThreshold = _a.thresholdToRenderTimeInASingleColumn, ampm = _a.ampm, inTimeSteps = _a.timeSteps, views = _a.views;
    var thresholdToRenderTimeInASingleColumn = inThreshold !== null && inThreshold !== void 0 ? inThreshold : 24;
    var timeSteps = __assign({ hours: 1, minutes: 5, seconds: 5 }, inTimeSteps);
    var shouldRenderTimeInASingleColumn = resolveShouldRenderTimeInASingleColumn(timeSteps, thresholdToRenderTimeInASingleColumn);
    return {
        thresholdToRenderTimeInASingleColumn: thresholdToRenderTimeInASingleColumn,
        timeSteps: timeSteps,
        shouldRenderTimeInASingleColumn: shouldRenderTimeInASingleColumn,
        views: resolveViews(ampm, views, shouldRenderTimeInASingleColumn),
    };
}
