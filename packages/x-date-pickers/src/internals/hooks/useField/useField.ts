import * as React from 'react';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import useEventCallback from '@mui/utils/useEventCallback';
import useForkRef from '@mui/utils/useForkRef';
import { MuiDateSectionName } from '../../models/muiPickersAdapter';
import { useValidation } from '../validation/useValidation';
import { useUtils } from '../useUtils';
import {
  FieldSection,
  UseFieldParams,
  UseFieldResponse,
  UseFieldForwardedProps,
  UseFieldInternalProps,
  AvailableAdjustKeyCode,
  FieldBoundaries,
} from './useField.types';
import {
  getMonthsMatchingQuery,
  adjustDateSectionValue,
  adjustInvalidDateSectionValue,
  applySectionValueToDate,
  cleanTrailingZeroInNumericSectionValue,
  isAndroid,
  cleanString,
} from './useField.utils';
import { useFieldState } from './useFieldState';

export const useField = <
  TValue,
  TDate,
  TSection extends FieldSection,
  TForwardedProps extends UseFieldForwardedProps,
  TInternalProps extends UseFieldInternalProps<any, any>,
>(
  params: UseFieldParams<TValue, TDate, TSection, TForwardedProps, TInternalProps>,
): UseFieldResponse<TForwardedProps> => {
  const utils = useUtils<TDate>();
  if (!utils.formatTokenMap) {
    throw new Error('This adapter is not compatible with the field components');
  }
  const queryRef = React.useRef<{ dateSectionName: MuiDateSectionName; value: string } | null>(
    null,
  );

  const {
    state,
    selectedSectionIndexes,
    setSelectedSections,
    clearValue,
    clearActiveSection,
    updateSectionValue,
    updateValueFromValueStr,
    setTempAndroidValueStr,
    sectionOrder,
  } = useFieldState(params);

  const {
    inputRef: inputRefProp,
    internalProps,
    internalProps: { readOnly = false },
    forwardedProps: { onClick, onKeyDown, onFocus, onBlur, onMouseUp, ...otherForwardedProps },
    fieldValueManager,
    valueManager,
    validator,
  } = params;

  const inputRef = React.useRef<HTMLInputElement>(null);
  const handleRef = useForkRef(inputRefProp, inputRef);
  const focusTimeoutRef = React.useRef<NodeJS.Timeout | undefined>(undefined);

  const syncSelectionFromDOM = () => {
    const browserStartIndex = inputRef.current!.selectionStart ?? 0;
    const nextSectionIndex =
      browserStartIndex <= state.sections[0].startInInput
        ? 1 // Special case if browser index is in invisible cheracters at the begining.
        : state.sections.findIndex((section) => section.startInInput > browserStartIndex);
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
    // The ref is guaranteed to be resolved that this point.
    const input = inputRef.current;

    clearTimeout(focusTimeoutRef.current);
    focusTimeoutRef.current = setTimeout(() => {
      // The ref changed, the component got remounted, the focus event is no longer relevant.
      if (!input || input !== inputRef.current) {
        return;
      }

      if (selectedSectionIndexes != null) {
        return;
      }

      if (Number(input.selectionEnd) - Number(input.selectionStart) === input.value.length) {
        setSelectedSections({ startIndex: 0, endIndex: state.sections.length - 1 });
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
      const isValidPastedValue =
        (activeSection.contentType === 'letter' && lettersOnly) ||
        (activeSection.contentType === 'digit' && digitsOnly);
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
    updateValueFromValueStr(pastedValue);
  });

  const handleInputChange = useEventCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (readOnly) {
      return;
    }

    const valueStr = cleanString(event.target.value);

    // If no section is selected, we just try to parse the new value
    // This line is mostly triggered by imperative code / application tests.
    if (selectedSectionIndexes == null) {
      updateValueFromValueStr(valueStr);
      return;
    }

    const prevValueStr = cleanString(fieldValueManager.getValueStrFromSections(state.sections));

    let startOfDiffIndex = -1;
    let endOfDiffIndex = -1;
    for (let i = 0; i < prevValueStr.length; i += 1) {
      if (startOfDiffIndex === -1 && prevValueStr[i] !== valueStr[i]) {
        startOfDiffIndex = i;
      }

      if (
        endOfDiffIndex === -1 &&
        prevValueStr[prevValueStr.length - i - 1] !== valueStr[valueStr.length - i - 1]
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
      valueStr.length -
      prevValueStr.length +
      activeSection.end -
      cleanString(activeSection.separator || '').length;
    const keyPressed = valueStr.slice(activeSection.start, activeSectionEndRelativeToNewValue);

    if (isAndroid() && keyPressed.length === 0) {
      setTempAndroidValueStr(valueStr);
      return;
    }

    const isNumericValue = !Number.isNaN(Number(keyPressed));

    if (isNumericValue) {
      const getNewSectionValueStr = (
        date: TDate | null,
        boundaries: FieldBoundaries<TDate, TSection>,
      ) => {
        const sectionBoundaries = boundaries[activeSection.dateSectionName](date, activeSection);

        // Remove the trailing `0` (`01` => `1`)
        let newSectionValue = Number(`${activeSection.value}${keyPressed}`).toString();

        while (newSectionValue.length > 0 && Number(newSectionValue) > sectionBoundaries.maximum) {
          newSectionValue = newSectionValue.slice(1);
        }

        // In the unlikely scenario where max < 9, we could type a single digit that already exceeds the maximum.
        if (newSectionValue.length === 0) {
          newSectionValue = sectionBoundaries.minimum.toString();
        }

        if (!activeSection.hasTrailingZeroes) {
          return newSectionValue;
        }

        return cleanTrailingZeroInNumericSectionValue(newSectionValue, sectionBoundaries.maximum);
      };

      updateSectionValue({
        activeSection,
        setSectionValueOnDate: (activeDate, boundaries) => {
          // TODO: Support digit editing for months displayed in full letter
          if (activeSection.contentType === 'letter') {
            return activeDate;
          }

          return applySectionValueToDate({
            utils,
            dateSectionName: activeSection.dateSectionName,
            date: activeDate,
            getNumericSectionValue: (getter) => {
              const sectionValueStr = getNewSectionValueStr(activeDate, boundaries);

              // We can't parse the day on the current date, otherwise we might try to parse `31` on a 30-days month.
              // So we take for granted that for days, the digit rendered is always 1-indexed, just like the digit stored in the date.
              if (activeSection.dateSectionName === 'day') {
                return Number(sectionValueStr);
              }

              // The month is stored as 0-indexed in the date (0 = January, 1 = February, ...).
              // But it is often rendered as 1-indexed in the input (1 = January, 2 = February, ...).
              // This parsing makes sure that we store the digit according to the date index and not the input index.
              const sectionDate = utils.parse(sectionValueStr, activeSection.formatValue)!;
              return getter(sectionDate);
            },
            // Meridiem is not compatible with digit editing, this line should never be called.
            getMeridiemSectionValue: () => '',
          });
        },
        setSectionValueOnSections: (boundaries) => {
          // TODO: Support digit editing for months displayed in full letter
          if (activeSection.contentType === 'letter') {
            return activeSection.value;
          }

          return getNewSectionValueStr(null, boundaries);
        },
      });
    }
    // TODO: Improve condition
    else if (['/', ' ', '-'].includes(keyPressed)) {
      if (selectedSectionIndexes.startIndex < state.sections.length - 1) {
        setSelectedSections(selectedSectionIndexes.startIndex + 1);
      }
    } else {
      const getNewSectionValueStr = (): string => {
        if (activeSection.contentType === 'digit') {
          return activeSection.value;
        }

        const newQuery = keyPressed.toLowerCase();
        const currentQuery =
          queryRef.current?.dateSectionName === activeSection.dateSectionName
            ? queryRef.current!.value
            : '';
        const concatenatedQuery = `${currentQuery}${newQuery}`;
        const matchingMonthsWithConcatenatedQuery = getMonthsMatchingQuery(
          utils,
          activeSection,
          concatenatedQuery,
        );
        if (matchingMonthsWithConcatenatedQuery.length > 0) {
          queryRef.current = {
            dateSectionName: activeSection.dateSectionName,
            value: concatenatedQuery,
          };
          return matchingMonthsWithConcatenatedQuery[0];
        }

        const matchingMonthsWithNewQuery = getMonthsMatchingQuery(utils, activeSection, newQuery);
        if (matchingMonthsWithNewQuery.length > 0) {
          queryRef.current = {
            dateSectionName: activeSection.dateSectionName,
            value: newQuery,
          };
          return matchingMonthsWithNewQuery[0];
        }

        return activeSection.value;
      };

      updateSectionValue({
        activeSection,
        setSectionValueOnDate: (activeDate) =>
          applySectionValueToDate({
            utils,
            dateSectionName: activeSection.dateSectionName,
            date: activeDate,
            getNumericSectionValue: (getter) => {
              const sectionValueStr = getNewSectionValueStr();
              const sectionDate = utils.parse(sectionValueStr, activeSection.formatValue)!;

              return getter(sectionDate);
            },
            getMeridiemSectionValue: getNewSectionValueStr,
          }),
        setSectionValueOnSections: () => getNewSectionValueStr(),
      });
    }
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
        setSelectedSections({ startIndex: 0, endIndex: state.sections.length - 1 });
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
        break;
      }

      // Increment / decrement the selected section value
      case ['ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown'].includes(event.key): {
        event.preventDefault();

        if (readOnly || selectedSectionIndexes == null) {
          break;
        }

        const activeSection = state.sections[selectedSectionIndexes.startIndex];

        updateSectionValue({
          activeSection,
          setSectionValueOnDate: (activeDate) =>
            adjustDateSectionValue(
              utils,
              activeDate,
              activeSection.dateSectionName,
              event.key as AvailableAdjustKeyCode,
            ),
          setSectionValueOnSections: () =>
            adjustInvalidDateSectionValue(
              utils,
              activeSection,
              event.key as AvailableAdjustKeyCode,
            ),
        });
        break;
      }
    }
  });

  useEnhancedEffect(() => {
    if (selectedSectionIndexes == null) {
      return;
    }

    const updateSelectionRangeIfChanged = (selectionStart: number, selectionEnd: number) => {
      if (
        selectionStart !== inputRef.current!.selectionStart ||
        selectionEnd !== inputRef.current!.selectionEnd
      ) {
        inputRef.current!.setSelectionRange(selectionStart, selectionEnd);
      }
    };

    const firstSelectedSection = state.sections[selectedSectionIndexes.startIndex];
    const lastSelectedSection = state.sections[selectedSectionIndexes.endIndex];

    updateSelectionRangeIfChanged(
      firstSelectedSection.startInInput,
      lastSelectedSection.endInInput,
    );
  });

  const validationError = useValidation(
    { ...internalProps, value: state.value },
    validator,
    valueManager.isSameError,
    valueManager.defaultErrorState,
  );

  const inputError = React.useMemo(
    () => fieldValueManager.hasError(validationError),
    [fieldValueManager, validationError],
  );

  React.useEffect(() => {
    // Select the right section when focused on mount (`autoFocus = true` on the input)
    if (inputRef.current && inputRef.current === document.activeElement) {
      setSelectedSections({ startIndex: 0, endIndex: state.sections.length - 1 });
    }

    return () => window.clearTimeout(focusTimeoutRef.current);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const valueStr = React.useMemo(
    () => state.tempValueStrAndroid ?? fieldValueManager.getValueStrFromSections(state.sections),
    [state.sections, fieldValueManager, state.tempValueStrAndroid],
  );

  const inputMode = React.useMemo(() => {
    if (selectedSectionIndexes == null) {
      return 'text';
    }

    if (state.sections[selectedSectionIndexes.startIndex].contentType === 'letter') {
      return 'text';
    }

    return 'tel';
  }, [selectedSectionIndexes, state.sections]);

  return {
    ...otherForwardedProps,
    value: valueStr,
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
