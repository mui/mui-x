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
exports.useFieldV7TextField = void 0;
var React = require("react");
var useForkRef_1 = require("@mui/utils/useForkRef");
var useEventCallback_1 = require("@mui/utils/useEventCallback");
var useEnhancedEffect_1 = require("@mui/utils/useEnhancedEffect");
var useField_utils_1 = require("./useField.utils");
var utils_1 = require("../../utils/utils");
var hooks_1 = require("../../../hooks");
var useFieldCharacterEditing_1 = require("./useFieldCharacterEditing");
var useFieldState_1 = require("./useFieldState");
var useFieldInternalPropsWithDefaults_1 = require("./useFieldInternalPropsWithDefaults");
var syncSelectionToDOM_1 = require("./syncSelectionToDOM");
var useFieldRootProps_1 = require("./useFieldRootProps");
var useFieldHiddenInputProps_1 = require("./useFieldHiddenInputProps");
var useFieldSectionContainerProps_1 = require("./useFieldSectionContainerProps");
var useFieldSectionContentProps_1 = require("./useFieldSectionContentProps");
var useFieldV7TextField = function (parameters) {
    var props = parameters.props, manager = parameters.manager, skipContextFieldRefAssignment = parameters.skipContextFieldRefAssignment, _a = parameters.manager, valueType = _a.valueType, useOpenPickerButtonAriaLabel = _a.internal_useOpenPickerButtonAriaLabel;
    var _b = (0, hooks_1.useSplitFieldProps)(props, valueType), internalProps = _b.internalProps, forwardedProps = _b.forwardedProps;
    var internalPropsWithDefaults = (0, useFieldInternalPropsWithDefaults_1.useFieldInternalPropsWithDefaults)({
        manager: manager,
        internalProps: internalProps,
        skipContextFieldRefAssignment: skipContextFieldRefAssignment,
    });
    var sectionListRefProp = forwardedProps.sectionListRef, onBlur = forwardedProps.onBlur, onClick = forwardedProps.onClick, onFocus = forwardedProps.onFocus, onInput = forwardedProps.onInput, onPaste = forwardedProps.onPaste, onKeyDown = forwardedProps.onKeyDown, onClear = forwardedProps.onClear, clearable = forwardedProps.clearable;
    var _c = internalPropsWithDefaults.disabled, disabled = _c === void 0 ? false : _c, _d = internalPropsWithDefaults.readOnly, readOnly = _d === void 0 ? false : _d, _e = internalPropsWithDefaults.autoFocus, autoFocus = _e === void 0 ? false : _e, focusedProp = internalPropsWithDefaults.focused, unstableFieldRef = internalPropsWithDefaults.unstableFieldRef;
    var sectionListRef = React.useRef(null);
    var handleSectionListRef = (0, useForkRef_1.default)(sectionListRefProp, sectionListRef);
    var domGetters = React.useMemo(function () { return ({
        isReady: function () { return sectionListRef.current != null; },
        getRoot: function () { return sectionListRef.current.getRoot(); },
        getSectionContainer: function (sectionIndex) {
            return sectionListRef.current.getSectionContainer(sectionIndex);
        },
        getSectionContent: function (sectionIndex) {
            return sectionListRef.current.getSectionContent(sectionIndex);
        },
        getSectionIndexFromDOMElement: function (element) {
            return sectionListRef.current.getSectionIndexFromDOMElement(element);
        },
    }); }, [sectionListRef]);
    var stateResponse = (0, useFieldState_1.useFieldState)({ manager: manager, internalPropsWithDefaults: internalPropsWithDefaults, forwardedProps: forwardedProps });
    var 
    // States and derived states
    areAllSectionsEmpty = stateResponse.areAllSectionsEmpty, error = stateResponse.error, parsedSelectedSections = stateResponse.parsedSelectedSections, sectionOrder = stateResponse.sectionOrder, state = stateResponse.state, value = stateResponse.value, 
    // Methods to update the states
    clearValue = stateResponse.clearValue, setSelectedSections = stateResponse.setSelectedSections;
    var applyCharacterEditing = (0, useFieldCharacterEditing_1.useFieldCharacterEditing)({ stateResponse: stateResponse });
    var openPickerAriaLabel = useOpenPickerButtonAriaLabel(value);
    var _f = React.useState(false), focused = _f[0], setFocused = _f[1];
    function focusField(newSelectedSections) {
        if (newSelectedSections === void 0) { newSelectedSections = 0; }
        if (disabled ||
            !sectionListRef.current ||
            // if the field is already focused, we don't need to focus it again
            getActiveSectionIndex(sectionListRef) != null) {
            return;
        }
        var newParsedSelectedSections = (0, useField_utils_1.parseSelectedSections)(newSelectedSections, state.sections);
        setFocused(true);
        sectionListRef.current.getSectionContent(newParsedSelectedSections).focus();
    }
    var rootProps = (0, useFieldRootProps_1.useFieldRootProps)({
        manager: manager,
        internalPropsWithDefaults: internalPropsWithDefaults,
        stateResponse: stateResponse,
        applyCharacterEditing: applyCharacterEditing,
        focused: focused,
        setFocused: setFocused,
        domGetters: domGetters,
    });
    var hiddenInputProps = (0, useFieldHiddenInputProps_1.useFieldHiddenInputProps)({ manager: manager, stateResponse: stateResponse });
    var createSectionContainerProps = (0, useFieldSectionContainerProps_1.useFieldSectionContainerProps)({
        stateResponse: stateResponse,
        internalPropsWithDefaults: internalPropsWithDefaults,
    });
    var createSectionContentProps = (0, useFieldSectionContentProps_1.useFieldSectionContentProps)({
        manager: manager,
        stateResponse: stateResponse,
        applyCharacterEditing: applyCharacterEditing,
        internalPropsWithDefaults: internalPropsWithDefaults,
        domGetters: domGetters,
        focused: focused,
    });
    var handleRootKeyDown = (0, useEventCallback_1.default)(function (event) {
        onKeyDown === null || onKeyDown === void 0 ? void 0 : onKeyDown(event);
        rootProps.onKeyDown(event);
    });
    var handleRootBlur = (0, useEventCallback_1.default)(function (event) {
        onBlur === null || onBlur === void 0 ? void 0 : onBlur(event);
        rootProps.onBlur(event);
    });
    var handleRootFocus = (0, useEventCallback_1.default)(function (event) {
        onFocus === null || onFocus === void 0 ? void 0 : onFocus(event);
        rootProps.onFocus(event);
    });
    var handleRootClick = (0, useEventCallback_1.default)(function (event) {
        // The click event on the clear or open button would propagate to the input, trigger this handler and result in an inadvertent section selection.
        // We avoid this by checking if the call of `handleInputClick` is actually intended, or a propagated call, which should be skipped.
        if (event.isDefaultPrevented()) {
            return;
        }
        onClick === null || onClick === void 0 ? void 0 : onClick(event);
        rootProps.onClick(event);
    });
    var handleRootPaste = (0, useEventCallback_1.default)(function (event) {
        onPaste === null || onPaste === void 0 ? void 0 : onPaste(event);
        rootProps.onPaste(event);
    });
    var handleRootInput = (0, useEventCallback_1.default)(function (event) {
        onInput === null || onInput === void 0 ? void 0 : onInput(event);
        rootProps.onInput(event);
    });
    var handleClear = (0, useEventCallback_1.default)(function (event) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        event.preventDefault();
        onClear === null || onClear === void 0 ? void 0 : onClear.apply(void 0, __spreadArray([event], args, false));
        clearValue();
        if (!isFieldFocused(sectionListRef)) {
            // setSelectedSections is called internally
            focusField(0);
        }
        else {
            setSelectedSections(sectionOrder.startIndex);
        }
    });
    var elements = React.useMemo(function () {
        return state.sections.map(function (section, sectionIndex) {
            var content = createSectionContentProps(section, sectionIndex);
            return {
                container: createSectionContainerProps(sectionIndex),
                content: createSectionContentProps(section, sectionIndex),
                before: {
                    children: section.startSeparator,
                },
                after: {
                    children: section.endSeparator,
                    'data-range-position': section.isEndFormatSeparator
                        ? content['data-range-position']
                        : undefined,
                },
            };
        });
    }, [state.sections, createSectionContainerProps, createSectionContentProps]);
    React.useEffect(function () {
        if (sectionListRef.current == null) {
            throw new Error([
                'MUI X: The `sectionListRef` prop has not been initialized by `PickersSectionList`',
                'You probably tried to pass a component to the `textField` slot that contains an `<input />` element instead of a `PickersSectionList`.',
                '',
                'If you want to keep using an `<input />` HTML element for the editing, please add the `enableAccessibleFieldDOMStructure={false}` prop to your Picker or Field component:',
                '',
                '<DatePicker enableAccessibleFieldDOMStructure={false} slots={{ textField: MyCustomTextField }} />',
                '',
                'Learn more about the field accessible DOM structure on the MUI documentation: https://mui.com/x/react-date-pickers/fields/#fields-to-edit-a-single-element',
            ].join('\n'));
        }
        if (autoFocus && !disabled && sectionListRef.current) {
            sectionListRef.current.getSectionContent(sectionOrder.startIndex).focus();
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    (0, useEnhancedEffect_1.default)(function () {
        if (!focused || !sectionListRef.current) {
            return;
        }
        if (parsedSelectedSections === 'all') {
            sectionListRef.current.getRoot().focus();
        }
        else if (typeof parsedSelectedSections === 'number') {
            var domElement = sectionListRef.current.getSectionContent(parsedSelectedSections);
            if (domElement) {
                domElement.focus();
            }
        }
    }, [parsedSelectedSections, focused]);
    (0, useEnhancedEffect_1.default)(function () {
        (0, syncSelectionToDOM_1.syncSelectionToDOM)({ focused: focused, domGetters: domGetters, stateResponse: stateResponse });
    });
    React.useImperativeHandle(unstableFieldRef, function () { return ({
        getSections: function () { return state.sections; },
        getActiveSectionIndex: function () { return getActiveSectionIndex(sectionListRef); },
        setSelectedSections: function (newSelectedSections) {
            if (disabled || !sectionListRef.current) {
                return;
            }
            var newParsedSelectedSections = (0, useField_utils_1.parseSelectedSections)(newSelectedSections, state.sections);
            var newActiveSectionIndex = newParsedSelectedSections === 'all' ? 0 : newParsedSelectedSections;
            setFocused(newActiveSectionIndex !== null);
            setSelectedSections(newSelectedSections);
        },
        focusField: focusField,
        isFieldFocused: function () { return isFieldFocused(sectionListRef); },
    }); });
    return __assign(__assign(__assign(__assign(__assign({}, forwardedProps), rootProps), { onBlur: handleRootBlur, onClick: handleRootClick, onFocus: handleRootFocus, onInput: handleRootInput, onPaste: handleRootPaste, onKeyDown: handleRootKeyDown, onClear: handleClear }), hiddenInputProps), { error: error, clearable: Boolean(clearable && !areAllSectionsEmpty && !readOnly && !disabled), focused: focusedProp !== null && focusedProp !== void 0 ? focusedProp : focused, sectionListRef: handleSectionListRef, 
        // Additional
        enableAccessibleFieldDOMStructure: true, elements: elements, areAllSectionsEmpty: areAllSectionsEmpty, disabled: disabled, readOnly: readOnly, autoFocus: autoFocus, openPickerAriaLabel: openPickerAriaLabel });
};
exports.useFieldV7TextField = useFieldV7TextField;
function getActiveSectionIndex(sectionListRef) {
    var _a;
    var activeElement = (0, utils_1.getActiveElement)((_a = sectionListRef.current) === null || _a === void 0 ? void 0 : _a.getRoot());
    if (!activeElement ||
        !sectionListRef.current ||
        !sectionListRef.current.getRoot().contains(activeElement)) {
        return null;
    }
    return sectionListRef.current.getSectionIndexFromDOMElement(activeElement);
}
function isFieldFocused(sectionListRef) {
    var _a;
    var activeElement = (0, utils_1.getActiveElement)((_a = sectionListRef.current) === null || _a === void 0 ? void 0 : _a.getRoot());
    return !!sectionListRef.current && sectionListRef.current.getRoot().contains(activeElement);
}
