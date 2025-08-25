"use strict";
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
exports.parseSelectedSections = exports.getSectionOrder = exports.isAndroid = exports.mergeDateIntoReferenceDate = exports.validateSections = exports.getSectionsBoundaries = exports.createDateStrForV6InputFromSections = exports.createDateStrForV7HiddenInputFromSections = exports.getDateFromDateSections = exports.doesSectionFormatHaveLeadingZeros = exports.changeSectionValueFormat = exports.getSectionVisibleValue = exports.cleanDigitSectionValue = exports.cleanLeadingZeros = exports.isStringNumber = exports.applyLocalizedDigits = exports.removeLocalizedDigits = exports.getLocalizedDigits = exports.FORMAT_SECONDS_NO_LEADING_ZEROS = exports.getLetterEditingOptions = exports.getDaysInWeekStr = exports.getDateSectionConfigFromFormatToken = void 0;
var date_utils_1 = require("../../utils/date-utils");
var getDateSectionConfigFromFormatToken = function (adapter, formatToken) {
    var config = adapter.formatTokenMap[formatToken];
    if (config == null) {
        throw new Error([
            "MUI X: The token \"".concat(formatToken, "\" is not supported by the Date and Time Pickers."),
            'Please try using another token or open an issue on https://github.com/mui/mui-x/issues/new/choose if you think it should be supported.',
        ].join('\n'));
    }
    if (typeof config === 'string') {
        return {
            type: config,
            contentType: config === 'meridiem' ? 'letter' : 'digit',
            maxLength: undefined,
        };
    }
    return {
        type: config.sectionType,
        contentType: config.contentType,
        maxLength: config.maxLength,
    };
};
exports.getDateSectionConfigFromFormatToken = getDateSectionConfigFromFormatToken;
var getDaysInWeekStr = function (adapter, format) {
    var elements = [];
    var now = adapter.date(undefined, 'default');
    var startDate = adapter.startOfWeek(now);
    var endDate = adapter.endOfWeek(now);
    var current = startDate;
    while (adapter.isBefore(current, endDate)) {
        elements.push(current);
        current = adapter.addDays(current, 1);
    }
    return elements.map(function (weekDay) { return adapter.formatByString(weekDay, format); });
};
exports.getDaysInWeekStr = getDaysInWeekStr;
var getLetterEditingOptions = function (adapter, timezone, sectionType, format) {
    switch (sectionType) {
        case 'month': {
            return (0, date_utils_1.getMonthsInYear)(adapter, adapter.date(undefined, timezone)).map(function (month) {
                return adapter.formatByString(month, format);
            });
        }
        case 'weekDay': {
            return (0, exports.getDaysInWeekStr)(adapter, format);
        }
        case 'meridiem': {
            var now = adapter.date(undefined, timezone);
            return [adapter.startOfDay(now), adapter.endOfDay(now)].map(function (date) {
                return adapter.formatByString(date, format);
            });
        }
        default: {
            return [];
        }
    }
};
exports.getLetterEditingOptions = getLetterEditingOptions;
// This format should be the same on all the adapters
// If some adapter does not respect this convention, then we will need to hardcode the format on each adapter.
exports.FORMAT_SECONDS_NO_LEADING_ZEROS = 's';
var NON_LOCALIZED_DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
var getLocalizedDigits = function (adapter) {
    var today = adapter.date(undefined);
    var formattedZero = adapter.formatByString(adapter.setSeconds(today, 0), exports.FORMAT_SECONDS_NO_LEADING_ZEROS);
    if (formattedZero === '0') {
        return NON_LOCALIZED_DIGITS;
    }
    return Array.from({ length: 10 }).map(function (_, index) {
        return adapter.formatByString(adapter.setSeconds(today, index), exports.FORMAT_SECONDS_NO_LEADING_ZEROS);
    });
};
exports.getLocalizedDigits = getLocalizedDigits;
var removeLocalizedDigits = function (valueStr, localizedDigits) {
    if (localizedDigits[0] === '0') {
        return valueStr;
    }
    var digits = [];
    var currentFormattedDigit = '';
    for (var i = 0; i < valueStr.length; i += 1) {
        currentFormattedDigit += valueStr[i];
        var matchingDigitIndex = localizedDigits.indexOf(currentFormattedDigit);
        if (matchingDigitIndex > -1) {
            digits.push(matchingDigitIndex.toString());
            currentFormattedDigit = '';
        }
    }
    return digits.join('');
};
exports.removeLocalizedDigits = removeLocalizedDigits;
var applyLocalizedDigits = function (valueStr, localizedDigits) {
    if (localizedDigits[0] === '0') {
        return valueStr;
    }
    return valueStr
        .split('')
        .map(function (char) { return localizedDigits[Number(char)]; })
        .join('');
};
exports.applyLocalizedDigits = applyLocalizedDigits;
var isStringNumber = function (valueStr, localizedDigits) {
    var nonLocalizedValueStr = (0, exports.removeLocalizedDigits)(valueStr, localizedDigits);
    // `Number(' ')` returns `0` even if ' ' is not a valid number.
    return nonLocalizedValueStr !== ' ' && !Number.isNaN(Number(nonLocalizedValueStr));
};
exports.isStringNumber = isStringNumber;
/**
 * Make sure the value of a digit section have the right amount of leading zeros.
 * E.g.: `03` => `3`
 * Warning: Should only be called with non-localized digits. Call `removeLocalizedDigits` with your value if needed.
 */
var cleanLeadingZeros = function (valueStr, size) {
    // Remove the leading zeros and then add back as many as needed.
    return Number(valueStr).toString().padStart(size, '0');
};
exports.cleanLeadingZeros = cleanLeadingZeros;
var cleanDigitSectionValue = function (adapter, value, sectionBoundaries, localizedDigits, section) {
    if (process.env.NODE_ENV !== 'production') {
        if (section.type !== 'day' && section.contentType === 'digit-with-letter') {
            throw new Error([
                "MUI X: The token \"".concat(section.format, "\" is a digit format with letter in it.'\n             This type of format is only supported for 'day' sections"),
            ].join('\n'));
        }
    }
    if (section.type === 'day' && section.contentType === 'digit-with-letter') {
        var date = adapter.setDate(sectionBoundaries.longestMonth, value);
        return adapter.formatByString(date, section.format);
    }
    // queryValue without leading `0` (`01` => `1`)
    var valueStr = value.toString();
    if (section.hasLeadingZerosInInput) {
        valueStr = (0, exports.cleanLeadingZeros)(valueStr, section.maxLength);
    }
    return (0, exports.applyLocalizedDigits)(valueStr, localizedDigits);
};
exports.cleanDigitSectionValue = cleanDigitSectionValue;
var getSectionVisibleValue = function (section, target, localizedDigits) {
    var value = section.value || section.placeholder;
    var hasLeadingZeros = target === 'non-input' ? section.hasLeadingZerosInFormat : section.hasLeadingZerosInInput;
    if (target === 'non-input' &&
        section.hasLeadingZerosInInput &&
        !section.hasLeadingZerosInFormat) {
        value = Number((0, exports.removeLocalizedDigits)(value, localizedDigits)).toString();
    }
    // In the input, we add an empty character at the end of each section without leading zeros.
    // This makes sure that `onChange` will always be fired.
    // Otherwise, when your input value equals `1/dd/yyyy` (format `M/DD/YYYY` on DayJs),
    // If you press `1`, on the first section, the new value is also `1/dd/yyyy`,
    // So the browser will not fire the input `onChange`.
    var shouldAddInvisibleSpace = ['input-rtl', 'input-ltr'].includes(target) &&
        section.contentType === 'digit' &&
        !hasLeadingZeros &&
        value.length === 1;
    if (shouldAddInvisibleSpace) {
        value = "".concat(value, "\u200E");
    }
    if (target === 'input-rtl') {
        value = "\u2068".concat(value, "\u2069");
    }
    return value;
};
exports.getSectionVisibleValue = getSectionVisibleValue;
var changeSectionValueFormat = function (adapter, valueStr, currentFormat, newFormat) {
    if (process.env.NODE_ENV !== 'production') {
        if ((0, exports.getDateSectionConfigFromFormatToken)(adapter, currentFormat).type === 'weekDay') {
            throw new Error("changeSectionValueFormat doesn't support week day formats");
        }
    }
    return adapter.formatByString(adapter.parse(valueStr, currentFormat), newFormat);
};
exports.changeSectionValueFormat = changeSectionValueFormat;
var isFourDigitYearFormat = function (adapter, format) {
    return adapter.formatByString(adapter.date(undefined, 'system'), format).length === 4;
};
var doesSectionFormatHaveLeadingZeros = function (adapter, contentType, sectionType, format) {
    if (contentType !== 'digit') {
        return false;
    }
    var now = adapter.date(undefined, 'default');
    switch (sectionType) {
        // We can't use `changeSectionValueFormat`, because  `adapter.parse('1', 'YYYY')` returns `1971` instead of `1`.
        case 'year': {
            // Remove once https://github.com/iamkun/dayjs/pull/2847 is merged and bump dayjs version
            if (adapter.lib === 'dayjs' && format === 'YY') {
                return true;
            }
            return adapter.formatByString(adapter.setYear(now, 1), format).startsWith('0');
        }
        case 'month': {
            return adapter.formatByString(adapter.startOfYear(now), format).length > 1;
        }
        case 'day': {
            return adapter.formatByString(adapter.startOfMonth(now), format).length > 1;
        }
        case 'weekDay': {
            return adapter.formatByString(adapter.startOfWeek(now), format).length > 1;
        }
        case 'hours': {
            return adapter.formatByString(adapter.setHours(now, 1), format).length > 1;
        }
        case 'minutes': {
            return adapter.formatByString(adapter.setMinutes(now, 1), format).length > 1;
        }
        case 'seconds': {
            return adapter.formatByString(adapter.setSeconds(now, 1), format).length > 1;
        }
        default: {
            throw new Error('Invalid section type');
        }
    }
};
exports.doesSectionFormatHaveLeadingZeros = doesSectionFormatHaveLeadingZeros;
/**
 * Some date libraries like `dayjs` don't support parsing from date with escaped characters.
 * To make sure that the parsing works, we are building a format and a date without any separator.
 */
var getDateFromDateSections = function (adapter, sections, localizedDigits) {
    // If we have both a day and a weekDay section,
    // Then we skip the weekDay in the parsing because libraries like dayjs can't parse complicated formats containing a weekDay.
    // dayjs(dayjs().format('dddd MMMM D YYYY'), 'dddd MMMM D YYYY')) // returns `Invalid Date` even if the format is valid.
    var shouldSkipWeekDays = sections.some(function (section) { return section.type === 'day'; });
    var sectionFormats = [];
    var sectionValues = [];
    for (var i = 0; i < sections.length; i += 1) {
        var section = sections[i];
        var shouldSkip = shouldSkipWeekDays && section.type === 'weekDay';
        if (!shouldSkip) {
            sectionFormats.push(section.format);
            sectionValues.push((0, exports.getSectionVisibleValue)(section, 'non-input', localizedDigits));
        }
    }
    var formatWithoutSeparator = sectionFormats.join(' ');
    var dateWithoutSeparatorStr = sectionValues.join(' ');
    return adapter.parse(dateWithoutSeparatorStr, formatWithoutSeparator);
};
exports.getDateFromDateSections = getDateFromDateSections;
var createDateStrForV7HiddenInputFromSections = function (sections) {
    return sections
        .map(function (section) {
        return "".concat(section.startSeparator).concat(section.value || section.placeholder).concat(section.endSeparator);
    })
        .join('');
};
exports.createDateStrForV7HiddenInputFromSections = createDateStrForV7HiddenInputFromSections;
var createDateStrForV6InputFromSections = function (sections, localizedDigits, isRtl) {
    var formattedSections = sections.map(function (section) {
        var dateValue = (0, exports.getSectionVisibleValue)(section, isRtl ? 'input-rtl' : 'input-ltr', localizedDigits);
        return "".concat(section.startSeparator).concat(dateValue).concat(section.endSeparator);
    });
    var dateStr = formattedSections.join('');
    if (!isRtl) {
        return dateStr;
    }
    // \u2066: start left-to-right isolation
    // \u2067: start right-to-left isolation
    // \u2068: start first strong character isolation
    // \u2069: pop isolation
    // wrap into an isolated group such that separators can split the string in smaller ones by adding \u2069\u2068
    return "\u2066".concat(dateStr, "\u2069");
};
exports.createDateStrForV6InputFromSections = createDateStrForV6InputFromSections;
var getSectionsBoundaries = function (adapter, localizedDigits, timezone) {
    var today = adapter.date(undefined, timezone);
    var endOfYear = adapter.endOfYear(today);
    var endOfDay = adapter.endOfDay(today);
    var _a = (0, date_utils_1.getMonthsInYear)(adapter, today).reduce(function (acc, month) {
        var daysInMonth = adapter.getDaysInMonth(month);
        if (daysInMonth > acc.maxDaysInMonth) {
            return { maxDaysInMonth: daysInMonth, longestMonth: month };
        }
        return acc;
    }, { maxDaysInMonth: 0, longestMonth: null }), maxDaysInMonth = _a.maxDaysInMonth, longestMonth = _a.longestMonth;
    return {
        year: function (_a) {
            var format = _a.format;
            return ({
                minimum: 0,
                maximum: isFourDigitYearFormat(adapter, format) ? 9999 : 99,
            });
        },
        month: function () { return ({
            minimum: 1,
            // Assumption: All years have the same amount of months
            maximum: adapter.getMonth(endOfYear) + 1,
        }); },
        day: function (_a) {
            var currentDate = _a.currentDate;
            return ({
                minimum: 1,
                maximum: adapter.isValid(currentDate) ? adapter.getDaysInMonth(currentDate) : maxDaysInMonth,
                longestMonth: longestMonth,
            });
        },
        weekDay: function (_a) {
            var format = _a.format, contentType = _a.contentType;
            if (contentType === 'digit') {
                var daysInWeek = (0, exports.getDaysInWeekStr)(adapter, format).map(Number);
                return {
                    minimum: Math.min.apply(Math, daysInWeek),
                    maximum: Math.max.apply(Math, daysInWeek),
                };
            }
            return {
                minimum: 1,
                maximum: 7,
            };
        },
        hours: function (_a) {
            var format = _a.format;
            var lastHourInDay = adapter.getHours(endOfDay);
            var hasMeridiem = (0, exports.removeLocalizedDigits)(adapter.formatByString(adapter.endOfDay(today), format), localizedDigits) !== lastHourInDay.toString();
            if (hasMeridiem) {
                return {
                    minimum: 1,
                    maximum: Number((0, exports.removeLocalizedDigits)(adapter.formatByString(adapter.startOfDay(today), format), localizedDigits)),
                };
            }
            return {
                minimum: 0,
                maximum: lastHourInDay,
            };
        },
        minutes: function () { return ({
            minimum: 0,
            // Assumption: All years have the same amount of minutes
            maximum: adapter.getMinutes(endOfDay),
        }); },
        seconds: function () { return ({
            minimum: 0,
            // Assumption: All years have the same amount of seconds
            maximum: adapter.getSeconds(endOfDay),
        }); },
        meridiem: function () { return ({
            minimum: 0,
            maximum: 1,
        }); },
        empty: function () { return ({
            minimum: 0,
            maximum: 0,
        }); },
    };
};
exports.getSectionsBoundaries = getSectionsBoundaries;
var warnedOnceInvalidSection = false;
var validateSections = function (sections, valueType) {
    if (process.env.NODE_ENV !== 'production') {
        if (!warnedOnceInvalidSection) {
            var supportedSections_1 = ['empty'];
            if (['date', 'date-time'].includes(valueType)) {
                supportedSections_1.push('weekDay', 'day', 'month', 'year');
            }
            if (['time', 'date-time'].includes(valueType)) {
                supportedSections_1.push('hours', 'minutes', 'seconds', 'meridiem');
            }
            var invalidSection = sections.find(function (section) { return !supportedSections_1.includes(section.type); });
            if (invalidSection) {
                console.warn("MUI X: The field component you are using is not compatible with the \"".concat(invalidSection.type, "\" date section."), "The supported date sections are [\"".concat(supportedSections_1.join('", "'), "\"]`."));
                warnedOnceInvalidSection = true;
            }
        }
    }
};
exports.validateSections = validateSections;
var transferDateSectionValue = function (adapter, section, dateToTransferFrom, dateToTransferTo) {
    switch (section.type) {
        case 'year': {
            return adapter.setYear(dateToTransferTo, adapter.getYear(dateToTransferFrom));
        }
        case 'month': {
            return adapter.setMonth(dateToTransferTo, adapter.getMonth(dateToTransferFrom));
        }
        case 'weekDay': {
            var dayInWeekStrOfActiveDate = adapter.formatByString(dateToTransferFrom, section.format);
            if (section.hasLeadingZerosInInput) {
                dayInWeekStrOfActiveDate = (0, exports.cleanLeadingZeros)(dayInWeekStrOfActiveDate, section.maxLength);
            }
            var formattedDaysInWeek = (0, exports.getDaysInWeekStr)(adapter, section.format);
            var dayInWeekOfActiveDate = formattedDaysInWeek.indexOf(dayInWeekStrOfActiveDate);
            var dayInWeekOfNewSectionValue = formattedDaysInWeek.indexOf(section.value);
            var diff = dayInWeekOfNewSectionValue - dayInWeekOfActiveDate;
            return adapter.addDays(dateToTransferFrom, diff);
        }
        case 'day': {
            return adapter.setDate(dateToTransferTo, adapter.getDate(dateToTransferFrom));
        }
        case 'meridiem': {
            var isAM = adapter.getHours(dateToTransferFrom) < 12;
            var mergedDateHours = adapter.getHours(dateToTransferTo);
            if (isAM && mergedDateHours >= 12) {
                return adapter.addHours(dateToTransferTo, -12);
            }
            if (!isAM && mergedDateHours < 12) {
                return adapter.addHours(dateToTransferTo, 12);
            }
            return dateToTransferTo;
        }
        case 'hours': {
            return adapter.setHours(dateToTransferTo, adapter.getHours(dateToTransferFrom));
        }
        case 'minutes': {
            return adapter.setMinutes(dateToTransferTo, adapter.getMinutes(dateToTransferFrom));
        }
        case 'seconds': {
            return adapter.setSeconds(dateToTransferTo, adapter.getSeconds(dateToTransferFrom));
        }
        default: {
            return dateToTransferTo;
        }
    }
};
var reliableSectionModificationOrder = {
    year: 1,
    month: 2,
    day: 3,
    weekDay: 4,
    hours: 5,
    minutes: 6,
    seconds: 7,
    meridiem: 8,
    empty: 9,
};
var mergeDateIntoReferenceDate = function (adapter, dateToTransferFrom, sections, referenceDate, shouldLimitToEditedSections) {
    // cloning sections before sort to avoid mutating it
    return __spreadArray([], sections, true).sort(function (a, b) { return reliableSectionModificationOrder[a.type] - reliableSectionModificationOrder[b.type]; })
        .reduce(function (mergedDate, section) {
        if (!shouldLimitToEditedSections || section.modified) {
            return transferDateSectionValue(adapter, section, dateToTransferFrom, mergedDate);
        }
        return mergedDate;
    }, referenceDate);
};
exports.mergeDateIntoReferenceDate = mergeDateIntoReferenceDate;
var isAndroid = function () { return navigator.userAgent.toLowerCase().includes('android'); };
exports.isAndroid = isAndroid;
// TODO v9: Remove
var getSectionOrder = function (sections, shouldApplyRTL) {
    var neighbors = {};
    if (!shouldApplyRTL) {
        sections.forEach(function (_, index) {
            var leftIndex = index === 0 ? null : index - 1;
            var rightIndex = index === sections.length - 1 ? null : index + 1;
            neighbors[index] = { leftIndex: leftIndex, rightIndex: rightIndex };
        });
        return { neighbors: neighbors, startIndex: 0, endIndex: sections.length - 1 };
    }
    var rtl2ltr = {};
    var ltr2rtl = {};
    var groupedSectionsStart = 0;
    var groupedSectionsEnd = 0;
    var RTLIndex = sections.length - 1;
    while (RTLIndex >= 0) {
        groupedSectionsEnd = sections.findIndex(
        // eslint-disable-next-line @typescript-eslint/no-loop-func
        function (section, index) {
            var _a;
            return index >= groupedSectionsStart &&
                ((_a = section.endSeparator) === null || _a === void 0 ? void 0 : _a.includes(' ')) &&
                // Special case where the spaces were not there in the initial input
                section.endSeparator !== ' / ';
        });
        if (groupedSectionsEnd === -1) {
            groupedSectionsEnd = sections.length - 1;
        }
        for (var i = groupedSectionsEnd; i >= groupedSectionsStart; i -= 1) {
            ltr2rtl[i] = RTLIndex;
            rtl2ltr[RTLIndex] = i;
            RTLIndex -= 1;
        }
        groupedSectionsStart = groupedSectionsEnd + 1;
    }
    sections.forEach(function (_, index) {
        var rtlIndex = ltr2rtl[index];
        var leftIndex = rtlIndex === 0 ? null : rtl2ltr[rtlIndex - 1];
        var rightIndex = rtlIndex === sections.length - 1 ? null : rtl2ltr[rtlIndex + 1];
        neighbors[index] = { leftIndex: leftIndex, rightIndex: rightIndex };
    });
    return { neighbors: neighbors, startIndex: rtl2ltr[0], endIndex: rtl2ltr[sections.length - 1] };
};
exports.getSectionOrder = getSectionOrder;
var parseSelectedSections = function (selectedSections, sections) {
    if (selectedSections == null) {
        return null;
    }
    if (selectedSections === 'all') {
        return 'all';
    }
    if (typeof selectedSections === 'string') {
        var index = sections.findIndex(function (section) { return section.type === selectedSections; });
        return index === -1 ? null : index;
    }
    return selectedSections;
};
exports.parseSelectedSections = parseSelectedSections;
