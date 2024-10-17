import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import useId from '@mui/utils/useId';
import {
  FieldSection,
  MuiPickersAdapter,
  PickerAnyAccessibleValueManagerV8,
  PickerManagerProperties,
  PickerValidDate,
} from '../../../models';
import {
  UseFieldAccessibleDOMGetters,
  UseFieldDOMInteractions,
  UseFieldInternalPropsFromManager,
} from './useField.types';
import { UseFieldStateReturnValue } from './useFieldState';
import { UseFieldCharacterEditingReturnValue } from './useFieldCharacterEditing';
import { useUtils } from '../useUtils';
import { usePickersTranslations } from '../../../hooks';

export const useFieldAccessibleSectionContentProps = <
  TManager extends PickerAnyAccessibleValueManagerV8,
>(
  parameters: UseFieldAccessibleSectionContentPropsParameters<TManager>,
) => {
  type ManagerProperties = PickerManagerProperties<TManager>;
  type TDate = ManagerProperties['date'];

  const utils = useUtils<TDate>();
  const translations = usePickersTranslations();
  const id = useId();

  const {
    stateResponse: {
      state,
      setSelectedSections,
      parsedSelectedSections,
      clearActiveSection,
      updateValueFromValueStr,
      updateSectionValue,
      sectionsValueBoundaries,
    },
    characterEditingResponse: { applyCharacterEditing, resetCharacterQuery },

    internalPropsWithDefaults: { disabled = false, readOnly = false },
    interactions,
    domGetters,
  } = parameters;

  /**
   * If a section content has been updated with a value we don't want to keep,
   * Then we need to imperatively revert it (we can't let React do it because the value did not change in his internal representation).
   */
  const revertDOMSectionChange = useEventCallback((sectionIndex: number) => {
    const section = state.sections[sectionIndex];

    domGetters.getSectionContent(sectionIndex).innerHTML = section.value || section.placeholder;
    interactions.syncSelectionToDOM();
  });

  const handleInput = useEventCallback((event: React.FormEvent<HTMLSpanElement>) => {
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

      resetCharacterQuery();
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
      resetCharacterQuery();
      updateSectionValue({
        activeSection,
        newSectionValue: pastedValue,
        shouldGoToNextSection: true,
      });
    }
    // If the pasted value corresponds to a single section, but not the expected type, we skip the modification
    else if (!lettersOnly && !digitsOnly) {
      resetCharacterQuery();
      updateValueFromValueStr(pastedValue);
    }
  });

  const handleDragOver = useEventCallback((event: React.DragEvent<HTMLSpanElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'none';
  });

  const handleMouseUp = useEventCallback((event: React.MouseEvent) => {
    // Without this, the browser will remove the selected when clicking inside an already-selected section.
    event.preventDefault();
  });

  const createHandleFocus = useEventCallback((sectionIndex: number) => () => {
    setSelectedSections(sectionIndex);
  });

  const isContainerEditable = parsedSelectedSections === 'all';
  return React.useCallback(
    (section: FieldSection, sectionIndex: number): React.HTMLAttributes<HTMLSpanElement> => {
      const isEditable = !isContainerEditable && !disabled && !readOnly;

      const sectionBoundaries = sectionsValueBoundaries[section.type]({
        currentDate: null,
        contentType: section.contentType,
        format: section.format,
      });

      return {
        // Event handlers
        onInput: handleInput,
        onPaste: handlePaste,
        onDragOver: handleDragOver,
        onMouseUp: handleMouseUp,
        onFocus: createHandleFocus(sectionIndex),

        // ARIA attributes
        role: 'spinbutton',
        id: `${id}-${section.type}`,
        'aria-labelledby': `${id}-${section.type}`,
        'aria-readonly': readOnly,
        'aria-valuenow': getAriaValueNowAttribute(section, utils),
        'aria-valuemin': sectionBoundaries.minimum,
        'aria-valuemax': sectionBoundaries.maximum,
        'aria-valuetext': section.value
          ? getAriaValueTextAttribute(section, utils)
          : translations.empty,
        'aria-label': translations[section.type],
        'aria-disabled': disabled,

        // Other
        tabIndex: isContainerEditable || sectionIndex > 0 ? -1 : 0,
        contentEditable: !isContainerEditable && !disabled && !readOnly,
        spellCheck: isEditable ? false : undefined,
        autoCapitalize: isEditable ? 'off' : undefined,
        autoCorrect: isEditable ? 'off' : undefined,
        [parseInt(React.version, 10) >= 17 ? 'enterKeyHint' : 'enterkeyhint']: isEditable
          ? 'next'
          : undefined,
        children: section.value || section.placeholder,
        inputMode: section.contentType === 'letter' ? 'text' : 'numeric',
      };
    },
    [
      handleInput,
      handlePaste,
      handleDragOver,
      handleMouseUp,
      createHandleFocus,
      disabled,
      readOnly,
      id,
      isContainerEditable,
      translations,
      sectionsValueBoundaries,
      utils,
    ],
  );
};

function getAriaValueNowAttribute<TDate extends PickerValidDate>(
  section: FieldSection,
  utils: MuiPickersAdapter<TDate>,
): number | undefined {
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
      const parsedDate = utils.parse(
        `01:00 ${section.value}`,
        `${utils.formats.hours12h}:${utils.formats.minutes} ${section.format}`,
      );
      if (parsedDate) {
        return utils.getHours(parsedDate) >= 12 ? 1 : 0;
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
      const parsedDate = utils.parse(section.value, section.format);
      return parsedDate ? utils.getMonth(parsedDate) + 1 : undefined;
    }
    default:
      return section.contentType !== 'letter' ? Number(section.value) : undefined;
  }
}

function getAriaValueTextAttribute<TDate extends PickerValidDate>(
  section: FieldSection,
  utils: MuiPickersAdapter<TDate>,
) {
  if (!section.value) {
    return undefined;
  }
  switch (section.type) {
    case 'month': {
      if (section.contentType === 'digit') {
        return utils.format(utils.setMonth(utils.date(), Number(section.value) - 1), 'month');
      }
      const parsedDate = utils.parse(section.value, section.format);
      return parsedDate ? utils.format(parsedDate, 'month') : undefined;
    }
    case 'day':
      return section.contentType === 'digit'
        ? utils.format(
            utils.setDate(utils.startOfYear(utils.date()), Number(section.value)),
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

interface UseFieldAccessibleSectionContentPropsParameters<
  TManager extends PickerAnyAccessibleValueManagerV8,
> {
  internalPropsWithDefaults: UseFieldInternalPropsFromManager<TManager>;
  stateResponse: UseFieldStateReturnValue<TManager>;
  characterEditingResponse: UseFieldCharacterEditingReturnValue;
  interactions: UseFieldDOMInteractions;
  domGetters: UseFieldAccessibleDOMGetters;
}
