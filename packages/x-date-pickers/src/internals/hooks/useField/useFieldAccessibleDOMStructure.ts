import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import useForkRef from '@mui/utils/useForkRef';
import useId from '@mui/utils/useId';
import { getSectionValueNow, getSectionValueText } from './useField.utils';
import {
  UseFieldInternalProps,
  UseFieldWithKnownDOMStructure,
  UseFieldAccessibleAdditionalProps,
  UseFieldAccessibleForwardedProps,
  UseFieldAccessibleDOMGetters,
} from './useField.types';
import { PickersSectionElement } from '../../../PickersSectionList';
import { usePickersTranslations } from '../../../hooks/usePickersTranslations';
import { useUtils } from '../useUtils';
import { useFieldClearValue } from './useFieldClearValue';
import { useValidation } from '../../../validation';
import { FieldSection, InferError, PickerValidDate } from '../../../models';
import { useFieldState } from './useFieldState';
import { useFieldCharacterEditing } from './useFieldCharacterEditing';
import { useFieldAccessibleDOMInteractions } from './useFieldAccessibleDOMInteractions';
import { useFieldAccessibleContainerEventHandlers } from './useFieldAccessibleContainerEventHandlers';

export const useFieldAccessibleDOMStructure: UseFieldWithKnownDOMStructure<true> = <
  TValue,
  TDate extends PickerValidDate,
  TSection extends FieldSection,
  TInternalProps extends UseFieldInternalProps<any, any, any, true, any> & {
    minutesStep?: number;
  },
>(
  params,
) => {
  const {
    internalProps,
    internalProps: { disabled, readOnly = false },
    forwardedProps,
    forwardedProps: {
      sectionListRef: sectionListRefProp,
      error: errorProp,
      focused: focusedProp,
      autoFocus = false,
    },
    valueManager,
    fieldValueManager,
    validator,
  } = params;

  const translations = usePickersTranslations();
  const utils = useUtils<TDate>();
  const id = useId();

  const [focused, setFocused] = React.useState(false);

  const stateResponse = useFieldState<TValue, TDate, TSection, true, InferError<TInternalProps>>(
    params,
  );
  const {
    parsedSelectedSections,
    activeSectionIndex,
    state,
    updateSectionValue,
    updateValueFromValueStr,
    clearActiveSection,
    setSelectedSections,
    sectionsValueBoundaries,
    timezone,
  } = stateResponse;

  const characterEditingResponse = useFieldCharacterEditing<TValue, TDate, TSection>({
    stateResponse,
  });
  const { applyCharacterEditing, resetCharacterQuery } = characterEditingResponse;

  // TODO: Add methods to parameters to access those elements instead of using refs
  const sectionListRef = React.useRef<UseFieldAccessibleDOMGetters>(null);
  const handleSectionListRef = useForkRef(sectionListRefProp, sectionListRef);
  const domGetters: UseFieldAccessibleDOMGetters = {
    getRoot: () => sectionListRef.current!.getRoot(),
    getSectionContainer: (sectionIndex: number) =>
      sectionListRef.current!.getSectionContainer(sectionIndex),
    getSectionContent: (sectionIndex: number) =>
      sectionListRef.current!.getSectionContent(sectionIndex),
    getSectionIndexFromDOMElement: (element: Element | null | undefined) =>
      sectionListRef.current!.getSectionIndexFromDOMElement(element),
  };

  const interactions = useFieldAccessibleDOMInteractions({
    forwardedProps,
    internalProps,
    stateResponse,
    focused,
    setFocused,
    domGetters,
  });

  const areAllSectionsEmpty = valueManager.areValuesEqual(
    utils,
    state.value,
    valueManager.emptyValue,
  );

  /**
   * If a section content has been updated with a value we don't want to keep,
   * Then we need to imperatively revert it (we can't let React do it because the value did not change in his internal representation).
   */
  const revertDOMSectionChange = useEventCallback((sectionIndex: number) => {
    if (!sectionListRef.current) {
      return;
    }

    const section = state.sections[sectionIndex];

    sectionListRef.current.getSectionContent(sectionIndex).innerHTML =
      section.value || section.placeholder;
    interactions.syncSelectionToDOM();
  });

  const getInputContainerClickHandler = useEventCallback(
    (sectionIndex: number) => (event: React.MouseEvent<HTMLDivElement>) => {
      // The click event on the clear button would propagate to the input, trigger this handler and result in a wrong section selection.
      // We avoid this by checking if the call to this function is actually intended, or a side effect.
      if (event.isDefaultPrevented()) {
        return;
      }

      setSelectedSections(sectionIndex);
    },
  );

  const handleInputContentMouseUp = useEventCallback((event: React.MouseEvent) => {
    // Without this, the browser will remove the selected when clicking inside an already-selected section.
    event.preventDefault();
  });

  const getInputContentFocusHandler = useEventCallback((sectionIndex: number) => () => {
    setSelectedSections(sectionIndex);
  });

  const handleInputContentPaste = useEventCallback(
    (event: React.ClipboardEvent<HTMLSpanElement>) => {
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
    },
  );

  const handleInputContentDragOver = useEventCallback((event: React.DragEvent<HTMLSpanElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'none';
  });

  const handleInputContentInput = useEventCallback((event: React.FormEvent<HTMLSpanElement>) => {
    if (!sectionListRef.current) {
      return;
    }

    const target = event.target as HTMLSpanElement;
    const keyPressed = target.textContent ?? '';
    const sectionIndex = sectionListRef.current.getSectionIndexFromDOMElement(target)!;
    const section = state.sections[sectionIndex];

    if (readOnly || !sectionListRef.current) {
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

  useEnhancedEffect(() => {
    if (!focused || !sectionListRef.current) {
      return;
    }

    if (parsedSelectedSections === 'all') {
      sectionListRef.current.getRoot().focus();
    } else if (typeof parsedSelectedSections === 'number') {
      const domElement = sectionListRef.current.getSectionContent(parsedSelectedSections);
      if (domElement) {
        domElement.focus();
      }
    }
  }, [parsedSelectedSections, focused, sectionListRef]);

  const isContainerEditable = parsedSelectedSections === 'all';
  const elements = React.useMemo<PickersSectionElement[]>(() => {
    return state.sections.map((section, index) => {
      const isEditable = !isContainerEditable && !disabled && !readOnly;

      const sectionBoundaries = sectionsValueBoundaries[section.type]({
        currentDate: null,
        contentType: section.contentType,
        format: section.format,
      });

      return {
        container: {
          'data-sectionindex': index,
          onClick: getInputContainerClickHandler(index),
        } as React.HTMLAttributes<HTMLSpanElement>,
        content: {
          tabIndex: isContainerEditable || index > 0 ? -1 : 0,
          contentEditable: !isContainerEditable && !disabled && !readOnly,
          role: 'spinbutton',
          id: `${id}-${section.type}`,
          'aria-labelledby': `${id}-${section.type}`,
          'aria-readonly': readOnly,
          'aria-valuenow': getSectionValueNow(section, utils),
          'aria-valuemin': sectionBoundaries.minimum,
          'aria-valuemax': sectionBoundaries.maximum,
          'aria-valuetext': section.value
            ? getSectionValueText(section, utils)
            : translations.empty,
          'aria-label': translations[section.type],
          'aria-disabled': disabled,
          spellCheck: isEditable ? false : undefined,
          autoCapitalize: isEditable ? 'off' : undefined,
          autoCorrect: isEditable ? 'off' : undefined,
          [parseInt(React.version, 10) >= 17 ? 'enterKeyHint' : 'enterkeyhint']: isEditable
            ? 'next'
            : undefined,
          children: section.value || section.placeholder,
          onInput: handleInputContentInput,
          onPaste: handleInputContentPaste,
          onFocus: getInputContentFocusHandler(index),
          onDragOver: handleInputContentDragOver,
          onMouseUp: handleInputContentMouseUp,
          inputMode: section.contentType === 'letter' ? 'text' : 'numeric',
        },
        before: {
          children: section.startSeparator,
        },
        after: {
          children: section.endSeparator,
        },
      };
    });
  }, [
    state.sections,
    getInputContentFocusHandler,
    handleInputContentPaste,
    handleInputContentDragOver,
    handleInputContentInput,
    getInputContainerClickHandler,
    handleInputContentMouseUp,
    disabled,
    readOnly,
    isContainerEditable,
    translations,
    utils,
    id,
    sectionsValueBoundaries,
  ]);

  const handleValueStrChange = useEventCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    updateValueFromValueStr(event.target.value);
  });

  const valueStr = React.useMemo(
    () =>
      areAllSectionsEmpty
        ? ''
        : fieldValueManager.getV7HiddenInputValueFromSections(state.sections),
    [areAllSectionsEmpty, state.sections, fieldValueManager],
  );

  React.useEffect(() => {
    if (sectionListRef.current == null) {
      throw new Error(
        [
          'MUI X: The `sectionListRef` prop has not been initialized by `PickersSectionList`',
          'You probably tried to pass a component to the `textField` slot that contains an `<input />` element instead of a `PickersSectionList`.',
          '',
          'If you want to keep using an `<input />` HTML element for the editing, please remove the `enableAccessibleFieldDOMStructure` prop from your picker or field component:',
          '',
          '<DatePicker slots={{ textField: MyCustomTextField }} />',
          '',
          'Learn more about the field accessible DOM structure on the MUI documentation: https://mui.com/x/react-date-pickers/fields/#fields-to-edit-a-single-element',
        ].join('\n'),
      );
    }

    if (autoFocus && sectionListRef.current) {
      sectionListRef.current.getSectionContent(0).focus();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const containerEventHandlers = useFieldAccessibleContainerEventHandlers({
    fieldValueManager,
    internalProps,
    forwardedProps,
    stateResponse,
    characterEditingResponse,
    interactions,
    domGetters,
    focused,
    setFocused,
  });

  const { onClear, clearable } = useFieldClearValue({
    internalProps,
    forwardedProps,
    stateResponse,
    areAllSectionsEmpty,
    interactions,
  });

  const { hasValidationError } = useValidation({
    props: internalProps,
    validator,
    timezone,
    value: state.value,
    onError: internalProps.onError,
  });

  const error = React.useMemo(() => {
    // only override when `error` is undefined.
    // in case of multi input fields, the `error` value is provided externally and will always be defined.
    if (errorProp !== undefined) {
      return errorProp;
    }

    return hasValidationError;
  }, [hasValidationError, errorProp]);

  useEnhancedEffect(() => {
    interactions.syncSelectionToDOM();
  });

  React.useEffect(() => {
    if (!error && activeSectionIndex == null) {
      resetCharacterQuery();
    }
  }, [state.referenceValue, activeSectionIndex, error]); // eslint-disable-line react-hooks/exhaustive-deps

  const forwardedPropsWithDefault: Required<UseFieldAccessibleForwardedProps> = {
    focused: focusedProp ?? focused,
    autoFocus,
    onClear,
    clearable,
    error,
    sectionListRef: handleSectionListRef,
    ...containerEventHandlers,
  };

  const additionalProps: UseFieldAccessibleAdditionalProps = {
    enableAccessibleFieldDOMStructure: true,
    elements,
    // TODO v7: Try to set to undefined when there is a section selected.
    tabIndex: parsedSelectedSections === 0 ? -1 : 0,
    contentEditable: isContainerEditable,
    value: valueStr,
    onChange: handleValueStrChange,
    areAllSectionsEmpty,
    disabled,
    readOnly,
  };

  return {
    ...forwardedProps,
    ...forwardedPropsWithDefault,
    ...additionalProps,
  };
};
