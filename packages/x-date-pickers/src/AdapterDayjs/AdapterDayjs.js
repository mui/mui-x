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
exports.AdapterDayjs = void 0;
/* eslint-disable class-methods-use-this */
/* v8 ignore start */
var dayjs_1 = require("dayjs");
// dayjs has no exports field defined
// See https://github.com/iamkun/dayjs/issues/2562
/* eslint-disable import/extensions */
var weekOfYear_js_1 = require("dayjs/plugin/weekOfYear.js");
var customParseFormat_js_1 = require("dayjs/plugin/customParseFormat.js");
var localizedFormat_js_1 = require("dayjs/plugin/localizedFormat.js");
var isBetween_js_1 = require("dayjs/plugin/isBetween.js");
var advancedFormat_js_1 = require("dayjs/plugin/advancedFormat.js");
/* v8 ignore stop */
/* eslint-enable import/extensions */
var warning_1 = require("@mui/x-internals/warning");
dayjs_1.default.extend(localizedFormat_js_1.default);
dayjs_1.default.extend(weekOfYear_js_1.default);
dayjs_1.default.extend(isBetween_js_1.default);
dayjs_1.default.extend(advancedFormat_js_1.default);
var formatTokenMap = {
    // Year
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
    d: { sectionType: 'weekDay', contentType: 'digit', maxLength: 2 },
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
    weekdayShort: 'dd',
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
var MISSING_UTC_PLUGIN = [
    'Missing UTC plugin',
    'To be able to use UTC or timezones, you have to enable the `utc` plugin',
    'Find more information on https://mui.com/x/react-date-pickers/timezone/#day-js-and-utc',
].join('\n');
var MISSING_TIMEZONE_PLUGIN = [
    'Missing timezone plugin',
    'To be able to use timezones, you have to enable both the `utc` and the `timezone` plugin',
    'Find more information on https://mui.com/x/react-date-pickers/timezone/#day-js-and-timezone',
].join('\n');
/**
 * Based on `@date-io/dayjs`
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
var AdapterDayjs = /** @class */ (function () {
    function AdapterDayjs(_a) {
        var _b = _a === void 0 ? {} : _a, locale = _b.locale, formats = _b.formats;
        var _this = this;
        this.isMUIAdapter = true;
        this.isTimezoneCompatible = true;
        this.lib = 'dayjs';
        this.escapedCharacters = { start: '[', end: ']' };
        this.formatTokenMap = formatTokenMap;
        this.setLocaleToValue = function (value) {
            var expectedLocale = _this.getCurrentLocaleCode();
            if (expectedLocale === value.locale()) {
                return value;
            }
            return value.locale(expectedLocale);
        };
        this.hasUTCPlugin = function () { return typeof dayjs_1.default.utc !== 'undefined'; };
        this.hasTimezonePlugin = function () { return typeof dayjs_1.default.tz !== 'undefined'; };
        this.isSame = function (value, comparing, comparisonTemplate) {
            var comparingInValueTimezone = _this.setTimezone(comparing, _this.getTimezone(value));
            return value.format(comparisonTemplate) === comparingInValueTimezone.format(comparisonTemplate);
        };
        /**
         * Replaces "default" by undefined and "system" by the system timezone before passing it to `dayjs`.
         */
        this.cleanTimezone = function (timezone) {
            switch (timezone) {
                case 'default': {
                    return undefined;
                }
                case 'system': {
                    return dayjs_1.default.tz.guess();
                }
                default: {
                    return timezone;
                }
            }
        };
        this.createSystemDate = function (value) {
            var date;
            if (_this.hasUTCPlugin() && _this.hasTimezonePlugin()) {
                var timezone = dayjs_1.default.tz.guess();
                if (timezone === 'UTC') {
                    date = (0, dayjs_1.default)(value);
                } /* v8 ignore next 3 */
                else {
                    // We can't change the system timezone in the tests
                    date = dayjs_1.default.tz(value, timezone);
                }
            }
            else {
                date = (0, dayjs_1.default)(value);
            }
            return _this.setLocaleToValue(date);
        };
        this.createUTCDate = function (value) {
            /* v8 ignore next 3 */
            if (!_this.hasUTCPlugin()) {
                throw new Error(MISSING_UTC_PLUGIN);
            }
            return _this.setLocaleToValue(dayjs_1.default.utc(value));
        };
        this.createTZDate = function (value, timezone) {
            /* v8 ignore next 3 */
            if (!_this.hasUTCPlugin()) {
                throw new Error(MISSING_UTC_PLUGIN);
            }
            /* v8 ignore next 3 */
            if (!_this.hasTimezonePlugin()) {
                throw new Error(MISSING_TIMEZONE_PLUGIN);
            }
            var keepLocalTime = value !== undefined && !value.endsWith('Z');
            return _this.setLocaleToValue((0, dayjs_1.default)(value).tz(_this.cleanTimezone(timezone), keepLocalTime));
        };
        this.getLocaleFormats = function () {
            var locales = dayjs_1.default.Ls;
            var locale = _this.locale || 'en';
            var localeObject = locales[locale];
            if (localeObject === undefined) {
                /* v8 ignore start */
                if (process.env.NODE_ENV !== 'production') {
                    (0, warning_1.warnOnce)([
                        'MUI X: Your locale has not been found.',
                        'Either the locale key is not a supported one. Locales supported by dayjs are available here: https://github.com/iamkun/dayjs/tree/dev/src/locale.',
                        "Or you forget to import the locale from 'dayjs/locale/{localeUsed}'",
                        'fallback on English locale.',
                    ]);
                }
                /* v8 ignore stop */
                localeObject = locales.en;
            }
            return localeObject.formats;
        };
        /**
         * If the new day does not have the same offset as the old one (when switching to summer day time for example),
         * Then dayjs will not automatically adjust the offset (moment does).
         * We have to parse again the value to make sure the `fixOffset` method is applied.
         * See https://github.com/iamkun/dayjs/blob/b3624de619d6e734cd0ffdbbd3502185041c1b60/src/plugin/timezone/index.js#L72
         */
        this.adjustOffset = function (value) {
            var _a;
            if (!_this.hasTimezonePlugin()) {
                return value;
            }
            var timezone = _this.getTimezone(value);
            if (timezone !== 'UTC') {
                var fixedValue = value.tz(_this.cleanTimezone(timezone), true);
                // TODO: Simplify the case when we raise the `dayjs` peer dep to 1.11.12 (https://github.com/iamkun/dayjs/releases/tag/v1.11.12)
                /* v8 ignore next 3 */
                // @ts-ignore
                if (fixedValue.$offset === ((_a = value.$offset) !== null && _a !== void 0 ? _a : 0)) {
                    return value;
                }
                // Change only what is needed to avoid creating a new object with unwanted data
                // Especially important when used in an environment where utc or timezone dates are used only in some places
                // Reference: https://github.com/mui/mui-x/issues/13290
                // @ts-ignore
                value.$offset = fixedValue.$offset;
            }
            return value;
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
        this.getInvalidDate = function () { return (0, dayjs_1.default)(new Date('Invalid date')); };
        this.getTimezone = function (value) {
            var _a;
            if (_this.hasTimezonePlugin()) {
                // @ts-ignore
                var zone = (_a = value.$x) === null || _a === void 0 ? void 0 : _a.$timezone;
                if (zone) {
                    return zone;
                }
            }
            if (_this.hasUTCPlugin() && value.isUTC()) {
                return 'UTC';
            }
            return 'system';
        };
        this.setTimezone = function (value, timezone) {
            if (_this.getTimezone(value) === timezone) {
                return value;
            }
            if (timezone === 'UTC') {
                /* v8 ignore next 3 */
                if (!_this.hasUTCPlugin()) {
                    throw new Error(MISSING_UTC_PLUGIN);
                }
                return value.utc();
            }
            // We know that we have the UTC plugin.
            // Otherwise, the value timezone would always equal "system".
            // And it would be caught by the first "if" of this method.
            if (timezone === 'system') {
                return value.local();
            }
            if (!_this.hasTimezonePlugin()) {
                if (timezone === 'default') {
                    return value;
                }
                /* v8 ignore next */
                throw new Error(MISSING_TIMEZONE_PLUGIN);
            }
            return _this.setLocaleToValue(dayjs_1.default.tz(value, _this.cleanTimezone(timezone)));
        };
        this.toJsDate = function (value) {
            return value.toDate();
        };
        this.parse = function (value, format) {
            if (value === '') {
                return null;
            }
            return (0, dayjs_1.default)(value, format, _this.locale, true);
        };
        this.getCurrentLocaleCode = function () {
            return _this.locale || 'en';
        };
        this.is12HourCycleInCurrentLocale = function () {
            /* v8 ignore next */
            return /A|a/.test(_this.getLocaleFormats().LT || '');
        };
        this.expandFormat = function (format) {
            var localeFormats = _this.getLocaleFormats();
            // @see https://github.com/iamkun/dayjs/blob/dev/src/plugin/localizedFormat/index.js
            var t = function (formatBis) {
                return formatBis.replace(/(\[[^\]]+])|(MMMM|MM|DD|dddd)/g, function (_, a, b) { return a || b.slice(1); });
            };
            return format.replace(/(\[[^\]]+])|(LTS?|l{1,4}|L{1,4})/g, function (_, a, b) {
                var B = b && b.toUpperCase();
                return (a ||
                    localeFormats[b] ||
                    t(localeFormats[B]));
            });
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
            return _this.setLocaleToValue(value).format(formatString);
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
            return value.toDate().getTime() === comparing.toDate().getTime();
        };
        this.isSameYear = function (value, comparing) {
            return _this.isSame(value, comparing, 'YYYY');
        };
        this.isSameMonth = function (value, comparing) {
            return _this.isSame(value, comparing, 'YYYY-MM');
        };
        this.isSameDay = function (value, comparing) {
            return _this.isSame(value, comparing, 'YYYY-MM-DD');
        };
        this.isSameHour = function (value, comparing) {
            return value.isSame(comparing, 'hour');
        };
        this.isAfter = function (value, comparing) {
            return value > comparing;
        };
        this.isAfterYear = function (value, comparing) {
            if (!_this.hasUTCPlugin()) {
                return value.isAfter(comparing, 'year');
            }
            return !_this.isSameYear(value, comparing) && value.utc() > comparing.utc();
        };
        this.isAfterDay = function (value, comparing) {
            if (!_this.hasUTCPlugin()) {
                return value.isAfter(comparing, 'day');
            }
            return !_this.isSameDay(value, comparing) && value.utc() > comparing.utc();
        };
        this.isBefore = function (value, comparing) {
            return value < comparing;
        };
        this.isBeforeYear = function (value, comparing) {
            if (!_this.hasUTCPlugin()) {
                return value.isBefore(comparing, 'year');
            }
            return !_this.isSameYear(value, comparing) && value.utc() < comparing.utc();
        };
        this.isBeforeDay = function (value, comparing) {
            if (!_this.hasUTCPlugin()) {
                return value.isBefore(comparing, 'day');
            }
            return !_this.isSameDay(value, comparing) && value.utc() < comparing.utc();
        };
        this.isWithinRange = function (value, _a) {
            var start = _a[0], end = _a[1];
            return value >= start && value <= end;
        };
        this.startOfYear = function (value) {
            return _this.adjustOffset(value.startOf('year'));
        };
        this.startOfMonth = function (value) {
            return _this.adjustOffset(value.startOf('month'));
        };
        this.startOfWeek = function (value) {
            return _this.adjustOffset(_this.setLocaleToValue(value).startOf('week'));
        };
        this.startOfDay = function (value) {
            return _this.adjustOffset(value.startOf('day'));
        };
        this.endOfYear = function (value) {
            return _this.adjustOffset(value.endOf('year'));
        };
        this.endOfMonth = function (value) {
            return _this.adjustOffset(value.endOf('month'));
        };
        this.endOfWeek = function (value) {
            return _this.adjustOffset(_this.setLocaleToValue(value).endOf('week'));
        };
        this.endOfDay = function (value) {
            return _this.adjustOffset(value.endOf('day'));
        };
        this.addYears = function (value, amount) {
            return _this.adjustOffset(value.add(amount, 'year'));
        };
        this.addMonths = function (value, amount) {
            return _this.adjustOffset(value.add(amount, 'month'));
        };
        this.addWeeks = function (value, amount) {
            return _this.adjustOffset(value.add(amount, 'week'));
        };
        this.addDays = function (value, amount) {
            return _this.adjustOffset(value.add(amount, 'day'));
        };
        this.addHours = function (value, amount) {
            return _this.adjustOffset(value.add(amount, 'hour'));
        };
        this.addMinutes = function (value, amount) {
            return _this.adjustOffset(value.add(amount, 'minute'));
        };
        this.addSeconds = function (value, amount) {
            return _this.adjustOffset(value.add(amount, 'second'));
        };
        this.getYear = function (value) {
            return value.year();
        };
        this.getMonth = function (value) {
            return value.month();
        };
        this.getDate = function (value) {
            return value.date();
        };
        this.getHours = function (value) {
            return value.hour();
        };
        this.getMinutes = function (value) {
            return value.minute();
        };
        this.getSeconds = function (value) {
            return value.second();
        };
        this.getMilliseconds = function (value) {
            return value.millisecond();
        };
        this.setYear = function (value, year) {
            return _this.adjustOffset(value.set('year', year));
        };
        this.setMonth = function (value, month) {
            return _this.adjustOffset(value.set('month', month));
        };
        this.setDate = function (value, date) {
            return _this.adjustOffset(value.set('date', date));
        };
        this.setHours = function (value, hours) {
            return _this.adjustOffset(value.set('hour', hours));
        };
        this.setMinutes = function (value, minutes) {
            return _this.adjustOffset(value.set('minute', minutes));
        };
        this.setSeconds = function (value, seconds) {
            return _this.adjustOffset(value.set('second', seconds));
        };
        this.setMilliseconds = function (value, milliseconds) {
            return _this.adjustOffset(value.set('millisecond', milliseconds));
        };
        this.getDaysInMonth = function (value) {
            return value.daysInMonth();
        };
        this.getWeekArray = function (value) {
            var start = _this.startOfWeek(_this.startOfMonth(value));
            var end = _this.endOfWeek(_this.endOfMonth(value));
            var count = 0;
            var current = start;
            var nestedWeeks = [];
            while (current < end) {
                var weekNumber = Math.floor(count / 7);
                nestedWeeks[weekNumber] = nestedWeeks[weekNumber] || [];
                nestedWeeks[weekNumber].push(current);
                current = _this.addDays(current, 1);
                count += 1;
            }
            return nestedWeeks;
        };
        this.getWeekNumber = function (value) {
            return value.week();
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
        this.locale = locale;
        this.formats = __assign(__assign({}, defaultFormats), formats);
        // Moved plugins to the constructor to allow for users to use options on the library
        // for reference: https://github.com/mui/mui-x/pull/11151
        dayjs_1.default.extend(customParseFormat_js_1.default);
    }
    AdapterDayjs.prototype.getDayOfWeek = function (value) {
        return value.day() + 1;
    };
    return AdapterDayjs;
}());
exports.AdapterDayjs = AdapterDayjs;
