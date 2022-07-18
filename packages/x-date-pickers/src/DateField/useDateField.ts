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
  updateSectionValue,
} from './DateField.utils';
import { useUtils } from '../internals/hooks/useUtils';

interface UseDateFieldState<TDate> {
  valueStr: string;
  valueParsed: TDate;
  sections: DateFieldInputSection[];
  selectedSectionIndex: number | 'all' | null;
  selectedSectionQuery: string | null;
}

export const useDateField = <TInputDate, TDate = TInputDate>(
  inProps: UseDateFieldProps<TInputDate, TDate>,
): UseDateFieldResponse => {
  const utils = useUtils<TDate>();
  const inputRef = React.useRef<HTMLInputElement>(null);

  const { value, onChange, format = 'dd/MM/yyyy' } = inProps;

  const parsedValue = React.useMemo(
    () => datePickerValueManager.parseInput(utils, value),
    [utils, value],
  );

  const [state, setState] = React.useState<UseDateFieldState<TDate>>(() => ({
    valueStr: utils.formatByString(parsedValue, format),
    valueParsed: parsedValue,
    sections: splitFormatIntoSections(utils, format, parsedValue),
    selectedSectionIndex: null,
    selectedSectionQuery: null,
  }));

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
    setState((prevState) => ({
      ...prevState,
      valueStr: utils.formatByString(parsedValue, format),
      valueParsed: parsedValue,
      sections: splitFormatIntoSections(utils, format, parsedValue),
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
      const newDate = incrementDatePartValue(
        utils,
        parsedValue,
        startSection.dateSectionName,
        event.key === 'ArrowDown' ? -1 : 1,
      );
      onChange(newDate);
      event.preventDefault();
      return;
    }

    if (event.key === 'a' && event.ctrlKey) {
      updateSelectedSection('all');
      event.preventDefault();
      return;
    }

    if (event.key === 'Backspace') {
      updateSections(updateSectionValue(state.sections, startSectionIndex, ''));
      event.preventDefault();
      return;
    }
    const numericKey = Number(event.key);

    if (!Number.isNaN(numericKey)) {
      const sectionLength = utils.formatByString(utils.date()!, startSection.formatValue).length;
      const newSectionValue =
        sectionLength === startSection.value.length
          ? event.key
          : `${startSection.value}${event.key}`;
      const newSections = updateSectionValue(state.sections, startSectionIndex, newSectionValue);
      updateSections(newSections);
      event.preventDefault();
      return;
    }

    if (event.key.match(/([A-zÀ-ÿ])/)) {
      console.log('TODO: Implement letter edition');
      event.preventDefault();
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
    updateSelectionRangeIfChanged(section.start, section.start + section.value.length);
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
