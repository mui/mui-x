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
Object.defineProperty(exports, "__esModule", { value: true });
exports.singleItemFieldValueManager = exports.singleItemValueManager = void 0;
var date_utils_1 = require("./date-utils");
var getDefaultReferenceDate_1 = require("./getDefaultReferenceDate");
var useField_utils_1 = require("../hooks/useField/useField.utils");
exports.singleItemValueManager = {
    emptyValue: null,
    getTodayValue: date_utils_1.getTodayDate,
    getInitialReferenceValue: function (_a) {
        var value = _a.value, referenceDate = _a.referenceDate, params = __rest(_a, ["value", "referenceDate"]);
        if (params.adapter.isValid(value)) {
            return value;
        }
        if (referenceDate != null) {
            return referenceDate;
        }
        return (0, getDefaultReferenceDate_1.getDefaultReferenceDate)(params);
    },
    cleanValue: date_utils_1.replaceInvalidDateByNull,
    areValuesEqual: date_utils_1.areDatesEqual,
    isSameError: function (a, b) { return a === b; },
    hasError: function (error) { return error != null; },
    defaultErrorState: null,
    getTimezone: function (adapter, value) { return (adapter.isValid(value) ? adapter.getTimezone(value) : null); },
    setTimezone: function (adapter, timezone, value) {
        return value == null ? null : adapter.setTimezone(value, timezone);
    },
};
exports.singleItemFieldValueManager = {
    updateReferenceValue: function (adapter, value, prevReferenceValue) {
        return adapter.isValid(value) ? value : prevReferenceValue;
    },
    getSectionsFromValue: function (date, getSectionsFromDate) { return getSectionsFromDate(date); },
    getV7HiddenInputValueFromSections: useField_utils_1.createDateStrForV7HiddenInputFromSections,
    getV6InputValueFromSections: useField_utils_1.createDateStrForV6InputFromSections,
    parseValueStr: function (valueStr, referenceValue, parseDate) {
        return parseDate(valueStr.trim(), referenceValue);
    },
    getDateFromSection: function (value) { return value; },
    getDateSectionsFromValue: function (sections) { return sections; },
    updateDateInValue: function (value, activeSection, activeDate) { return activeDate; },
    clearDateSections: function (sections) { return sections.map(function (section) { return (__assign(__assign({}, section), { value: '' })); }); },
};
