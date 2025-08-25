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
exports.AdapterDateFnsJalali = void 0;
// date-fns-jalali@<3 has no exports field defined
// See https://github.com/date-fns/date-fns/issues/1781
/* eslint-disable import/extensions, class-methods-use-this */
/* v8 ignore start */
// @ts-nocheck
var index_js_1 = require("date-fns-jalali/addSeconds/index.js");
var index_js_2 = require("date-fns-jalali/addMinutes/index.js");
var index_js_3 = require("date-fns-jalali/addHours/index.js");
var index_js_4 = require("date-fns-jalali/addDays/index.js");
var index_js_5 = require("date-fns-jalali/addWeeks/index.js");
var index_js_6 = require("date-fns-jalali/addMonths/index.js");
var index_js_7 = require("date-fns-jalali/addYears/index.js");
var index_js_8 = require("date-fns-jalali/endOfDay/index.js");
var index_js_9 = require("date-fns-jalali/endOfWeek/index.js");
var index_js_10 = require("date-fns-jalali/endOfYear/index.js");
var index_js_11 = require("date-fns-jalali/format/index.js");
var index_js_12 = require("date-fns-jalali/getHours/index.js");
var index_js_13 = require("date-fns-jalali/getSeconds/index.js");
var index_js_14 = require("date-fns-jalali/getMilliseconds/index.js");
var index_js_15 = require("date-fns-jalali/getWeek/index.js");
var index_js_16 = require("date-fns-jalali/getYear/index.js");
var index_js_17 = require("date-fns-jalali/getMonth/index.js");
var index_js_18 = require("date-fns-jalali/getDate/index.js");
var index_js_19 = require("date-fns-jalali/getDaysInMonth/index.js");
var index_js_20 = require("date-fns-jalali/getMinutes/index.js");
var index_js_21 = require("date-fns-jalali/isAfter/index.js");
var index_js_22 = require("date-fns-jalali/isBefore/index.js");
var index_js_23 = require("date-fns-jalali/isEqual/index.js");
var index_js_24 = require("date-fns-jalali/isSameDay/index.js");
var index_js_25 = require("date-fns-jalali/isSameYear/index.js");
var index_js_26 = require("date-fns-jalali/isSameMonth/index.js");
var index_js_27 = require("date-fns-jalali/isSameHour/index.js");
var index_js_28 = require("date-fns-jalali/isValid/index.js");
var index_js_29 = require("date-fns-jalali/parse/index.js");
var index_js_30 = require("date-fns-jalali/setDate/index.js");
var index_js_31 = require("date-fns-jalali/setHours/index.js");
var index_js_32 = require("date-fns-jalali/setMinutes/index.js");
var index_js_33 = require("date-fns-jalali/setMonth/index.js");
var index_js_34 = require("date-fns-jalali/setSeconds/index.js");
var index_js_35 = require("date-fns-jalali/setMilliseconds/index.js");
var index_js_36 = require("date-fns-jalali/setYear/index.js");
var index_js_37 = require("date-fns-jalali/startOfDay/index.js");
var index_js_38 = require("date-fns-jalali/startOfMonth/index.js");
var index_js_39 = require("date-fns-jalali/endOfMonth/index.js");
var index_js_40 = require("date-fns-jalali/startOfWeek/index.js");
var index_js_41 = require("date-fns-jalali/startOfYear/index.js");
var index_js_42 = require("date-fns-jalali/isWithinInterval/index.js");
var index_js_43 = require("date-fns-jalali/locale/fa-IR/index.js");
var index_js_44 = require("date-fns-jalali/_lib/format/longFormatters/index.js");
var AdapterDateFnsBase_1 = require("../AdapterDateFnsBase");
var defaultFormats = {
    year: 'yyyy',
    month: 'LLLL',
    monthShort: 'MMM',
    dayOfMonth: 'd',
    dayOfMonthFull: 'do',
    weekday: 'EEEE',
    weekdayShort: 'EEEEEE',
    hours24h: 'HH',
    hours12h: 'hh',
    meridiem: 'aa',
    minutes: 'mm',
    seconds: 'ss',
    fullDate: 'PPP',
    keyboardDate: 'P',
    shortDate: 'd MMM',
    normalDate: 'd MMMM',
    normalDateWithWeekday: 'EEE, d MMMM',
    fullTime12h: 'hh:mm aaa',
    fullTime24h: 'HH:mm',
    keyboardDateTime12h: 'P hh:mm aa',
    keyboardDateTime24h: 'P HH:mm',
};
var NUMBER_SYMBOL_MAP = {
    '1': '۱',
    '2': '۲',
    '3': '۳',
    '4': '۴',
    '5': '۵',
    '6': '۶',
    '7': '۷',
    '8': '۸',
    '9': '۹',
    '0': '۰',
};
/**
 * Based on `@date-io/date-fns-jalali`
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
var AdapterDateFnsJalali = /** @class */ (function (_super) {
    __extends(AdapterDateFnsJalali, _super);
    function AdapterDateFnsJalali(_a) {
        var _b = _a === void 0 ? {} : _a, locale = _b.locale, formats = _b.formats;
        var _this = this;
        /* v8 ignore start */
        if (process.env.NODE_ENV !== 'production') {
            if (typeof index_js_4.default !== 'function') {
                throw new Error([
                    'MUI: This adapter is only compatible with `date-fns-jalali` v2.x package versions.',
                    'Please, install v2.x of the package or use the `AdapterDateFnsJalali` instead.',
                ].join('\n'));
            }
        }
        /* v8 ignore stop */
        _this = _super.call(this, {
            locale: locale !== null && locale !== void 0 ? locale : index_js_43.default,
            // some formats are different in jalali adapter,
            // this ensures that `AdapterDateFnsBase` formats are overridden
            formats: __assign(__assign({}, defaultFormats), formats),
            longFormatters: index_js_44.default,
            lib: 'date-fns-jalali',
        }) || this;
        _this.parse = function (value, format) {
            if (value === '') {
                return null;
            }
            return (0, index_js_29.default)(value, format, new Date(), { locale: _this.locale });
        };
        _this.isValid = function (value) {
            if (value == null) {
                return false;
            }
            return (0, index_js_28.default)(value);
        };
        _this.format = function (value, formatKey) {
            return _this.formatByString(value, _this.formats[formatKey]);
        };
        _this.formatByString = function (value, formatString) {
            return (0, index_js_11.default)(value, formatString, { locale: _this.locale });
        };
        _this.formatNumber = function (numberToFormat) {
            return numberToFormat
                .replace(/\d/g, function (match) { return NUMBER_SYMBOL_MAP[match]; })
                .replace(/,/g, '،');
        };
        _this.isEqual = function (value, comparing) {
            if (value === null && comparing === null) {
                return true;
            }
            if (value === null || comparing === null) {
                return false;
            }
            return (0, index_js_23.default)(value, comparing);
        };
        _this.isSameYear = function (value, comparing) {
            return (0, index_js_25.default)(value, comparing);
        };
        _this.isSameMonth = function (value, comparing) {
            return (0, index_js_26.default)(value, comparing);
        };
        _this.isSameDay = function (value, comparing) {
            return (0, index_js_24.default)(value, comparing);
        };
        _this.isSameHour = function (value, comparing) {
            return (0, index_js_27.default)(value, comparing);
        };
        _this.isAfter = function (value, comparing) {
            return (0, index_js_21.default)(value, comparing);
        };
        _this.isAfterYear = function (value, comparing) {
            return (0, index_js_21.default)(value, _this.endOfYear(comparing));
        };
        _this.isAfterDay = function (value, comparing) {
            return (0, index_js_21.default)(value, _this.endOfDay(comparing));
        };
        _this.isBefore = function (value, comparing) {
            return (0, index_js_22.default)(value, comparing);
        };
        _this.isBeforeYear = function (value, comparing) {
            return (0, index_js_22.default)(value, _this.startOfYear(comparing));
        };
        _this.isBeforeDay = function (value, comparing) {
            return (0, index_js_22.default)(value, _this.startOfDay(comparing));
        };
        _this.isWithinRange = function (value, _a) {
            var start = _a[0], end = _a[1];
            return (0, index_js_42.default)(value, { start: start, end: end });
        };
        _this.startOfYear = function (value) {
            return (0, index_js_41.default)(value);
        };
        _this.startOfMonth = function (value) {
            return (0, index_js_38.default)(value);
        };
        _this.startOfWeek = function (value) {
            return (0, index_js_40.default)(value, { locale: _this.locale });
        };
        _this.startOfDay = function (value) {
            return (0, index_js_37.default)(value);
        };
        _this.endOfYear = function (value) {
            return (0, index_js_10.default)(value);
        };
        _this.endOfMonth = function (value) {
            return (0, index_js_39.default)(value);
        };
        _this.endOfWeek = function (value) {
            return (0, index_js_9.default)(value, { locale: _this.locale });
        };
        _this.endOfDay = function (value) {
            return (0, index_js_8.default)(value);
        };
        _this.addYears = function (value, amount) {
            return (0, index_js_7.default)(value, amount);
        };
        _this.addMonths = function (value, amount) {
            return (0, index_js_6.default)(value, amount);
        };
        _this.addWeeks = function (value, amount) {
            return (0, index_js_5.default)(value, amount);
        };
        _this.addDays = function (value, amount) {
            return (0, index_js_4.default)(value, amount);
        };
        _this.addHours = function (value, amount) {
            return (0, index_js_3.default)(value, amount);
        };
        _this.addMinutes = function (value, amount) {
            return (0, index_js_2.default)(value, amount);
        };
        _this.addSeconds = function (value, amount) {
            return (0, index_js_1.default)(value, amount);
        };
        _this.getYear = function (value) {
            return (0, index_js_16.default)(value);
        };
        _this.getMonth = function (value) {
            return (0, index_js_17.default)(value);
        };
        _this.getDate = function (value) {
            return (0, index_js_18.default)(value);
        };
        _this.getHours = function (value) {
            return (0, index_js_12.default)(value);
        };
        _this.getMinutes = function (value) {
            return (0, index_js_20.default)(value);
        };
        _this.getSeconds = function (value) {
            return (0, index_js_13.default)(value);
        };
        _this.getMilliseconds = function (value) {
            return (0, index_js_14.default)(value);
        };
        _this.setYear = function (value, year) {
            return (0, index_js_36.default)(value, year);
        };
        _this.setMonth = function (value, month) {
            return (0, index_js_33.default)(value, month);
        };
        _this.setDate = function (value, date) {
            return (0, index_js_30.default)(value, date);
        };
        _this.setHours = function (value, hours) {
            return (0, index_js_31.default)(value, hours);
        };
        _this.setMinutes = function (value, minutes) {
            return (0, index_js_32.default)(value, minutes);
        };
        _this.setSeconds = function (value, seconds) {
            return (0, index_js_34.default)(value, seconds);
        };
        _this.setMilliseconds = function (value, milliseconds) {
            return (0, index_js_35.default)(value, milliseconds);
        };
        _this.getDaysInMonth = function (value) {
            return (0, index_js_19.default)(value);
        };
        _this.getWeekArray = function (value) {
            var start = _this.startOfWeek(_this.startOfMonth(value));
            var end = _this.endOfWeek(_this.endOfMonth(value));
            var count = 0;
            var current = start;
            var nestedWeeks = [];
            while (_this.isBefore(current, end)) {
                var weekNumber = Math.floor(count / 7);
                nestedWeeks[weekNumber] = nestedWeeks[weekNumber] || [];
                nestedWeeks[weekNumber].push(current);
                current = _this.addDays(current, 1);
                count += 1;
            }
            return nestedWeeks;
        };
        _this.getWeekNumber = function (date) {
            return (0, index_js_15.default)(date, { locale: _this.locale });
        };
        _this.getYearRange = function (_a) {
            var start = _a[0], end = _a[1];
            var startDate = _this.startOfYear(start);
            var endDate = _this.endOfYear(end);
            var years = [];
            var current = startDate;
            while (_this.isBefore(current, endDate)) {
                years.push(current);
                current = _this.addYears(current, 1);
            }
            return years;
        };
        return _this;
    }
    return AdapterDateFnsJalali;
}(AdapterDateFnsBase_1.AdapterDateFnsBase));
exports.AdapterDateFnsJalali = AdapterDateFnsJalali;
