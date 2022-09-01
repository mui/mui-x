import * as React from 'react';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import useEventCallback from '@mui/utils/useEventCallback';
import { MuiPickerFieldAdapter } from '../../models/muiPickersAdapter';
import { useValidation } from '../validation/useValidation';
import { useUtils } from '../useUtils';
import {
  FieldSection,
  UseFieldParams,
  UseFieldResponse,
  UseFieldState,
  UseFieldForwardedProps,
  UseFieldInternalProps,
  AvailableAdjustKeyCode,
} from './useField.interfaces';
import {
  cleanTrailingZeroInNumericSectionValue,
  getMonthsMatchingQuery,
  getSectionValueNumericBoundaries,
  getSectionVisibleValue,
  adjustDateSectionValue,
  adjustInvalidDateSectionValue,
  setSectionValue,
} from './useField.utils';

export const useField = <
  TInputValue,
  TValue,
  TDate,
  TSection extends FieldSection,
  TForwardedProps extends UseFieldForwardedProps,
  TInternalProps extends UseFieldInternalProps<any, any, any>,
>(
  params: UseFieldParams<TInputValue, TValue, TDate, TSection, TForwardedProps, TInternalProps>,
): UseFieldResponse<TForwardedProps> => {
  const utils = useUtils<TDate>() as MuiPickerFieldAdapter<TDate>;
  if (!utils.formatTokenMap) {
    throw new Error('This adapter is not compatible with the field components');
  }
  const inputRef = React.useRef<HTMLInputElement>(null);

  const {
    internalProps: {
      value: valueProp,
      defaultValue,
      onChange,
      format = utils.formats.keyboardDate,
      readOnly = false,
    },
    forwardedProps: { onClick, onKeyDown, onFocus, onBlur, ...otherForwardedProps },
    valueManager,
    fieldValueManager,
    validator,
  } = params;

  const firstDefaultValue = React.useRef(defaultValue);
  const focusTimeoutRef = React.useRef<NodeJS.Timeout | undefined>(undefined);

  const valueParsed = React.useMemo(() => {
    // TODO: Avoid this type casting, the emptyValues are both valid TDate and TInputDate
    const value =
      firstDefaultValue.current ?? valueProp ?? (valueManager.emptyValue as unknown as TInputValue);

    return valueManager.parseInput(utils, value);
  }, [valueProp, valueManager, utils]);

  const [state, setState] = React.useState<UseFieldState<TValue, TSection[]>>(() => {
    const sections = fieldValueManager.getSectionsFromValue(utils, null, valueParsed, format);

    return {
      sections,
      valueParsed,
      valueStr: fieldValueManager.getValueStrFromSections(sections),
      selectedSectionIndexes: null,
    };
  });

  const updateSections = (sections: TSection[]) => {
    const { value: newValueParsed, shouldPublish } = fieldValueManager.getValueFromSections(
      utils,
      state.sections,
      sections,
      format,
    );

    setState((prevState) => ({
      ...prevState,
      sections,
      valueStr: fieldValueManager.getValueStrFromSections(sections),
      valueParsed: newValueParsed,
    }));

    if (onChange && shouldPublish) {
      onChange(newValueParsed);
    }
  };

  const updateSelectedSections = (start?: number, end?: number) => {
    setState((prevState) => ({
      ...prevState,
      selectedSectionIndexes: start == null ? null : { start, end: end ?? start },
      selectedSectionQuery: null,
    }));
  };

  const handleInputClick = useEventCallback((...args) => {
    onClick?.(...(args as []));

    if (state.sections.length === 0) {
      return;
    }

    const nextSectionIndex = state.sections.findIndex(
      (section) => section.start > (inputRef.current?.selectionStart ?? 0),
    );
    const sectionIndex = nextSectionIndex === -1 ? state.sections.length - 1 : nextSectionIndex - 1;

    updateSelectedSections(sectionIndex);
  });

  const handleInputFocus = useEventCallback((...args) => {
    onFocus?.(...(args as []));
    focusTimeoutRef.current = setTimeout(() => {
      if ((inputRef.current?.selectionEnd ?? 0) - (inputRef.current?.selectionStart ?? 0) === 0) {
        handleInputClick();
      } else {
        updateSelectedSections(0, state.sections.length - 1);
      }
    });
  });

  const handleInputBlur = useEventCallback((...args) => {
    onBlur?.(...(args as []));
    updateSelectedSections();
  });

  const handleInputKeyDown = useEventCallback((event: React.KeyboardEvent) => {
    onKeyDown?.(event);
    if (!inputRef.current || state.sections.length === 0) {
      return;
    }

    // eslint-disable-next-line default-case
    switch (true) {
      // Select all
      case event.key === 'a' && (event.ctrlKey || event.metaKey): {
        event.preventDefault();
        updateSelectedSections(0, state.sections.length - 1);
        return;
      }

      // Move selection to next section
      case event.key === 'ArrowRight': {
        event.preventDefault();

        if (state.selectedSectionIndexes == null) {
          updateSelectedSections(0);
        } else if (state.selectedSectionIndexes.start < state.sections.length - 1) {
          updateSelectedSections(state.selectedSectionIndexes.start + 1);
        } else if (state.selectedSectionIndexes.start !== state.selectedSectionIndexes.end) {
          updateSelectedSections(state.selectedSectionIndexes.end);
        }

        return;
      }

      // Move selection to previous section
      case event.key === 'ArrowLeft': {
        event.preventDefault();

        if (state.selectedSectionIndexes == null) {
          updateSelectedSections(state.sections.length - 1);
        } else if (state.selectedSectionIndexes.start !== state.selectedSectionIndexes.end) {
          updateSelectedSections(state.selectedSectionIndexes.start);
        } else if (state.selectedSectionIndexes.start > 0) {
          updateSelectedSections(state.selectedSectionIndexes.start - 1);
        }
        return;
      }

      // Reset the value of the selected section
      case ['Backspace', 'Delete'].includes(event.key): {
        event.preventDefault();

        if (readOnly) {
          return;
        }

        const resetSections = (startIndex: number, endIndex: number) => {
          let sections = state.sections;

          for (let i = startIndex; i <= endIndex; i += 1) {
            sections = setSectionValue(sections, i, '');
          }

          return sections;
        };

        if (state.selectedSectionIndexes == null) {
          updateSections(resetSections(0, state.sections.length));
        } else {
          updateSections(
            resetSections(state.selectedSectionIndexes.start, state.selectedSectionIndexes.end),
          );
        }
        break;
      }

      // Increment / decrement the selected section value
      case ['ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown'].includes(event.key): {
        event.preventDefault();

        if (readOnly || state.selectedSectionIndexes == null) {
          return;
        }

        const activeSection = state.sections[state.selectedSectionIndexes.start];
        const activeDate = fieldValueManager.getActiveDateFromActiveSection(
          state.valueParsed,
          activeSection,
        );

        // The date is not valid, we have to increment the section value rather than the date
        if (!utils.isValid(activeDate.value)) {
          const newSectionValue = adjustInvalidDateSectionValue(
            utils,
            activeSection,
            event.key as AvailableAdjustKeyCode,
          );

          updateSections(
            setSectionValue(state.sections, state.selectedSectionIndexes.start, newSectionValue),
          );
        } else {
          const newDate = adjustDateSectionValue(
            utils,
            activeDate.value,
            activeSection.dateSectionName,
            event.key as AvailableAdjustKeyCode,
          );

          const newValue = activeDate.update(newDate);
          const sections = fieldValueManager.getSectionsFromValue(
            utils,
            state.sections,
            newValue,
            format,
          );

          updateSections(sections);
        }

        return;
      }

      // Apply numeric editing on the selected section value
      case !Number.isNaN(Number(event.key)): {
        event.preventDefault();

        if (readOnly || state.selectedSectionIndexes == null) {
          return;
        }

        const activeSection = state.sections[state.selectedSectionIndexes.start];
        const activeDate = fieldValueManager.getActiveDateFromActiveSection(
          state.valueParsed,
          activeSection,
        );

        const boundaries = getSectionValueNumericBoundaries(
          utils,
          activeDate.value ?? utils.date()!,
          activeSection.dateSectionName,
        );

        const concatenatedSectionValue = `${activeSection.value}${event.key}`;
        const newSectionValue =
          Number(concatenatedSectionValue) > boundaries.maximum
            ? event.key
            : concatenatedSectionValue;

        updateSections(
          setSectionValue(
            state.sections,
            state.selectedSectionIndexes.start,
            cleanTrailingZeroInNumericSectionValue(newSectionValue, boundaries.maximum),
          ),
        );
        return;
      }

      // Apply full letter editing on the selected section value
      case event.key.length === 1: {
        event.preventDefault();

        if (readOnly || state.selectedSectionIndexes == null) {
          return;
        }

        const activeSection = state.sections[state.selectedSectionIndexes.start];

        // TODO: Do not hardcode the compatible formatValue
        if (activeSection.formatValue !== 'MMMM') {
          return;
        }

        const newQuery = event.key.toLowerCase();
        const concatenatedQuery = `${activeSection.query ?? ''}${newQuery}`;
        const matchingMonthsWithConcatenatedQuery = getMonthsMatchingQuery(
          utils,
          activeSection.formatValue,
          concatenatedQuery,
        );
        if (matchingMonthsWithConcatenatedQuery.length > 0) {
          updateSections(
            setSectionValue(
              state.sections,
              state.selectedSectionIndexes.start,
              matchingMonthsWithConcatenatedQuery[0],
              concatenatedQuery,
            ),
          );
        } else {
          const matchingMonthsWithNewQuery = getMonthsMatchingQuery(
            utils,
            activeSection.formatValue,
            newQuery,
          );
          if (matchingMonthsWithNewQuery.length > 0) {
            updateSections(
              setSectionValue(
                state.sections,
                state.selectedSectionIndexes.start,
                matchingMonthsWithNewQuery[0],
                newQuery,
              ),
            );
          }
        }
      }
    }
  });

  useEnhancedEffect(() => {
    if (!inputRef.current || state.selectedSectionIndexes == null) {
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

    const firstSelectedSection = state.sections[state.selectedSectionIndexes.start];
    const lastSelectedSection = state.sections[state.selectedSectionIndexes.end];
    updateSelectionRangeIfChanged(
      firstSelectedSection.start,
      lastSelectedSection.start + getSectionVisibleValue(lastSelectedSection).length,
    );
  });

  React.useEffect(() => {
    if (!valueManager.areValuesEqual(utils, state.valueParsed, valueParsed)) {
      const sections = fieldValueManager.getSectionsFromValue(
        utils,
        state.sections,
        valueParsed,
        format,
      );
      setState((prevState) => ({
        ...prevState,
        valueParsed,
        valueStr: fieldValueManager.getValueStrFromSections(sections),
        sections,
      }));
    }
  }, [valueParsed]); // eslint-disable-line react-hooks/exhaustive-deps

  // TODO: Make validation work with TDate instead of TInputDate
  const validationError = useValidation(
    { ...params.internalProps, value: state.valueParsed as unknown as TInputValue },
    validator,
    fieldValueManager.isSameError,
  );

  const inputError = React.useMemo(
    () => fieldValueManager.hasError(validationError),
    [fieldValueManager, validationError],
  );

  React.useEffect(() => {
    return () => window.clearTimeout(focusTimeoutRef.current);
  }, []);

  return {
    inputProps: {
      ...otherForwardedProps,
      value: state.valueStr,
      onClick: handleInputClick,
      onFocus: handleInputFocus,
      onBlur: handleInputBlur,
      onKeyDown: handleInputKeyDown,
      error: inputError,
    },
    inputRef,
  };
};
