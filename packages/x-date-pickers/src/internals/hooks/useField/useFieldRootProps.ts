import useEventCallback from '@mui/utils/useEventCallback';
import useTimeout from '@mui/utils/useTimeout';
import {
  InferFieldSection,
  MuiPickersAdapter,
  PickersTimezone,
  PickerValidDate,
} from '../../../models';
import {
  FieldSectionsValueBoundaries,
  UseFieldDOMGetters,
  UseFieldInternalProps,
} from './useField.types';
import { UseFieldStateReturnValue } from './useFieldState';
import { getActiveElement } from '../../utils/utils';
import { UseFieldCharacterEditingReturnValue } from './useFieldCharacterEditing';
import { syncSelectionToDOM } from './syncSelectionToDOM';
import { PickerAnyManager, PickerValidValue } from '../../models';
import { usePickerAdapter } from '../../../hooks/usePickerAdapter';
import {
  cleanDigitSectionValue,
  getLetterEditingOptions,
  removeLocalizedDigits,
} from './useField.utils';

/**
 * Generate the props to pass to the root element of the field.
 * @param {UseFieldRootPropsParameters} parameters The parameters of the hook.
 * @returns {UseFieldRootPropsReturnValue} The props to forward to the root element of the field.
 */
export function useFieldRootProps(
  parameters: UseFieldRootPropsParameters,
): UseFieldRootPropsReturnValue {
  const {
    manager: { internal_fieldValueManager: fieldValueManager },
    focused,
    setFocused,
    domGetters,
    stateResponse,
    applyCharacterEditing,
    internalPropsWithDefaults,
    stateResponse: {
      // States and derived states
      parsedSelectedSections,
      sectionsValueBoundaries,
      sectionOrder,
      state,
      value,
      activeSectionIndex,
      localizedDigits,
      timezone,

      // Methods to update the states
      clearValue,
      clearActiveSection,
      setCharacterQuery,
      setSelectedSections,
      updateValueFromValueStr,
      updateSectionValue,
    },
    internalPropsWithDefaults: { disabled = false, readOnly = false, minutesStep },
  } = parameters;

  const adapter = usePickerAdapter();

  const handleKeyDown = useEventCallback((event: React.KeyboardEvent<HTMLSpanElement>) => {
    if (disabled) {
      return;
    }

    // eslint-disable-next-line default-case
    switch (true) {
      // Select all
      case (event.ctrlKey || event.metaKey) &&
        (event.key?.toUpperCase() === 'A' || String.fromCharCode(event.keyCode) === 'A') &&
        !event.shiftKey &&
        !event.altKey: {
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
        } else if (parsedSelectedSections === 'all') {
          setSelectedSections(sectionOrder.endIndex);
        } else {
          const nextSectionIndex = sectionOrder.neighbors[parsedSelectedSections].rightIndex;
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
        } else if (parsedSelectedSections === 'all') {
          setSelectedSections(sectionOrder.startIndex);
        } else {
          const nextSectionIndex = sectionOrder.neighbors[parsedSelectedSections].leftIndex;
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
        } else {
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

        const activeSection = state.sections[activeSectionIndex];

        const newSectionValue = adjustSectionValue(
          adapter,
          timezone,
          activeSection,
          event.key as AvailableAdjustKeyCode,
          sectionsValueBoundaries,
          localizedDigits,
          fieldValueManager.getDateFromSection(value, activeSection),
          { minutesStep },
        );

        updateSectionValue({
          section: activeSection,
          newSectionValue,
          shouldGoToNextSection: false,
        });
        break;
      }
    }
  });

  const containerClickTimeout = useTimeout();
  const handleClick = useEventCallback((event: React.MouseEvent) => {
    if (disabled || !domGetters.isReady()) {
      return;
    }

    setFocused(true);

    if (parsedSelectedSections === 'all') {
      containerClickTimeout.start(0, () => {
        const cursorPosition = document.getSelection()!.getRangeAt(0).startOffset;

        if (cursorPosition === 0) {
          setSelectedSections(sectionOrder.startIndex);
          return;
        }

        let sectionIndex = 0;
        let cursorOnStartOfSection = 0;

        while (cursorOnStartOfSection < cursorPosition && sectionIndex < state.sections.length) {
          const section = state.sections[sectionIndex];
          sectionIndex += 1;
          cursorOnStartOfSection += `${section.startSeparator}${
            section.value || section.placeholder
          }${section.endSeparator}`.length;
        }

        setSelectedSections(sectionIndex - 1);
      });
    } else if (!focused) {
      setFocused(true);
      setSelectedSections(sectionOrder.startIndex);
    } else {
      const hasClickedOnASection = domGetters.getRoot().contains(event.target as Node);

      if (!hasClickedOnASection) {
        setSelectedSections(sectionOrder.startIndex);
      }
    }
  });

  const handleInput = useEventCallback((event: React.FormEvent<HTMLDivElement>) => {
    if (!domGetters.isReady() || parsedSelectedSections !== 'all') {
      return;
    }

    const target = event.target as HTMLSpanElement;
    const keyPressed = target.textContent ?? '';

    domGetters.getRoot().innerHTML = state.sections
      .map(
        (section) =>
          `${section.startSeparator}${section.value || section.placeholder}${section.endSeparator}`,
      )
      .join('');
    syncSelectionToDOM({ focused, domGetters, stateResponse });

    if (keyPressed.length === 0 || keyPressed.charCodeAt(0) === 10) {
      clearValue();
      setSelectedSections('all');
    } else if (keyPressed.length > 1) {
      updateValueFromValueStr(keyPressed);
    } else {
      if (parsedSelectedSections === 'all') {
        setSelectedSections(0);
      }
      applyCharacterEditing({
        keyPressed,
        sectionIndex: 0,
      });
    }
  });

  const handlePaste = useEventCallback((event: React.ClipboardEvent<HTMLDivElement>) => {
    if (readOnly || parsedSelectedSections !== 'all') {
      event.preventDefault();
      return;
    }

    const pastedValue = event.clipboardData.getData('text');
    event.preventDefault();
    setCharacterQuery(null);
    updateValueFromValueStr(pastedValue);
  });

  const handleFocus = useEventCallback(() => {
    if (focused || disabled || !domGetters.isReady()) {
      return;
    }

    const activeElement = getActiveElement(domGetters.getRoot());

    setFocused(true);

    const isFocusInsideASection = domGetters.getSectionIndexFromDOMElement(activeElement) != null;
    if (!isFocusInsideASection) {
      setSelectedSections(sectionOrder.startIndex);
    }
  });

  const handleBlur = useEventCallback(() => {
    setTimeout(() => {
      if (!domGetters.isReady()) {
        return;
      }

      const activeElement = getActiveElement(domGetters.getRoot());
      const shouldBlur = !domGetters.getRoot().contains(activeElement);
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
    tabIndex: internalPropsWithDefaults.disabled || parsedSelectedSections === 0 ? -1 : 0, // TODO: Try to set to undefined when there is a section selected.
  };
}

function getDeltaFromKeyCode(keyCode: Omit<AvailableAdjustKeyCode, 'Home' | 'End'>) {
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

function adjustSectionValue<TValue extends PickerValidValue>(
  adapter: MuiPickersAdapter,
  timezone: PickersTimezone,
  section: InferFieldSection<TValue>,
  keyCode: AvailableAdjustKeyCode,
  sectionsValueBoundaries: FieldSectionsValueBoundaries,
  localizedDigits: string[],
  activeDate: PickerValidDate | null,
  stepsAttributes?: { minutesStep?: number },
): string {
  const delta = getDeltaFromKeyCode(keyCode);
  const isStart = keyCode === 'Home';
  const isEnd = keyCode === 'End';

  const shouldSetAbsolute = section.value === '' || isStart || isEnd;

  const adjustDigitSection = () => {
    const sectionBoundaries = sectionsValueBoundaries[section.type]({
      currentDate: activeDate,
      format: section.format,
      contentType: section.contentType,
    });

    const getCleanValue = (value: number) =>
      cleanDigitSectionValue(adapter, value, sectionBoundaries, localizedDigits, section);

    const step =
      section.type === 'minutes' && stepsAttributes?.minutesStep ? stepsAttributes.minutesStep : 1;

    let newSectionValueNumber: number;

    if (shouldSetAbsolute) {
      if (section.type === 'year' && !isEnd && !isStart) {
        return adapter.formatByString(adapter.date(undefined, timezone), section.format);
      }

      if (delta > 0 || isStart) {
        newSectionValueNumber = sectionBoundaries.minimum;
      } else {
        newSectionValueNumber = sectionBoundaries.maximum;
      }
    } else {
      const currentSectionValue = parseInt(
        removeLocalizedDigits(section.value, localizedDigits),
        10,
      );
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
      return getCleanValue(
        sectionBoundaries.minimum +
          ((newSectionValueNumber - sectionBoundaries.maximum - 1) %
            (sectionBoundaries.maximum - sectionBoundaries.minimum + 1)),
      );
    }

    if (newSectionValueNumber < sectionBoundaries.minimum) {
      return getCleanValue(
        sectionBoundaries.maximum -
          ((sectionBoundaries.minimum - newSectionValueNumber - 1) %
            (sectionBoundaries.maximum - sectionBoundaries.minimum + 1)),
      );
    }

    return getCleanValue(newSectionValueNumber);
  };

  const adjustLetterSection = () => {
    const options = getLetterEditingOptions(adapter, timezone, section.type, section.format);
    if (options.length === 0) {
      return section.value;
    }

    if (shouldSetAbsolute) {
      if (delta > 0 || isStart) {
        return options[0];
      }

      return options[options.length - 1];
    }

    const currentOptionIndex = options.indexOf(section.value);
    const newOptionIndex = (currentOptionIndex + delta) % options.length;
    const clampedIndex = (newOptionIndex + options.length) % options.length;

    return options[clampedIndex];
  };

  if (section.contentType === 'digit' || section.contentType === 'digit-with-letter') {
    return adjustDigitSection();
  }

  return adjustLetterSection();
}

type AvailableAdjustKeyCode = 'ArrowUp' | 'ArrowDown' | 'PageUp' | 'PageDown' | 'Home' | 'End';

interface UseFieldRootPropsParameters {
  manager: PickerAnyManager;
  stateResponse: UseFieldStateReturnValue<any>;
  applyCharacterEditing: UseFieldCharacterEditingReturnValue;
  internalPropsWithDefaults: UseFieldInternalProps<any, any> & { minutesStep?: number };
  domGetters: UseFieldDOMGetters;
  focused: boolean;
  setFocused: (focused: boolean) => void;
}

interface UseFieldRootPropsReturnValue {
  onKeyDown: React.KeyboardEventHandler<HTMLDivElement>;
  onBlur: React.FocusEventHandler<HTMLDivElement>;
  onFocus: React.FocusEventHandler<HTMLDivElement>;
  onClick: React.MouseEventHandler<HTMLDivElement>;
  onPaste: React.ClipboardEventHandler<HTMLDivElement>;
  onInput: React.FormEventHandler<HTMLDivElement>;
  contentEditable: boolean;
  tabIndex: number;
}
