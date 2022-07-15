import * as React from 'react';
import {
  unstable_useEnhancedEffect as useEnhancedEffect,
  useEventCallback,
} from '@mui/material/utils';
import {
  UseDateFieldProps,
  UseDateFieldResponse,
  DateSectionName,
  DateFieldState,
} from './DateField.interfaces';
import { datePickerValueManager } from '../DatePicker/shared';
import {
  createDateStrFromSections,
  focusInputSection,
  getInputSectionIndexFromCursorPosition,
  incrementDatePartValue,
  splitFormatIntoSections,
  updateSectionValue,
} from './DateField.utils';
import { useUtils } from '../internals/hooks/useUtils';

export const useDateField = <TInputDate, TDate = TInputDate>(
  inProps: UseDateFieldProps<TInputDate, TDate>,
): UseDateFieldResponse => {
  const utils = useUtils<TDate>();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const dateSectionToSelect = React.useRef<DateSectionName | null>(null);

  const { value, onChange, format = 'dd/MM/yyyy' } = inProps;

  const parsedValue = React.useMemo(
    () => datePickerValueManager.parseInput(utils, value),
    [utils, value],
  );

  const [state, setState] = React.useState<DateFieldState>(() => ({
    inputValue: utils.formatByString(parsedValue, format),
    inputSections: splitFormatIntoSections(utils, format, parsedValue),
  }));

  const handleInputClick = useEventCallback(() => {
    if (state.inputSections.length === 0) {
      return;
    }

    const sectionIndex = getInputSectionIndexFromCursorPosition(
      state.inputSections,
      inputRef.current!.selectionStart ?? 0,
    );
    focusInputSection(inputRef, state.inputSections[sectionIndex]);
  });

  const handleInputKeyDown = useEventCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!inputRef.current || state.inputSections.length === 0) {
      return;
    }

    const startSectionIndex = getInputSectionIndexFromCursorPosition(
      state.inputSections,
      inputRef.current.selectionStart ?? 0,
    );
    const endSectionIndex = getInputSectionIndexFromCursorPosition(
      state.inputSections,
      inputRef.current.selectionEnd ?? 0,
    );
    const startSection = state.inputSections[startSectionIndex];
    let shouldPreventDefault = true;

    if (event.key === 'ArrowRight') {
      if (startSectionIndex !== endSectionIndex) {
        focusInputSection(inputRef, state.inputSections[0]);
      } else if (startSectionIndex < state.inputSections.length - 1) {
        focusInputSection(inputRef, state.inputSections[startSectionIndex + 1]);
      }
    } else if (event.key === 'ArrowLeft') {
      if (startSectionIndex !== endSectionIndex) {
        focusInputSection(inputRef, state.inputSections[0]);
      } else if (startSectionIndex > 0) {
        focusInputSection(inputRef, state.inputSections[startSectionIndex - 1]);
      }
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      const dateSectionName = startSection.dateSectionName;
      const newDate = incrementDatePartValue(
        utils,
        parsedValue,
        dateSectionName,
        event.key === 'ArrowDown' ? -1 : 1,
      );
      dateSectionToSelect.current = dateSectionName;
      onChange(newDate);
    } else if (event.key === 'Backspace') {
      const newSections = updateSectionValue(state.inputSections, startSectionIndex, '');
      setState({
        inputValue: createDateStrFromSections(newSections),
        inputSections: newSections,
      });
    } else {
      const numericKey = Number(event.key);
      if (Number.isNaN(numericKey)) {
        shouldPreventDefault = false;
      } else {
        const sectionLength = utils.formatByString(utils.date()!, startSection.formatValue).length;
        const newSectionValue =
          sectionLength === startSection.value.length
            ? event.key
            : `${startSection.value}${event.key}`;
        const newSections = updateSectionValue(
          state.inputSections,
          startSectionIndex,
          newSectionValue,
        );
        const newInputValue = createDateStrFromSections(newSections);
        setState({
          inputValue: newInputValue,
          inputSections: newSections,
        });
        dateSectionToSelect.current = startSection.dateSectionName;

        const newParsedValue = utils.parse(newInputValue, format);
        if (utils.isValid(newParsedValue)) {
          onChange(newParsedValue);
        }
      }
    }

    if (shouldPreventDefault) {
      event.preventDefault();
    }
  });

  React.useEffect(() => {
    setState({
      inputValue: utils.formatByString(parsedValue, format),
      inputSections: splitFormatIntoSections(utils, format, parsedValue),
    });
  }, [utils, parsedValue, format]);

  useEnhancedEffect(() => {
    if (dateSectionToSelect.current != null) {
      focusInputSection(
        inputRef,
        state.inputSections.find(
          (section) => section.dateSectionName === dateSectionToSelect.current,
        )!,
      );
      dateSectionToSelect.current = null;
    }
  }, [state]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    inputProps: {
      value: state.inputValue,
      onClick: handleInputClick,
      onKeyDown: handleInputKeyDown,
    },
    inputRef,
  };
};
