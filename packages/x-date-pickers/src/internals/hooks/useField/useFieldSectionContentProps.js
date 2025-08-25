"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFieldSectionContentProps = useFieldSectionContentProps;
var React = require("react");
var useEventCallback_1 = require("@mui/utils/useEventCallback");
var useId_1 = require("@mui/utils/useId");
var hooks_1 = require("../../../hooks");
var syncSelectionToDOM_1 = require("./syncSelectionToDOM");
/**
 * Generate the props to pass to the content element of each section of the field.
 * It is not used by the non-accessible DOM structure (with an <input /> element for editing).
 * It should be used in the MUI accessible DOM structure and the Base UI implementation.
 * @param {UseFieldRootPropsParameters} parameters The parameters of the hook.
 * @returns {UseFieldRootPropsReturnValue} The props to forward to the content element of each section of the field.
 */
function useFieldSectionContentProps(parameters) {
    var adapter = (0, hooks_1.usePickerAdapter)();
    var translations = (0, hooks_1.usePickerTranslations)();
    var id = (0, useId_1.default)();
    var focused = parameters.focused, domGetters = parameters.domGetters, stateResponse = parameters.stateResponse, applyCharacterEditing = parameters.applyCharacterEditing, fieldValueManager = parameters.manager.internal_fieldValueManager, _a = parameters.stateResponse, 
    // States and derived states
    parsedSelectedSections = _a.parsedSelectedSections, sectionsValueBoundaries = _a.sectionsValueBoundaries, state = _a.state, value = _a.value, 
    // Methods to update the states
    clearActiveSection = _a.clearActiveSection, setCharacterQuery = _a.setCharacterQuery, setSelectedSections = _a.setSelectedSections, updateSectionValue = _a.updateSectionValue, updateValueFromValueStr = _a.updateValueFromValueStr, _b = parameters.internalPropsWithDefaults, _c = _b.disabled, disabled = _c === void 0 ? false : _c, _d = _b.readOnly, readOnly = _d === void 0 ? false : _d;
    var isContainerEditable = parsedSelectedSections === 'all';
    var isEditable = !isContainerEditable && !disabled && !readOnly;
    /**
     * If a section content has been updated with a value we don't want to keep,
     * Then we need to imperatively revert it (we can't let React do it because the value did not change in his internal representation).
     */
    var revertDOMSectionChange = (0, useEventCallback_1.default)(function (sectionIndex) {
        if (!domGetters.isReady()) {
            return;
        }
        var section = state.sections[sectionIndex];
        domGetters.getSectionContent(sectionIndex).innerHTML = section.value || section.placeholder;
        (0, syncSelectionToDOM_1.syncSelectionToDOM)({ focused: focused, domGetters: domGetters, stateResponse: stateResponse });
    });
    var handleInput = (0, useEventCallback_1.default)(function (event) {
        var _a;
        if (!domGetters.isReady()) {
            return;
        }
        var target = event.target;
        var keyPressed = (_a = target.textContent) !== null && _a !== void 0 ? _a : '';
        var sectionIndex = domGetters.getSectionIndexFromDOMElement(target);
        var section = state.sections[sectionIndex];
        if (readOnly) {
            revertDOMSectionChange(sectionIndex);
            return;
        }
        if (keyPressed.length === 0) {
            if (section.value === '') {
                revertDOMSectionChange(sectionIndex);
                return;
            }
            var inputType = event.nativeEvent.inputType;
            if (inputType === 'insertParagraph' || inputType === 'insertLineBreak') {
                revertDOMSectionChange(sectionIndex);
                return;
            }
            revertDOMSectionChange(sectionIndex);
            clearActiveSection();
            return;
        }
        applyCharacterEditing({
            keyPressed: keyPressed,
            sectionIndex: sectionIndex,
        });
        // The DOM value needs to remain the one React is expecting.
        revertDOMSectionChange(sectionIndex);
    });
    var handleMouseUp = (0, useEventCallback_1.default)(function (event) {
        // Without this, the browser will remove the selected when clicking inside an already-selected section.
        event.preventDefault();
    });
    var handlePaste = (0, useEventCallback_1.default)(function (event) {
        // prevent default to avoid the input `onInput` handler being called
        event.preventDefault();
        if (readOnly || disabled || typeof parsedSelectedSections !== 'number') {
            return;
        }
        var activeSection = state.sections[parsedSelectedSections];
        var pastedValue = event.clipboardData.getData('text');
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
        }
        // If the pasted value corresponds to a single section, but not the expected type, we skip the modification
        else if (!lettersOnly && !digitsOnly) {
            setCharacterQuery(null);
            updateValueFromValueStr(pastedValue);
        }
    });
    var handleDragOver = (0, useEventCallback_1.default)(function (event) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'none';
    });
    var createFocusHandler = React.useCallback(function (sectionIndex) { return function () {
        if (disabled) {
            return;
        }
        setSelectedSections(sectionIndex);
    }; }, [disabled, setSelectedSections]);
    return React.useCallback(function (section, sectionIndex) {
        var sectionBoundaries = sectionsValueBoundaries[section.type]({
            currentDate: fieldValueManager.getDateFromSection(value, section),
            contentType: section.contentType,
            format: section.format,
        });
        return {
            // Event handlers
            onInput: handleInput,
            onPaste: handlePaste,
            onMouseUp: handleMouseUp,
            onDragOver: handleDragOver,
            onFocus: createFocusHandler(sectionIndex),
            // Aria attributes
            'aria-labelledby': "".concat(id, "-").concat(section.type),
            'aria-readonly': readOnly,
            'aria-valuenow': getSectionValueNow(section, adapter),
            'aria-valuemin': sectionBoundaries.minimum,
            'aria-valuemax': sectionBoundaries.maximum,
            'aria-valuetext': section.value
                ? getSectionValueText(section, adapter)
                : translations.empty,
            'aria-label': translations[section.type],
            'aria-disabled': disabled,
            // Other
            tabIndex: isContainerEditable || sectionIndex > 0 ? -1 : 0,
            contentEditable: !isContainerEditable && !disabled && !readOnly,
            role: 'spinbutton',
            id: "".concat(id, "-").concat(section.type),
            'data-range-position': section.dateName || undefined,
            spellCheck: isEditable ? false : undefined,
            autoCapitalize: isEditable ? 'off' : undefined,
            autoCorrect: isEditable ? 'off' : undefined,
            children: section.value || section.placeholder,
            inputMode: section.contentType === 'letter' ? 'text' : 'numeric',
        };
    }, [
        sectionsValueBoundaries,
        id,
        isContainerEditable,
        disabled,
        readOnly,
        isEditable,
        translations,
        adapter,
        handleInput,
        handlePaste,
        handleMouseUp,
        handleDragOver,
        createFocusHandler,
        fieldValueManager,
        value,
    ]);
}
function getSectionValueText(section, adapter) {
    if (!section.value) {
        return undefined;
    }
    switch (section.type) {
        case 'month': {
            if (section.contentType === 'digit') {
                return adapter.format(adapter.setMonth(adapter.date(), Number(section.value) - 1), 'month');
            }
            var parsedDate = adapter.parse(section.value, section.format);
            return parsedDate ? adapter.format(parsedDate, 'month') : undefined;
        }
        case 'day':
            return section.contentType === 'digit'
                ? adapter.format(adapter.setDate(adapter.startOfYear(adapter.date()), Number(section.value)), 'dayOfMonthFull')
                : section.value;
        case 'weekDay':
            // TODO: improve by providing the label of the week day
            return undefined;
        default:
            return undefined;
    }
}
function getSectionValueNow(section, adapter) {
    if (!section.value) {
        return undefined;
    }
    switch (section.type) {
        case 'weekDay': {
            if (section.contentType === 'letter') {
                // TODO: improve by resolving the week day number from a letter week day
                return undefined;
            }
            return Number(section.value);
        }
        case 'meridiem': {
            var parsedDate = adapter.parse("01:00 ".concat(section.value), "".concat(adapter.formats.hours12h, ":").concat(adapter.formats.minutes, " ").concat(section.format));
            if (parsedDate) {
                return adapter.getHours(parsedDate) >= 12 ? 1 : 0;
            }
            return undefined;
        }
        case 'day':
            return section.contentType === 'digit-with-letter'
                ? parseInt(section.value, 10)
                : Number(section.value);
        case 'month': {
            if (section.contentType === 'digit') {
                return Number(section.value);
            }
            var parsedDate = adapter.parse(section.value, section.format);
            return parsedDate ? adapter.getMonth(parsedDate) + 1 : undefined;
        }
        default:
            return section.contentType !== 'letter' ? Number(section.value) : undefined;
    }
}
