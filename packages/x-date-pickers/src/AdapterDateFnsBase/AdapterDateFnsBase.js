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
exports.AdapterDateFnsBase = void 0;
var formatTokenMap = {
    // Year
    y: { sectionType: 'year', contentType: 'digit', maxLength: 4 },
    yy: 'year',
    yyy: { sectionType: 'year', contentType: 'digit', maxLength: 4 },
    yyyy: 'year',
    // Month
    M: { sectionType: 'month', contentType: 'digit', maxLength: 2 },
    MM: 'month',
    MMMM: { sectionType: 'month', contentType: 'letter' },
    MMM: { sectionType: 'month', contentType: 'letter' },
    L: { sectionType: 'month', contentType: 'digit', maxLength: 2 },
    LL: 'month',
    LLL: { sectionType: 'month', contentType: 'letter' },
    LLLL: { sectionType: 'month', contentType: 'letter' },
    // Day of the month
    d: { sectionType: 'day', contentType: 'digit', maxLength: 2 },
    dd: 'day',
    do: { sectionType: 'day', contentType: 'digit-with-letter' },
    // Day of the week
    E: { sectionType: 'weekDay', contentType: 'letter' },
    EE: { sectionType: 'weekDay', contentType: 'letter' },
    EEE: { sectionType: 'weekDay', contentType: 'letter' },
    EEEE: { sectionType: 'weekDay', contentType: 'letter' },
    EEEEE: { sectionType: 'weekDay', contentType: 'letter' },
    i: { sectionType: 'weekDay', contentType: 'digit', maxLength: 1 },
    ii: 'weekDay',
    iii: { sectionType: 'weekDay', contentType: 'letter' },
    iiii: { sectionType: 'weekDay', contentType: 'letter' },
    // eslint-disable-next-line id-denylist
    e: { sectionType: 'weekDay', contentType: 'digit', maxLength: 1 },
    ee: 'weekDay',
    eee: { sectionType: 'weekDay', contentType: 'letter' },
    eeee: { sectionType: 'weekDay', contentType: 'letter' },
    eeeee: { sectionType: 'weekDay', contentType: 'letter' },
    eeeeee: { sectionType: 'weekDay', contentType: 'letter' },
    c: { sectionType: 'weekDay', contentType: 'digit', maxLength: 1 },
    cc: 'weekDay',
    ccc: { sectionType: 'weekDay', contentType: 'letter' },
    cccc: { sectionType: 'weekDay', contentType: 'letter' },
    ccccc: { sectionType: 'weekDay', contentType: 'letter' },
    cccccc: { sectionType: 'weekDay', contentType: 'letter' },
    // Meridiem
    a: 'meridiem',
    aa: 'meridiem',
    aaa: 'meridiem',
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
    dayOfMonthFull: 'do',
    weekday: 'EEEE',
    weekdayShort: 'EEEEEE',
    hours24h: 'HH',
    hours12h: 'hh',
    meridiem: 'aa',
    minutes: 'mm',
    seconds: 'ss',
    fullDate: 'PP',
    keyboardDate: 'P',
    shortDate: 'MMM d',
    normalDate: 'd MMMM',
    normalDateWithWeekday: 'EEE, MMM d',
    fullTime12h: 'hh:mm aa',
    fullTime24h: 'HH:mm',
    keyboardDateTime12h: 'P hh:mm aa',
    keyboardDateTime24h: 'P HH:mm',
};
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
var AdapterDateFnsBase = /** @class */ (function () {
    function AdapterDateFnsBase(props) {
        var _this = this;
        this.isMUIAdapter = true;
        this.isTimezoneCompatible = false;
        this.formatTokenMap = formatTokenMap;
        this.escapedCharacters = { start: "'", end: "'" };
        this.date = function (value) {
            if (typeof value === 'undefined') {
                return new Date();
            }
            if (value === null) {
                return null;
            }
            return new Date(value);
        };
        this.getInvalidDate = function () { return new Date('Invalid Date'); };
        this.getTimezone = function () {
            return 'default';
        };
        this.setTimezone = function (value) {
            return value;
        };
        this.toJsDate = function (value) {
            return value;
        };
        this.getCurrentLocaleCode = function () {
            // `code` is undefined only in `date-fns` types, but all locales have it
            return _this.locale.code;
        };
        // Note: date-fns input types are more lenient than this adapter, so we need to expose our more
        // strict signature and delegate to the more lenient signature. Otherwise, we have downstream type errors upon usage.
        this.is12HourCycleInCurrentLocale = function () {
            return /a/.test(_this.locale.formatLong.time({ width: 'short' }));
        };
        this.expandFormat = function (format) {
            var longFormatRegexp = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g;
            // @see https://github.com/date-fns/date-fns/blob/master/src/format/index.js#L31
            return format
                .match(longFormatRegexp)
                .map(function (token) {
                var firstCharacter = token[0];
                if (firstCharacter === 'p' || firstCharacter === 'P') {
                    var longFormatter = _this.longFormatters[firstCharacter];
                    return longFormatter(token, _this.locale.formatLong);
                }
                return token;
            })
                .join('');
        };
        this.formatNumber = function (numberToFormat) {
            return numberToFormat;
        };
        this.getDayOfWeek = function (value) {
            return value.getDay() + 1;
        };
        var locale = props.locale, formats = props.formats, longFormatters = props.longFormatters, lib = props.lib;
        this.locale = locale;
        this.formats = __assign(__assign({}, defaultFormats), formats);
        this.longFormatters = longFormatters;
        this.lib = lib || 'date-fns';
    }
    return AdapterDateFnsBase;
}());
exports.AdapterDateFnsBase = AdapterDateFnsBase;
