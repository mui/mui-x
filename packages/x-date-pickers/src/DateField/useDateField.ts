import * as React from 'react';
import {
  unstable_useEnhancedEffect as useEnhancedEffect,
  useEventCallback,
} from '@mui/material/utils';
import {
  UseDateFieldProps,
  UseDateFieldResponse,
  DateFieldInputSection,
  DateSectionName,
} from './DateField.interfaces';
import { datePickerValueManager } from '../DatePicker/shared';
import {
  createDateStrFromSections,
  focusInputSection,
  getDateSectionNameFromFormat,
  getInputSectionIndexFromCursorPosition,
  incrementDatePartValue,
  splitStringIntoSections,
  updateSectionValue,
} from './DateField.utils';
import { useUtils } from '../internals/hooks/useUtils';

export const useDateField = <TInputDate, TDate = TInputDate>(
  inProps: UseDateFieldProps<TInputDate, TDate>,
): UseDateFieldResponse => {
  const utils = useUtils<TDate>();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const dateSectionToSelect = React.useRef<DateSectionName | null>(null);

  const { value, onChange, format = 'dd / MM / yyyy' } = inProps;

  const parsedValue = React.useMemo(
    () => datePickerValueManager.parseInput(utils, value),
    [utils, value],
  );

  const [inputValue, setInputValue] = React.useState(() =>
    utils.formatByString(parsedValue, format),
  );

  const formatSections = React.useMemo(() => splitStringIntoSections(format), [format]);

  const inputSections = React.useMemo<DateFieldInputSection[]>(
    () =>
      splitStringIntoSections(inputValue).map((el, index) => ({
        ...el,
        dateSectionName: getDateSectionNameFromFormat(formatSections[index].value),
      })),
    [inputValue, formatSections],
  );

  const handleInputClick = useEventCallback(() => {
    if (inputSections.length === 0) {
      return;
    }

    const sectionIndex = getInputSectionIndexFromCursorPosition(
      inputSections,
      inputRef.current!.selectionStart ?? 0,
    );
    focusInputSection(inputRef, inputSections[sectionIndex]);
  });

  const handleInputKeyDown = useEventCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!inputRef.current || inputSections.length === 0) {
      return;
    }

    let shouldPreventDefault = true;

    const startSectionIndex = getInputSectionIndexFromCursorPosition(
      inputSections,
      inputRef.current.selectionStart ?? 0,
    );
    const endSectionIndex = getInputSectionIndexFromCursorPosition(
      inputSections,
      inputRef.current.selectionEnd ?? 0,
    );
    const startSection = inputSections[startSectionIndex];

    if (event.key === 'ArrowRight') {
      if (startSectionIndex !== endSectionIndex) {
        focusInputSection(inputRef, inputSections[0]);
      }
      if (startSectionIndex < inputSections.length - 1) {
        focusInputSection(inputRef, inputSections[startSectionIndex + 1]);
      }
    } else if (event.key === 'ArrowLeft') {
      if (startSectionIndex !== endSectionIndex) {
        focusInputSection(inputRef, inputSections[inputSections.length - 1]);
      }
      if (startSectionIndex > 0) {
        focusInputSection(inputRef, inputSections[startSectionIndex - 1]);
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
      const newSections = updateSectionValue(inputSections, startSectionIndex, '');
      setInputValue(createDateStrFromSections(newSections));
    } else {
      const numericKey = Number(event.key);
      if (Number.isNaN(numericKey)) {
        shouldPreventDefault = false;
      } else {
        // TODO: Reset based on the current section value
        const shouldReset = false;
        const newSectionValue = shouldReset ? event.key : `${startSection.value}${event.key}`;
        const newSections = updateSectionValue(inputSections, startSectionIndex, newSectionValue);
        setInputValue(createDateStrFromSections(newSections));
        dateSectionToSelect.current = startSection.dateSectionName;
      }
    }

    if (shouldPreventDefault) {
      event.preventDefault();
    }
  });

  React.useEffect(() => {
    setInputValue(utils.formatByString(parsedValue, format));
  }, [utils, parsedValue, format]);

  useEnhancedEffect(() => {
    if (dateSectionToSelect.current != null) {
      focusInputSection(
        inputRef,
        inputSections.find((section) => section.dateSectionName === dateSectionToSelect.current)!,
      );
      dateSectionToSelect.current = null;
    }
  }, [inputValue]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    inputProps: {
      value: inputValue,
      onClick: handleInputClick,
      onKeyDown: handleInputKeyDown,
    },
    inputRef,
  };
};
