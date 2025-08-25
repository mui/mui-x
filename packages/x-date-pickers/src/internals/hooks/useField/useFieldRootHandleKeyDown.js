"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFieldRootHandleKeyDown = useFieldRootHandleKeyDown;
var useEventCallback_1 = require("@mui/utils/useEventCallback");
var useField_utils_1 = require("./useField.utils");
var usePickerAdapter_1 = require("../../../hooks/usePickerAdapter");
/**
 * Returns the `onKeyDown` handler to pass to the root element of the field.
 */
function useFieldRootHandleKeyDown(parameters) {
    var adapter = (0, usePickerAdapter_1.usePickerAdapter)();
    var fieldValueManager = parameters.manager.internal_fieldValueManager, _a = parameters.internalPropsWithDefaults, minutesStep = _a.minutesStep, disabled = _a.disabled, readOnly = _a.readOnly, _b = parameters.stateResponse, 
    // States and derived states
    state = _b.state, value = _b.value, activeSectionIndex = _b.activeSectionIndex, parsedSelectedSections = _b.parsedSelectedSections, sectionsValueBoundaries = _b.sectionsValueBoundaries, localizedDigits = _b.localizedDigits, timezone = _b.timezone, sectionOrder = _b.sectionOrder, 
    // Methods to update the states
    clearValue = _b.clearValue, clearActiveSection = _b.clearActiveSection, setSelectedSections = _b.setSelectedSections, updateSectionValue = _b.updateSectionValue;
    return (0, useEventCallback_1.default)(function (event) {
        if (disabled) {
            return;
        }
        // eslint-disable-next-line default-case
        switch (true) {
            // Select all
            case (event.ctrlKey || event.metaKey) &&
                String.fromCharCode(event.keyCode) === 'A' &&
                !event.shiftKey &&
                !event.altKey:
                {
                    // prevent default to make sure that the next line "select all" while updating
                    // the internal state at the same time.
                    event.preventDefault();
                    setSelectedSections('all');
                    break;
                }
            // Move selection to next section
            case event.key === 'ArrowRight': {
                event.preventDefault();
                if (parsedSelectedSections == null) {
                    setSelectedSections(sectionOrder.startIndex);
                }
                else if (parsedSelectedSections === 'all') {
                    setSelectedSections(sectionOrder.endIndex);
                }
                else {
                    var nextSectionIndex = sectionOrder.neighbors[parsedSelectedSections].rightIndex;
                    if (nextSectionIndex !== null) {
                        setSelectedSections(nextSectionIndex);
                    }
                }
                break;
            }
            // Move selection to previous section
            case event.key === 'ArrowLeft': {
                event.preventDefault();
                if (parsedSelectedSections == null) {
                    setSelectedSections(sectionOrder.endIndex);
                }
                else if (parsedSelectedSections === 'all') {
                    setSelectedSections(sectionOrder.startIndex);
                }
                else {
                    var nextSectionIndex = sectionOrder.neighbors[parsedSelectedSections].leftIndex;
                    if (nextSectionIndex !== null) {
                        setSelectedSections(nextSectionIndex);
                    }
                }
                break;
            }
            // Reset the value of the selected section
            case event.key === 'Delete': {
                event.preventDefault();
                if (readOnly) {
                    break;
                }
                if (parsedSelectedSections == null || parsedSelectedSections === 'all') {
                    clearValue();
                }
                else {
                    clearActiveSection();
                }
                break;
            }
            // Increment / decrement the selected section value
            case ['ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown'].includes(event.key): {
                event.preventDefault();
                if (readOnly || activeSectionIndex == null) {
                    break;
                }
                // if all sections are selected, mark the currently editing one as selected
                if (parsedSelectedSections === 'all') {
                    setSelectedSections(activeSectionIndex);
                }
                var activeSection = state.sections[activeSectionIndex];
                var newSectionValue = adjustSectionValue(adapter, timezone, activeSection, event.key, sectionsValueBoundaries, localizedDigits, fieldValueManager.getDateFromSection(value, activeSection), { minutesStep: minutesStep });
                updateSectionValue({
                    section: activeSection,
                    newSectionValue: newSectionValue,
                    shouldGoToNextSection: false,
                });
                break;
            }
        }
    });
}
function getDeltaFromKeyCode(keyCode) {
    switch (keyCode) {
        case 'ArrowUp':
            return 1;
        case 'ArrowDown':
            return -1;
        case 'PageUp':
            return 5;
        case 'PageDown':
            return -5;
        default:
            return 0;
    }
}
function adjustSectionValue(adapter, timezone, section, keyCode, sectionsValueBoundaries, localizedDigits, activeDate, stepsAttributes) {
    var delta = getDeltaFromKeyCode(keyCode);
    var isStart = keyCode === 'Home';
    var isEnd = keyCode === 'End';
    var shouldSetAbsolute = section.value === '' || isStart || isEnd;
    var adjustDigitSection = function () {
        var sectionBoundaries = sectionsValueBoundaries[section.type]({
            currentDate: activeDate,
            format: section.format,
            contentType: section.contentType,
        });
        var getCleanValue = function (value) {
            return (0, useField_utils_1.cleanDigitSectionValue)(adapter, value, sectionBoundaries, localizedDigits, section);
        };
        var step = section.type === 'minutes' && (stepsAttributes === null || stepsAttributes === void 0 ? void 0 : stepsAttributes.minutesStep) ? stepsAttributes.minutesStep : 1;
        var newSectionValueNumber;
        if (shouldSetAbsolute) {
            if (section.type === 'year' && !isEnd && !isStart) {
                return adapter.formatByString(adapter.date(undefined, timezone), section.format);
            }
            if (delta > 0 || isStart) {
                newSectionValueNumber = sectionBoundaries.minimum;
            }
            else {
                newSectionValueNumber = sectionBoundaries.maximum;
            }
        }
        else {
            var currentSectionValue = parseInt((0, useField_utils_1.removeLocalizedDigits)(section.value, localizedDigits), 10);
            newSectionValueNumber = currentSectionValue + delta * step;
        }
        if (newSectionValueNumber % step !== 0) {
            if (delta < 0 || isStart) {
                newSectionValueNumber += step - ((step + newSectionValueNumber) % step); // for JS -3 % 5 = -3 (should be 2)
            }
            if (delta > 0 || isEnd) {
                newSectionValueNumber -= newSectionValueNumber % step;
            }
        }
        if (newSectionValueNumber > sectionBoundaries.maximum) {
            return getCleanValue(sectionBoundaries.minimum +
                ((newSectionValueNumber - sectionBoundaries.maximum - 1) %
                    (sectionBoundaries.maximum - sectionBoundaries.minimum + 1)));
        }
        if (newSectionValueNumber < sectionBoundaries.minimum) {
            return getCleanValue(sectionBoundaries.maximum -
                ((sectionBoundaries.minimum - newSectionValueNumber - 1) %
                    (sectionBoundaries.maximum - sectionBoundaries.minimum + 1)));
        }
        return getCleanValue(newSectionValueNumber);
    };
    var adjustLetterSection = function () {
        var options = (0, useField_utils_1.getLetterEditingOptions)(adapter, timezone, section.type, section.format);
        if (options.length === 0) {
            return section.value;
        }
        if (shouldSetAbsolute) {
            if (delta > 0 || isStart) {
                return options[0];
            }
            return options[options.length - 1];
        }
        var currentOptionIndex = options.indexOf(section.value);
        var newOptionIndex = (currentOptionIndex + delta) % options.length;
        var clampedIndex = (newOptionIndex + options.length) % options.length;
        return options[clampedIndex];
    };
    if (section.contentType === 'digit' || section.contentType === 'digit-with-letter') {
        return adjustDigitSection();
    }
    return adjustLetterSection();
}
