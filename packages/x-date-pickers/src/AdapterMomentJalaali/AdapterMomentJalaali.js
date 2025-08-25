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
exports.AdapterMomentJalaali = void 0;
/* eslint-disable class-methods-use-this */
/* v8 ignore next */
var moment_jalaali_1 = require("moment-jalaali");
var AdapterMoment_1 = require("../AdapterMoment");
// From https://momentjs.com/docs/#/displaying/format/
var formatTokenMap = {
    // Year
    jYY: 'year',
    jYYYY: { sectionType: 'year', contentType: 'digit', maxLength: 4 },
    // Month
    jM: { sectionType: 'month', contentType: 'digit', maxLength: 2 },
    jMM: 'month',
    jMMM: { sectionType: 'month', contentType: 'letter' },
    jMMMM: { sectionType: 'month', contentType: 'letter' },
    // Day of the month
    jD: { sectionType: 'day', contentType: 'digit', maxLength: 2 },
    jDD: 'day',
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
    year: 'jYYYY',
    month: 'jMMMM',
    monthShort: 'jMMM',
    dayOfMonth: 'jD',
    // Full day of the month format (i.e. 3rd) is not supported
    // Falling back to regular format
    dayOfMonthFull: 'jD',
    weekday: 'dddd',
    weekdayShort: 'ddd',
    hours24h: 'HH',
    hours12h: 'hh',
    meridiem: 'A',
    minutes: 'mm',
    seconds: 'ss',
    fullDate: 'jYYYY, jMMMM Do',
    keyboardDate: 'jYYYY/jMM/jDD',
    shortDate: 'jD jMMM',
    normalDate: 'dddd, jD jMMM',
    normalDateWithWeekday: 'DD MMMM',
    fullTime12h: 'hh:mm A',
    fullTime24h: 'HH:mm',
    keyboardDateTime12h: 'jYYYY/jMM/jDD hh:mm A',
    keyboardDateTime24h: 'jYYYY/jMM/jDD HH:mm',
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
 * Based on `@date-io/jalaali`
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
var AdapterMomentJalaali = /** @class */ (function (_super) {
    __extends(AdapterMomentJalaali, _super);
    function AdapterMomentJalaali(_a) {
        var _b = _a === void 0 ? {} : _a, formats = _b.formats, instance = _b.instance;
        var _this = _super.call(this, { locale: 'fa', instance: instance }) || this;
        _this.isTimezoneCompatible = false;
        _this.lib = 'moment-jalaali';
        _this.formatTokenMap = formatTokenMap;
        _this.date = function (value) {
            if (value === null) {
                return null;
            }
            return _this.moment(value).locale('fa');
        };
        _this.getTimezone = function () {
            return 'default';
        };
        _this.setTimezone = function (value) {
            return value;
        };
        _this.parse = function (value, format) {
            if (value === '') {
                return null;
            }
            return _this.moment(value, format, true).locale('fa');
        };
        _this.formatNumber = function (numberToFormat) {
            return numberToFormat
                .replace(/\d/g, function (match) { return NUMBER_SYMBOL_MAP[match]; })
                .replace(/,/g, '،');
        };
        _this.isSameYear = function (value, comparing) {
            return value.jYear() === comparing.jYear();
        };
        _this.isSameMonth = function (value, comparing) {
            return value.jYear() === comparing.jYear() && value.jMonth() === comparing.jMonth();
        };
        _this.isAfterYear = function (value, comparing) {
            return value.jYear() > comparing.jYear();
        };
        _this.isBeforeYear = function (value, comparing) {
            return value.jYear() < comparing.jYear();
        };
        _this.startOfYear = function (value) {
            return value.clone().startOf('jYear');
        };
        _this.startOfMonth = function (value) {
            return value.clone().startOf('jMonth');
        };
        _this.endOfYear = function (value) {
            return value.clone().endOf('jYear');
        };
        _this.endOfMonth = function (value) {
            return value.clone().endOf('jMonth');
        };
        _this.addYears = function (value, amount) {
            return amount < 0
                ? value.clone().subtract(Math.abs(amount), 'jYear')
                : value.clone().add(amount, 'jYear');
        };
        _this.addMonths = function (value, amount) {
            return amount < 0
                ? value.clone().subtract(Math.abs(amount), 'jMonth')
                : value.clone().add(amount, 'jMonth');
        };
        _this.getYear = function (value) {
            return value.jYear();
        };
        _this.getMonth = function (value) {
            return value.jMonth();
        };
        _this.getDate = function (value) {
            return value.jDate();
        };
        _this.getDaysInMonth = function (value) {
            return _this.moment.jDaysInMonth(value.jYear(), value.jMonth());
        };
        _this.setYear = function (value, year) {
            return value.clone().jYear(year);
        };
        _this.setMonth = function (value, month) {
            return value.clone().jMonth(month);
        };
        _this.setDate = function (value, date) {
            return value.clone().jDate(date);
        };
        _this.getWeekNumber = function (value) {
            return value.jWeek();
        };
        _this.moment = instance || moment_jalaali_1.default;
        _this.locale = 'fa';
        _this.formats = __assign(__assign({}, defaultFormats), formats);
        return _this;
    }
    return AdapterMomentJalaali;
}(AdapterMoment_1.AdapterMoment));
exports.AdapterMomentJalaali = AdapterMomentJalaali;
