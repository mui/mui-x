"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFieldRootProps = useFieldRootProps;
var useEventCallback_1 = require("@mui/utils/useEventCallback");
var useTimeout_1 = require("@mui/utils/useTimeout");
var useFieldRootHandleKeyDown_1 = require("./useFieldRootHandleKeyDown");
var utils_1 = require("../../utils/utils");
var syncSelectionToDOM_1 = require("./syncSelectionToDOM");
/**
 * Generate the props to pass to the root element of the field.
 * It is not used by the non-accessible DOM structure (with an <input /> element for editing).
 * It should be used in the MUI accessible DOM structure and the Base UI implementation.
 * @param {UseFieldRootPropsParameters} parameters The parameters of the hook.
 * @returns {UseFieldRootPropsReturnValue} The props to forward to the root element of the field.
 */
function useFieldRootProps(parameters) {
    var manager = parameters.manager, focused = parameters.focused, setFocused = parameters.setFocused, domGetters = parameters.domGetters, stateResponse = parameters.stateResponse, applyCharacterEditing = parameters.applyCharacterEditing, internalPropsWithDefaults = parameters.internalPropsWithDefaults, _a = parameters.stateResponse, 
    // States and derived states
    parsedSelectedSections = _a.parsedSelectedSections, sectionOrder = _a.sectionOrder, state = _a.state, 
    // Methods to update the states
    clearValue = _a.clearValue, setCharacterQuery = _a.setCharacterQuery, setSelectedSections = _a.setSelectedSections, updateValueFromValueStr = _a.updateValueFromValueStr, _b = parameters.internalPropsWithDefaults, _c = _b.disabled, disabled = _c === void 0 ? false : _c, _d = _b.readOnly, readOnly = _d === void 0 ? false : _d;
    // TODO: Inline onContainerKeyDown once the old DOM structure is removed
    var handleKeyDown = (0, useFieldRootHandleKeyDown_1.useFieldRootHandleKeyDown)({
        manager: manager,
        internalPropsWithDefaults: internalPropsWithDefaults,
        stateResponse: stateResponse,
    });
    var containerClickTimeout = (0, useTimeout_1.default)();
    var handleClick = (0, useEventCallback_1.default)(function (event) {
        if (disabled || !domGetters.isReady()) {
            return;
        }
        setFocused(true);
        if (parsedSelectedSections === 'all') {
            containerClickTimeout.start(0, function () {
                var cursorPosition = document.getSelection().getRangeAt(0).startOffset;
                if (cursorPosition === 0) {
                    setSelectedSections(sectionOrder.startIndex);
                    return;
                }
                var sectionIndex = 0;
                var cursorOnStartOfSection = 0;
                while (cursorOnStartOfSection < cursorPosition && sectionIndex < state.sections.length) {
                    var section = state.sections[sectionIndex];
                    sectionIndex += 1;
                    cursorOnStartOfSection += "".concat(section.startSeparator).concat(section.value || section.placeholder).concat(section.endSeparator).length;
                }
                setSelectedSections(sectionIndex - 1);
            });
        }
        else if (!focused) {
            setFocused(true);
            setSelectedSections(sectionOrder.startIndex);
        }
        else {
            var hasClickedOnASection = domGetters.getRoot().contains(event.target);
            if (!hasClickedOnASection) {
                setSelectedSections(sectionOrder.startIndex);
            }
        }
    });
    var handleInput = (0, useEventCallback_1.default)(function (event) {
        var _a;
        if (!domGetters.isReady() || parsedSelectedSections !== 'all') {
            return;
        }
        var target = event.target;
        var keyPressed = (_a = target.textContent) !== null && _a !== void 0 ? _a : '';
        domGetters.getRoot().innerHTML = state.sections
            .map(function (section) {
            return "".concat(section.startSeparator).concat(section.value || section.placeholder).concat(section.endSeparator);
        })
            .join('');
        (0, syncSelectionToDOM_1.syncSelectionToDOM)({ focused: focused, domGetters: domGetters, stateResponse: stateResponse });
        if (keyPressed.length === 0 || keyPressed.charCodeAt(0) === 10) {
            clearValue();
            setSelectedSections('all');
        }
        else if (keyPressed.length > 1) {
            updateValueFromValueStr(keyPressed);
        }
        else {
            if (parsedSelectedSections === 'all') {
                setSelectedSections(0);
            }
            applyCharacterEditing({
                keyPressed: keyPressed,
                sectionIndex: 0,
            });
        }
    });
    var handlePaste = (0, useEventCallback_1.default)(function (event) {
        if (readOnly || parsedSelectedSections !== 'all') {
            event.preventDefault();
            return;
        }
        var pastedValue = event.clipboardData.getData('text');
        event.preventDefault();
        setCharacterQuery(null);
        updateValueFromValueStr(pastedValue);
    });
    var handleFocus = (0, useEventCallback_1.default)(function () {
        if (focused || disabled || !domGetters.isReady()) {
            return;
        }
        var activeElement = (0, utils_1.getActiveElement)(domGetters.getRoot());
        setFocused(true);
        var isFocusInsideASection = domGetters.getSectionIndexFromDOMElement(activeElement) != null;
        if (!isFocusInsideASection) {
            setSelectedSections(sectionOrder.startIndex);
        }
    });
    var handleBlur = (0, useEventCallback_1.default)(function () {
        setTimeout(function () {
            if (!domGetters.isReady()) {
                return;
            }
            var activeElement = (0, utils_1.getActiveElement)(domGetters.getRoot());
            var shouldBlur = !domGetters.getRoot().contains(activeElement);
            if (shouldBlur) {
                setFocused(false);
                setSelectedSections(null);
            }
        });
    });
    return {
        // Event handlers
        onKeyDown: handleKeyDown,
        onBlur: handleBlur,
        onFocus: handleFocus,
        onClick: handleClick,
        onPaste: handlePaste,
        onInput: handleInput,
        // Other
        contentEditable: parsedSelectedSections === 'all',
        tabIndex: parsedSelectedSections === 0 ? -1 : 0, // TODO: Try to set to undefined when there is a section selected.
    };
}
