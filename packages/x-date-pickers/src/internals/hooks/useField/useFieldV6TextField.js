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
exports.useFieldV6TextField = exports.addPositionPropertiesToSections = void 0;
var React = require("react");
var RtlProvider_1 = require("@mui/system/RtlProvider");
var useEnhancedEffect_1 = require("@mui/utils/useEnhancedEffect");
var useEventCallback_1 = require("@mui/utils/useEventCallback");
var useTimeout_1 = require("@mui/utils/useTimeout");
var useForkRef_1 = require("@mui/utils/useForkRef");
var hooks_1 = require("../../../hooks");
var utils_1 = require("../../utils/utils");
var useField_utils_1 = require("./useField.utils");
var useFieldCharacterEditing_1 = require("./useFieldCharacterEditing");
var useFieldRootHandleKeyDown_1 = require("./useFieldRootHandleKeyDown");
var useFieldState_1 = require("./useFieldState");
var useFieldInternalPropsWithDefaults_1 = require("./useFieldInternalPropsWithDefaults");
var cleanString = function (dirtyString) { return dirtyString.replace(/[\u2066\u2067\u2068\u2069]/g, ''); };
var addPositionPropertiesToSections = function (sections, localizedDigits, isRtl) {
    var position = 0;
    var positionInInput = isRtl ? 1 : 0;
    var newSections = [];
    for (var i = 0; i < sections.length; i += 1) {
        var section = sections[i];
        var renderedValue = (0, useField_utils_1.getSectionVisibleValue)(section, isRtl ? 'input-rtl' : 'input-ltr', localizedDigits);
        var sectionStr = "".concat(section.startSeparator).concat(renderedValue).concat(section.endSeparator);
        var sectionLength = cleanString(sectionStr).length;
        var sectionLengthInInput = sectionStr.length;
        // The ...InInput values consider the unicode characters but do include them in their indexes
        var cleanedValue = cleanString(renderedValue);
        var startInInput = positionInInput +
            (cleanedValue === '' ? 0 : renderedValue.indexOf(cleanedValue[0])) +
            section.startSeparator.length;
        var endInInput = startInInput + cleanedValue.length;
        newSections.push(__assign(__assign({}, section), { start: position, end: position + sectionLength, startInInput: startInInput, endInInput: endInInput }));
        position += sectionLength;
        // Move position to the end of string associated to the current section
        positionInInput += sectionLengthInInput;
    }
    return newSections;
};
exports.addPositionPropertiesToSections = addPositionPropertiesToSections;
var useFieldV6TextField = function (parameters) {
    var isRtl = (0, RtlProvider_1.useRtl)();
    var focusTimeout = (0, useTimeout_1.default)();
    var selectionSyncTimeout = (0, useTimeout_1.default)();
    var props = parameters.props, manager = parameters.manager, skipContextFieldRefAssignment = parameters.skipContextFieldRefAssignment, _a = parameters.manager, valueType = _a.valueType, valueManager = _a.internal_valueManager, fieldValueManager = _a.internal_fieldValueManager, useOpenPickerButtonAriaLabel = _a.internal_useOpenPickerButtonAriaLabel;
    var _b = (0, hooks_1.useSplitFieldProps)(props, valueType), internalProps = _b.internalProps, forwardedProps = _b.forwardedProps;
    var internalPropsWithDefaults = (0, useFieldInternalPropsWithDefaults_1.useFieldInternalPropsWithDefaults)({
        manager: manager,
        internalProps: internalProps,
        skipContextFieldRefAssignment: skipContextFieldRefAssignment,
    });
    var onFocus = forwardedProps.onFocus, onClick = forwardedProps.onClick, onPaste = forwardedProps.onPaste, onBlur = forwardedProps.onBlur, onKeyDown = forwardedProps.onKeyDown, onClear = forwardedProps.onClear, clearable = forwardedProps.clearable, inputRefProp = forwardedProps.inputRef, inPlaceholder = forwardedProps.placeholder;
    var _c = internalPropsWithDefaults.readOnly, readOnly = _c === void 0 ? false : _c, _d = internalPropsWithDefaults.disabled, disabled = _d === void 0 ? false : _d, _e = internalPropsWithDefaults.autoFocus, autoFocus = _e === void 0 ? false : _e, focused = internalPropsWithDefaults.focused, unstableFieldRef = internalPropsWithDefaults.unstableFieldRef;
    var inputRef = React.useRef(null);
    var handleRef = (0, useForkRef_1.default)(inputRefProp, inputRef);
    var stateResponse = (0, useFieldState_1.useFieldState)({ manager: manager, internalPropsWithDefaults: internalPropsWithDefaults, forwardedProps: forwardedProps });
    var 
    // States and derived states
    activeSectionIndex = stateResponse.activeSectionIndex, areAllSectionsEmpty = stateResponse.areAllSectionsEmpty, error = stateResponse.error, localizedDigits = stateResponse.localizedDigits, parsedSelectedSections = stateResponse.parsedSelectedSections, sectionOrder = stateResponse.sectionOrder, state = stateResponse.state, value = stateResponse.value, 
    // Methods to update the states
    clearValue = stateResponse.clearValue, clearActiveSection = stateResponse.clearActiveSection, setCharacterQuery = stateResponse.setCharacterQuery, setSelectedSections = stateResponse.setSelectedSections, setTempAndroidValueStr = stateResponse.setTempAndroidValueStr, updateSectionValue = stateResponse.updateSectionValue, updateValueFromValueStr = stateResponse.updateValueFromValueStr, 
    // Utilities methods
    getSectionsFromValue = stateResponse.getSectionsFromValue;
    var applyCharacterEditing = (0, useFieldCharacterEditing_1.useFieldCharacterEditing)({ stateResponse: stateResponse });
    var openPickerAriaLabel = useOpenPickerButtonAriaLabel(value);
    var sections = React.useMemo(function () { return (0, exports.addPositionPropertiesToSections)(state.sections, localizedDigits, isRtl); }, [state.sections, localizedDigits, isRtl]);
    function syncSelectionFromDOM() {
        var _a;
        var browserStartIndex = (_a = inputRef.current.selectionStart) !== null && _a !== void 0 ? _a : 0;
        var nextSectionIndex;
        if (browserStartIndex <= sections[0].startInInput) {
            // Special case if browser index is in invisible characters at the beginning
            nextSectionIndex = 1;
        }
        else if (browserStartIndex >= sections[sections.length - 1].endInInput) {
            // If the click is after the last character of the input, then we want to select the 1st section.
            nextSectionIndex = 1;
        }
        else {
            nextSectionIndex = sections.findIndex(function (section) { return section.startInInput - section.startSeparator.length > browserStartIndex; });
        }
        var sectionIndex = nextSectionIndex === -1 ? sections.length - 1 : nextSectionIndex - 1;
        setSelectedSections(sectionIndex);
    }
    function focusField(newSelectedSection) {
        var _a;
        if (newSelectedSection === void 0) { newSelectedSection = 0; }
        if ((0, utils_1.getActiveElement)(inputRef.current) === inputRef.current) {
            return;
        }
        (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.focus();
        setSelectedSections(newSelectedSection);
    }
    var handleInputFocus = (0, useEventCallback_1.default)(function (event) {
        onFocus === null || onFocus === void 0 ? void 0 : onFocus(event);
        // The ref is guaranteed to be resolved at this point.
        var input = inputRef.current;
        focusTimeout.start(0, function () {
            // The ref changed, the component got remounted, the focus event is no longer relevant.
            if (!input || input !== inputRef.current) {
                return;
            }
            if (activeSectionIndex != null) {
                return;
            }
            if (
            // avoid selecting all sections when focusing empty field without value
            input.value.length &&
                Number(input.selectionEnd) - Number(input.selectionStart) === input.value.length) {
                setSelectedSections('all');
            }
            else {
                syncSelectionFromDOM();
            }
        });
    });
    var handleInputClick = (0, useEventCallback_1.default)(function (event) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        // The click event on the clear button would propagate to the input, trigger this handler and result in a wrong section selection.
        // We avoid this by checking if the call of `handleInputClick` is actually intended, or a side effect.
        if (event.isDefaultPrevented()) {
            return;
        }
        onClick === null || onClick === void 0 ? void 0 : onClick.apply(void 0, __spreadArray([event], args, false));
        syncSelectionFromDOM();
    });
    var handleInputPaste = (0, useEventCallback_1.default)(function (event) {
        onPaste === null || onPaste === void 0 ? void 0 : onPaste(event);
        // prevent default to avoid the input `onChange` handler being called
        event.preventDefault();
        if (readOnly || disabled) {
            return;
        }
        var pastedValue = event.clipboardData.getData('text');
        if (typeof parsedSelectedSections === 'number') {
            var activeSection = state.sections[parsedSelectedSections];
            var lettersOnly = /^[a-zA-Z]+$/.test(pastedValue);
            var digitsOnly = /^[0-9]+$/.test(pastedValue);
            var digitsAndLetterOnly = /^(([a-zA-Z]+)|)([0-9]+)(([a-zA-Z]+)|)$/.test(pastedValue);
            var isValidPastedValue = (activeSection.contentType === 'letter' && lettersOnly) ||
                (activeSection.contentType === 'digit' && digitsOnly) ||
                (activeSection.contentType === 'digit-with-letter' && digitsAndLetterOnly);
            if (isValidPastedValue) {
                setCharacterQuery(null);
                updateSectionValue({
                    section: activeSection,
                    newSectionValue: pastedValue,
                    shouldGoToNextSection: true,
                });
                return;
            }
            if (lettersOnly || digitsOnly) {
                // The pasted value corresponds to a single section, but not the expected type,
                // skip the modification
                return;
            }
        }
        setCharacterQuery(null);
        updateValueFromValueStr(pastedValue);
    });
    var handleContainerBlur = (0, useEventCallback_1.default)(function (event) {
        onBlur === null || onBlur === void 0 ? void 0 : onBlur(event);
        setSelectedSections(null);
    });
    var handleInputChange = (0, useEventCallback_1.default)(function (event) {
        if (readOnly) {
            return;
        }
        var targetValue = event.target.value;
        if (targetValue === '') {
            clearValue();
            return;
        }
        var eventData = event.nativeEvent.data;
        // Calling `.fill(04/11/2022)` in playwright will trigger a change event with the requested content to insert in `event.nativeEvent.data`
        // usual changes have only the currently typed character in the `event.nativeEvent.data`
        var shouldUseEventData = eventData && eventData.length > 1;
        var valueStr = shouldUseEventData ? eventData : targetValue;
        var cleanValueStr = cleanString(valueStr);
        if (parsedSelectedSections === 'all') {
            setSelectedSections(activeSectionIndex);
        }
        // If no section is selected or eventData should be used, we just try to parse the new value
        // This line is mostly triggered by imperative code / application tests.
        if (activeSectionIndex == null || shouldUseEventData) {
            updateValueFromValueStr(shouldUseEventData ? eventData : cleanValueStr);
            return;
        }
        var keyPressed;
        if (parsedSelectedSections === 'all' && cleanValueStr.length === 1) {
            keyPressed = cleanValueStr;
        }
        else {
            var prevValueStr = cleanString(fieldValueManager.getV6InputValueFromSections(sections, localizedDigits, isRtl));
            var startOfDiffIndex = -1;
            var endOfDiffIndex = -1;
            for (var i = 0; i < prevValueStr.length; i += 1) {
                if (startOfDiffIndex === -1 && prevValueStr[i] !== cleanValueStr[i]) {
                    startOfDiffIndex = i;
                }
                if (endOfDiffIndex === -1 &&
                    prevValueStr[prevValueStr.length - i - 1] !== cleanValueStr[cleanValueStr.length - i - 1]) {
                    endOfDiffIndex = i;
                }
            }
            var activeSection = sections[activeSectionIndex];
            var hasDiffOutsideOfActiveSection = startOfDiffIndex < activeSection.start ||
                prevValueStr.length - endOfDiffIndex - 1 > activeSection.end;
            if (hasDiffOutsideOfActiveSection) {
                // TODO: Support if the new date is valid
                return;
            }
            // The active section being selected, the browser has replaced its value with the key pressed by the user.
            var activeSectionEndRelativeToNewValue = cleanValueStr.length -
                prevValueStr.length +
                activeSection.end -
                cleanString(activeSection.endSeparator || '').length;
            keyPressed = cleanValueStr.slice(activeSection.start + cleanString(activeSection.startSeparator || '').length, activeSectionEndRelativeToNewValue);
        }
        if (keyPressed.length === 0) {
            if ((0, useField_utils_1.isAndroid)()) {
                setTempAndroidValueStr(valueStr);
            }
            clearActiveSection();
            return;
        }
        applyCharacterEditing({ keyPressed: keyPressed, sectionIndex: activeSectionIndex });
    });
    var handleClear = (0, useEventCallback_1.default)(function (event) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        event.preventDefault();
        onClear === null || onClear === void 0 ? void 0 : onClear.apply(void 0, __spreadArray([event], args, false));
        clearValue();
        if (!isFieldFocused(inputRef)) {
            // setSelectedSections is called internally
            focusField(0);
        }
        else {
            setSelectedSections(sectionOrder.startIndex);
        }
    });
    var handleContainerKeyDown = (0, useFieldRootHandleKeyDown_1.useFieldRootHandleKeyDown)({
        manager: manager,
        internalPropsWithDefaults: internalPropsWithDefaults,
        stateResponse: stateResponse,
    });
    var wrappedHandleContainerKeyDown = (0, useEventCallback_1.default)(function (event) {
        onKeyDown === null || onKeyDown === void 0 ? void 0 : onKeyDown(event);
        handleContainerKeyDown(event);
    });
    var placeholder = React.useMemo(function () {
        if (inPlaceholder !== undefined) {
            return inPlaceholder;
        }
        return fieldValueManager.getV6InputValueFromSections(getSectionsFromValue(valueManager.emptyValue), localizedDigits, isRtl);
    }, [
        inPlaceholder,
        fieldValueManager,
        getSectionsFromValue,
        valueManager.emptyValue,
        localizedDigits,
        isRtl,
    ]);
    var valueStr = React.useMemo(function () {
        var _a;
        return (_a = state.tempValueStrAndroid) !== null && _a !== void 0 ? _a : fieldValueManager.getV6InputValueFromSections(state.sections, localizedDigits, isRtl);
    }, [state.sections, fieldValueManager, state.tempValueStrAndroid, localizedDigits, isRtl]);
    React.useEffect(function () {
        // Select all the sections when focused on mount (`autoFocus = true` on the input)
        if (inputRef.current && inputRef.current === (0, utils_1.getActiveElement)(inputRef.current)) {
            setSelectedSections('all');
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    (0, useEnhancedEffect_1.default)(function () {
        function syncSelectionToDOM() {
            if (!inputRef.current) {
                return;
            }
            if (parsedSelectedSections == null) {
                if (inputRef.current.scrollLeft) {
                    // Ensure that input content is not marked as selected.
                    // setting selection range to 0 causes issues in Safari.
                    // https://bugs.webkit.org/show_bug.cgi?id=224425
                    inputRef.current.scrollLeft = 0;
                }
                return;
            }
            // On multi input range pickers we want to update selection range only for the active input
            // This helps to avoid the focus jumping on Safari https://github.com/mui/mui-x/issues/9003
            // because WebKit implements the `setSelectionRange` based on the spec: https://bugs.webkit.org/show_bug.cgi?id=224425
            if (inputRef.current !== (0, utils_1.getActiveElement)(inputRef.current)) {
                return;
            }
            // Fix scroll jumping on iOS browser: https://github.com/mui/mui-x/issues/8321
            var currentScrollTop = inputRef.current.scrollTop;
            if (parsedSelectedSections === 'all') {
                inputRef.current.select();
            }
            else {
                var selectedSection = sections[parsedSelectedSections];
                var selectionStart_1 = selectedSection.type === 'empty'
                    ? selectedSection.startInInput - selectedSection.startSeparator.length
                    : selectedSection.startInInput;
                var selectionEnd_1 = selectedSection.type === 'empty'
                    ? selectedSection.endInInput + selectedSection.endSeparator.length
                    : selectedSection.endInInput;
                if (selectionStart_1 !== inputRef.current.selectionStart ||
                    selectionEnd_1 !== inputRef.current.selectionEnd) {
                    if (inputRef.current === (0, utils_1.getActiveElement)(inputRef.current)) {
                        inputRef.current.setSelectionRange(selectionStart_1, selectionEnd_1);
                    }
                }
                selectionSyncTimeout.start(0, function () {
                    // handle case when the selection is not updated correctly
                    // could happen on Android
                    if (inputRef.current &&
                        inputRef.current === (0, utils_1.getActiveElement)(inputRef.current) &&
                        // The section might loose all selection, where `selectionStart === selectionEnd`
                        // https://github.com/mui/mui-x/pull/13652
                        inputRef.current.selectionStart === inputRef.current.selectionEnd &&
                        (inputRef.current.selectionStart !== selectionStart_1 ||
                            inputRef.current.selectionEnd !== selectionEnd_1)) {
                        syncSelectionToDOM();
                    }
                });
            }
            // Even reading this variable seems to do the trick, but also setting it just to make use of it
            inputRef.current.scrollTop = currentScrollTop;
        }
        syncSelectionToDOM();
    });
    var inputMode = React.useMemo(function () {
        if (activeSectionIndex == null) {
            return 'text';
        }
        if (state.sections[activeSectionIndex].contentType === 'letter') {
            return 'text';
        }
        return 'numeric';
    }, [activeSectionIndex, state.sections]);
    var inputHasFocus = inputRef.current && inputRef.current === (0, utils_1.getActiveElement)(inputRef.current);
    var shouldShowPlaceholder = !inputHasFocus && areAllSectionsEmpty;
    React.useImperativeHandle(unstableFieldRef, function () { return ({
        getSections: function () { return state.sections; },
        getActiveSectionIndex: function () {
            var _a, _b;
            var browserStartIndex = (_a = inputRef.current.selectionStart) !== null && _a !== void 0 ? _a : 0;
            var browserEndIndex = (_b = inputRef.current.selectionEnd) !== null && _b !== void 0 ? _b : 0;
            if (browserStartIndex === 0 && browserEndIndex === 0) {
                return null;
            }
            var nextSectionIndex = browserStartIndex <= sections[0].startInInput
                ? 1 // Special case if browser index is in invisible characters at the beginning.
                : sections.findIndex(function (section) { return section.startInInput - section.startSeparator.length > browserStartIndex; });
            return nextSectionIndex === -1 ? sections.length - 1 : nextSectionIndex - 1;
        },
        setSelectedSections: function (newSelectedSections) { return setSelectedSections(newSelectedSections); },
        focusField: focusField,
        isFieldFocused: function () { return isFieldFocused(inputRef); },
    }); });
    return __assign(__assign({}, forwardedProps), { error: error, clearable: Boolean(clearable && !areAllSectionsEmpty && !readOnly && !disabled), onBlur: handleContainerBlur, onClick: handleInputClick, onFocus: handleInputFocus, onPaste: handleInputPaste, onKeyDown: wrappedHandleContainerKeyDown, onClear: handleClear, inputRef: handleRef, 
        // Additional
        enableAccessibleFieldDOMStructure: false, placeholder: placeholder, inputMode: inputMode, autoComplete: 'off', value: shouldShowPlaceholder ? '' : valueStr, onChange: handleInputChange, focused: focused, disabled: disabled, readOnly: readOnly, autoFocus: autoFocus, openPickerAriaLabel: openPickerAriaLabel });
};
exports.useFieldV6TextField = useFieldV6TextField;
function isFieldFocused(inputRef) {
    return inputRef.current === (0, utils_1.getActiveElement)(inputRef.current);
}
