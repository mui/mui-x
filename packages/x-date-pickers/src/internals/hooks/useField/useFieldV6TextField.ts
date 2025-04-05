import * as React from 'react';
import { useRtl } from '@mui/system/RtlProvider';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import useEventCallback from '@mui/utils/useEventCallback';
import useTimeout from '@mui/utils/useTimeout';
import useForkRef from '@mui/utils/useForkRef';
import { UseFieldParameters, UseFieldProps, UseFieldReturnValue } from './useField.types';
import { useSplitFieldProps } from '../../../hooks';
import { FieldSectionType, InferFieldSection } from '../../../models';
import { getActiveElement } from '../../utils/utils';
import { getSectionVisibleValue, isAndroid } from './useField.utils';
import { PickerValidValue } from '../../models';
import { useFieldCharacterEditing } from './useFieldCharacterEditing';
import { useFieldRootHandleKeyDown } from './useFieldRootHandleKeyDown';
import { useFieldState } from './useFieldState';
import { useFieldInternalPropsWithDefaults } from './useFieldInternalPropsWithDefaults';

const cleanString = (dirtyString: string) => dirtyString.replace(/[\u2066\u2067\u2068\u2069]/g, '');

export const addPositionPropertiesToSections = <TValue extends PickerValidValue>(
  sections: InferFieldSection<TValue>[],
  localizedDigits: string[],
  isRtl: boolean,
): FieldSectionWithPositions<TValue>[] => {
  let position = 0;
  let positionInInput = isRtl ? 1 : 0;
  const newSections: FieldSectionWithPositions<TValue>[] = [];

  for (let i = 0; i < sections.length; i += 1) {
    const section = sections[i];
    const renderedValue = getSectionVisibleValue(
      section,
      isRtl ? 'input-rtl' : 'input-ltr',
      localizedDigits,
    );
    const sectionStr = `${section.startSeparator}${renderedValue}${section.endSeparator}`;

    const sectionLength = cleanString(sectionStr).length;
    const sectionLengthInInput = sectionStr.length;

    // The ...InInput values consider the unicode characters but do include them in their indexes
    const cleanedValue = cleanString(renderedValue);
    const startInInput =
      positionInInput +
      (cleanedValue === '' ? 0 : renderedValue.indexOf(cleanedValue[0])) +
      section.startSeparator.length;
    const endInInput = startInInput + cleanedValue.length;

    newSections.push({
      ...section,
      start: position,
      end: position + sectionLength,
      startInInput,
      endInInput,
    });
    position += sectionLength;
    // Move position to the end of string associated to the current section
    positionInInput += sectionLengthInInput;
  }

  return newSections;
};

export const useFieldV6TextField = <
  TValue extends PickerValidValue,
  TError,
  TValidationProps extends {},
  TProps extends UseFieldProps<false>,
>(
  parameters: UseFieldParameters<TValue, false, TError, TValidationProps, TProps>,
): UseFieldReturnValue<false, TProps> => {
  const isRtl = useRtl();
  const focusTimeout = useTimeout();
  const selectionSyncTimeout = useTimeout();

  const {
    props,
    manager,
    skipContextFieldRefAssignment,
    manager: {
      valueType,
      internal_valueManager: valueManager,
      internal_fieldValueManager: fieldValueManager,
      internal_useOpenPickerButtonAriaLabel: useOpenPickerButtonAriaLabel,
    },
  } = parameters;

  const { internalProps, forwardedProps } = useSplitFieldProps(props, valueType);
  const internalPropsWithDefaults = useFieldInternalPropsWithDefaults({
    manager,
    internalProps,
    skipContextFieldRefAssignment,
  });

  const {
    onFocus,
    onClick,
    onPaste,
    onBlur,
    onKeyDown,
    onClear,
    clearable,
    inputRef: inputRefProp,
    placeholder: inPlaceholder,
  } = forwardedProps;

  const {
    readOnly = false,
    disabled = false,
    autoFocus = false,
    focused,
    unstableFieldRef,
  } = internalPropsWithDefaults;

  const inputRef = React.useRef<HTMLInputElement>(null);
  const handleRef = useForkRef(inputRefProp, inputRef);

  const stateResponse = useFieldState({ manager, internalPropsWithDefaults, forwardedProps });
  const {
    // States and derived states
    activeSectionIndex,
    areAllSectionsEmpty,
    error,
    localizedDigits,
    parsedSelectedSections,
    sectionOrder,
    state,
    value,

    // Methods to update the states
    clearValue,
    clearActiveSection,
    setCharacterQuery,
    setSelectedSections,
    setTempAndroidValueStr,
    updateSectionValue,
    updateValueFromValueStr,

    // Utilities methods
    getSectionsFromValue,
  } = stateResponse;

  const applyCharacterEditing = useFieldCharacterEditing({ stateResponse });
  const openPickerAriaLabel = useOpenPickerButtonAriaLabel(value);

  const sections = React.useMemo(
    () => addPositionPropertiesToSections(state.sections, localizedDigits, isRtl),
    [state.sections, localizedDigits, isRtl],
  );

  function syncSelectionFromDOM() {
    const browserStartIndex = inputRef.current!.selectionStart ?? 0;
    let nextSectionIndex: number;
    if (browserStartIndex <= sections[0].startInInput) {
      // Special case if browser index is in invisible characters at the beginning
      nextSectionIndex = 1;
    } else if (browserStartIndex >= sections[sections.length - 1].endInInput) {
      // If the click is after the last character of the input, then we want to select the 1st section.
      nextSectionIndex = 1;
    } else {
      nextSectionIndex = sections.findIndex(
        (section) => section.startInInput - section.startSeparator.length > browserStartIndex,
      );
    }
    const sectionIndex = nextSectionIndex === -1 ? sections.length - 1 : nextSectionIndex - 1;
    setSelectedSections(sectionIndex);
  }

  function focusField(newSelectedSection: number | FieldSectionType = 0) {
    if (getActiveElement(document) === inputRef.current) {
      return;
    }
    inputRef.current?.focus();
    setSelectedSections(newSelectedSection);
  }

  const handleInputFocus = useEventCallback((event: React.FocusEvent) => {
    onFocus?.(event);
    // The ref is guaranteed to be resolved at this point.
    const input = inputRef.current;

    focusTimeout.start(0, () => {
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
        Number(input.selectionEnd) - Number(input.selectionStart) === input.value.length
      ) {
        setSelectedSections('all');
      } else {
        syncSelectionFromDOM();
      }
    });
  });

  const handleInputClick = useEventCallback((event: React.MouseEvent, ...args) => {
    // The click event on the clear button would propagate to the input, trigger this handler and result in a wrong section selection.
    // We avoid this by checking if the call of `handleInputClick` is actually intended, or a side effect.
    if (event.isDefaultPrevented()) {
      return;
    }

    onClick?.(event, ...(args as []));
    syncSelectionFromDOM();
  });

  const handleInputPaste = useEventCallback((event: React.ClipboardEvent<HTMLInputElement>) => {
    onPaste?.(event);

    // prevent default to avoid the input `onChange` handler being called
    event.preventDefault();

    if (readOnly || disabled) {
      return;
    }

    const pastedValue = event.clipboardData.getData('text');
    if (typeof parsedSelectedSections === 'number') {
      const activeSection = state.sections[parsedSelectedSections];

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

  const handleContainerBlur = useEventCallback((event: React.FocusEvent) => {
    onBlur?.(event);
    setSelectedSections(null);
  });

  const handleInputChange = useEventCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (readOnly) {
      return;
    }

    const targetValue = event.target.value;
    if (targetValue === '') {
      clearValue();
      return;
    }

    const eventData = (event.nativeEvent as InputEvent).data;
    // Calling `.fill(04/11/2022)` in playwright will trigger a change event with the requested content to insert in `event.nativeEvent.data`
    // usual changes have only the currently typed character in the `event.nativeEvent.data`
    const shouldUseEventData = eventData && eventData.length > 1;
    const valueStr = shouldUseEventData ? eventData : targetValue;
    const cleanValueStr = cleanString(valueStr);

    if (parsedSelectedSections === 'all') {
      setSelectedSections(activeSectionIndex);
    }

    // If no section is selected or eventData should be used, we just try to parse the new value
    // This line is mostly triggered by imperative code / application tests.
    if (activeSectionIndex == null || shouldUseEventData) {
      updateValueFromValueStr(shouldUseEventData ? eventData : cleanValueStr);
      return;
    }

    let keyPressed: string;
    if (parsedSelectedSections === 'all' && cleanValueStr.length === 1) {
      keyPressed = cleanValueStr;
    } else {
      const prevValueStr = cleanString(
        fieldValueManager.getV6InputValueFromSections(sections, localizedDigits, isRtl),
      );

      let startOfDiffIndex = -1;
      let endOfDiffIndex = -1;
      for (let i = 0; i < prevValueStr.length; i += 1) {
        if (startOfDiffIndex === -1 && prevValueStr[i] !== cleanValueStr[i]) {
          startOfDiffIndex = i;
        }

        if (
          endOfDiffIndex === -1 &&
          prevValueStr[prevValueStr.length - i - 1] !== cleanValueStr[cleanValueStr.length - i - 1]
        ) {
          endOfDiffIndex = i;
        }
      }

      const activeSection = sections[activeSectionIndex];

      const hasDiffOutsideOfActiveSection =
        startOfDiffIndex < activeSection.start ||
        prevValueStr.length - endOfDiffIndex - 1 > activeSection.end;

      if (hasDiffOutsideOfActiveSection) {
        // TODO: Support if the new date is valid
        return;
      }

      // The active section being selected, the browser has replaced its value with the key pressed by the user.
      const activeSectionEndRelativeToNewValue =
        cleanValueStr.length -
        prevValueStr.length +
        activeSection.end -
        cleanString(activeSection.endSeparator || '').length;

      keyPressed = cleanValueStr.slice(
        activeSection.start + cleanString(activeSection.startSeparator || '').length,
        activeSectionEndRelativeToNewValue,
      );
    }

    if (keyPressed.length === 0) {
      if (isAndroid()) {
        setTempAndroidValueStr(valueStr);
      }
      clearActiveSection();

      return;
    }

    applyCharacterEditing({ keyPressed, sectionIndex: activeSectionIndex });
  });

  const handleClear = useEventCallback((event: React.MouseEvent, ...args) => {
    event.preventDefault();
    onClear?.(event, ...(args as []));
    clearValue();

    if (!isFieldFocused(inputRef)) {
      // setSelectedSections is called internally
      focusField(0);
    } else {
      setSelectedSections(sectionOrder.startIndex);
    }
  });

  const handleContainerKeyDown = useFieldRootHandleKeyDown({
    manager,
    internalPropsWithDefaults,
    stateResponse,
  });
  const wrappedHandleContainerKeyDown = useEventCallback(
    (event: React.KeyboardEvent<HTMLSpanElement>) => {
      onKeyDown?.(event);
      handleContainerKeyDown(event);
    },
  );

  const placeholder = React.useMemo(() => {
    if (inPlaceholder !== undefined) {
      return inPlaceholder;
    }

    return fieldValueManager.getV6InputValueFromSections(
      getSectionsFromValue(valueManager.emptyValue),
      localizedDigits,
      isRtl,
    );
  }, [
    inPlaceholder,
    fieldValueManager,
    getSectionsFromValue,
    valueManager.emptyValue,
    localizedDigits,
    isRtl,
  ]);

  const valueStr = React.useMemo(
    () =>
      state.tempValueStrAndroid ??
      fieldValueManager.getV6InputValueFromSections(state.sections, localizedDigits, isRtl),
    [state.sections, fieldValueManager, state.tempValueStrAndroid, localizedDigits, isRtl],
  );

  React.useEffect(() => {
    // Select all the sections when focused on mount (`autoFocus = true` on the input)
    if (inputRef.current && inputRef.current === getActiveElement(document)) {
      setSelectedSections('all');
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEnhancedEffect(() => {
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
      if (inputRef.current !== getActiveElement(document)) {
        return;
      }

      // Fix scroll jumping on iOS browser: https://github.com/mui/mui-x/issues/8321
      const currentScrollTop = inputRef.current.scrollTop;

      if (parsedSelectedSections === 'all') {
        inputRef.current.select();
      } else {
        const selectedSection = sections[parsedSelectedSections];
        const selectionStart =
          selectedSection.type === 'empty'
            ? selectedSection.startInInput - selectedSection.startSeparator.length
            : selectedSection.startInInput;
        const selectionEnd =
          selectedSection.type === 'empty'
            ? selectedSection.endInInput + selectedSection.endSeparator.length
            : selectedSection.endInInput;

        if (
          selectionStart !== inputRef.current.selectionStart ||
          selectionEnd !== inputRef.current.selectionEnd
        ) {
          if (inputRef.current === getActiveElement(document)) {
            inputRef.current.setSelectionRange(selectionStart, selectionEnd);
          }
        }
        selectionSyncTimeout.start(0, () => {
          // handle case when the selection is not updated correctly
          // could happen on Android
          if (
            inputRef.current &&
            inputRef.current === getActiveElement(document) &&
            // The section might loose all selection, where `selectionStart === selectionEnd`
            // https://github.com/mui/mui-x/pull/13652
            inputRef.current.selectionStart === inputRef.current.selectionEnd &&
            (inputRef.current.selectionStart !== selectionStart ||
              inputRef.current.selectionEnd !== selectionEnd)
          ) {
            syncSelectionToDOM();
          }
        });
      }

      // Even reading this variable seems to do the trick, but also setting it just to make use of it
      inputRef.current.scrollTop = currentScrollTop;
    }

    syncSelectionToDOM();
  });

  const inputMode = React.useMemo(() => {
    if (activeSectionIndex == null) {
      return 'text';
    }

    if (state.sections[activeSectionIndex].contentType === 'letter') {
      return 'text';
    }

    return 'numeric';
  }, [activeSectionIndex, state.sections]);

  const inputHasFocus = inputRef.current && inputRef.current === getActiveElement(document);
  const shouldShowPlaceholder = !inputHasFocus && areAllSectionsEmpty;

  React.useImperativeHandle(unstableFieldRef, () => ({
    getSections: () => state.sections,
    getActiveSectionIndex: () => {
      const browserStartIndex = inputRef.current!.selectionStart ?? 0;
      const browserEndIndex = inputRef.current!.selectionEnd ?? 0;
      if (browserStartIndex === 0 && browserEndIndex === 0) {
        return null;
      }

      const nextSectionIndex =
        browserStartIndex <= sections[0].startInInput
          ? 1 // Special case if browser index is in invisible characters at the beginning.
          : sections.findIndex(
              (section) => section.startInInput - section.startSeparator.length > browserStartIndex,
            );
      return nextSectionIndex === -1 ? sections.length - 1 : nextSectionIndex - 1;
    },
    setSelectedSections: (newSelectedSections) => setSelectedSections(newSelectedSections),
    focusField,
    isFieldFocused: () => isFieldFocused(inputRef),
  }));

  return {
    // Forwarded
    ...forwardedProps,
    error,
    clearable: Boolean(clearable && !areAllSectionsEmpty && !readOnly && !disabled),
    onBlur: handleContainerBlur,
    onClick: handleInputClick,
    onFocus: handleInputFocus,
    onPaste: handleInputPaste,
    onKeyDown: wrappedHandleContainerKeyDown,
    onClear: handleClear,
    inputRef: handleRef,

    // Additional
    enableAccessibleFieldDOMStructure: false,
    placeholder,
    inputMode,
    autoComplete: 'off',
    value: shouldShowPlaceholder ? '' : valueStr,
    onChange: handleInputChange,
    focused,
    disabled,
    readOnly,
    autoFocus,
    openPickerAriaLabel,
  };
};

function isFieldFocused(inputRef: React.RefObject<HTMLInputElement | null>) {
  return inputRef.current === getActiveElement(document);
}

type FieldSectionWithPositions<TValue extends PickerValidValue> = InferFieldSection<TValue> & {
  /**
   * Start index of the section in the format
   */
  start: number;
  /**
   * End index of the section in the format
   */
  end: number;
  /**
   * Start index of the section value in the input.
   * Takes into account invisible unicode characters such as \u2069 but does not include them
   */
  startInInput: number;
  /**
   * End index of the section value in the input.
   * Takes into account invisible unicode characters such as \u2069 but does not include them
   */
  endInInput: number;
};
