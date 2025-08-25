"use strict";
'use client';
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
exports.useFieldState = void 0;
var React = require("react");
var useControlled_1 = require("@mui/utils/useControlled");
var useTimeout_1 = require("@mui/utils/useTimeout");
var useEventCallback_1 = require("@mui/utils/useEventCallback");
var RtlProvider_1 = require("@mui/system/RtlProvider");
var hooks_1 = require("../../../hooks");
var useField_utils_1 = require("./useField.utils");
var buildSectionsFromFormat_1 = require("./buildSectionsFromFormat");
var validation_1 = require("../../../validation");
var useControlledValue_1 = require("../useControlledValue");
var getDefaultReferenceDate_1 = require("../../utils/getDefaultReferenceDate");
var QUERY_LIFE_DURATION_MS = 5000;
var useFieldState = function (parameters) {
    var _a;
    var adapter = (0, hooks_1.usePickerAdapter)();
    var translations = (0, hooks_1.usePickerTranslations)();
    var isRtl = (0, RtlProvider_1.useRtl)();
    var _b = parameters.manager, validator = _b.validator, valueType = _b.valueType, valueManager = _b.internal_valueManager, fieldValueManager = _b.internal_fieldValueManager, internalPropsWithDefaults = parameters.internalPropsWithDefaults, _c = parameters.internalPropsWithDefaults, valueProp = _c.value, defaultValue = _c.defaultValue, referenceDateProp = _c.referenceDate, onChange = _c.onChange, format = _c.format, _d = _c.formatDensity, formatDensity = _d === void 0 ? 'dense' : _d, selectedSectionsProp = _c.selectedSections, onSelectedSectionsChange = _c.onSelectedSectionsChange, _e = _c.shouldRespectLeadingZeros, shouldRespectLeadingZeros = _e === void 0 ? false : _e, timezoneProp = _c.timezone, _f = _c.enableAccessibleFieldDOMStructure, enableAccessibleFieldDOMStructure = _f === void 0 ? true : _f, errorProp = parameters.forwardedProps.error;
    var _g = (0, useControlledValue_1.useControlledValue)({
        name: 'a field component',
        timezone: timezoneProp,
        value: valueProp,
        defaultValue: defaultValue,
        referenceDate: referenceDateProp,
        onChange: onChange,
        valueManager: valueManager,
    }), value = _g.value, handleValueChange = _g.handleValueChange, timezone = _g.timezone;
    var valueRef = React.useRef(value);
    React.useEffect(function () {
        valueRef.current = value;
    }, [value]);
    var hasValidationError = (0, validation_1.useValidation)({
        props: internalPropsWithDefaults,
        validator: validator,
        timezone: timezone,
        value: value,
        onError: internalPropsWithDefaults.onError,
    }).hasValidationError;
    var error = React.useMemo(function () {
        // only override when `error` is undefined.
        // in case of multi input fields, the `error` value is provided externally and will always be defined.
        if (errorProp !== undefined) {
            return errorProp;
        }
        return hasValidationError;
    }, [hasValidationError, errorProp]);
    var localizedDigits = React.useMemo(function () { return (0, useField_utils_1.getLocalizedDigits)(adapter); }, [adapter]);
    var sectionsValueBoundaries = React.useMemo(function () { return (0, useField_utils_1.getSectionsBoundaries)(adapter, localizedDigits, timezone); }, [adapter, localizedDigits, timezone]);
    var getSectionsFromValue = React.useCallback(function (valueToAnalyze) {
        return fieldValueManager.getSectionsFromValue(valueToAnalyze, function (date) {
            return (0, buildSectionsFromFormat_1.buildSectionsFromFormat)({
                adapter: adapter,
                localeText: translations,
                localizedDigits: localizedDigits,
                format: format,
                date: date,
                formatDensity: formatDensity,
                shouldRespectLeadingZeros: shouldRespectLeadingZeros,
                enableAccessibleFieldDOMStructure: enableAccessibleFieldDOMStructure,
                isRtl: isRtl,
            });
        });
    }, [
        fieldValueManager,
        format,
        translations,
        localizedDigits,
        isRtl,
        shouldRespectLeadingZeros,
        adapter,
        formatDensity,
        enableAccessibleFieldDOMStructure,
    ]);
    var _h = React.useState(function () {
        var sections = getSectionsFromValue(value);
        (0, useField_utils_1.validateSections)(sections, valueType);
        var stateWithoutReferenceDate = {
            sections: sections,
            lastExternalValue: value,
            lastSectionsDependencies: { format: format, isRtl: isRtl, locale: adapter.locale },
            tempValueStrAndroid: null,
            characterQuery: null,
        };
        var granularity = (0, getDefaultReferenceDate_1.getSectionTypeGranularity)(sections);
        var referenceValue = valueManager.getInitialReferenceValue({
            referenceDate: referenceDateProp,
            value: value,
            adapter: adapter,
            props: internalPropsWithDefaults,
            granularity: granularity,
            timezone: timezone,
        });
        return __assign(__assign({}, stateWithoutReferenceDate), { referenceValue: referenceValue });
    }), state = _h[0], setState = _h[1];
    var _j = (0, useControlled_1.default)({
        controlled: selectedSectionsProp,
        default: null,
        name: 'useField',
        state: 'selectedSections',
    }), selectedSections = _j[0], innerSetSelectedSections = _j[1];
    var setSelectedSections = function (newSelectedSections) {
        innerSetSelectedSections(newSelectedSections);
        onSelectedSectionsChange === null || onSelectedSectionsChange === void 0 ? void 0 : onSelectedSectionsChange(newSelectedSections);
    };
    var parsedSelectedSections = React.useMemo(function () { return (0, useField_utils_1.parseSelectedSections)(selectedSections, state.sections); }, [selectedSections, state.sections]);
    var activeSectionIndex = parsedSelectedSections === 'all' ? 0 : parsedSelectedSections;
    var sectionOrder = React.useMemo(function () { return (0, useField_utils_1.getSectionOrder)(state.sections, isRtl && !enableAccessibleFieldDOMStructure); }, [state.sections, isRtl, enableAccessibleFieldDOMStructure]);
    var areAllSectionsEmpty = React.useMemo(function () { return state.sections.every(function (section) { return section.value === ''; }); }, [state.sections]);
    var publishValue = function (newValue) {
        var context = {
            validationError: validator({
                adapter: adapter,
                value: newValue,
                timezone: timezone,
                props: internalPropsWithDefaults,
            }),
        };
        handleValueChange(newValue, context);
    };
    var setSectionValue = function (sectionIndex, newSectionValue) {
        var newSections = __spreadArray([], state.sections, true);
        newSections[sectionIndex] = __assign(__assign({}, newSections[sectionIndex]), { value: newSectionValue, modified: true });
        return newSections;
    };
    var sectionToUpdateOnNextInvalidDateRef = React.useRef(null);
    var updateSectionValueOnNextInvalidDateTimeout = (0, useTimeout_1.default)();
    var setSectionUpdateToApplyOnNextInvalidDate = function (newSectionValue) {
        if (activeSectionIndex == null) {
            return;
        }
        sectionToUpdateOnNextInvalidDateRef.current = {
            sectionIndex: activeSectionIndex,
            value: newSectionValue,
        };
        updateSectionValueOnNextInvalidDateTimeout.start(0, function () {
            sectionToUpdateOnNextInvalidDateRef.current = null;
        });
    };
    var clearValue = function () {
        if (valueManager.areValuesEqual(adapter, value, valueManager.emptyValue)) {
            setState(function (prevState) { return (__assign(__assign({}, prevState), { sections: prevState.sections.map(function (section) { return (__assign(__assign({}, section), { value: '' })); }), tempValueStrAndroid: null, characterQuery: null })); });
        }
        else {
            setState(function (prevState) { return (__assign(__assign({}, prevState), { characterQuery: null })); });
            publishValue(valueManager.emptyValue);
        }
    };
    var clearActiveSection = function () {
        if (activeSectionIndex == null) {
            return;
        }
        var activeSection = state.sections[activeSectionIndex];
        if (activeSection.value === '') {
            return;
        }
        setSectionUpdateToApplyOnNextInvalidDate('');
        if (fieldValueManager.getDateFromSection(value, activeSection) === null) {
            setState(function (prevState) { return (__assign(__assign({}, prevState), { sections: setSectionValue(activeSectionIndex, ''), tempValueStrAndroid: null, characterQuery: null })); });
        }
        else {
            setState(function (prevState) { return (__assign(__assign({}, prevState), { characterQuery: null })); });
            publishValue(fieldValueManager.updateDateInValue(value, activeSection, null));
        }
    };
    var updateValueFromValueStr = function (valueStr) {
        var parseDateStr = function (dateStr, referenceDate) {
            var date = adapter.parse(dateStr, format);
            if (!adapter.isValid(date)) {
                return null;
            }
            var sections = (0, buildSectionsFromFormat_1.buildSectionsFromFormat)({
                adapter: adapter,
                localeText: translations,
                localizedDigits: localizedDigits,
                format: format,
                date: date,
                formatDensity: formatDensity,
                shouldRespectLeadingZeros: shouldRespectLeadingZeros,
                enableAccessibleFieldDOMStructure: enableAccessibleFieldDOMStructure,
                isRtl: isRtl,
            });
            return (0, useField_utils_1.mergeDateIntoReferenceDate)(adapter, date, sections, referenceDate, false);
        };
        var newValue = fieldValueManager.parseValueStr(valueStr, state.referenceValue, parseDateStr);
        publishValue(newValue);
    };
    var cleanActiveDateSectionsIfValueNullTimeout = (0, useTimeout_1.default)();
    var updateSectionValue = function (_a) {
        var section = _a.section, newSectionValue = _a.newSectionValue, shouldGoToNextSection = _a.shouldGoToNextSection;
        updateSectionValueOnNextInvalidDateTimeout.clear();
        cleanActiveDateSectionsIfValueNullTimeout.clear();
        var activeDate = fieldValueManager.getDateFromSection(value, section);
        /**
         * Decide which section should be focused
         */
        if (shouldGoToNextSection && activeSectionIndex < state.sections.length - 1) {
            setSelectedSections(activeSectionIndex + 1);
        }
        /**
         * Try to build a valid date from the new section value
         */
        var newSections = setSectionValue(activeSectionIndex, newSectionValue);
        var newActiveDateSections = fieldValueManager.getDateSectionsFromValue(newSections, section);
        var newActiveDate = (0, useField_utils_1.getDateFromDateSections)(adapter, newActiveDateSections, localizedDigits);
        /**
         * If the new date is valid,
         * Then we merge the value of the modified sections into the reference date.
         * This makes sure that we don't lose some information of the initial date (like the time on a date field).
         */
        if (adapter.isValid(newActiveDate)) {
            var mergedDate = (0, useField_utils_1.mergeDateIntoReferenceDate)(adapter, newActiveDate, newActiveDateSections, fieldValueManager.getDateFromSection(state.referenceValue, section), true);
            if (activeDate == null) {
                cleanActiveDateSectionsIfValueNullTimeout.start(0, function () {
                    if (valueRef.current === value) {
                        setState(function (prevState) { return (__assign(__assign({}, prevState), { sections: fieldValueManager.clearDateSections(state.sections, section), tempValueStrAndroid: null })); });
                    }
                });
            }
            return publishValue(fieldValueManager.updateDateInValue(value, section, mergedDate));
        }
        /**
         * If all the sections are filled but the date is invalid and the previous date is valid or null,
         * Then we publish an invalid date.
         */
        if (newActiveDateSections.every(function (sectionBis) { return sectionBis.value !== ''; }) &&
            (activeDate == null || adapter.isValid(activeDate))) {
            setSectionUpdateToApplyOnNextInvalidDate(newSectionValue);
            return publishValue(fieldValueManager.updateDateInValue(value, section, newActiveDate));
        }
        /**
         * If the previous date is not null,
         * Then we publish the date as `null`.
         */
        if (activeDate != null) {
            setSectionUpdateToApplyOnNextInvalidDate(newSectionValue);
            return publishValue(fieldValueManager.updateDateInValue(value, section, null));
        }
        /**
         * If the previous date is already null,
         * Then we don't publish the date and we update the sections.
         */
        return setState(function (prevState) { return (__assign(__assign({}, prevState), { sections: newSections, tempValueStrAndroid: null })); });
    };
    var setTempAndroidValueStr = function (tempValueStrAndroid) {
        return setState(function (prevState) { return (__assign(__assign({}, prevState), { tempValueStrAndroid: tempValueStrAndroid })); });
    };
    var setCharacterQuery = (0, useEventCallback_1.default)(function (newCharacterQuery) {
        setState(function (prevState) { return (__assign(__assign({}, prevState), { characterQuery: newCharacterQuery })); });
    });
    // If `prop.value` changes, we update the state to reflect the new value
    if (value !== state.lastExternalValue) {
        var sections_1;
        if (sectionToUpdateOnNextInvalidDateRef.current != null &&
            !adapter.isValid(fieldValueManager.getDateFromSection(value, state.sections[sectionToUpdateOnNextInvalidDateRef.current.sectionIndex]))) {
            sections_1 = setSectionValue(sectionToUpdateOnNextInvalidDateRef.current.sectionIndex, sectionToUpdateOnNextInvalidDateRef.current.value);
        }
        else {
            sections_1 = getSectionsFromValue(value);
        }
        setState(function (prevState) { return (__assign(__assign({}, prevState), { lastExternalValue: value, sections: sections_1, sectionsDependencies: { format: format, isRtl: isRtl, locale: adapter.locale }, referenceValue: fieldValueManager.updateReferenceValue(adapter, value, prevState.referenceValue), tempValueStrAndroid: null })); });
    }
    if (isRtl !== state.lastSectionsDependencies.isRtl ||
        format !== state.lastSectionsDependencies.format ||
        adapter.locale !== state.lastSectionsDependencies.locale) {
        var sections_2 = getSectionsFromValue(value);
        (0, useField_utils_1.validateSections)(sections_2, valueType);
        setState(function (prevState) { return (__assign(__assign({}, prevState), { lastSectionsDependencies: { format: format, isRtl: isRtl, locale: adapter.locale }, sections: sections_2, tempValueStrAndroid: null, characterQuery: null })); });
    }
    if (state.characterQuery != null && !error && activeSectionIndex == null) {
        setCharacterQuery(null);
    }
    if (state.characterQuery != null &&
        ((_a = state.sections[state.characterQuery.sectionIndex]) === null || _a === void 0 ? void 0 : _a.type) !== state.characterQuery.sectionType) {
        setCharacterQuery(null);
    }
    React.useEffect(function () {
        if (sectionToUpdateOnNextInvalidDateRef.current != null) {
            sectionToUpdateOnNextInvalidDateRef.current = null;
        }
    });
    var cleanCharacterQueryTimeout = (0, useTimeout_1.default)();
    React.useEffect(function () {
        if (state.characterQuery != null) {
            cleanCharacterQueryTimeout.start(QUERY_LIFE_DURATION_MS, function () { return setCharacterQuery(null); });
        }
        return function () { };
    }, [state.characterQuery, setCharacterQuery, cleanCharacterQueryTimeout]);
    // If `tempValueStrAndroid` is still defined for some section when running `useEffect`,
    // Then `onChange` has only been called once, which means the user pressed `Backspace` to reset the section.
    // This causes a small flickering on Android,
    // But we can't use `useEnhancedEffect` which is always called before the second `onChange` call and then would cause false positives.
    React.useEffect(function () {
        if (state.tempValueStrAndroid != null && activeSectionIndex != null) {
            clearActiveSection();
        }
    }, [state.sections]); // eslint-disable-line react-hooks/exhaustive-deps
    return {
        // States and derived states
        activeSectionIndex: activeSectionIndex,
        areAllSectionsEmpty: areAllSectionsEmpty,
        error: error,
        localizedDigits: localizedDigits,
        parsedSelectedSections: parsedSelectedSections,
        sectionOrder: sectionOrder,
        sectionsValueBoundaries: sectionsValueBoundaries,
        state: state,
        timezone: timezone,
        value: value,
        // Methods to update the states
        clearValue: clearValue,
        clearActiveSection: clearActiveSection,
        setCharacterQuery: setCharacterQuery,
        setSelectedSections: setSelectedSections,
        setTempAndroidValueStr: setTempAndroidValueStr,
        updateSectionValue: updateSectionValue,
        updateValueFromValueStr: updateValueFromValueStr,
        // Utilities methods
        getSectionsFromValue: getSectionsFromValue,
    };
};
exports.useFieldState = useFieldState;
