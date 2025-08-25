"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPickerSingleInput = exports.isPickerRangeType = exports.formatFullTimeValue = exports.getDateOffset = exports.getExpectedOnChangeCount = exports.stubMatchMedia = void 0;
var sinon_1 = require("sinon");
var vitest_1 = require("vitest");
var stubMatchMedia = function (matches) {
    if (matches === void 0) { matches = true; }
    var original = window.matchMedia;
    window.matchMedia = sinon_1.default.stub().returns({
        matches: matches,
        addListener: function () { },
        addEventListener: function () { },
        removeListener: function () { },
        removeEventListener: function () { },
    });
    (0, vitest_1.onTestFinished)(function () {
        window.matchMedia = original;
    });
};
exports.stubMatchMedia = stubMatchMedia;
var getChangeCountForComponentFamily = function (componentFamily) {
    switch (componentFamily) {
        case 'clock':
        case 'multi-section-digital-clock':
            return 3;
        default:
            return 1;
    }
};
var getExpectedOnChangeCount = function (componentFamily, params) {
    if (componentFamily === 'digital-clock') {
        return getChangeCountForComponentFamily(componentFamily);
    }
    if (params.type === 'date-time') {
        return (getChangeCountForComponentFamily(componentFamily) +
            getChangeCountForComponentFamily(params.variant === 'desktop' ? 'multi-section-digital-clock' : 'clock'));
    }
    if (componentFamily === 'picker' && params.type === 'time') {
        return getChangeCountForComponentFamily(params.variant === 'desktop' ? 'multi-section-digital-clock' : 'clock');
    }
    if (componentFamily === 'picker' && params.type === 'date-time-range') {
        return (getChangeCountForComponentFamily(componentFamily) +
            getChangeCountForComponentFamily('multi-section-digital-clock'));
    }
    if (componentFamily === 'clock') {
        // the `TimeClock` fires change for both touch move and touch end
        // but does not have meridiem control
        return (getChangeCountForComponentFamily(componentFamily) - 1) * 2;
    }
    if (componentFamily === 'picker' && params.type === 'time-range') {
        return getChangeCountForComponentFamily('multi-section-digital-clock');
    }
    return getChangeCountForComponentFamily(componentFamily);
};
exports.getExpectedOnChangeCount = getExpectedOnChangeCount;
var getDateOffset = function (adapter, date) {
    var utcHour = adapter.getHours(adapter.setTimezone(adapter.startOfDay(date), 'UTC'));
    var cleanUtcHour = utcHour > 12 ? 24 - utcHour : -utcHour;
    return cleanUtcHour * 60;
};
exports.getDateOffset = getDateOffset;
var formatFullTimeValue = function (adapter, value) {
    var hasMeridiem = adapter.is12HourCycleInCurrentLocale();
    return adapter.format(value, hasMeridiem ? 'fullTime12h' : 'fullTime24h');
};
exports.formatFullTimeValue = formatFullTimeValue;
var isPickerRangeType = function (type) {
    return type === 'date-range' || type === 'date-time-range' || type === 'time-range';
};
exports.isPickerRangeType = isPickerRangeType;
var isPickerSingleInput = function (parameters) {
    if (parameters.type === 'date-range' ||
        parameters.type === 'date-time-range' ||
        parameters.type === 'time-range') {
        return parameters.fieldType === 'single-input';
    }
    return true;
};
exports.isPickerSingleInput = isPickerSingleInput;
