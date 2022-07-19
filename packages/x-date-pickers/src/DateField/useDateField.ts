import * as React from 'react';
import {
  unstable_useEnhancedEffect as useEnhancedEffect,
  useEventCallback,
} from '@mui/material/utils';
import {
  UseDateFieldProps,
  UseDateFieldResponse,
  DateFieldInputSection,
} from './DateField.interfaces';
import { datePickerValueManager } from '../DatePicker/shared';
import {
  createDateStrFromSections,
  getSectionIndexFromCursorPosition,
  incrementDatePartValue,
  splitFormatIntoSections,
  setSectionValue,
  getMonthsMatchingQuery,
  formatDateWithPlaceholder,
  getSectionVisibleValue,
  getMonthList,
  getSectionValueNumericBoundaries,
} from './DateField.utils';
import { useUtils } from '../internals/hooks/useUtils';

interface UseDateFieldState<TDate> {
  valueStr: string;
  valueParsed: TDate | null;
  sections: DateFieldInputSection[];
  selectedSectionIndex: number | 'all' | null;
}

export const useDateField = <TInputDate, TDate = TInputDate>(
  inProps: UseDateFieldProps<TInputDate, TDate>,
): UseDateFieldResponse => {
  const utils = useUtils<TDate>();
  const inputRef = React.useRef<HTMLInputElement>(null);

  const { value, onChange, format = 'dd/MM/yyyy' } = inProps;

  const parsedValue = React.useMemo<TDate | null>(
    () => datePickerValueManager.parseInput(utils, value),
    [utils, value],
  );

  const [state, setState] = React.useState<UseDateFieldState<TDate>>(() => {
    const sections = splitFormatIntoSections(utils, format, parsedValue);
    return {
      valueStr: createDateStrFromSections(sections),
      valueParsed: parsedValue,
      sections,
      selectedSectionIndex: null,
    };
  });

  const updateSections = (sections: DateFieldInputSection[]) => {
    const newValueStr = createDateStrFromSections(sections);
    const newValueParsed = utils.parse(newValueStr, format)!;
    const isNewDateValid = utils.isValid(newValueParsed);

    setState((prevState) => {
      return {
        ...prevState,
        sections,
        valueStr: newValueStr,
        valueParsed: isNewDateValid ? newValueParsed : prevState.valueParsed,
      };
    });

    if (isNewDateValid) {
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

  if (!utils.isEqual(state.valueParsed, parsedValue)) {
    const sections = splitFormatIntoSections(utils, format, parsedValue);
    setState((prevState) => ({
      ...prevState,
      valueStr: createDateStrFromSections(sections),
      valueParsed: parsedValue,
      sections,
    }));
  }

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

    if (event.key === 'ArrowRight') {
      if (startSectionIndex !== endSectionIndex) {
        updateSelectedSection(0);
      } else if (startSectionIndex < state.sections.length - 1) {
        updateSelectedSection(startSectionIndex + 1);
      }

      event.preventDefault();
      return;
    }

    if (event.key === 'ArrowLeft') {
      if (startSectionIndex !== endSectionIndex) {
        updateSelectedSection(0);
      } else if (startSectionIndex > 0) {
        updateSelectedSection(startSectionIndex - 1);
      }
      event.preventDefault();
      return;
    }

    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      // Some sections are empty, we can't use the date format
      if (state.sections.some((section) => section.value === '')) {
        const boundaries = getSectionValueNumericBoundaries(
          utils,
          parsedValue ?? utils.date()!,
          startSection.dateSectionName,
        );
        if (startSection.value === '') {
          const newNumericSectionValue =
            event.key === 'ArrowDown' ? boundaries.minimum : boundaries.maximum;
          // TODO: Make generic
          const newSectionValue =
            startSection.formatValue === 'MMMM'
              ? getMonthList(utils, startSection.formatValue)[newNumericSectionValue]
              : newNumericSectionValue.toString();
          updateSections(setSectionValue(state.sections, startSectionIndex, newSectionValue));
        } else {
          throw new Error('MUI: Not implemented yet');
        }
      } else {
        const newDate = incrementDatePartValue(
          utils,
          parsedValue,
          startSection.dateSectionName,
          event.key === 'ArrowDown' ? -1 : 1,
        );
        onChange(newDate);
      }

      event.preventDefault();
      return;
    }

    if (event.key === 'a' && event.ctrlKey) {
      updateSelectedSection('all');
      event.preventDefault();
      return;
    }

    if (event.key === 'Backspace') {
      updateSections(setSectionValue(state.sections, startSectionIndex, ''));
      event.preventDefault();
      return;
    }
    const numericKey = Number(event.key);

    if (!Number.isNaN(numericKey)) {
      const boundaries = getSectionValueNumericBoundaries(
        utils,
        parsedValue ?? utils.date()!,
        startSection.dateSectionName,
      );

      const concatenatedSectionValue = `${startSection.value}${event.key}`;
      const newSectionValue =
        Number(concatenatedSectionValue) > boundaries.maximum
          ? event.key
          : concatenatedSectionValue;
      updateSections(setSectionValue(state.sections, startSectionIndex, newSectionValue));
      event.preventDefault();
      return;
    }

    if (event.key.length === 1) {
      // TODO: Make generic
      if (startSection.formatValue === 'MMMM') {
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

  return {
    inputProps: {
      value: state.valueStr,
      onClick: handleInputClick,
      onKeyDown: handleInputKeyDown,
    },
    inputRef,
  };
};
