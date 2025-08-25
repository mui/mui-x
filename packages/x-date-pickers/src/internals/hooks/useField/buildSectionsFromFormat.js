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
exports.buildSectionsFromFormat = void 0;
var useField_utils_1 = require("./useField.utils");
var expandFormat = function (_a) {
    var adapter = _a.adapter, format = _a.format;
    // Expand the provided format
    var formatExpansionOverflow = 10;
    var prevFormat = format;
    var nextFormat = adapter.expandFormat(format);
    while (nextFormat !== prevFormat) {
        prevFormat = nextFormat;
        nextFormat = adapter.expandFormat(prevFormat);
        formatExpansionOverflow -= 1;
        if (formatExpansionOverflow < 0) {
            throw new Error('MUI X: The format expansion seems to be in an infinite loop. Please open an issue with the format passed to the component.');
        }
    }
    return nextFormat;
};
var getEscapedPartsFromFormat = function (_a) {
    var adapter = _a.adapter, expandedFormat = _a.expandedFormat;
    var escapedParts = [];
    var _b = adapter.escapedCharacters, startChar = _b.start, endChar = _b.end;
    var regExp = new RegExp("(\\".concat(startChar, "[^\\").concat(endChar, "]*\\").concat(endChar, ")+"), 'g');
    var match = null;
    // eslint-disable-next-line no-cond-assign
    while ((match = regExp.exec(expandedFormat))) {
        escapedParts.push({ start: match.index, end: regExp.lastIndex - 1 });
    }
    return escapedParts;
};
var getSectionPlaceholder = function (adapter, localeText, sectionConfig, sectionFormat) {
    switch (sectionConfig.type) {
        case 'year': {
            return localeText.fieldYearPlaceholder({
                digitAmount: adapter.formatByString(adapter.date(undefined, 'default'), sectionFormat)
                    .length,
                format: sectionFormat,
            });
        }
        case 'month': {
            return localeText.fieldMonthPlaceholder({
                contentType: sectionConfig.contentType,
                format: sectionFormat,
            });
        }
        case 'day': {
            return localeText.fieldDayPlaceholder({ format: sectionFormat });
        }
        case 'weekDay': {
            return localeText.fieldWeekDayPlaceholder({
                contentType: sectionConfig.contentType,
                format: sectionFormat,
            });
        }
        case 'hours': {
            return localeText.fieldHoursPlaceholder({ format: sectionFormat });
        }
        case 'minutes': {
            return localeText.fieldMinutesPlaceholder({ format: sectionFormat });
        }
        case 'seconds': {
            return localeText.fieldSecondsPlaceholder({ format: sectionFormat });
        }
        case 'meridiem': {
            return localeText.fieldMeridiemPlaceholder({ format: sectionFormat });
        }
        default: {
            return sectionFormat;
        }
    }
};
var createSection = function (_a) {
    var adapter = _a.adapter, date = _a.date, shouldRespectLeadingZeros = _a.shouldRespectLeadingZeros, localeText = _a.localeText, localizedDigits = _a.localizedDigits, now = _a.now, token = _a.token, startSeparator = _a.startSeparator;
    if (token === '') {
        throw new Error('MUI X: Should not call `commitToken` with an empty token');
    }
    var sectionConfig = (0, useField_utils_1.getDateSectionConfigFromFormatToken)(adapter, token);
    var hasLeadingZerosInFormat = (0, useField_utils_1.doesSectionFormatHaveLeadingZeros)(adapter, sectionConfig.contentType, sectionConfig.type, token);
    var hasLeadingZerosInInput = shouldRespectLeadingZeros
        ? hasLeadingZerosInFormat
        : sectionConfig.contentType === 'digit';
    var isValidDate = adapter.isValid(date);
    var sectionValue = isValidDate ? adapter.formatByString(date, token) : '';
    var maxLength = null;
    if (hasLeadingZerosInInput) {
        if (hasLeadingZerosInFormat) {
            maxLength =
                sectionValue === '' ? adapter.formatByString(now, token).length : sectionValue.length;
        }
        else {
            if (sectionConfig.maxLength == null) {
                throw new Error("MUI X: The token ".concat(token, " should have a 'maxLength' property on it's adapter"));
            }
            maxLength = sectionConfig.maxLength;
            if (isValidDate) {
                sectionValue = (0, useField_utils_1.applyLocalizedDigits)((0, useField_utils_1.cleanLeadingZeros)((0, useField_utils_1.removeLocalizedDigits)(sectionValue, localizedDigits), maxLength), localizedDigits);
            }
        }
    }
    return __assign(__assign({}, sectionConfig), { format: token, maxLength: maxLength, value: sectionValue, placeholder: getSectionPlaceholder(adapter, localeText, sectionConfig, token), hasLeadingZerosInFormat: hasLeadingZerosInFormat, hasLeadingZerosInInput: hasLeadingZerosInInput, startSeparator: startSeparator, endSeparator: '', modified: false });
};
var buildSections = function (parameters) {
    var _a;
    var adapter = parameters.adapter, expandedFormat = parameters.expandedFormat, escapedParts = parameters.escapedParts;
    var now = adapter.date(undefined);
    var sections = [];
    var startSeparator = '';
    // This RegExp tests if the beginning of a string corresponds to a supported token
    var validTokens = Object.keys(adapter.formatTokenMap).sort(function (a, b) { return b.length - a.length; }); // Sort to put longest word first
    var regExpFirstWordInFormat = /^([a-zA-Z]+)/;
    var regExpWordOnlyComposedOfTokens = new RegExp("^(".concat(validTokens.join('|'), ")*$"));
    var regExpFirstTokenInWord = new RegExp("^(".concat(validTokens.join('|'), ")"));
    var getEscapedPartOfCurrentChar = function (i) {
        return escapedParts.find(function (escapeIndex) { return escapeIndex.start <= i && escapeIndex.end >= i; });
    };
    var i = 0;
    while (i < expandedFormat.length) {
        var escapedPartOfCurrentChar = getEscapedPartOfCurrentChar(i);
        var isEscapedChar = escapedPartOfCurrentChar != null;
        var firstWordInFormat = (_a = regExpFirstWordInFormat.exec(expandedFormat.slice(i))) === null || _a === void 0 ? void 0 : _a[1];
        // The first word in the format is only composed of tokens.
        // We extract those tokens to create a new sections.
        if (!isEscapedChar &&
            firstWordInFormat != null &&
            regExpWordOnlyComposedOfTokens.test(firstWordInFormat)) {
            var word = firstWordInFormat;
            while (word.length > 0) {
                var firstWord = regExpFirstTokenInWord.exec(word)[1];
                word = word.slice(firstWord.length);
                sections.push(createSection(__assign(__assign({}, parameters), { now: now, token: firstWord, startSeparator: startSeparator })));
                startSeparator = '';
            }
            i += firstWordInFormat.length;
        }
        // The remaining format does not start with a token,
        // We take the first character and add it to the current section's end separator.
        else {
            var char = expandedFormat[i];
            // If we are on the opening or closing character of an escaped part of the format,
            // Then we ignore this character.
            var isEscapeBoundary = (isEscapedChar && (escapedPartOfCurrentChar === null || escapedPartOfCurrentChar === void 0 ? void 0 : escapedPartOfCurrentChar.start) === i) ||
                (escapedPartOfCurrentChar === null || escapedPartOfCurrentChar === void 0 ? void 0 : escapedPartOfCurrentChar.end) === i;
            if (!isEscapeBoundary) {
                if (sections.length === 0) {
                    startSeparator += char;
                }
                else {
                    sections[sections.length - 1].endSeparator += char;
                    sections[sections.length - 1].isEndFormatSeparator = true;
                }
            }
            i += 1;
        }
    }
    if (sections.length === 0 && startSeparator.length > 0) {
        sections.push({
            type: 'empty',
            contentType: 'letter',
            maxLength: null,
            format: '',
            value: '',
            placeholder: '',
            hasLeadingZerosInFormat: false,
            hasLeadingZerosInInput: false,
            startSeparator: startSeparator,
            endSeparator: '',
            modified: false,
        });
    }
    return sections;
};
var postProcessSections = function (_a) {
    var isRtl = _a.isRtl, formatDensity = _a.formatDensity, sections = _a.sections;
    return sections.map(function (section) {
        var cleanSeparator = function (separator) {
            var cleanedSeparator = separator;
            if (isRtl && cleanedSeparator !== null && cleanedSeparator.includes(' ')) {
                cleanedSeparator = "\u2069".concat(cleanedSeparator, "\u2066");
            }
            if (formatDensity === 'spacious' && ['/', '.', '-'].includes(cleanedSeparator)) {
                cleanedSeparator = " ".concat(cleanedSeparator, " ");
            }
            return cleanedSeparator;
        };
        section.startSeparator = cleanSeparator(section.startSeparator);
        section.endSeparator = cleanSeparator(section.endSeparator);
        return section;
    });
};
var buildSectionsFromFormat = function (parameters) {
    var expandedFormat = expandFormat(parameters);
    if (parameters.isRtl && parameters.enableAccessibleFieldDOMStructure) {
        expandedFormat = expandedFormat.split(' ').reverse().join(' ');
    }
    var escapedParts = getEscapedPartsFromFormat(__assign(__assign({}, parameters), { expandedFormat: expandedFormat }));
    var sections = buildSections(__assign(__assign({}, parameters), { expandedFormat: expandedFormat, escapedParts: escapedParts }));
    return postProcessSections(__assign(__assign({}, parameters), { sections: sections }));
};
exports.buildSectionsFromFormat = buildSectionsFromFormat;
