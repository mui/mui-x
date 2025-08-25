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
exports.AdapterLuxon = void 0;
/* eslint-disable class-methods-use-this */
var luxon_1 = require("luxon");
var formatTokenMap = {
    // Year
    y: { sectionType: 'year', contentType: 'digit', maxLength: 4 },
    yy: 'year',
    yyyy: { sectionType: 'year', contentType: 'digit', maxLength: 4 },
    // Month
    L: { sectionType: 'month', contentType: 'digit', maxLength: 2 },
    LL: 'month',
    LLL: { sectionType: 'month', contentType: 'letter' },
    LLLL: { sectionType: 'month', contentType: 'letter' },
    M: { sectionType: 'month', contentType: 'digit', maxLength: 2 },
    MM: 'month',
    MMM: { sectionType: 'month', contentType: 'letter' },
    MMMM: { sectionType: 'month', contentType: 'letter' },
    // Day of the month
    d: { sectionType: 'day', contentType: 'digit', maxLength: 2 },
    dd: 'day',
    // Day of the week
    c: { sectionType: 'weekDay', contentType: 'digit', maxLength: 1 },
    ccc: { sectionType: 'weekDay', contentType: 'letter' },
    cccc: { sectionType: 'weekDay', contentType: 'letter' },
    E: { sectionType: 'weekDay', contentType: 'digit', maxLength: 2 },
    EEE: { sectionType: 'weekDay', contentType: 'letter' },
    EEEE: { sectionType: 'weekDay', contentType: 'letter' },
    // Meridiem
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
    year: 'yyyy',
    month: 'LLLL',
    monthShort: 'MMM',
    dayOfMonth: 'd',
    // Full day of the month format (i.e. 3rd) is not supported
    // Falling back to regular format
    dayOfMonthFull: 'd',
    weekday: 'cccc',
    weekdayShort: 'ccccc',
    hours24h: 'HH',
    hours12h: 'hh',
    meridiem: 'a',
    minutes: 'mm',
    seconds: 'ss',
    fullDate: 'DD',
    keyboardDate: 'D',
    shortDate: 'MMM d',
    normalDate: 'd MMMM',
    normalDateWithWeekday: 'EEE, MMM d',
    fullTime12h: 'hh:mm a',
    fullTime24h: 'HH:mm',
    keyboardDateTime12h: 'D hh:mm a',
    keyboardDateTime24h: 'D T',
};
/**
 * Based on `@date-io/luxon`
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
var AdapterLuxon = /** @class */ (function () {
    function AdapterLuxon(_a) {
        var _b = _a === void 0 ? {} : _a, locale = _b.locale, formats = _b.formats;
        var _this = this;
        this.isMUIAdapter = true;
        this.isTimezoneCompatible = true;
        this.lib = 'luxon';
        this.escapedCharacters = { start: "'", end: "'" };
        this.formatTokenMap = formatTokenMap;
        this.setLocaleToValue = function (value) {
            var expectedLocale = _this.getCurrentLocaleCode();
            if (expectedLocale === value.locale) {
                return value;
            }
            return value.setLocale(expectedLocale);
        };
        this.date = function (value, timezone) {
            if (timezone === void 0) { timezone = 'default'; }
            if (value === null) {
                return null;
            }
            if (typeof value === 'undefined') {
                // @ts-ignore
                return luxon_1.DateTime.fromJSDate(new Date(), { locale: _this.locale, zone: timezone });
            }
            // @ts-ignore
            return luxon_1.DateTime.fromISO(value, { locale: _this.locale, zone: timezone });
        };
        this.getInvalidDate = function () { return luxon_1.DateTime.fromJSDate(new Date('Invalid Date')); };
        this.getTimezone = function (value) {
            // When using the system zone, we want to return "system", not something like "Europe/Paris"
            if (value.zone.type === 'system') {
                return 'system';
            }
            return value.zoneName;
        };
        this.setTimezone = function (value, timezone) {
            if (!value.zone.equals(luxon_1.Info.normalizeZone(timezone))) {
                return value.setZone(timezone);
            }
            return value;
        };
        this.toJsDate = function (value) {
            return value.toJSDate();
        };
        this.parse = function (value, formatString) {
            if (value === '') {
                return null;
            }
            return luxon_1.DateTime.fromFormat(value, formatString, { locale: _this.locale });
        };
        this.getCurrentLocaleCode = function () {
            return _this.locale;
        };
        /* v8 ignore start */
        this.is12HourCycleInCurrentLocale = function () {
            var _a, _b;
            if (typeof Intl === 'undefined' || typeof Intl.DateTimeFormat === 'undefined') {
                return true; // Luxon defaults to en-US if Intl not found
            }
            return Boolean((_b = (_a = new Intl.DateTimeFormat(_this.locale, { hour: 'numeric' })) === null || _a === void 0 ? void 0 : _a.resolvedOptions()) === null || _b === void 0 ? void 0 : _b.hour12);
        };
        /* v8 ignore stop */
        this.expandFormat = function (format) {
            // Extract escaped section to avoid extending them
            var catchEscapedSectionsRegexp = /''|'(''|[^'])+('|$)|[^']*/g;
            // This RegExp tests if a string is only mad of supported tokens
            var validTokens = __spreadArray(__spreadArray([], Object.keys(_this.formatTokenMap), true), ['yyyyy'], false);
            var isWordComposedOfTokens = new RegExp("^(".concat(validTokens.join('|'), ")+$"));
            // Extract words to test if they are a token or a word to escape.
            var catchWordsRegexp = /(?:^|[^a-z])([a-z]+)(?:[^a-z]|$)|([a-z]+)/gi;
            return (format
                .match(catchEscapedSectionsRegexp)
                .map(function (token) {
                var firstCharacter = token[0];
                if (firstCharacter === "'") {
                    return token;
                }
                var expandedToken = luxon_1.DateTime.expandFormat(token, { locale: _this.locale });
                return expandedToken.replace(catchWordsRegexp, function (substring, g1, g2) {
                    var word = g1 || g2; // words are either in group 1 or group 2
                    if (isWordComposedOfTokens.test(word)) {
                        return substring;
                    }
                    return "'".concat(substring, "'");
                });
            })
                .join('')
                // The returned format can contain `yyyyy` which means year between 4 and 6 digits.
                // This value is supported by luxon parser but not luxon formatter.
                // To avoid conflicts, we replace it by 4 digits which is enough for most use-cases.
                .replace('yyyyy', 'yyyy'));
        };
        this.isValid = function (value) {
            if (value === null) {
                return false;
            }
            return value.isValid;
        };
        this.format = function (value, formatKey) {
            return _this.formatByString(value, _this.formats[formatKey]);
        };
        this.formatByString = function (value, format) {
            return value.setLocale(_this.locale).toFormat(format);
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
            return +value === +comparing;
        };
        this.isSameYear = function (value, comparing) {
            var comparingInValueTimezone = _this.setTimezone(comparing, _this.getTimezone(value));
            return value.hasSame(comparingInValueTimezone, 'year');
        };
        this.isSameMonth = function (value, comparing) {
            var comparingInValueTimezone = _this.setTimezone(comparing, _this.getTimezone(value));
            return value.hasSame(comparingInValueTimezone, 'month');
        };
        this.isSameDay = function (value, comparing) {
            var comparingInValueTimezone = _this.setTimezone(comparing, _this.getTimezone(value));
            return value.hasSame(comparingInValueTimezone, 'day');
        };
        this.isSameHour = function (value, comparing) {
            var comparingInValueTimezone = _this.setTimezone(comparing, _this.getTimezone(value));
            return value.hasSame(comparingInValueTimezone, 'hour');
        };
        this.isAfter = function (value, comparing) {
            return value > comparing;
        };
        this.isAfterYear = function (value, comparing) {
            var comparingInValueTimezone = _this.setTimezone(comparing, _this.getTimezone(value));
            var diff = value.diff(_this.endOfYear(comparingInValueTimezone), 'years').toObject();
            return diff.years > 0;
        };
        this.isAfterDay = function (value, comparing) {
            var comparingInValueTimezone = _this.setTimezone(comparing, _this.getTimezone(value));
            var diff = value.diff(_this.endOfDay(comparingInValueTimezone), 'days').toObject();
            return diff.days > 0;
        };
        this.isBefore = function (value, comparing) {
            return value < comparing;
        };
        this.isBeforeYear = function (value, comparing) {
            var comparingInValueTimezone = _this.setTimezone(comparing, _this.getTimezone(value));
            var diff = value.diff(_this.startOfYear(comparingInValueTimezone), 'years').toObject();
            return diff.years < 0;
        };
        this.isBeforeDay = function (value, comparing) {
            var comparingInValueTimezone = _this.setTimezone(comparing, _this.getTimezone(value));
            var diff = value.diff(_this.startOfDay(comparingInValueTimezone), 'days').toObject();
            return diff.days < 0;
        };
        this.isWithinRange = function (value, _a) {
            var start = _a[0], end = _a[1];
            return (_this.isEqual(value, start) ||
                _this.isEqual(value, end) ||
                (_this.isAfter(value, start) && _this.isBefore(value, end)));
        };
        this.startOfYear = function (value) {
            return value.startOf('year');
        };
        this.startOfMonth = function (value) {
            return value.startOf('month');
        };
        this.startOfWeek = function (value) {
            return _this.setLocaleToValue(value).startOf('week', { useLocaleWeeks: true });
        };
        this.startOfDay = function (value) {
            return value.startOf('day');
        };
        this.endOfYear = function (value) {
            return value.endOf('year');
        };
        this.endOfMonth = function (value) {
            return value.endOf('month');
        };
        this.endOfWeek = function (value) {
            return _this.setLocaleToValue(value).endOf('week', { useLocaleWeeks: true });
        };
        this.endOfDay = function (value) {
            return value.endOf('day');
        };
        this.addYears = function (value, amount) {
            return value.plus({ years: amount });
        };
        this.addMonths = function (value, amount) {
            return value.plus({ months: amount });
        };
        this.addWeeks = function (value, amount) {
            return value.plus({ weeks: amount });
        };
        this.addDays = function (value, amount) {
            return value.plus({ days: amount });
        };
        this.addHours = function (value, amount) {
            return value.plus({ hours: amount });
        };
        this.addMinutes = function (value, amount) {
            return value.plus({ minutes: amount });
        };
        this.addSeconds = function (value, amount) {
            return value.plus({ seconds: amount });
        };
        this.getYear = function (value) {
            return value.get('year');
        };
        this.getMonth = function (value) {
            // See https://github.com/moment/luxon/blob/master/docs/moment.md#major-functional-differences
            return value.get('month') - 1;
        };
        this.getDate = function (value) {
            return value.get('day');
        };
        this.getHours = function (value) {
            return value.get('hour');
        };
        this.getMinutes = function (value) {
            return value.get('minute');
        };
        this.getSeconds = function (value) {
            return value.get('second');
        };
        this.getMilliseconds = function (value) {
            return value.get('millisecond');
        };
        this.setYear = function (value, year) {
            return value.set({ year: year });
        };
        this.setMonth = function (value, month) {
            return value.set({ month: month + 1 });
        };
        this.setDate = function (value, date) {
            return value.set({ day: date });
        };
        this.setHours = function (value, hours) {
            return value.set({ hour: hours });
        };
        this.setMinutes = function (value, minutes) {
            return value.set({ minute: minutes });
        };
        this.setSeconds = function (value, seconds) {
            return value.set({ second: seconds });
        };
        this.setMilliseconds = function (value, milliseconds) {
            return value.set({ millisecond: milliseconds });
        };
        this.getDaysInMonth = function (value) {
            return value.daysInMonth;
        };
        this.getWeekArray = function (value) {
            var firstDay = _this.startOfWeek(_this.startOfMonth(value));
            var lastDay = _this.endOfWeek(_this.endOfMonth(value));
            var days = lastDay.diff(firstDay, 'days').toObject().days;
            var weeks = [];
            new Array(Math.round(days))
                .fill(0)
                .map(function (_, i) { return i; })
                .map(function (day) { return firstDay.plus({ days: day }); })
                .forEach(function (v, i) {
                if (i === 0 || (i % 7 === 0 && i > 6)) {
                    weeks.push([v]);
                    return;
                }
                weeks[weeks.length - 1].push(v);
            });
            return weeks;
        };
        this.getWeekNumber = function (value) {
            var _a;
            /* v8 ignore next */
            return (_a = value.localWeekNumber) !== null && _a !== void 0 ? _a : value.weekNumber;
        };
        this.getDayOfWeek = function (value) {
            var _a;
            return (_a = value.localWeekday) !== null && _a !== void 0 ? _a : value.weekday;
        };
        this.getYearRange = function (_a) {
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
        this.locale = locale || 'en-US';
        this.formats = __assign(__assign({}, defaultFormats), formats);
    }
    return AdapterLuxon;
}());
exports.AdapterLuxon = AdapterLuxon;
