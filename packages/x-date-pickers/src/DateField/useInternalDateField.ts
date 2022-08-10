import * as React from 'react';
import {
  unstable_useEnhancedEffect as useEnhancedEffect,
  useEventCallback,
} from '@mui/material/utils';
import { PickerStateValueManager } from '../internals/hooks/usePickerState';
import { useUtils } from '../internals/hooks/useUtils';
import { MuiPickersAdapter } from '../internals/models/muiPickersAdapter';
import { DateFieldInputSection } from './DateField.interfaces';
import {
  cleanTrailingZeroInNumericSectionValue,
  getMonthList,
  getMonthsMatchingQuery,
  getSectionIndexFromCursorPosition,
  getSectionValueNumericBoundaries,
  getSectionVisibleValue,
  incrementDatePartValue,
  setSectionValue,
} from './DateField.utils';

export interface PickerFieldValueManager<TValue, TDate, TSection> {
  getSectionsFromValue: (
    utils: MuiPickersAdapter<TDate>,
    prevSections: TSection[] | null,
    value: TValue,
    format: string,
  ) => TSection[];
  getValueStrFromSections: (sections: TSection[]) => string;
  getValueFromSections: (
    utils: MuiPickersAdapter<TDate>,
    prevSections: TSection[],
    sections: TSection[],
    format: string,
  ) => { value: TValue; shouldPublish: boolean };
  getActiveDateFromActiveSection: (
    value: TValue,
    activeSection: TSection,
  ) => { value: TDate | null; update: (newActiveDate: TDate | null) => TValue };
}

export interface UseInternalDateFieldProps<
  TInputValue,
  TValue,
  TDate,
  TSection extends DateFieldInputSection,
> {
  value: TInputValue;
  onChange: (value: TValue) => void;
  format?: string;
  valueManager: PickerStateValueManager<TInputValue, TValue, TDate>;
  fieldValueManager: PickerFieldValueManager<TValue, TDate, TSection>;
}

interface UseDateFieldState<TValue, TSections> {
  valueStr: string;
  valueParsed: TValue;
  sections: TSections;
  selectedSectionIndex: number | 'all' | null;
}

export const useInternalDateField = <
  TInputValue,
  TValue,
  TDate,
  TSection extends DateFieldInputSection,
>(
  inProps: UseInternalDateFieldProps<TInputValue, TValue, TDate, TSection>,
) => {
  const utils = useUtils<TDate>();
  const inputRef = React.useRef<HTMLInputElement>(null);

  const {
    value,
    onChange,
    valueManager,
    fieldValueManager,
    format = utils.formats.keyboardDate,
  } = inProps;

  const [state, setState] = React.useState<UseDateFieldState<TValue, TSection[]>>(() => {
    const valueParsed = valueManager.parseInput(utils, value);
    const sections = fieldValueManager.getSectionsFromValue(utils, null, valueParsed, format);

    return {
      sections,
      valueParsed,
      valueStr: fieldValueManager.getValueStrFromSections(sections),
      selectedSectionIndex: null,
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

    if (shouldPublish) {
      onChange(newValueParsed);
    }
  };

  const updateSelectedSection = (selectedSectionIndex: number | 'all' | null) => {
    setState((prevState) => ({
      ...prevState,
      selectedSectionIndex,
      selectedSectionQuery: null,
    }));
  };

  const handleInputClick = useEventCallback(() => {
    if (state.sections.length === 0) {
      return;
    }

    const sectionIndex = getSectionIndexFromCursorPosition(
      state.sections,
      inputRef.current!.selectionStart,
    );
    updateSelectedSection(sectionIndex);
  });

  const handleInputKeyDown = useEventCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!inputRef.current || state.sections.length === 0) {
      return;
    }

    const startSectionIndex = getSectionIndexFromCursorPosition(
      state.sections,
      inputRef.current.selectionStart,
    );
    const endSectionIndex = getSectionIndexFromCursorPosition(
      state.sections,
      inputRef.current.selectionEnd,
    );
    const startSection = state.sections[startSectionIndex];

    const activeDate = fieldValueManager.getActiveDateFromActiveSection(
      state.valueParsed,
      startSection,
    );

    // eslint-disable-next-line default-case
    switch (true) {
      // Select all
      case event.key === 'a' && event.ctrlKey: {
        updateSelectedSection('all');
        event.preventDefault();
        break;
      }

      // Move selection to next section
      case event.key === 'ArrowRight': {
        if (startSectionIndex !== endSectionIndex) {
          updateSelectedSection(0);
        } else if (startSectionIndex < state.sections.length - 1) {
          updateSelectedSection(startSectionIndex + 1);
        }

        event.preventDefault();
        break;
      }

      // Move selection to previous section
      case event.key === 'ArrowLeft': {
        if (startSectionIndex !== endSectionIndex) {
          updateSelectedSection(0);
        } else if (startSectionIndex > 0) {
          updateSelectedSection(startSectionIndex - 1);
        }
        event.preventDefault();
        break;
      }

      // Reset the value of the selected section
      case event.key === 'Backspace': {
        updateSections(setSectionValue(state.sections, startSectionIndex, ''));
        event.preventDefault();
        break;
      }

      // Increment / decrement the selected section value
      case event.key === 'ArrowUp' || event.key === 'ArrowDown': {
        // The date is not valid, we have to increment the section value rather than the date
        if (!utils.isValid(activeDate.value)) {
          const boundaries = getSectionValueNumericBoundaries(
            utils,
            utils.date(),
            startSection.dateSectionName,
          );

          let newSectionNumericValue: number;
          if (startSection.value === '') {
            newSectionNumericValue =
              event.key === 'ArrowDown' ? boundaries.minimum : boundaries.maximum;
          } else {
            const currentNumericValue =
              startSection.formatValue === 'MMMM'
                ? getMonthList(utils, startSection.formatValue).indexOf(startSection.value)
                : Number(startSection.value);
            newSectionNumericValue = currentNumericValue + (event.key === 'ArrowDown' ? -1 : 1);
            if (newSectionNumericValue < boundaries.minimum) {
              newSectionNumericValue = boundaries.maximum;
            } else if (newSectionNumericValue > boundaries.maximum) {
              newSectionNumericValue = boundaries.minimum;
            }
          }

          // TODO: Make generic
          const newSectionValue =
            startSection.formatValue === 'MMMM'
              ? getMonthList(utils, startSection.formatValue)[newSectionNumericValue]
              : cleanTrailingZeroInNumericSectionValue(
                  newSectionNumericValue.toString(),
                  boundaries.maximum,
                );
          updateSections(setSectionValue(state.sections, startSectionIndex, newSectionValue));
        } else {
          const newDate = incrementDatePartValue(
            utils,
            activeDate.value,
            startSection.dateSectionName,
            event.key === 'ArrowDown' ? -1 : 1,
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

        event.preventDefault();
        break;
      }

      // Apply numeric editing on the selected section value
      case !Number.isNaN(Number(event.key)): {
        const boundaries = getSectionValueNumericBoundaries(
          utils,
          activeDate.value ?? utils.date()!,
          startSection.dateSectionName,
        );

        const concatenatedSectionValue = `${startSection.value}${event.key}`;
        const newSectionValue =
          Number(concatenatedSectionValue) > boundaries.maximum
            ? event.key
            : concatenatedSectionValue;

        updateSections(
          setSectionValue(
            state.sections,
            startSectionIndex,
            cleanTrailingZeroInNumericSectionValue(newSectionValue, boundaries.maximum),
          ),
        );
        event.preventDefault();
        break;
      }

      // Apply full letter editing on the selected section value
      // TODO: Do not hardcode the compatible formatValue
      case event.key.length === 1 && startSection.formatValue === 'MMMM': {
        const newQuery = event.key.toLowerCase();
        const concatenatedQuery = `${startSection.query ?? ''}${newQuery}`;
        const matchingMonthsWithConcatenatedQuery = getMonthsMatchingQuery(
          utils,
          startSection.formatValue,
          concatenatedQuery,
        );
        if (matchingMonthsWithConcatenatedQuery.length > 0) {
          updateSections(
            setSectionValue(
              state.sections,
              startSectionIndex,
              matchingMonthsWithConcatenatedQuery[0],
              concatenatedQuery,
            ),
          );
        } else {
          const matchingMonthsWithNewQuery = getMonthsMatchingQuery(
            utils,
            startSection.formatValue,
            newQuery,
          );
          if (matchingMonthsWithNewQuery.length > 0) {
            updateSections(
              setSectionValue(
                state.sections,
                startSectionIndex,
                matchingMonthsWithNewQuery[0],
                newQuery,
              ),
            );
          }
        }

        event.preventDefault();
      }
    }
  });

  useEnhancedEffect(() => {
    if (!inputRef.current || state.selectedSectionIndex == null) {
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

    if (state.selectedSectionIndex === 'all') {
      updateSelectionRangeIfChanged(0, inputRef.current.value.length);
      return;
    }

    const section = state.sections[state.selectedSectionIndex];
    updateSelectionRangeIfChanged(
      section.start,
      section.start + getSectionVisibleValue(section).length,
    );
  });

  React.useEffect(() => {
    const valueParsed = valueManager.parseInput(utils, value);
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
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    inputProps: {
      value: state.valueStr,
      onClick: handleInputClick,
      onKeyDown: handleInputKeyDown,
    },
    inputRef,
  };
};
