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
    value: TValue,
    format: string,
  ) => TSection[];
  getValueStrFromSections: (sections: TSection[]) => string;
  getValueFromSections: (
    utils: MuiPickersAdapter<TDate>,
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
  /**
   * @default "dd/MM/yyyy"
   */
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
    const sections = fieldValueManager.getSectionsFromValue(utils, valueParsed, format);

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
      sections,
      format,
    );

    const cleanSections = fieldValueManager.getSectionsFromValue(utils, newValueParsed, format);

    setState((prevState) => ({
      ...prevState,
      sections: cleanSections,
      valueStr: fieldValueManager.getValueStrFromSections(cleanSections),
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

  React.useEffect(() => {
    const valueParsed = valueManager.parseInput(utils, value);
    if (!valueManager.areValuesEqual(utils, state.valueParsed, valueParsed)) {
      const sections = fieldValueManager.getSectionsFromValue(utils, valueParsed, format);
      setState((prevState) => ({
        ...prevState,
        valueParsed,
        valueStr: fieldValueManager.getValueStrFromSections(sections),
        sections,
      }));
    }
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

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
          activeDate.value ?? utils.date()!,
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
            : newSectionNumericValue.toString();
        updateSections(setSectionValue(state.sections, startSectionIndex, newSectionValue));
      } else {
        const newDate = incrementDatePartValue(
          utils,
          activeDate.value,
          startSection.dateSectionName,
          event.key === 'ArrowDown' ? -1 : 1,
        );

        const newValue = activeDate.update(newDate);
        const sections = fieldValueManager.getSectionsFromValue(utils, newValue, format);

        updateSections(sections);
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
        activeDate.value ?? utils.date()!,
        startSection.dateSectionName,
      );

      const concatenatedSectionValue = `${startSection.value}${event.key}`;
      const newSectionValue =
        Number(concatenatedSectionValue) > boundaries.maximum
          ? event.key
          : concatenatedSectionValue;

      updateSections(
        setSectionValue(state.sections, startSectionIndex, Number(newSectionValue).toString()),
      );
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
