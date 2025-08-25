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
// date-fns@<3 has no exports field defined
// See https://github.com/date-fns/date-fns/issues/1781
/* eslint-disable import/extensions, class-methods-use-this */
/* v8 ignore start */
// @ts-nocheck
var index_js_1 = require("date-fns/addDays/index.js");
var index_js_2 = require("date-fns/addSeconds/index.js");
var index_js_3 = require("date-fns/addMinutes/index.js");
var index_js_4 = require("date-fns/addHours/index.js");
var index_js_5 = require("date-fns/addWeeks/index.js");
var index_js_6 = require("date-fns/addMonths/index.js");
var index_js_7 = require("date-fns/addYears/index.js");
var index_js_8 = require("date-fns/endOfDay/index.js");
var index_js_9 = require("date-fns/endOfWeek/index.js");
var index_js_10 = require("date-fns/endOfYear/index.js");
var index_js_11 = require("date-fns/format/index.js");
var index_js_12 = require("date-fns/getDate/index.js");
var index_js_13 = require("date-fns/getDaysInMonth/index.js");
var index_js_14 = require("date-fns/getHours/index.js");
var index_js_15 = require("date-fns/getMinutes/index.js");
var index_js_16 = require("date-fns/getMonth/index.js");
var index_js_17 = require("date-fns/getSeconds/index.js");
var index_js_18 = require("date-fns/getMilliseconds/index.js");
var index_js_19 = require("date-fns/getWeek/index.js");
var index_js_20 = require("date-fns/getYear/index.js");
var index_js_21 = require("date-fns/isAfter/index.js");
var index_js_22 = require("date-fns/isBefore/index.js");
var index_js_23 = require("date-fns/isEqual/index.js");
var index_js_24 = require("date-fns/isSameDay/index.js");
var index_js_25 = require("date-fns/isSameYear/index.js");
var index_js_26 = require("date-fns/isSameMonth/index.js");
var index_js_27 = require("date-fns/isSameHour/index.js");
var index_js_28 = require("date-fns/isValid/index.js");
var index_js_29 = require("date-fns/parse/index.js");
var index_js_30 = require("date-fns/setDate/index.js");
var index_js_31 = require("date-fns/setHours/index.js");
var index_js_32 = require("date-fns/setMinutes/index.js");
var index_js_33 = require("date-fns/setMonth/index.js");
var index_js_34 = require("date-fns/setSeconds/index.js");
var index_js_35 = require("date-fns/setMilliseconds/index.js");
var index_js_36 = require("date-fns/setYear/index.js");
var index_js_37 = require("date-fns/startOfDay/index.js");
var index_js_38 = require("date-fns/startOfMonth/index.js");
var index_js_39 = require("date-fns/endOfMonth/index.js");
var index_js_40 = require("date-fns/startOfWeek/index.js");
var index_js_41 = require("date-fns/startOfYear/index.js");
var index_js_42 = require("date-fns/isWithinInterval/index.js");
var index_js_43 = require("date-fns/locale/en-US/index.js");
var index_js_44 = require("date-fns/_lib/format/longFormatters/index.js");
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
            if (typeof index_js_1.default !== 'function') {
                throw new Error([
                    'MUI: This adapter is only compatible with `date-fns` v2.x package versions.',
                    'Please, install v2.x of the package or use the `AdapterDateFns` instead.',
                ].join('\n'));
            }
        }
        /* v8 ignore stop */
        _this = _super.call(this, { locale: locale !== null && locale !== void 0 ? locale : index_js_43.default, formats: formats, longFormatters: index_js_44.default }) || this;
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
            return (0, index_js_21.default)(value, (0, index_js_10.default)(comparing));
        };
        _this.isAfterDay = function (value, comparing) {
            return (0, index_js_21.default)(value, (0, index_js_8.default)(comparing));
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
            return (0, index_js_1.default)(value, amount);
        };
        _this.addHours = function (value, amount) {
            return (0, index_js_4.default)(value, amount);
        };
        _this.addMinutes = function (value, amount) {
            return (0, index_js_3.default)(value, amount);
        };
        _this.addSeconds = function (value, amount) {
            return (0, index_js_2.default)(value, amount);
        };
        _this.getYear = function (value) {
            return (0, index_js_20.default)(value);
        };
        _this.getMonth = function (value) {
            return (0, index_js_16.default)(value);
        };
        _this.getDate = function (value) {
            return (0, index_js_12.default)(value);
        };
        _this.getHours = function (value) {
            return (0, index_js_14.default)(value);
        };
        _this.getMinutes = function (value) {
            return (0, index_js_15.default)(value);
        };
        _this.getSeconds = function (value) {
            return (0, index_js_17.default)(value);
        };
        _this.getMilliseconds = function (value) {
            return (0, index_js_18.default)(value);
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
            return (0, index_js_13.default)(value);
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
            return (0, index_js_19.default)(value, { locale: _this.locale });
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
