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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdapterDateFns = void 0;
/* eslint-disable class-methods-use-this */
var addDays_1 = require("date-fns/addDays");
var addSeconds_1 = require("date-fns/addSeconds");
var addMinutes_1 = require("date-fns/addMinutes");
var addHours_1 = require("date-fns/addHours");
var addWeeks_1 = require("date-fns/addWeeks");
var addMonths_1 = require("date-fns/addMonths");
var addYears_1 = require("date-fns/addYears");
var endOfDay_1 = require("date-fns/endOfDay");
var endOfWeek_1 = require("date-fns/endOfWeek");
var endOfYear_1 = require("date-fns/endOfYear");
var format_1 = require("date-fns/format");
var getDate_1 = require("date-fns/getDate");
var getDaysInMonth_1 = require("date-fns/getDaysInMonth");
var getHours_1 = require("date-fns/getHours");
var getMinutes_1 = require("date-fns/getMinutes");
var getMonth_1 = require("date-fns/getMonth");
var getSeconds_1 = require("date-fns/getSeconds");
var getMilliseconds_1 = require("date-fns/getMilliseconds");
var getWeek_1 = require("date-fns/getWeek");
var getYear_1 = require("date-fns/getYear");
var isAfter_1 = require("date-fns/isAfter");
var isBefore_1 = require("date-fns/isBefore");
var isEqual_1 = require("date-fns/isEqual");
var isSameDay_1 = require("date-fns/isSameDay");
var isSameYear_1 = require("date-fns/isSameYear");
var isSameMonth_1 = require("date-fns/isSameMonth");
var isSameHour_1 = require("date-fns/isSameHour");
var isValid_1 = require("date-fns/isValid");
var parse_1 = require("date-fns/parse");
var setDate_1 = require("date-fns/setDate");
var setHours_1 = require("date-fns/setHours");
var setMinutes_1 = require("date-fns/setMinutes");
var setMonth_1 = require("date-fns/setMonth");
var setSeconds_1 = require("date-fns/setSeconds");
var setMilliseconds_1 = require("date-fns/setMilliseconds");
var setYear_1 = require("date-fns/setYear");
var startOfDay_1 = require("date-fns/startOfDay");
var startOfMonth_1 = require("date-fns/startOfMonth");
var endOfMonth_1 = require("date-fns/endOfMonth");
var startOfWeek_1 = require("date-fns/startOfWeek");
var startOfYear_1 = require("date-fns/startOfYear");
var isWithinInterval_1 = require("date-fns/isWithinInterval");
var en_US_1 = require("date-fns/locale/en-US");
var AdapterDateFnsBase_1 = require("../AdapterDateFnsBase");
/**
 * Based on `@date-io/date-fns`
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
var AdapterDateFns = /** @class */ (function (_super) {
    __extends(AdapterDateFns, _super);
    function AdapterDateFns(_a) {
        var _b = _a === void 0 ? {} : _a, locale = _b.locale, formats = _b.formats;
        var _this = this;
        /* v8 ignore start */
        if (process.env.NODE_ENV !== 'production') {
            if (typeof addDays_1.addDays !== 'function') {
                throw new Error([
                    'MUI: The `date-fns` package v2.x is not compatible with this adapter.',
                    'Please, install v3.x or v4.x of the package or use the `AdapterDateFnsV2` instead.',
                ].join('\n'));
            }
            if (!format_1.longFormatters) {
                throw new Error('MUI: The minimum supported `date-fns` package version compatible with this adapter is `3.2.x`.');
            }
        }
        /* v8 ignore stop */
        _this = _super.call(this, { locale: locale !== null && locale !== void 0 ? locale : en_US_1.enUS, formats: formats, longFormatters: format_1.longFormatters }) || this;
        // TODO: explicit return types can be removed once there is only one date-fns version supported
        _this.parse = function (value, format) {
            if (value === '') {
                return null;
            }
            return (0, parse_1.parse)(value, format, new Date(), { locale: _this.locale });
        };
        _this.isValid = function (value) {
            if (value == null) {
                return false;
            }
            return (0, isValid_1.isValid)(value);
        };
        _this.format = function (value, formatKey) {
            return _this.formatByString(value, _this.formats[formatKey]);
        };
        _this.formatByString = function (value, formatString) {
            return (0, format_1.format)(value, formatString, { locale: _this.locale });
        };
        _this.isEqual = function (value, comparing) {
            if (value === null && comparing === null) {
                return true;
            }
            if (value === null || comparing === null) {
                return false;
            }
            return (0, isEqual_1.isEqual)(value, comparing);
        };
        _this.isSameYear = function (value, comparing) {
            return (0, isSameYear_1.isSameYear)(value, comparing);
        };
        _this.isSameMonth = function (value, comparing) {
            return (0, isSameMonth_1.isSameMonth)(value, comparing);
        };
        _this.isSameDay = function (value, comparing) {
            return (0, isSameDay_1.isSameDay)(value, comparing);
        };
        _this.isSameHour = function (value, comparing) {
            return (0, isSameHour_1.isSameHour)(value, comparing);
        };
        _this.isAfter = function (value, comparing) {
            return (0, isAfter_1.isAfter)(value, comparing);
        };
        _this.isAfterYear = function (value, comparing) {
            return (0, isAfter_1.isAfter)(value, (0, endOfYear_1.endOfYear)(comparing));
        };
        _this.isAfterDay = function (value, comparing) {
            return (0, isAfter_1.isAfter)(value, (0, endOfDay_1.endOfDay)(comparing));
        };
        _this.isBefore = function (value, comparing) {
            return (0, isBefore_1.isBefore)(value, comparing);
        };
        _this.isBeforeYear = function (value, comparing) {
            return (0, isBefore_1.isBefore)(value, _this.startOfYear(comparing));
        };
        _this.isBeforeDay = function (value, comparing) {
            return (0, isBefore_1.isBefore)(value, _this.startOfDay(comparing));
        };
        _this.isWithinRange = function (value, _a) {
            var start = _a[0], end = _a[1];
            return (0, isWithinInterval_1.isWithinInterval)(value, { start: start, end: end });
        };
        _this.startOfYear = function (value) {
            return (0, startOfYear_1.startOfYear)(value);
        };
        _this.startOfMonth = function (value) {
            return (0, startOfMonth_1.startOfMonth)(value);
        };
        _this.startOfWeek = function (value) {
            return (0, startOfWeek_1.startOfWeek)(value, { locale: _this.locale });
        };
        _this.startOfDay = function (value) {
            return (0, startOfDay_1.startOfDay)(value);
        };
        _this.endOfYear = function (value) {
            return (0, endOfYear_1.endOfYear)(value);
        };
        _this.endOfMonth = function (value) {
            return (0, endOfMonth_1.endOfMonth)(value);
        };
        _this.endOfWeek = function (value) {
            return (0, endOfWeek_1.endOfWeek)(value, { locale: _this.locale });
        };
        _this.endOfDay = function (value) {
            return (0, endOfDay_1.endOfDay)(value);
        };
        _this.addYears = function (value, amount) {
            return (0, addYears_1.addYears)(value, amount);
        };
        _this.addMonths = function (value, amount) {
            return (0, addMonths_1.addMonths)(value, amount);
        };
        _this.addWeeks = function (value, amount) {
            return (0, addWeeks_1.addWeeks)(value, amount);
        };
        _this.addDays = function (value, amount) {
            return (0, addDays_1.addDays)(value, amount);
        };
        _this.addHours = function (value, amount) {
            return (0, addHours_1.addHours)(value, amount);
        };
        _this.addMinutes = function (value, amount) {
            return (0, addMinutes_1.addMinutes)(value, amount);
        };
        _this.addSeconds = function (value, amount) {
            return (0, addSeconds_1.addSeconds)(value, amount);
        };
        _this.getYear = function (value) {
            return (0, getYear_1.getYear)(value);
        };
        _this.getMonth = function (value) {
            return (0, getMonth_1.getMonth)(value);
        };
        _this.getDate = function (value) {
            return (0, getDate_1.getDate)(value);
        };
        _this.getHours = function (value) {
            return (0, getHours_1.getHours)(value);
        };
        _this.getMinutes = function (value) {
            return (0, getMinutes_1.getMinutes)(value);
        };
        _this.getSeconds = function (value) {
            return (0, getSeconds_1.getSeconds)(value);
        };
        _this.getMilliseconds = function (value) {
            return (0, getMilliseconds_1.getMilliseconds)(value);
        };
        _this.setYear = function (value, year) {
            return (0, setYear_1.setYear)(value, year);
        };
        _this.setMonth = function (value, month) {
            return (0, setMonth_1.setMonth)(value, month);
        };
        _this.setDate = function (value, date) {
            return (0, setDate_1.setDate)(value, date);
        };
        _this.setHours = function (value, hours) {
            return (0, setHours_1.setHours)(value, hours);
        };
        _this.setMinutes = function (value, minutes) {
            return (0, setMinutes_1.setMinutes)(value, minutes);
        };
        _this.setSeconds = function (value, seconds) {
            return (0, setSeconds_1.setSeconds)(value, seconds);
        };
        _this.setMilliseconds = function (value, milliseconds) {
            return (0, setMilliseconds_1.setMilliseconds)(value, milliseconds);
        };
        _this.getDaysInMonth = function (value) {
            return (0, getDaysInMonth_1.getDaysInMonth)(value);
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
        _this.getWeekNumber = function (value) {
            return (0, getWeek_1.getWeek)(value, { locale: _this.locale });
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
    return AdapterDateFns;
}(AdapterDateFnsBase_1.AdapterDateFnsBase));
exports.AdapterDateFns = AdapterDateFns;
