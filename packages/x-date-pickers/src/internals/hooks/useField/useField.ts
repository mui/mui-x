import * as React from 'react';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import useEventCallback from '@mui/utils/useEventCallback';
import useControlled from '@mui/utils/useControlled';
import useForkRef from '@mui/utils/useForkRef';
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
  FieldSelectedSectionsIndexes,
  FieldSelectedSections,
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
  TValue,
  TDate,
  TSection extends FieldSection,
  TForwardedProps extends UseFieldForwardedProps,
  TInternalProps extends UseFieldInternalProps<any, any>,
>(
  params: UseFieldParams<TValue, TDate, TSection, TForwardedProps, TInternalProps>,
): UseFieldResponse<TForwardedProps> => {
  const utils = useUtils<TDate>() as MuiPickerFieldAdapter<TDate>;
  if (!utils.formatTokenMap) {
    throw new Error('This adapter is not compatible with the field components');
  }

  const {
    internalProps: {
      value: valueProp,
      defaultValue,
      onChange,
      format = utils.formats.keyboardDate,
      readOnly = false,
      selectedSectionIndexes: selectedSectionIndexesProp,
      onSelectedSectionIndexesChange,
      inputRef: inputRefProp,
    },
    forwardedProps: { onClick, onKeyDown, onFocus, onBlur, ...otherForwardedProps },
    valueManager,
    fieldValueManager,
    validator,
  } = params;

  const inputRef = React.useRef<HTMLInputElement>(null);
  const handleRef = useForkRef(inputRefProp, inputRef);

  const firstDefaultValue = React.useRef(defaultValue);
  const focusTimeoutRef = React.useRef<NodeJS.Timeout | undefined>(undefined);

  const value = firstDefaultValue.current ?? valueProp ?? valueManager.emptyValue;

  const [state, setState] = React.useState<UseFieldState<TValue, TSection[]>>(() => {
    const sections = fieldValueManager.getSectionsFromValue(utils, null, value, format);

    return {
      sections,
      value,
      selectedSectionIndexes: null,
    };
  });

  const [selectedSections, setSelectedSection] = useControlled({
    controlled: selectedSectionIndexesProp,
    default: null,
    name: 'useField',
    state: 'selectedSectionIndexes',
  });

  const selectedSectionIndexes = React.useMemo<FieldSelectedSectionsIndexes | null>(() => {
    if (selectedSections == null) {
      return null;
    }

    if (typeof selectedSections === 'number') {
      return { startIndex: selectedSections, endIndex: selectedSections };
    }

    if (typeof selectedSections === 'string') {
      const selectedSectionIndex = state.sections.findIndex(
        (section) => section.dateSectionName === selectedSections,
      );

      return { startIndex: selectedSectionIndex, endIndex: selectedSectionIndex };
    }

    return selectedSections;
  }, [selectedSections, state.sections]);

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
      valueParsed: newValueParsed,
    }));

    if (onChange && shouldPublish) {
      onChange(newValueParsed);
    }
  };

  const updateSelectedSections = (newSelectedSections: FieldSelectedSections) => {
    setSelectedSection(newSelectedSections);
    onSelectedSectionIndexesChange?.(newSelectedSections);

    setState((prevState) => ({
      ...prevState,
      selectedSectionQuery: null,
    }));
  };

  const handleInputClick = useEventCallback((...args) => {
    onClick?.(...(args as []));

    const nextSectionIndex = state.sections.findIndex(
      (section) => section.start > (inputRef.current!.selectionStart ?? 0),
    );
    const sectionIndex = nextSectionIndex === -1 ? state.sections.length - 1 : nextSectionIndex - 1;

    updateSelectedSections(sectionIndex);
  });

  const handleInputFocus = useEventCallback((...args) => {
    onFocus?.(...(args as []));
    // The ref is guaranteed to be resolved that this point.
    const input = inputRef.current as HTMLInputElement;

    clearTimeout(focusTimeoutRef.current);
    focusTimeoutRef.current = setTimeout(() => {
      // The ref changed, the component got remounted, the focus event is no longer relevant.
      if (input !== inputRef.current) {
        return;
      }

      if (Number(input.selectionEnd) - Number(input.selectionStart) === input.value.length) {
        updateSelectedSections({ startIndex: 0, endIndex: state.sections.length - 1 });
      } else {
        handleInputClick();
      }
    });
  });

  const handleInputBlur = useEventCallback((...args) => {
    onBlur?.(...(args as []));
    updateSelectedSections(null);
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
        updateSelectedSections({ startIndex: 0, endIndex: state.sections.length - 1 });
        return;
      }

      // Move selection to next section
      case event.key === 'ArrowRight': {
        event.preventDefault();

        if (selectedSectionIndexes == null) {
          updateSelectedSections(0);
        } else if (selectedSectionIndexes.startIndex < state.sections.length - 1) {
          updateSelectedSections(selectedSectionIndexes.startIndex + 1);
        } else if (selectedSectionIndexes.startIndex !== selectedSectionIndexes.endIndex) {
          updateSelectedSections(selectedSectionIndexes.startIndex);
        }

        return;
      }

      // Move selection to previous section
      case event.key === 'ArrowLeft': {
        event.preventDefault();

        if (selectedSectionIndexes == null) {
          updateSelectedSections(state.sections.length - 1);
        } else if (selectedSectionIndexes.startIndex !== selectedSectionIndexes.endIndex) {
          updateSelectedSections(selectedSectionIndexes.startIndex);
        } else if (selectedSectionIndexes.startIndex > 0) {
          updateSelectedSections(selectedSectionIndexes.startIndex - 1);
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

        if (selectedSectionIndexes == null) {
          updateSections(resetSections(0, state.sections.length));
        } else {
          updateSections(
            resetSections(selectedSectionIndexes.startIndex, selectedSectionIndexes.endIndex),
          );
        }
        break;
      }

      // Increment / decrement the selected section value
      case ['ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown'].includes(event.key): {
        event.preventDefault();

        if (readOnly || selectedSectionIndexes == null) {
          return;
        }

        const activeSection = state.sections[selectedSectionIndexes.startIndex];
        const activeDate = fieldValueManager.getActiveDateFromActiveSection(
          state.value,
          activeSection,
        );

        // The date is not valid, we have to increment the section value rather than the date
        if (activeDate.value === null || !utils.isValid(activeDate.value)) {
          const newSectionValue = adjustInvalidDateSectionValue(
            utils,
            activeSection,
            event.key as AvailableAdjustKeyCode,
          );

          updateSections(
            setSectionValue(state.sections, selectedSectionIndexes.startIndex, newSectionValue),
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

        if (readOnly || selectedSectionIndexes == null) {
          return;
        }

        const activeSection = state.sections[selectedSectionIndexes.startIndex];
        const activeDate = fieldValueManager.getActiveDateFromActiveSection(
          state.value,
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
            selectedSectionIndexes.startIndex,
            cleanTrailingZeroInNumericSectionValue(newSectionValue, boundaries.maximum),
          ),
        );
        return;
      }

      // Apply full letter editing on the selected section value
      case event.key.length === 1: {
        event.preventDefault();

        if (readOnly || selectedSectionIndexes == null) {
          return;
        }

        const activeSection = state.sections[selectedSectionIndexes.startIndex];

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
              selectedSectionIndexes.startIndex,
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
                selectedSectionIndexes.startIndex,
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
      firstSelectedSection.start,
      lastSelectedSection.start + getSectionVisibleValue(lastSelectedSection).length,
    );
  });

  React.useEffect(() => {
    if (!valueManager.areValuesEqual(utils, state.value, value)) {
      const sections = fieldValueManager.getSectionsFromValue(utils, state.sections, value, format);
      setState((prevState) => ({
        ...prevState,
        valueParsed: value,
        sections,
      }));
    }
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  const validationError = useValidation(
    { ...params.internalProps, value: state.value },
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

  const valueStr = React.useMemo(
    () => fieldValueManager.getValueStrFromSections(state.sections),
    [state.sections, fieldValueManager],
  );

  return {
    inputProps: {
      ...otherForwardedProps,
      value: valueStr,
      onClick: handleInputClick,
      onFocus: handleInputFocus,
      onBlur: handleInputBlur,
      onKeyDown: handleInputKeyDown,
      error: inputError,
    },
    inputRef: handleRef,
  };
};
