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
exports.useFieldCharacterEditing = void 0;
var useEventCallback_1 = require("@mui/utils/useEventCallback");
var useField_utils_1 = require("./useField.utils");
var usePickerAdapter_1 = require("../../../hooks/usePickerAdapter");
var isQueryResponseWithoutValue = function (response) { return response.saveQuery != null; };
/**
 * Update the active section value when the user pressed a key that is not a navigation key (arrow key for example).
 * This hook has two main editing behaviors
 *
 * 1. The numeric editing when the user presses a digit
 * 2. The letter editing when the user presses another key
 */
var useFieldCharacterEditing = function (_a) {
    var _b = _a.stateResponse, 
    // States and derived states
    localizedDigits = _b.localizedDigits, sectionsValueBoundaries = _b.sectionsValueBoundaries, state = _b.state, timezone = _b.timezone, 
    // Methods to update the states
    setCharacterQuery = _b.setCharacterQuery, setTempAndroidValueStr = _b.setTempAndroidValueStr, updateSectionValue = _b.updateSectionValue;
    var adapter = (0, usePickerAdapter_1.usePickerAdapter)();
    var applyQuery = function (_a, getFirstSectionValueMatchingWithQuery, isValidQueryValue) {
        var keyPressed = _a.keyPressed, sectionIndex = _a.sectionIndex;
        var cleanKeyPressed = keyPressed.toLowerCase();
        var activeSection = state.sections[sectionIndex];
        // The current query targets the section being editing
        // We can try to concatenate the value
        if (state.characterQuery != null &&
            (!isValidQueryValue || isValidQueryValue(state.characterQuery.value)) &&
            state.characterQuery.sectionIndex === sectionIndex) {
            var concatenatedQueryValue = "".concat(state.characterQuery.value).concat(cleanKeyPressed);
            var queryResponse_1 = getFirstSectionValueMatchingWithQuery(concatenatedQueryValue, activeSection);
            if (!isQueryResponseWithoutValue(queryResponse_1)) {
                setCharacterQuery({
                    sectionIndex: sectionIndex,
                    value: concatenatedQueryValue,
                    sectionType: activeSection.type,
                });
                return queryResponse_1;
            }
        }
        var queryResponse = getFirstSectionValueMatchingWithQuery(cleanKeyPressed, activeSection);
        if (isQueryResponseWithoutValue(queryResponse) && !queryResponse.saveQuery) {
            setCharacterQuery(null);
            return null;
        }
        setCharacterQuery({
            sectionIndex: sectionIndex,
            value: cleanKeyPressed,
            sectionType: activeSection.type,
        });
        if (isQueryResponseWithoutValue(queryResponse)) {
            return null;
        }
        return queryResponse;
    };
    var applyLetterEditing = function (params) {
        var findMatchingOptions = function (format, options, queryValue) {
            var matchingValues = options.filter(function (option) {
                return option.toLowerCase().startsWith(queryValue);
            });
            if (matchingValues.length === 0) {
                return { saveQuery: false };
            }
            return {
                sectionValue: matchingValues[0],
                shouldGoToNextSection: matchingValues.length === 1,
            };
        };
        var testQueryOnFormatAndFallbackFormat = function (queryValue, activeSection, fallbackFormat, formatFallbackValue) {
            var getOptions = function (format) {
                return (0, useField_utils_1.getLetterEditingOptions)(adapter, timezone, activeSection.type, format);
            };
            if (activeSection.contentType === 'letter') {
                return findMatchingOptions(activeSection.format, getOptions(activeSection.format), queryValue);
            }
            // When editing a digit-format month / weekDay and the user presses a letter,
            // We can support the letter editing by using the letter-format month / weekDay and re-formatting the result.
            // We just have to make sure that the default month / weekDay format is a letter format,
            if (fallbackFormat &&
                formatFallbackValue != null &&
                (0, useField_utils_1.getDateSectionConfigFromFormatToken)(adapter, fallbackFormat).contentType === 'letter') {
                var fallbackOptions = getOptions(fallbackFormat);
                var response = findMatchingOptions(fallbackFormat, fallbackOptions, queryValue);
                if (isQueryResponseWithoutValue(response)) {
                    return { saveQuery: false };
                }
                return __assign(__assign({}, response), { sectionValue: formatFallbackValue(response.sectionValue, fallbackOptions) });
            }
            return { saveQuery: false };
        };
        var getFirstSectionValueMatchingWithQuery = function (queryValue, activeSection) {
            switch (activeSection.type) {
                case 'month': {
                    var formatFallbackValue = function (fallbackValue) {
                        return (0, useField_utils_1.changeSectionValueFormat)(adapter, fallbackValue, adapter.formats.month, activeSection.format);
                    };
                    return testQueryOnFormatAndFallbackFormat(queryValue, activeSection, adapter.formats.month, formatFallbackValue);
                }
                case 'weekDay': {
                    var formatFallbackValue = function (fallbackValue, fallbackOptions) {
                        return fallbackOptions.indexOf(fallbackValue).toString();
                    };
                    return testQueryOnFormatAndFallbackFormat(queryValue, activeSection, adapter.formats.weekday, formatFallbackValue);
                }
                case 'meridiem': {
                    return testQueryOnFormatAndFallbackFormat(queryValue, activeSection);
                }
                default: {
                    return { saveQuery: false };
                }
            }
        };
        return applyQuery(params, getFirstSectionValueMatchingWithQuery);
    };
    var applyNumericEditing = function (params) {
        var getNewSectionValue = function (_a) {
            var queryValue = _a.queryValue, skipIfBelowMinimum = _a.skipIfBelowMinimum, section = _a.section;
            var cleanQueryValue = (0, useField_utils_1.removeLocalizedDigits)(queryValue, localizedDigits);
            var queryValueNumber = Number(cleanQueryValue);
            var sectionBoundaries = sectionsValueBoundaries[section.type]({
                currentDate: null,
                format: section.format,
                contentType: section.contentType,
            });
            if (queryValueNumber > sectionBoundaries.maximum) {
                return { saveQuery: false };
            }
            // If the user types `0` on a month section,
            // It is below the minimum, but we want to store the `0` in the query,
            // So that when he pressed `1`, it will store `01` and move to the next section.
            if (skipIfBelowMinimum && queryValueNumber < sectionBoundaries.minimum) {
                return { saveQuery: true };
            }
            var shouldGoToNextSection = queryValueNumber * 10 > sectionBoundaries.maximum ||
                cleanQueryValue.length === sectionBoundaries.maximum.toString().length;
            var newSectionValue = (0, useField_utils_1.cleanDigitSectionValue)(adapter, queryValueNumber, sectionBoundaries, localizedDigits, section);
            return { sectionValue: newSectionValue, shouldGoToNextSection: shouldGoToNextSection };
        };
        var getFirstSectionValueMatchingWithQuery = function (queryValue, activeSection) {
            if (activeSection.contentType === 'digit' ||
                activeSection.contentType === 'digit-with-letter') {
                return getNewSectionValue({
                    queryValue: queryValue,
                    skipIfBelowMinimum: false,
                    section: activeSection,
                });
            }
            // When editing a letter-format month and the user presses a digit,
            // We can support the numeric editing by using the digit-format month and re-formatting the result.
            if (activeSection.type === 'month') {
                var hasLeadingZerosInFormat = (0, useField_utils_1.doesSectionFormatHaveLeadingZeros)(adapter, 'digit', 'month', 'MM');
                var response = getNewSectionValue({
                    queryValue: queryValue,
                    skipIfBelowMinimum: true,
                    section: {
                        type: activeSection.type,
                        format: 'MM',
                        hasLeadingZerosInFormat: hasLeadingZerosInFormat,
                        hasLeadingZerosInInput: true,
                        contentType: 'digit',
                        maxLength: 2,
                    },
                });
                if (isQueryResponseWithoutValue(response)) {
                    return response;
                }
                var formattedValue = (0, useField_utils_1.changeSectionValueFormat)(adapter, response.sectionValue, 'MM', activeSection.format);
                return __assign(__assign({}, response), { sectionValue: formattedValue });
            }
            // When editing a letter-format weekDay and the user presses a digit,
            // We can support the numeric editing by returning the nth day in the week day array.
            if (activeSection.type === 'weekDay') {
                var response = getNewSectionValue({
                    queryValue: queryValue,
                    skipIfBelowMinimum: true,
                    section: activeSection,
                });
                if (isQueryResponseWithoutValue(response)) {
                    return response;
                }
                var formattedValue = (0, useField_utils_1.getDaysInWeekStr)(adapter, activeSection.format)[Number(response.sectionValue) - 1];
                return __assign(__assign({}, response), { sectionValue: formattedValue });
            }
            return { saveQuery: false };
        };
        return applyQuery(params, getFirstSectionValueMatchingWithQuery, function (queryValue) {
            return (0, useField_utils_1.isStringNumber)(queryValue, localizedDigits);
        });
    };
    return (0, useEventCallback_1.default)(function (params) {
        var section = state.sections[params.sectionIndex];
        var isNumericEditing = (0, useField_utils_1.isStringNumber)(params.keyPressed, localizedDigits);
        var response = isNumericEditing
            ? applyNumericEditing(__assign(__assign({}, params), { keyPressed: (0, useField_utils_1.applyLocalizedDigits)(params.keyPressed, localizedDigits) }))
            : applyLetterEditing(params);
        if (response == null) {
            setTempAndroidValueStr(null);
            return;
        }
        updateSectionValue({
            section: section,
            newSectionValue: response.sectionValue,
            shouldGoToNextSection: response.shouldGoToNextSection,
        });
    });
};
exports.useFieldCharacterEditing = useFieldCharacterEditing;
