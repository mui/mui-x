import * as React from 'react';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import useEventCallback from '@mui/utils/useEventCallback';
import useForkRef from '@mui/utils/useForkRef';
import { useTheme } from '@mui/material/styles';
import { useValidation } from '../useValidation';
import { useUtils } from '../useUtils';
import {
  UseFieldParams,
  UseFieldResponse,
  UseFieldForwardedProps,
  UseFieldInternalProps,
  AvailableAdjustKeyCode,
} from './useField.types';
import { adjustSectionValue, isAndroid, cleanString, getSectionOrder } from './useField.utils';
import { useFieldState } from './useFieldState';
import { useFieldCharacterEditing } from './useFieldCharacterEditing';
import { getActiveElement } from '../../utils/utils';
import { FieldSection } from '../../../models';

export const useField = <
  TValue,
  TDate,
  TSection extends FieldSection,
  TForwardedProps extends UseFieldForwardedProps,
  TInternalProps extends UseFieldInternalProps<any, any, any, any> & { minutesStep?: number },
>(
  params: UseFieldParams<TValue, TDate, TSection, TForwardedProps, TInternalProps>,
): UseFieldResponse<TForwardedProps> => {
  const utils = useUtils<TDate>();

  const {
    state,
    selectedSectionIndexes,
    setSelectedSections,
    clearValue,
    clearActiveSection,
    updateSectionValue,
    updateValueFromValueStr,
    setTempAndroidValueStr,
    sectionsValueBoundaries,
    placeholder,
    timezone,
  } = useFieldState(params);

  const {
    inputRef: inputRefProp,
    internalProps,
    internalProps: { readOnly = false, unstableFieldRef, minutesStep },
    forwardedProps: {
      onClick,
      onKeyDown,
      onFocus,
      onBlur,
      onMouseUp,
      onPaste,
      error,
      ...otherForwardedProps
    },
    fieldValueManager,
    valueManager,
    validator,
  } = params;

  const { applyCharacterEditing, resetCharacterQuery } = useFieldCharacterEditing<TDate, TSection>({
    sections: state.sections,
    updateSectionValue,
    sectionsValueBoundaries,
    setTempAndroidValueStr,
    timezone,
  });

  const inputRef = React.useRef<HTMLInputElement>(null);
  const handleRef = useForkRef(inputRefProp, inputRef);
  const focusTimeoutRef = React.useRef<NodeJS.Timeout | undefined>(undefined);
  const theme = useTheme();
  const isRTL = theme.direction === 'rtl';

  const sectionOrder = React.useMemo(
    () => getSectionOrder(state.sections, isRTL),
    [state.sections, isRTL],
  );

  const syncSelectionFromDOM = () => {
    if (readOnly) {
      setSelectedSections(null);
      return;
    }
    const browserStartIndex = inputRef.current!.selectionStart ?? 0;
    let nextSectionIndex: number;
    if (browserStartIndex <= state.sections[0].startInInput) {
      // Special case if browser index is in invisible characters at the beginning
      nextSectionIndex = 1;
    } else if (browserStartIndex >= state.sections[state.sections.length - 1].endInInput) {
      // If the click is after the last character of the input, then we want to select the 1st section.
      nextSectionIndex = 1;
    } else {
      nextSectionIndex = state.sections.findIndex(
        (section) => section.startInInput - section.startSeparator.length > browserStartIndex,
      );
    }
    const sectionIndex = nextSectionIndex === -1 ? state.sections.length - 1 : nextSectionIndex - 1;

    setSelectedSections(sectionIndex);
  };

  const handleInputClick = useEventCallback((...args) => {
    onClick?.(...(args as []));
    syncSelectionFromDOM();
  });

  const handleInputMouseUp = useEventCallback((event: React.MouseEvent) => {
    onMouseUp?.(event);

    // Without this, the browser will remove the selected when clicking inside an already-selected section.
    event.preventDefault();
  });

  const handleInputFocus = useEventCallback((...args) => {
    onFocus?.(...(args as []));
    // The ref is guaranteed to be resolved at this point.
    const input = inputRef.current;

    window.clearTimeout(focusTimeoutRef.current);
    focusTimeoutRef.current = setTimeout(() => {
      // The ref changed, the component got remounted, the focus event is no longer relevant.
      if (!input || input !== inputRef.current) {
        return;
      }

      if (selectedSectionIndexes != null || readOnly) {
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

  const handleInputBlur = useEventCallback((...args) => {
    onBlur?.(...(args as []));
    setSelectedSections(null);
  });

  const handleInputPaste = useEventCallback((event: React.ClipboardEvent<HTMLInputElement>) => {
    onPaste?.(event);

    if (readOnly) {
      event.preventDefault();
      return;
    }

    const pastedValue = event.clipboardData.getData('text');
    if (
      selectedSectionIndexes &&
      selectedSectionIndexes.startIndex === selectedSectionIndexes.endIndex
    ) {
      const activeSection = state.sections[selectedSectionIndexes.startIndex];

      const lettersOnly = /^[a-zA-Z]+$/.test(pastedValue);
      const digitsOnly = /^[0-9]+$/.test(pastedValue);
      const digitsAndLetterOnly = /^(([a-zA-Z]+)|)([0-9]+)(([a-zA-Z]+)|)$/.test(pastedValue);
      const isValidPastedValue =
        (activeSection.contentType === 'letter' && lettersOnly) ||
        (activeSection.contentType === 'digit' && digitsOnly) ||
        (activeSection.contentType === 'digit-with-letter' && digitsAndLetterOnly);
      if (isValidPastedValue) {
        // Early return to let the paste update section, value
        return;
      }
      if (lettersOnly || digitsOnly) {
        // The pasted value correspond to a single section but not the expected type
        // skip the modification
        event.preventDefault();
        return;
      }
    }

    event.preventDefault();
    resetCharacterQuery();
    updateValueFromValueStr(pastedValue);
  });

  const handleInputChange = useEventCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (readOnly) {
      return;
    }

    const targetValue = event.target.value;
    const eventData = (event.nativeEvent as InputEvent).data;
    // Calling `.fill(04/11/2022)` in playwright will trigger a change event with the requested content to insert in `event.nativeEvent.data`
    // usual changes have only the currently typed character in the `event.nativeEvent.data`
    const shouldUseEventData = eventData && eventData.length > 1;
    const valueStr = shouldUseEventData ? eventData : targetValue;
    const cleanValueStr = cleanString(valueStr);

    // If no section is selected or eventData should be used, we just try to parse the new value
    // This line is mostly triggered by imperative code / application tests.
    if (selectedSectionIndexes == null || shouldUseEventData) {
      updateValueFromValueStr(shouldUseEventData ? eventData : cleanValueStr);
      return;
    }

    let keyPressed: string;
    if (
      selectedSectionIndexes.startIndex === 0 &&
      selectedSectionIndexes.endIndex === state.sections.length - 1 &&
      cleanValueStr.length === 1
    ) {
      keyPressed = cleanValueStr;
    } else {
      const prevValueStr = cleanString(
        fieldValueManager.getValueStrFromSections(state.sections, isRTL),
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

      const activeSection = state.sections[selectedSectionIndexes.startIndex];

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

    if (isAndroid() && keyPressed.length === 0) {
      setTempAndroidValueStr(valueStr);
      return;
    }

    applyCharacterEditing({ keyPressed, sectionIndex: selectedSectionIndexes.startIndex });
  });

  const handleInputKeyDown = useEventCallback((event: React.KeyboardEvent) => {
    onKeyDown?.(event);

    // eslint-disable-next-line default-case
    switch (true) {
      // Select all
      case event.key === 'a' && (event.ctrlKey || event.metaKey): {
        // prevent default to make sure that the next line "select all" while updating
        // the internal state at the same time.
        event.preventDefault();
        setSelectedSections('all');
        break;
      }

      // Move selection to next section
      case event.key === 'ArrowRight': {
        event.preventDefault();

        if (selectedSectionIndexes == null) {
          setSelectedSections(sectionOrder.startIndex);
        } else if (selectedSectionIndexes.startIndex !== selectedSectionIndexes.endIndex) {
          setSelectedSections(selectedSectionIndexes.endIndex);
        } else {
          const nextSectionIndex =
            sectionOrder.neighbors[selectedSectionIndexes.startIndex].rightIndex;
          if (nextSectionIndex !== null) {
            setSelectedSections(nextSectionIndex);
          }
        }
        break;
      }

      // Move selection to previous section
      case event.key === 'ArrowLeft': {
        event.preventDefault();

        if (selectedSectionIndexes == null) {
          setSelectedSections(sectionOrder.endIndex);
        } else if (selectedSectionIndexes.startIndex !== selectedSectionIndexes.endIndex) {
          setSelectedSections(selectedSectionIndexes.startIndex);
        } else {
          const nextSectionIndex =
            sectionOrder.neighbors[selectedSectionIndexes.startIndex].leftIndex;
          if (nextSectionIndex !== null) {
            setSelectedSections(nextSectionIndex);
          }
        }
        break;
      }

      // Reset the value of the selected section
      case ['Backspace', 'Delete'].includes(event.key): {
        event.preventDefault();

        if (readOnly) {
          break;
        }

        if (
          selectedSectionIndexes == null ||
          (selectedSectionIndexes.startIndex === 0 &&
            selectedSectionIndexes.endIndex === state.sections.length - 1)
        ) {
          clearValue();
        } else {
          clearActiveSection();
        }
        resetCharacterQuery();
        break;
      }

      // Increment / decrement the selected section value
      case ['ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown'].includes(event.key): {
        event.preventDefault();

        if (readOnly || selectedSectionIndexes == null) {
          break;
        }

        const activeSection = state.sections[selectedSectionIndexes.startIndex];
        const activeDateManager = fieldValueManager.getActiveDateManager(
          utils,
          state,
          activeSection,
        );

        const newSectionValue = adjustSectionValue(
          utils,
          timezone,
          activeSection,
          event.key as AvailableAdjustKeyCode,
          sectionsValueBoundaries,
          activeDateManager.date,
          { minutesStep },
        );

        updateSectionValue({
          activeSection,
          newSectionValue,
          shouldGoToNextSection: false,
        });
        break;
      }
    }
  });

  useEnhancedEffect(() => {
    if (!inputRef.current) {
      return;
    }
    if (selectedSectionIndexes == null) {
      if (inputRef.current.scrollLeft) {
        // Ensure that input content is not marked as selected.
        // setting selection range to 0 causes issues in Safari.
        // https://bugs.webkit.org/show_bug.cgi?id=224425
        inputRef.current.scrollLeft = 0;
      }
      return;
    }

    const firstSelectedSection = state.sections[selectedSectionIndexes.startIndex];
    const lastSelectedSection = state.sections[selectedSectionIndexes.endIndex];
    let selectionStart = firstSelectedSection.startInInput;
    let selectionEnd = lastSelectedSection.endInInput;

    if (selectedSectionIndexes.shouldSelectBoundarySelectors) {
      selectionStart -= firstSelectedSection.startSeparator.length;
      selectionEnd += lastSelectedSection.endSeparator.length;
    }

    if (
      selectionStart !== inputRef.current.selectionStart ||
      selectionEnd !== inputRef.current.selectionEnd
    ) {
      // Fix scroll jumping on iOS browser: https://github.com/mui/mui-x/issues/8321
      const currentScrollTop = inputRef.current.scrollTop;
      // On multi input range pickers we want to update selection range only for the active input
      // This helps avoiding the focus jumping on Safari https://github.com/mui/mui-x/issues/9003
      // because WebKit implements the `setSelectionRange` based on the spec: https://bugs.webkit.org/show_bug.cgi?id=224425
      if (inputRef.current === getActiveElement(document)) {
        inputRef.current.setSelectionRange(selectionStart, selectionEnd);
      }
      // Even reading this variable seems to do the trick, but also setting it just to make use of it
      inputRef.current.scrollTop = currentScrollTop;
    }
  });

  const validationError = useValidation(
    { ...internalProps, value: state.value, timezone },
    validator,
    valueManager.isSameError,
    valueManager.defaultErrorState,
  );

  const inputError = React.useMemo(() => {
    // only override when `error` is undefined.
    // in case of multi input fields, the `error` value is provided externally and will always be defined.
    if (error !== undefined) {
      return error;
    }

    return valueManager.hasError(validationError);
  }, [valueManager, validationError, error]);

  React.useEffect(() => {
    if (!inputError && !selectedSectionIndexes) {
      resetCharacterQuery();
    }
  }, [state.referenceValue, selectedSectionIndexes, inputError]); // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    // Select the right section when focused on mount (`autoFocus = true` on the input)
    if (inputRef.current && inputRef.current === document.activeElement) {
      setSelectedSections('all');
    }

    return () => window.clearTimeout(focusTimeoutRef.current);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // If `state.tempValueStrAndroid` is still defined when running `useEffect`,
  // Then `onChange` has only been called once, which means the user pressed `Backspace` to reset the section.
  // This causes a small flickering on Android,
  // But we can't use `useEnhancedEffect` which is always called before the second `onChange` call and then would cause false positives.
  React.useEffect(() => {
    if (state.tempValueStrAndroid != null && selectedSectionIndexes != null) {
      resetCharacterQuery();
      clearActiveSection();
    }
  }, [state.tempValueStrAndroid]); // eslint-disable-line react-hooks/exhaustive-deps

  const valueStr = React.useMemo(
    () =>
      state.tempValueStrAndroid ?? fieldValueManager.getValueStrFromSections(state.sections, isRTL),
    [state.sections, fieldValueManager, state.tempValueStrAndroid, isRTL],
  );

  const inputMode = React.useMemo(() => {
    if (selectedSectionIndexes == null) {
      return 'text';
    }

    if (state.sections[selectedSectionIndexes.startIndex].contentType === 'letter') {
      return 'text';
    }

    return 'numeric';
  }, [selectedSectionIndexes, state.sections]);

  const inputHasFocus = inputRef.current && inputRef.current === getActiveElement(document);
  const shouldShowPlaceholder =
    !inputHasFocus && valueManager.areValuesEqual(utils, state.value, valueManager.emptyValue);

  React.useImperativeHandle(unstableFieldRef, () => ({
    getSections: () => state.sections,
    getActiveSectionIndex: () => {
      const browserStartIndex = inputRef.current!.selectionStart ?? 0;
      const browserEndIndex = inputRef.current!.selectionEnd ?? 0;
      if (browserStartIndex === 0 && browserEndIndex === 0) {
        return null;
      }

      const nextSectionIndex =
        browserStartIndex <= state.sections[0].startInInput
          ? 1 // Special case if browser index is in invisible characters at the beginning.
          : state.sections.findIndex(
              (section) => section.startInInput - section.startSeparator.length > browserStartIndex,
            );
      return nextSectionIndex === -1 ? state.sections.length - 1 : nextSectionIndex - 1;
    },
    setSelectedSections: (activeSectionIndex) => setSelectedSections(activeSectionIndex),
  }));

  return {
    placeholder,
    autoComplete: 'off',
    ...otherForwardedProps,
    value: shouldShowPlaceholder ? '' : valueStr,
    inputMode,
    readOnly,
    onClick: handleInputClick,
    onFocus: handleInputFocus,
    onBlur: handleInputBlur,
    onPaste: handleInputPaste,
    onChange: handleInputChange,
    onKeyDown: handleInputKeyDown,
    onMouseUp: handleInputMouseUp,
    error: inputError,
    ref: handleRef,
  };
};
