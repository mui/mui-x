"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultReferenceDate = exports.getSectionTypeGranularity = exports.SECTION_TYPE_GRANULARITY = void 0;
var time_utils_1 = require("./time-utils");
var date_utils_1 = require("./date-utils");
exports.SECTION_TYPE_GRANULARITY = {
    year: 1,
    month: 2,
    day: 3,
    hours: 4,
    minutes: 5,
    seconds: 6,
    milliseconds: 7,
};
var getSectionTypeGranularity = function (sections) {
    return Math.max.apply(Math, sections.map(function (section) { var _a; return (_a = exports.SECTION_TYPE_GRANULARITY[section.type]) !== null && _a !== void 0 ? _a : 1; }));
};
exports.getSectionTypeGranularity = getSectionTypeGranularity;
var roundDate = function (adapter, granularity, date) {
    if (granularity === exports.SECTION_TYPE_GRANULARITY.year) {
        return adapter.startOfYear(date);
    }
    if (granularity === exports.SECTION_TYPE_GRANULARITY.month) {
        return adapter.startOfMonth(date);
    }
    if (granularity === exports.SECTION_TYPE_GRANULARITY.day) {
        return adapter.startOfDay(date);
    }
    // We don't have startOfHour / startOfMinute / startOfSecond
    var roundedDate = date;
    if (granularity < exports.SECTION_TYPE_GRANULARITY.minutes) {
        roundedDate = adapter.setMinutes(roundedDate, 0);
    }
    if (granularity < exports.SECTION_TYPE_GRANULARITY.seconds) {
        roundedDate = adapter.setSeconds(roundedDate, 0);
    }
    if (granularity < exports.SECTION_TYPE_GRANULARITY.milliseconds) {
        roundedDate = adapter.setMilliseconds(roundedDate, 0);
    }
    return roundedDate;
};
var getDefaultReferenceDate = function (_a) {
    var _b;
    var props = _a.props, adapter = _a.adapter, granularity = _a.granularity, timezone = _a.timezone, inGetTodayDate = _a.getTodayDate;
    var referenceDate = inGetTodayDate
        ? inGetTodayDate()
        : roundDate(adapter, granularity, (0, date_utils_1.getTodayDate)(adapter, timezone));
    if (props.minDate != null && adapter.isAfterDay(props.minDate, referenceDate)) {
        referenceDate = roundDate(adapter, granularity, props.minDate);
    }
    if (props.maxDate != null && adapter.isBeforeDay(props.maxDate, referenceDate)) {
        referenceDate = roundDate(adapter, granularity, props.maxDate);
    }
    var isAfter = (0, time_utils_1.createIsAfterIgnoreDatePart)((_b = props.disableIgnoringDatePartForTimeValidation) !== null && _b !== void 0 ? _b : false, adapter);
    if (props.minTime != null && isAfter(props.minTime, referenceDate)) {
        referenceDate = roundDate(adapter, granularity, props.disableIgnoringDatePartForTimeValidation
            ? props.minTime
            : (0, date_utils_1.mergeDateAndTime)(adapter, referenceDate, props.minTime));
    }
    if (props.maxTime != null && isAfter(referenceDate, props.maxTime)) {
        referenceDate = roundDate(adapter, granularity, props.disableIgnoringDatePartForTimeValidation
            ? props.maxTime
            : (0, date_utils_1.mergeDateAndTime)(adapter, referenceDate, props.maxTime));
    }
    return referenceDate;
};
exports.getDefaultReferenceDate = getDefaultReferenceDate;
