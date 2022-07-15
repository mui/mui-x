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
  focusInputSection,
  getDateSectionNameFromFormat,
  getInputSectionIndexFromCursorPosition,
  incrementDatePart,
  splitStringIntoSections,
} from './DateField.utils';
import { useUtils } from '../internals/hooks/useUtils';

const FORMAT = 'dd/MM/yyyy';

export const useDateField = <TInputDate, TDate = TInputDate>(
  inProps: UseDateFieldProps<TInputDate, TDate>,
): UseDateFieldResponse => {
  const utils = useUtils<TDate>();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const dateSectionToSelect = React.useRef<DateSectionName | null>(null);

  const { value, onChange } = inProps;

  const parsedValue = React.useMemo(
    () => datePickerValueManager.parseInput(utils, value),
    [utils, value],
  );

  const inputValueStr = React.useMemo(
    () => utils.formatByString(parsedValue, FORMAT),
    [utils, parsedValue],
  );

  const inputSections = React.useMemo<DateFieldInputSection[]>(() => {
    const formatSections = splitStringIntoSections(FORMAT);
    const tempInputSections = splitStringIntoSections(inputValueStr);

    return tempInputSections.map((el, index) => {
      return {
        ...el,
        dateSectionName: getDateSectionNameFromFormat(formatSections[index].value),
      };
    });
  }, [inputValueStr]);

  const handleInputClick = useEventCallback(() => {
    if (inputSections.length === 0) {
      return;
    }

    focusInputSection(inputRef, inputSections[0]);
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

    switch (event.key) {
      case 'ArrowRight': {
        if (startSectionIndex !== endSectionIndex) {
          focusInputSection(inputRef, inputSections[0]);
        }

        if (startSectionIndex < inputSections.length - 1) {
          focusInputSection(inputRef, inputSections[startSectionIndex + 1]);
        }

        break;
      }

      case 'ArrowLeft': {
        if (startSectionIndex !== endSectionIndex) {
          focusInputSection(inputRef, inputSections[inputSections.length - 1]);
        }

        if (startSectionIndex > 0) {
          focusInputSection(inputRef, inputSections[startSectionIndex - 1]);
        }

        break;
      }

      case 'ArrowUp':
      case 'ArrowDown': {
        const dateSectionName = inputSections[startSectionIndex].dateSectionName;
        const newDate = incrementDatePart(
          utils,
          parsedValue,
          dateSectionName,
          event.key === 'ArrowDown' ? -1 : 1,
        );
        dateSectionToSelect.current = dateSectionName;
        onChange(newDate);

        break;
      }

      default: {
        shouldPreventDefault = false;
      }
    }

    if (shouldPreventDefault) {
      event.preventDefault();
    }
  });

  useEnhancedEffect(() => {
    if (dateSectionToSelect.current != null) {
      focusInputSection(
        inputRef,
        inputSections.find((section) => section.dateSectionName === dateSectionToSelect.current)!,
      );
      dateSectionToSelect.current = null;
    }
  }, [parsedValue]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    inputProps: {
      value: inputValueStr,
      onClick: handleInputClick,
      onKeyDown: handleInputKeyDown,
    },
    inputRef,
  };
};
