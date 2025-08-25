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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdapterMoment = void 0;
/* eslint-disable class-methods-use-this */
var moment_1 = require("moment");
// From https://momentjs.com/docs/#/displaying/format/
var formatTokenMap = {
    // Year
    Y: 'year',
    YY: 'year',
    YYYY: { sectionType: 'year', contentType: 'digit', maxLength: 4 },
    // Month
    M: { sectionType: 'month', contentType: 'digit', maxLength: 2 },
    MM: 'month',
    MMM: { sectionType: 'month', contentType: 'letter' },
    MMMM: { sectionType: 'month', contentType: 'letter' },
    // Day of the month
    D: { sectionType: 'day', contentType: 'digit', maxLength: 2 },
    DD: 'day',
    Do: { sectionType: 'day', contentType: 'digit-with-letter' },
    // Day of the week
    E: { sectionType: 'weekDay', contentType: 'digit', maxLength: 1 },
    // eslint-disable-next-line id-denylist
    e: { sectionType: 'weekDay', contentType: 'digit', maxLength: 1 },
    d: { sectionType: 'weekDay', contentType: 'digit', maxLength: 1 },
    dd: { sectionType: 'weekDay', contentType: 'letter' },
    ddd: { sectionType: 'weekDay', contentType: 'letter' },
    dddd: { sectionType: 'weekDay', contentType: 'letter' },
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
    year: 'YYYY',
    month: 'MMMM',
    monthShort: 'MMM',
    dayOfMonth: 'D',
    dayOfMonthFull: 'Do',
    weekday: 'dddd',
    weekdayShort: 'ddd',
    hours24h: 'HH',
    hours12h: 'hh',
    meridiem: 'A',
    minutes: 'mm',
    seconds: 'ss',
    fullDate: 'll',
    keyboardDate: 'L',
    shortDate: 'MMM D',
    normalDate: 'D MMMM',
    normalDateWithWeekday: 'ddd, MMM D',
    fullTime12h: 'hh:mm A',
    fullTime24h: 'HH:mm',
    keyboardDateTime12h: 'L hh:mm A',
    keyboardDateTime24h: 'L HH:mm',
};
var MISSING_TIMEZONE_PLUGIN = [
    'Missing timezone plugin',
    'To be able to use timezones, you have to pass the default export from `moment-timezone` to the `dateLibInstance` prop of `LocalizationProvider`',
    'Find more information on https://mui.com/x/react-date-pickers/timezone/#moment-and-timezone',
].join('\n');
/**
 * Based on `@date-io/moment`
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
var AdapterMoment = /** @class */ (function () {
    function AdapterMoment(_a) {
        var _b = _a === void 0 ? {} : _a, locale = _b.locale, formats = _b.formats, instance = _b.instance;
        var _this = this;
        this.isMUIAdapter = true;
        this.isTimezoneCompatible = true;
        this.lib = 'moment';
        this.escapedCharacters = { start: '[', end: ']' };
        this.formatTokenMap = formatTokenMap;
        this.setLocaleToValue = function (value) {
            var expectedLocale = _this.getCurrentLocaleCode();
            if (expectedLocale === value.locale()) {
                return value;
            }
            return value.locale(expectedLocale);
        };
        this.hasTimezonePlugin = function () { return typeof _this.moment.tz !== 'undefined'; };
        this.createSystemDate = function (value) {
            var parsedValue = _this.moment(value).local();
            if (_this.locale === undefined) {
                return parsedValue;
            }
            return parsedValue.locale(_this.locale);
        };
        this.createUTCDate = function (value) {
            var parsedValue = _this.moment.utc(value);
            if (_this.locale === undefined) {
                return parsedValue;
            }
            return parsedValue.locale(_this.locale);
        };
        this.createTZDate = function (value, timezone) {
            /* v8 ignore next 3 */
            if (!_this.hasTimezonePlugin()) {
                throw new Error(MISSING_TIMEZONE_PLUGIN);
            }
            var parsedValue = timezone === 'default' ? _this.moment(value) : _this.moment.tz(value, timezone);
            if (_this.locale === undefined) {
                return parsedValue;
            }
            return parsedValue.locale(_this.locale);
        };
        this.date = function (value, timezone) {
            if (timezone === void 0) { timezone = 'default'; }
            if (value === null) {
                return null;
            }
            if (timezone === 'UTC') {
                return _this.createUTCDate(value);
            }
            if (timezone === 'system' || (timezone === 'default' && !_this.hasTimezonePlugin())) {
                return _this.createSystemDate(value);
            }
            return _this.createTZDate(value, timezone);
        };
        this.getInvalidDate = function () { return _this.moment(new Date('Invalid Date')); };
        this.getTimezone = function (value) {
            var _a, _b, _c;
            // @ts-ignore
            // eslint-disable-next-line no-underscore-dangle
            var zone = (_a = value._z) === null || _a === void 0 ? void 0 : _a.name;
            var defaultZone = value.isUTC() ? 'UTC' : 'system';
            // @ts-ignore
            return (_c = zone !== null && zone !== void 0 ? zone : (_b = _this.moment.defaultZone) === null || _b === void 0 ? void 0 : _b.name) !== null && _c !== void 0 ? _c : defaultZone;
        };
        this.setTimezone = function (value, timezone) {
            var _a, _b;
            if (_this.getTimezone(value) === timezone) {
                return value;
            }
            if (timezone === 'UTC') {
                return value.clone().utc();
            }
            if (timezone === 'system') {
                return value.clone().local();
            }
            if (!_this.hasTimezonePlugin()) {
                /* v8 ignore next 3 */
                if (timezone !== 'default') {
                    throw new Error(MISSING_TIMEZONE_PLUGIN);
                }
                return value;
            }
            var cleanZone = timezone === 'default'
                ? // @ts-ignore
                    ((_b = (_a = _this.moment.defaultZone) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : 'system')
                : timezone;
            if (cleanZone === 'system') {
                return value.clone().local();
            }
            var newValue = value.clone();
            newValue.tz(cleanZone);
            return newValue;
        };
        this.toJsDate = function (value) {
            return value.toDate();
        };
        this.parse = function (value, format) {
            if (value === '') {
                return null;
            }
            if (_this.locale) {
                return _this.moment(value, format, _this.locale, true);
            }
            return _this.moment(value, format, true);
        };
        this.getCurrentLocaleCode = function () {
            return _this.locale || moment_1.default.locale();
        };
        this.is12HourCycleInCurrentLocale = function () {
            return /A|a/.test(moment_1.default.localeData(_this.getCurrentLocaleCode()).longDateFormat('LT'));
        };
        this.expandFormat = function (format) {
            // @see https://github.com/moment/moment/blob/develop/src/lib/format/format.js#L6
            var localFormattingTokens = /(\[[^[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})|./g;
            return format
                .match(localFormattingTokens)
                .map(function (token) {
                var firstCharacter = token[0];
                if (firstCharacter === 'L' || firstCharacter === ';') {
                    return moment_1.default
                        .localeData(_this.getCurrentLocaleCode())
                        .longDateFormat(token);
                }
                return token;
            })
                .join('');
        };
        this.isValid = function (value) {
            if (value == null) {
                return false;
            }
            return value.isValid();
        };
        this.format = function (value, formatKey) {
            return _this.formatByString(value, _this.formats[formatKey]);
        };
        this.formatByString = function (value, formatString) {
            var clonedDate = value.clone();
            clonedDate.locale(_this.getCurrentLocaleCode());
            return clonedDate.format(formatString);
        };
        this.formatNumber = function (numberToFormat) {
            return numberToFormat;
        };
        this.isEqual = function (value, comparing) {
            if (value === null && comparing === null) {
                return true;
            }
            if (value === null || comparing === null) {
                return false;
            }
            return value.isSame(comparing);
        };
        this.isSameYear = function (value, comparing) {
            return value.isSame(comparing, 'year');
        };
        this.isSameMonth = function (value, comparing) {
            return value.isSame(comparing, 'month');
        };
        this.isSameDay = function (value, comparing) {
            return value.isSame(comparing, 'day');
        };
        this.isSameHour = function (value, comparing) {
            return value.isSame(comparing, 'hour');
        };
        this.isAfter = function (value, comparing) {
            return value.isAfter(comparing);
        };
        this.isAfterYear = function (value, comparing) {
            return value.isAfter(comparing, 'year');
        };
        this.isAfterDay = function (value, comparing) {
            return value.isAfter(comparing, 'day');
        };
        this.isBefore = function (value, comparing) {
            return value.isBefore(comparing);
        };
        this.isBeforeYear = function (value, comparing) {
            return value.isBefore(comparing, 'year');
        };
        this.isBeforeDay = function (value, comparing) {
            return value.isBefore(comparing, 'day');
        };
        this.isWithinRange = function (value, _a) {
            var start = _a[0], end = _a[1];
            return value.isBetween(start, end, null, '[]');
        };
        this.startOfYear = function (value) {
            return value.clone().startOf('year');
        };
        this.startOfMonth = function (value) {
            return value.clone().startOf('month');
        };
        this.startOfWeek = function (value) {
            return _this.setLocaleToValue(value.clone()).startOf('week');
        };
        this.startOfDay = function (value) {
            return value.clone().startOf('day');
        };
        this.endOfYear = function (value) {
            return value.clone().endOf('year');
        };
        this.endOfMonth = function (value) {
            return value.clone().endOf('month');
        };
        this.endOfWeek = function (value) {
            return _this.setLocaleToValue(value.clone()).endOf('week');
        };
        this.endOfDay = function (value) {
            return value.clone().endOf('day');
        };
        this.addYears = function (value, amount) {
            return amount < 0
                ? value.clone().subtract(Math.abs(amount), 'years')
                : value.clone().add(amount, 'years');
        };
        this.addMonths = function (value, amount) {
            return amount < 0
                ? value.clone().subtract(Math.abs(amount), 'months')
                : value.clone().add(amount, 'months');
        };
        this.addWeeks = function (value, amount) {
            return amount < 0
                ? value.clone().subtract(Math.abs(amount), 'weeks')
                : value.clone().add(amount, 'weeks');
        };
        this.addDays = function (value, amount) {
            return amount < 0
                ? value.clone().subtract(Math.abs(amount), 'days')
                : value.clone().add(amount, 'days');
        };
        this.addHours = function (value, amount) {
            return amount < 0
                ? value.clone().subtract(Math.abs(amount), 'hours')
                : value.clone().add(amount, 'hours');
        };
        this.addMinutes = function (value, amount) {
            return amount < 0
                ? value.clone().subtract(Math.abs(amount), 'minutes')
                : value.clone().add(amount, 'minutes');
        };
        this.addSeconds = function (value, amount) {
            return amount < 0
                ? value.clone().subtract(Math.abs(amount), 'seconds')
                : value.clone().add(amount, 'seconds');
        };
        this.getYear = function (value) {
            return value.get('year');
        };
        this.getMonth = function (value) {
            return value.get('month');
        };
        this.getDate = function (value) {
            return value.get('date');
        };
        this.getHours = function (value) {
            return value.get('hours');
        };
        this.getMinutes = function (value) {
            return value.get('minutes');
        };
        this.getSeconds = function (value) {
            return value.get('seconds');
        };
        this.getMilliseconds = function (value) {
            return value.get('milliseconds');
        };
        this.setYear = function (value, year) {
            return value.clone().year(year);
        };
        this.setMonth = function (value, month) {
            return value.clone().month(month);
        };
        this.setDate = function (value, date) {
            return value.clone().date(date);
        };
        this.setHours = function (value, hours) {
            return value.clone().hours(hours);
        };
        this.setMinutes = function (value, minutes) {
            return value.clone().minutes(minutes);
        };
        this.setSeconds = function (value, seconds) {
            return value.clone().seconds(seconds);
        };
        this.setMilliseconds = function (value, milliseconds) {
            return value.clone().milliseconds(milliseconds);
        };
        this.getDaysInMonth = function (value) {
            return value.daysInMonth();
        };
        this.getWeekArray = function (value) {
            var start = _this.startOfWeek(_this.startOfMonth(value));
            var end = _this.endOfWeek(_this.endOfMonth(value));
            var count = 0;
            var current = start;
            var currentDayOfYear = current.get('dayOfYear');
            var nestedWeeks = [];
            while (current.isBefore(end)) {
                var weekNumber = Math.floor(count / 7);
                nestedWeeks[weekNumber] = nestedWeeks[weekNumber] || [];
                nestedWeeks[weekNumber].push(current);
                var prevDayOfYear = currentDayOfYear;
                current = _this.addDays(current, 1);
                currentDayOfYear = current.get('dayOfYear');
                // If there is a TZ change at midnight, adding 1 day may only increase the date by 23 hours to 11pm
                // To fix, bump the date into the next day (add 12 hours) and then revert to the start of the day
                // See https://github.com/moment/moment/issues/4743#issuecomment-811306874 for context.
                if (prevDayOfYear === currentDayOfYear) {
                    current = current.add(12, 'h').startOf('day');
                }
                count += 1;
            }
            return nestedWeeks;
        };
        this.getWeekNumber = function (value) {
            return value.week();
        };
        this.getDayOfWeek = function (value) {
            return value.day() + 1;
        };
        this.moment = instance || moment_1.default;
        this.locale = locale;
        this.formats = __assign(__assign({}, defaultFormats), formats);
    }
    AdapterMoment.prototype.getYearRange = function (_a) {
        var start = _a[0], end = _a[1];
        var startDate = this.startOfYear(start);
        var endDate = this.endOfYear(end);
        var years = [];
        var current = startDate;
        while (this.isBefore(current, endDate)) {
            years.push(current);
            current = this.addYears(current, 1);
        }
        return years;
    };
    return AdapterMoment;
}());
exports.AdapterMoment = AdapterMoment;
