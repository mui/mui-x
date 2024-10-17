import * as React from 'react';
import { useRtl } from '@mui/system/RtlProvider';
import useEventCallback from '@mui/utils/useEventCallback';
import useForkRef from '@mui/utils/useForkRef';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import {
  UseFieldDOMInteractions,
  SectionOrdering,
  UseFieldLegacyForwardedProps,
  UseFieldLegacyAdditionalProps,
  UseFieldForwardedProps,
  UseFieldWithKnownDOMStructureParameters,
  UseFieldResponse,
} from './useField.types';
import { FieldSection, PickerAnyValueManagerV8, PickerManagerProperties } from '../../../models';
import { getActiveElement } from '../../utils/utils';
import { buildDefaultSectionOrdering, getSectionVisibleValue } from './useField.utils';
import { useFieldHandleKeyDown } from './useFieldHandleKeyDown';
import { useFieldClearValueProps } from './useFieldClearValueProps';
import { useFieldState } from './useFieldState';
import { useFieldCharacterEditing } from './useFieldCharacterEditing';
import { useFieldValidation } from './useFieldValidation';
import { useLocalizationContext } from '../useUtils';

type FieldSectionWithPositions<TSection> = TSection & {
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

const isAndroid = () => navigator.userAgent.toLowerCase().includes('android');

const cleanString = (dirtyString: string) => dirtyString.replace(/[\u2066\u2067\u2068\u2069]/g, '');

export const addPositionPropertiesToSections = <TSection extends FieldSection>(
  sections: TSection[],
  localizedDigits: string[],
  isRtl: boolean,
): FieldSectionWithPositions<TSection>[] => {
  let position = 0;
  let positionInInput = isRtl ? 1 : 0;
  const newSections: FieldSectionWithPositions<TSection>[] = [];

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

export type SectionNeighbors = {
  [sectionIndex: number]: {
    /**
     * Index of the next section displayed on the left. `null` if it's the leftmost section.
     */
    leftIndex: number | null;
    /**
     * Index of the next section displayed on the right. `null` if it's the rightmost section.
     */
    rightIndex: number | null;
  };
};

const getSectionOrder = (sections: FieldSection[]): SectionOrdering => {
  const neighbors: SectionNeighbors = {};

  type PositionMapping = { [from: number]: number };
  const rtl2ltr: PositionMapping = {};
  const ltr2rtl: PositionMapping = {};

  let groupedSectionsStart = 0;
  let groupedSectionsEnd = 0;
  let RTLIndex = sections.length - 1;

  while (RTLIndex >= 0) {
    groupedSectionsEnd = sections.findIndex(
      // eslint-disable-next-line @typescript-eslint/no-loop-func
      (section, index) =>
        index >= groupedSectionsStart &&
        section.endSeparator?.includes(' ') &&
        // Special case where the spaces were not there in the initial input
        section.endSeparator !== ' / ',
    );
    if (groupedSectionsEnd === -1) {
      groupedSectionsEnd = sections.length - 1;
    }

    for (let i = groupedSectionsEnd; i >= groupedSectionsStart; i -= 1) {
      ltr2rtl[i] = RTLIndex;
      rtl2ltr[RTLIndex] = i;
      RTLIndex -= 1;
    }
    groupedSectionsStart = groupedSectionsEnd + 1;
  }

  sections.forEach((_, index) => {
    const rtlIndex = ltr2rtl[index];
    const leftIndex = rtlIndex === 0 ? null : rtl2ltr[rtlIndex - 1];
    const rightIndex = rtlIndex === sections.length - 1 ? null : rtl2ltr[rtlIndex + 1];

    neighbors[index] = { leftIndex, rightIndex };
  });

  return {
    startIndex: rtl2ltr[0],
    endIndex: rtl2ltr[sections.length - 1],
    getSectionOnTheLeft: (index: number) => neighbors[index].leftIndex,
    getSectionOnTheRight: (index: number) => neighbors[index].rightIndex,
  };
};

export const useFieldLegacyDOMStructure = <
  TManager extends PickerAnyValueManagerV8,
  TForwardedProps extends UseFieldForwardedProps<false>,
>(
  parameters: UseFieldWithKnownDOMStructureParameters<TManager, TForwardedProps>,
): UseFieldResponse<false, TForwardedProps> => {
  const isRtl = useRtl();
  const focusTimeoutRef = React.useRef<ReturnType<typeof setTimeout>>();
  const selectionSyncTimeoutRef = React.useRef<ReturnType<typeof setTimeout>>();
  const localizationContext = useLocalizationContext<PickerManagerProperties<TManager>['date']>();

  const {
    forwardedProps,
    forwardedProps: {
      onFocus,
      onClick,
      onPaste,
      onBlur,
      inputRef: inputRefProp,
      placeholder: placeholderProp,
    },
    internalProps,
    valueManager,
    valueManager: { fieldValueManager, legacyValueManager },
  } = parameters;

  const internalPropsWithDefaults = React.useMemo(
    () =>
      valueManager.applyDefaultsToFieldInternalProps({
        ...localizationContext,
        internalProps,
      }),
    [valueManager, localizationContext, internalProps],
  );

  const { unstableFieldRef, readOnly = false, disabled = false } = internalPropsWithDefaults;

  const inputRef = React.useRef<HTMLInputElement>(null);
  const handleRef = useForkRef(inputRefProp, inputRef);

  const stateResponse = useFieldState(parameters);
  const {
    parsedSelectedSections,
    activeSectionIndex,
    state,
    updateSectionValue,
    updateValueFromValueStr,
    clearActiveSection,
    clearValue,
    setTempAndroidValueStr,
    setSelectedSections,
    getSectionsFromValue,
    localizedDigits,
    areAllSectionsEmpty,
  } = stateResponse;

  const error = useFieldValidation({
    internalPropsWithDefaults,
    forwardedProps,
    valueManager,
    stateResponse,
  });

  const characterEditingResponse = useFieldCharacterEditing({
    error,
    stateResponse,
  });
  const { applyCharacterEditing, resetCharacterQuery } = characterEditingResponse;

  const sections = React.useMemo(
    () => addPositionPropertiesToSections(state.sections, localizedDigits, isRtl),
    [state.sections, localizedDigits, isRtl],
  );

  const sectionOrder = React.useMemo(
    () =>
      isRtl ? getSectionOrder(state.sections) : buildDefaultSectionOrdering(state.sections.length),
    [state.sections, isRtl],
  );

  const interactions = React.useMemo<UseFieldDOMInteractions>(
    () => ({
      syncSelectionToDOM: () => {
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
          clearTimeout(selectionSyncTimeoutRef.current);
          selectionSyncTimeoutRef.current = setTimeout(() => {
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
              interactions.syncSelectionToDOM();
            }
          });
        }

        // Even reading this variable seems to do the trick, but also setting it just to make use of it
        inputRef.current.scrollTop = currentScrollTop;
      },
      getActiveSectionIndexFromDOM: () => {
        const browserStartIndex = inputRef.current!.selectionStart ?? 0;
        const browserEndIndex = inputRef.current!.selectionEnd ?? 0;
        if (browserStartIndex === 0 && browserEndIndex === 0) {
          return null;
        }

        const nextSectionIndex =
          browserStartIndex <= sections[0].startInInput
            ? 1 // Special case if browser index is in invisible characters at the beginning.
            : sections.findIndex(
                (section) =>
                  section.startInInput - section.startSeparator.length > browserStartIndex,
              );
        return nextSectionIndex === -1 ? sections.length - 1 : nextSectionIndex - 1;
      },
      focusField: (newSelectedSection = 0) => {
        inputRef.current?.focus();
        setSelectedSections(newSelectedSection);
      },
      setSelectedSections: (newSelectedSections) => setSelectedSections(newSelectedSections),
      isFieldFocused: () => inputRef.current === getActiveElement(document),
    }),
    [inputRef, parsedSelectedSections, sections, setSelectedSections],
  );

  const syncSelectionFromDOM = () => {
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
  };

  const handleInputFocus = useEventCallback((event: React.FocusEvent) => {
    onFocus?.(event);
    // The ref is guaranteed to be resolved at this point.
    const input = inputRef.current;

    clearTimeout(focusTimeoutRef.current);
    focusTimeoutRef.current = setTimeout(() => {
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

  const handleInputPaste = useEventCallback((event: React.ClipboardEvent) => {
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
        resetCharacterQuery();
        updateSectionValue({
          activeSection,
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

    resetCharacterQuery();
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
      resetCharacterQuery();
      clearValue();
      return;
    }

    const eventData = (event.nativeEvent as InputEvent).data;
    // Calling `.fill(04/11/2022)` in playwright will trigger a change event with the requested content to insert in `event.nativeEvent.data`
    // usual changes have only the currently typed character in the `event.nativeEvent.data`
    const shouldUseEventData = eventData && eventData.length > 1;
    const valueStr = shouldUseEventData ? eventData : targetValue;
    const cleanValueStr = cleanString(valueStr);

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
      resetCharacterQuery();
      clearActiveSection();

      return;
    }

    applyCharacterEditing({ keyPressed, sectionIndex: activeSectionIndex });
  });

  const placeholder = React.useMemo(() => {
    if (placeholderProp !== undefined) {
      return placeholderProp;
    }

    return fieldValueManager.getV6InputValueFromSections(
      getSectionsFromValue(legacyValueManager.emptyValue),
      localizedDigits,
      isRtl,
    );
  }, [
    placeholderProp,
    fieldValueManager,
    getSectionsFromValue,
    legacyValueManager.emptyValue,
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

    return () => {
      clearTimeout(focusTimeoutRef.current);
      clearTimeout(selectionSyncTimeoutRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

  const handleContainerKeyDown = useFieldHandleKeyDown({
    valueManager,
    internalPropsWithDefaults,
    forwardedProps,
    stateResponse,
    characterEditingResponse,
    sectionOrder,
  });

  const { onClear, clearable } = useFieldClearValueProps({
    internalPropsWithDefaults,
    forwardedProps,
    stateResponse,
    interactions,
    sectionOrder,
  });

  useEnhancedEffect(() => {
    interactions.syncSelectionToDOM();
  });

  // If `tempValueStrAndroid` is still defined for some section when running `useEffect`,
  // Then `onChange` has only been called once, which means the user pressed `Backspace` to reset the section.
  // This causes a small flickering on Android,
  // But we can't use `useEnhancedEffect` which is always called before the second `onChange` call and then would cause false positives.
  React.useEffect(() => {
    if (state.tempValueStrAndroid != null && activeSectionIndex != null) {
      resetCharacterQuery();
      clearActiveSection();
    }
  }, [state.sections]); // eslint-disable-line react-hooks/exhaustive-deps

  React.useImperativeHandle(unstableFieldRef, () => ({
    getSections: () => state.sections,
    getActiveSectionIndex: interactions.getActiveSectionIndexFromDOM,
    setSelectedSections: interactions.setSelectedSections,
    focusField: interactions.focusField,
    isFieldFocused: interactions.isFieldFocused,
  }));

  const forwardedPropsWithDefault: Required<UseFieldLegacyForwardedProps> = {
    onBlur: handleContainerBlur,
    onClick: handleInputClick,
    onFocus: handleInputFocus,
    onPaste: handleInputPaste,
    onKeyDown: handleContainerKeyDown,
    onClear,
    clearable,
    error,
    placeholder,
    inputRef: handleRef,
  };

  const additionalProps: UseFieldLegacyAdditionalProps = {
    enableAccessibleFieldDOMStructure: false,
    inputMode,
    autoComplete: 'off',
    value: shouldShowPlaceholder ? '' : valueStr,
    onChange: handleInputChange,
    disabled,
    readOnly,
  };

  return {
    ...forwardedProps,
    ...forwardedPropsWithDefault,
    ...additionalProps,
  };
};
