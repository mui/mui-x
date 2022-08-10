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
  selectedSectionIndexes: { start: number; end: number } | null;
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

    if (shouldPublish) {
      onChange(newValueParsed);
    }
  };

  const updateSelectedSections = (
    selectedSectionIndexes: UseDateFieldState<TDate, TSection>['selectedSectionIndexes'] | number,
  ) => {
    setState((prevState) => ({
      ...prevState,
      selectedSectionIndexes:
        typeof selectedSectionIndexes === 'number'
          ? { start: selectedSectionIndexes, end: selectedSectionIndexes }
          : selectedSectionIndexes,
      selectedSectionQuery: null,
    }));
  };

  const handleInputClick = useEventCallback(() => {
    if (state.sections.length === 0) {
      return;
    }

    const nextSectionIndex = state.sections.findIndex(
      (section) => section.start > (inputRef.current?.selectionStart ?? 0),
    );
    const sectionIndex = nextSectionIndex === -1 ? state.sections.length - 1 : nextSectionIndex - 1;

    updateSelectedSections(sectionIndex);
  });

  const handleInputKeyDown = useEventCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!inputRef.current || state.sections.length === 0) {
      return;
    }

    // eslint-disable-next-line default-case
    switch (true) {
      // Select all
      case event.key === 'a' && event.ctrlKey: {
        updateSelectedSections({ start: 0, end: state.sections.length - 1 });
        event.preventDefault();
        return;
      }

      // Move selection to next section
      case event.key === 'ArrowRight': {
        if (state.selectedSectionIndexes == null) {
          updateSelectedSections(0);
        } else if (state.selectedSectionIndexes.start !== state.selectedSectionIndexes.end) {
          updateSelectedSections(state.selectedSectionIndexes.end);
        } else if (state.selectedSectionIndexes.start < state.sections.length - 1) {
          updateSelectedSections(state.selectedSectionIndexes.start + 1);
        }

        event.preventDefault();
        return;
      }

      // Move selection to previous section
      case event.key === 'ArrowLeft': {
        if (state.selectedSectionIndexes == null) {
          updateSelectedSections(state.sections.length - 1);
        } else if (state.selectedSectionIndexes.start !== state.selectedSectionIndexes.end) {
          updateSelectedSections(state.selectedSectionIndexes.start);
        } else if (state.selectedSectionIndexes.start > 0) {
          updateSelectedSections(state.selectedSectionIndexes.start - 1);
        }
        event.preventDefault();
        return;
      }

      // Reset the value of the selected section
      case event.key === 'Backspace': {
        // TODO: Allow to reset all the selected sections
        updateSections(
          setSectionValue(state.sections, state.selectedSectionIndexes?.start ?? 0, ''),
        );
        event.preventDefault();
        return;
      }

      // Increment / decrement the selected section value
      case event.key === 'ArrowUp' || event.key === 'ArrowDown': {
        if (state.selectedSectionIndexes == null) {
          return;
        }

        const activeSection = state.sections[state.selectedSectionIndexes.start];
        const activeDate = fieldValueManager.getActiveDateFromActiveSection(
          state.valueParsed,
          activeSection,
        );

        // The date is not valid, we have to increment the section value rather than the date
        if (!utils.isValid(activeDate.value)) {
          const boundaries = getSectionValueNumericBoundaries(
            utils,
            utils.date(),
            activeSection.dateSectionName,
          );

          let newSectionNumericValue: number;
          if (activeSection.value === '') {
            newSectionNumericValue =
              event.key === 'ArrowDown' ? boundaries.minimum : boundaries.maximum;
          } else {
            const currentNumericValue =
              activeSection.formatValue === 'MMMM'
                ? getMonthList(utils, activeSection.formatValue).indexOf(activeSection.value)
                : Number(activeSection.value);
            newSectionNumericValue = currentNumericValue + (event.key === 'ArrowDown' ? -1 : 1);
            if (newSectionNumericValue < boundaries.minimum) {
              newSectionNumericValue = boundaries.maximum;
            } else if (newSectionNumericValue > boundaries.maximum) {
              newSectionNumericValue = boundaries.minimum;
            }
          }

          // TODO: Make generic
          const newSectionValue =
            activeSection.formatValue === 'MMMM'
              ? getMonthList(utils, activeSection.formatValue)[newSectionNumericValue]
              : cleanTrailingZeroInNumericSectionValue(
                  newSectionNumericValue.toString(),
                  boundaries.maximum,
                );
          updateSections(
            setSectionValue(state.sections, state.selectedSectionIndexes.start, newSectionValue),
          );
        } else {
          const newDate = incrementDatePartValue(
            utils,
            activeDate.value,
            activeSection.dateSectionName,
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
        return;
      }

      // Apply numeric editing on the selected section value
      case !Number.isNaN(Number(event.key)): {
        if (state.selectedSectionIndexes == null) {
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
        event.preventDefault();
        return;
      }

      // Apply full letter editing on the selected section value
      case event.key.length === 1: {
        if (state.selectedSectionIndexes == null) {
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

        event.preventDefault();
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
