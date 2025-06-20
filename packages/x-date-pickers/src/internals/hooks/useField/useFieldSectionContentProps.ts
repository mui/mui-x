import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import useId from '@mui/utils/useId';
import { UseFieldStateReturnValue } from './useFieldState';
import { FieldSection, MuiPickersAdapter, PickerManager } from '../../../models';
import { UseFieldDOMGetters, UseFieldInternalProps } from './useField.types';
import { usePickerAdapter, usePickerTranslations } from '../../../hooks';
import { syncSelectionToDOM } from './syncSelectionToDOM';
import { UseFieldCharacterEditingReturnValue } from './useFieldCharacterEditing';
import { FieldRangeSection } from '../../models';
import { PickersSectionElement } from '../../../PickersSectionList';

/**
 * Generate the props to pass to the content element of each section of the field.
 * It is not used by the non-accessible DOM structure (with an <input /> element for editing).
 * It should be used in the MUI accessible DOM structure and the Base UI implementation.
 * @param {UseFieldRootPropsParameters} parameters The parameters of the hook.
 * @returns {UseFieldRootPropsReturnValue} The props to forward to the content element of each section of the field.
 */
export function useFieldSectionContentProps(
  parameters: UseFieldSectionContentPropsParameters,
): UseFieldSectionContentPropsReturnValue {
  const adapter = usePickerAdapter();
  const translations = usePickerTranslations();
  const id = useId();

  const {
    focused,
    domGetters,
    stateResponse,
    applyCharacterEditing,
    manager: { internal_fieldValueManager: fieldValueManager },
    stateResponse: {
      // States and derived states
      parsedSelectedSections,
      sectionsValueBoundaries,
      state,
      value,

      // Methods to update the states
      clearActiveSection,
      setCharacterQuery,
      setSelectedSections,
      updateSectionValue,
      updateValueFromValueStr,
    },
    internalPropsWithDefaults: { disabled = false, readOnly = false },
  } = parameters;

  const isContainerEditable = parsedSelectedSections === 'all';
  const isEditable = !isContainerEditable && !disabled && !readOnly;

  /**
   * If a section content has been updated with a value we don't want to keep,
   * Then we need to imperatively revert it (we can't let React do it because the value did not change in his internal representation).
   */
  const revertDOMSectionChange = useEventCallback((sectionIndex: number) => {
    if (!domGetters.isReady()) {
      return;
    }

    const section = state.sections[sectionIndex];

    domGetters.getSectionContent(sectionIndex).innerHTML = section.value || section.placeholder;
    syncSelectionToDOM({ focused, domGetters, stateResponse });
  });

  const handleInput = useEventCallback((event: React.FormEvent<HTMLSpanElement>) => {
    if (!domGetters.isReady()) {
      return;
    }

    const target = event.target as HTMLSpanElement;
    const keyPressed = target.textContent ?? '';
    const sectionIndex = domGetters.getSectionIndexFromDOMElement(target)!;
    const section = state.sections[sectionIndex];

    if (readOnly) {
      revertDOMSectionChange(sectionIndex);
      return;
    }

    if (keyPressed.length === 0) {
      if (section.value === '') {
        revertDOMSectionChange(sectionIndex);
        return;
      }

      const inputType = (event.nativeEvent as InputEvent).inputType;
      if (inputType === 'insertParagraph' || inputType === 'insertLineBreak') {
        revertDOMSectionChange(sectionIndex);
        return;
      }

      revertDOMSectionChange(sectionIndex);
      clearActiveSection();
      return;
    }

    applyCharacterEditing({
      keyPressed,
      sectionIndex,
    });

    // The DOM value needs to remain the one React is expecting.
    revertDOMSectionChange(sectionIndex);
  });

  const handleMouseUp = useEventCallback((event: React.MouseEvent) => {
    // Without this, the browser will remove the selected when clicking inside an already-selected section.
    event.preventDefault();
  });

  const handlePaste = useEventCallback((event: React.ClipboardEvent<HTMLSpanElement>) => {
    // prevent default to avoid the input `onInput` handler being called
    event.preventDefault();

    if (readOnly || disabled || typeof parsedSelectedSections !== 'number') {
      return;
    }

    const activeSection = state.sections[parsedSelectedSections];
    const pastedValue = event.clipboardData.getData('text');
    const lettersOnly = /^[a-zA-Z]+$/.test(pastedValue);
    const digitsOnly = /^[0-9]+$/.test(pastedValue);
    const digitsAndLetterOnly = /^(([a-zA-Z]+)|)([0-9]+)(([a-zA-Z]+)|)$/.test(pastedValue);
    const isValidPastedValue =
      (activeSection.contentType === 'letter' && lettersOnly) ||
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

  const handleDragOver = useEventCallback((event: React.DragEvent<HTMLSpanElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'none';
  });

  const createFocusHandler = React.useCallback(
    (sectionIndex: number) => () => {
      if (disabled) {
        return;
      }
      setSelectedSections(sectionIndex);
    },
    [disabled, setSelectedSections],
  );

  return React.useCallback(
    (section, sectionIndex) => {
      const sectionBoundaries = sectionsValueBoundaries[section.type]({
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
        'aria-labelledby': `${id}-${section.type}`,
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
        id: `${id}-${section.type}`,
        'data-range-position': (section as FieldRangeSection).dateName || undefined,
        spellCheck: isEditable ? false : undefined,
        autoCapitalize: isEditable ? 'off' : undefined,
        autoCorrect: isEditable ? 'off' : undefined,
        children: section.value || section.placeholder,
        inputMode: section.contentType === 'letter' ? 'text' : 'numeric',
      };
    },
    [
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
    ],
  );
}

interface UseFieldSectionContentPropsParameters {
  manager: PickerManager<any, any, any, any, any>;
  stateResponse: UseFieldStateReturnValue<any>;
  applyCharacterEditing: UseFieldCharacterEditingReturnValue;
  internalPropsWithDefaults: UseFieldInternalProps<any, any, any>;
  domGetters: UseFieldDOMGetters;
  focused: boolean;
}

type UseFieldSectionContentPropsReturnValue = (
  section: FieldSection,
  sectionIndex: number,
) => PickersSectionElement['content'];

function getSectionValueText(
  section: FieldSection,
  adapter: MuiPickersAdapter,
): string | undefined {
  if (!section.value) {
    return undefined;
  }
  switch (section.type) {
    case 'month': {
      if (section.contentType === 'digit') {
        return adapter.format(adapter.setMonth(adapter.date(), Number(section.value) - 1), 'month');
      }
      const parsedDate = adapter.parse(section.value, section.format);
      return parsedDate ? adapter.format(parsedDate, 'month') : undefined;
    }
    case 'day':
      return section.contentType === 'digit'
        ? adapter.format(
            adapter.setDate(adapter.startOfYear(adapter.date()), Number(section.value)),
            'dayOfMonthFull',
          )
        : section.value;
    case 'weekDay':
      // TODO: improve by providing the label of the week day
      return undefined;
    default:
      return undefined;
  }
}

function getSectionValueNow(section: FieldSection, adapter: MuiPickersAdapter): number | undefined {
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
      const parsedDate = adapter.parse(
        `01:00 ${section.value}`,
        `${adapter.formats.hours12h}:${adapter.formats.minutes} ${section.format}`,
      );
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
      const parsedDate = adapter.parse(section.value, section.format);
      return parsedDate ? adapter.getMonth(parsedDate) + 1 : undefined;
    }
    default:
      return section.contentType !== 'letter' ? Number(section.value) : undefined;
  }
}
