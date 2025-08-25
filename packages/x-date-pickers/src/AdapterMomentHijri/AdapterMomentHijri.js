"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdapterMomentHijri = void 0;
/* eslint-disable class-methods-use-this */
/* v8 ignore next */
var moment_hijri_1 = require("moment-hijri");
var AdapterMoment_1 = require("../AdapterMoment");
// From https://momentjs.com/docs/#/displaying/format/
var formatTokenMap = {
    // Year
    iY: { sectionType: 'year', contentType: 'letter' },
    iYY: { sectionType: 'year', contentType: 'letter' },
    iYYYY: { sectionType: 'year', contentType: 'letter' },
    // Month
    iM: 'month',
    iMM: 'month',
    iMMM: { sectionType: 'month', contentType: 'letter' },
    iMMMM: { sectionType: 'month', contentType: 'letter' },
    // Day of the month
    iD: { sectionType: 'day', contentType: 'digit', maxLength: 2 },
    iDD: 'day',
    // Meridiem
    A: 'meridiem',
    a: 'meridiem',
    // Hours
    H: { sectionType: 'hours', contentType: 'digit', maxLength: 2 },
    HH: 'hours',
    h: { sectionType: 'hours', contentType: 'digit', maxLength: 2 },
    hh: 'hours',
    // Minutes
    m: { sectionType: 'minutes', contentType: 'digit', maxLength: 2 },
    mm: 'minutes',
    // Seconds
    s: { sectionType: 'seconds', contentType: 'digit', maxLength: 2 },
    ss: 'seconds',
};
var defaultFormats = {
    year: 'iYYYY',
    month: 'iMMMM',
    monthShort: 'iMMM',
    dayOfMonth: 'iD',
    // Full day of the month format (i.e. 3rd) is not supported
    // Falling back to regular format
    dayOfMonthFull: 'iD',
    weekday: 'dddd',
    weekdayShort: 'ddd',
    hours24h: 'HH',
    hours12h: 'hh',
    meridiem: 'A',
    minutes: 'mm',
    seconds: 'ss',
    fullDate: 'iYYYY, iMMMM Do',
    shortDate: 'iD iMMM',
    normalDate: 'dddd, iD iMMM',
    normalDateWithWeekday: 'DD iMMMM',
    fullTime12h: 'hh:mm A',
    fullTime24h: 'HH:mm',
    keyboardDate: 'iYYYY/iMM/iDD',
    keyboardDateTime12h: 'iYYYY/iMM/iDD hh:mm A',
    keyboardDateTime24h: 'iYYYY/iMM/iDD HH:mm',
};
var NUMBER_SYMBOL_MAP = {
    '1': '١',
    '2': '٢',
    '3': '٣',
    '4': '٤',
    '5': '٥',
    '6': '٦',
    '7': '٧',
    '8': '٨',
    '9': '٩',
    '0': '٠',
};
/**
 * Based on `@date-io/hijri`
 *
 * MIT License
 *
 * Copyright (c) 2017 Dmitriy Kovalenko
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
var AdapterMomentHijri = /** @class */ (function (_super) {
    __extends(AdapterMomentHijri, _super);
    function AdapterMomentHijri(_a) {
        var _b = _a === void 0 ? {} : _a, formats = _b.formats, instance = _b.instance;
        var _this = _super.call(this, { locale: 'ar-SA', instance: instance }) || this;
        _this.lib = 'moment-hijri';
        _this.isTimezoneCompatible = false;
        _this.formatTokenMap = formatTokenMap;
        _this.date = function (value) {
            if (value === null) {
                return null;
            }
            return _this.moment(value).locale('ar-SA');
        };
        /* v8 ignore next 3 */
        _this.getTimezone = function () {
            return 'default';
        };
        /* v8 ignore next 3 */
        _this.setTimezone = function (value) {
            return value;
        };
        _this.parse = function (value, format) {
            if (value === '') {
                return null;
            }
            return _this.moment(value, format, true).locale('ar-SA');
        };
        _this.formatNumber = function (numberToFormat) {
            return numberToFormat
                .replace(/\d/g, function (match) { return NUMBER_SYMBOL_MAP[match]; })
                .replace(/,/g, '،');
        };
        _this.startOfYear = function (value) {
            return value.clone().startOf('iYear');
        };
        _this.startOfMonth = function (value) {
            return value.clone().startOf('iMonth');
        };
        _this.endOfYear = function (value) {
            return value.clone().endOf('iYear');
        };
        _this.endOfMonth = function (value) {
            return value.clone().endOf('iMonth');
        };
        _this.addYears = function (value, amount) {
            return amount < 0
                ? value.clone().subtract(Math.abs(amount), 'iYear')
                : value.clone().add(amount, 'iYear');
        };
        _this.addMonths = function (value, amount) {
            return amount < 0
                ? value.clone().subtract(Math.abs(amount), 'iMonth')
                : value.clone().add(amount, 'iMonth');
        };
        _this.getYear = function (value) {
            return value.iYear();
        };
        _this.getMonth = function (value) {
            return value.iMonth();
        };
        _this.getDate = function (value) {
            return value.iDate();
        };
        _this.setYear = function (value, year) {
            return value.clone().iYear(year);
        };
        _this.setMonth = function (value, month) {
            return value.clone().iMonth(month);
        };
        _this.setDate = function (value, date) {
            return value.clone().iDate(date);
        };
        _this.getWeekNumber = function (value) {
            return value.iWeek();
        };
        _this.getYearRange = function (_a) {
            var start = _a[0], end = _a[1];
            // moment-hijri only supports dates between 1356-01-01 H and 1499-12-29 H
            // We need to throw if outside min/max bounds, otherwise the while loop below will be infinite.
            if (start.isBefore('1937-03-14')) {
                throw new Error('min date must be on or after 1356-01-01 H (1937-03-14)');
            }
            if (end.isAfter('2076-11-26')) {
                throw new Error('max date must be on or before 1499-12-29 H (2076-11-26)');
            }
            return _super.prototype.getYearRange.call(_this, [start, end]);
        };
        _this.moment = instance || moment_hijri_1.default;
        _this.locale = 'ar-SA';
        _this.formats = __assign(__assign({}, defaultFormats), formats);
        return _this;
    }
    return AdapterMomentHijri;
}(AdapterMoment_1.AdapterMoment));
exports.AdapterMomentHijri = AdapterMomentHijri;
