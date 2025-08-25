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
exports.getRangeFieldValueManager = exports.rangeValueManager = void 0;
var internals_1 = require("@mui/x-date-pickers/internals");
var date_fields_utils_1 = require("./date-fields-utils");
exports.rangeValueManager = {
    emptyValue: [null, null],
    getTodayValue: function (utils, timezone, valueType) { return [
        (0, internals_1.getTodayDate)(utils, timezone, valueType),
        (0, internals_1.getTodayDate)(utils, timezone, valueType),
    ]; },
    getInitialReferenceValue: function (_a) {
        var value = _a.value, referenceDateProp = _a.referenceDate, params = __rest(_a, ["value", "referenceDate"]);
        var shouldKeepStartDate = params.adapter.isValid(value[0]);
        var shouldKeepEndDate = params.adapter.isValid(value[1]);
        if (shouldKeepStartDate && shouldKeepEndDate) {
            return value;
        }
        var referenceDate = referenceDateProp !== null && referenceDateProp !== void 0 ? referenceDateProp : (0, internals_1.getDefaultReferenceDate)(params);
        var startReferenceDate = Array.isArray(referenceDate) ? referenceDate[0] : referenceDate;
        var endReferenceDate = Array.isArray(referenceDate) ? referenceDate[1] : referenceDate;
        return [
            shouldKeepStartDate ? value[0] : startReferenceDate,
            shouldKeepEndDate ? value[1] : endReferenceDate,
        ];
    },
    cleanValue: function (utils, value) {
        return value.map(function (date) { return (0, internals_1.replaceInvalidDateByNull)(utils, date); });
    },
    areValuesEqual: function (utils, a, b) {
        return (0, internals_1.areDatesEqual)(utils, a[0], b[0]) && (0, internals_1.areDatesEqual)(utils, a[1], b[1]);
    },
    isSameError: function (a, b) { return b !== null && a[1] === b[1] && a[0] === b[0]; },
    hasError: function (error) { return error[0] != null || error[1] != null; },
    defaultErrorState: [null, null],
    getTimezone: function (adapter, value) {
        var timezoneStart = adapter.isValid(value[0]) ? adapter.getTimezone(value[0]) : null;
        var timezoneEnd = adapter.isValid(value[1]) ? adapter.getTimezone(value[1]) : null;
        if (timezoneStart != null && timezoneEnd != null && timezoneStart !== timezoneEnd) {
            throw new Error('MUI X: The timezone of the start and the end date should be the same.');
        }
        return timezoneStart !== null && timezoneStart !== void 0 ? timezoneStart : timezoneEnd;
    },
    setTimezone: function (adapter, timezone, value) { return [
        value[0] == null ? null : adapter.setTimezone(value[0], timezone),
        value[1] == null ? null : adapter.setTimezone(value[1], timezone),
    ]; },
};
var getRangeFieldValueManager = function (_a) {
    var _b = _a.dateSeparator, dateSeparator = _b === void 0 ? '–' : _b;
    return ({
        updateReferenceValue: function (adapter, value, prevReferenceValue) {
            var shouldKeepStartDate = adapter.isValid(value[0]);
            var shouldKeepEndDate = adapter.isValid(value[1]);
            if (!shouldKeepStartDate && !shouldKeepEndDate) {
                return prevReferenceValue;
            }
            if (shouldKeepStartDate && shouldKeepEndDate) {
                return value;
            }
            if (shouldKeepStartDate) {
                return [value[0], prevReferenceValue[0]];
            }
            return [prevReferenceValue[1], value[1]];
        },
        getSectionsFromValue: function (_a, getSectionsFromDate) {
            var start = _a[0], end = _a[1];
            var getSections = function (newDate, position) {
                var sections = getSectionsFromDate(newDate);
                return sections.map(function (section, sectionIndex) {
                    if (sectionIndex === sections.length - 1 && position === 'start') {
                        return __assign(__assign({}, section), { dateName: position, 
                            // TODO: Check if RTL still works
                            endSeparator: "".concat(section.endSeparator, " ").concat(dateSeparator, " ") });
                    }
                    return __assign(__assign({}, section), { dateName: position });
                });
            };
            return __spreadArray(__spreadArray([], getSections(start, 'start'), true), getSections(end, 'end'), true);
        },
        getV7HiddenInputValueFromSections: function (sections) {
            var dateRangeSections = (0, date_fields_utils_1.splitDateRangeSections)(sections);
            return (0, internals_1.createDateStrForV7HiddenInputFromSections)(__spreadArray(__spreadArray([], dateRangeSections.startDate, true), dateRangeSections.endDate, true));
        },
        getV6InputValueFromSections: function (sections, localizedDigits, isRtl) {
            var dateRangeSections = (0, date_fields_utils_1.splitDateRangeSections)(sections);
            return (0, internals_1.createDateStrForV6InputFromSections)(__spreadArray(__spreadArray([], dateRangeSections.startDate, true), dateRangeSections.endDate, true), localizedDigits, isRtl);
        },
        parseValueStr: function (valueStr, referenceValue, parseDate) {
            // TODO: Improve because it would not work if some section have the same separator as the dateSeparator.
            var _a = valueStr.split(dateSeparator), startStr = _a[0], endStr = _a[1];
            return [startStr, endStr].map(function (dateStr, index) {
                if (dateStr == null) {
                    return null;
                }
                return parseDate(dateStr.trim(), referenceValue[index]);
            });
        },
        getDateFromSection: function (value, activeSection) { return value[getActiveDateIndex(activeSection)]; },
        getDateSectionsFromValue: function (sections, activeSection) {
            var dateRangeSections = (0, date_fields_utils_1.splitDateRangeSections)(sections);
            if (getActiveDateIndex(activeSection) === 0) {
                return (0, date_fields_utils_1.removeLastSeparator)(dateRangeSections.startDate);
            }
            return dateRangeSections.endDate;
        },
        updateDateInValue: function (value, activeSection, activeDate) {
            if (getActiveDateIndex(activeSection) === 0) {
                return [activeDate, value[1]];
            }
            return [value[0], activeDate];
        },
        clearDateSections: function (sections, activeSection) {
            var dateRangeSections = (0, date_fields_utils_1.splitDateRangeSections)(sections);
            if (getActiveDateIndex(activeSection) === 0) {
                return __spreadArray(__spreadArray([], dateRangeSections.startDate.map(function (section) { return (__assign(__assign({}, section), { value: '' })); }), true), dateRangeSections.endDate, true);
            }
            return __spreadArray(__spreadArray([], dateRangeSections.startDate, true), dateRangeSections.endDate.map(function (section) { return (__assign(__assign({}, section), { value: '' })); }), true);
        },
    });
};
exports.getRangeFieldValueManager = getRangeFieldValueManager;
function getActiveDateIndex(activeSection) {
    return activeSection == null || activeSection.dateName === 'start' ? 0 : 1;
}
