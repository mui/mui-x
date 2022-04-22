import * as React from 'react';
import {
  ParseableDate,
  useDefaultDates,
  useUtils,
  ValidationProps,
} from '@mui/x-date-pickers/internals';
import { useThemeProps } from '@mui/material/styles';
import { ExportedDateRangePickerViewProps } from './DateRangePickerView';
import { DateRangeValidationError } from '../internal/hooks/validation/useDateRangeValidation';
import { DateRange } from '../internal/models';
import { ExportedDateRangePickerInputProps } from './DateRangePickerInput';

export interface BaseDateRangePickerProps<TDate, TInputDate extends ParseableDate<TDate>>
  extends ExportedDateRangePickerViewProps<TDate, TInputDate>,
    ValidationProps<DateRangeValidationError, DateRange<TInputDate>>,
    ExportedDateRangePickerInputProps<TDate, TInputDate> {
  /**
   * The components used for each slot.
   * Either a string to use an HTML element or a component.
   * @default {}
   */
  components?: ExportedDateRangePickerViewProps<TDate, TInputDate>['components'] &
    ExportedDateRangePickerInputProps<TDate, TInputDate>['components'];
  /**
   * Text for end input label and toolbar placeholder.
   * @default 'End'
   */
  endText?: React.ReactNode;
  /**
   * Custom mask. Can be used to override generate from format. (e.g. `__/__/____ __:__` or `__/__/____ __:__ _M`).
   * @default '__/__/____'
   */
  mask?: ExportedDateRangePickerInputProps<TDate, TInputDate>['mask'];
  /**
   * Callback fired when the value (the selected date range) changes @DateIOType.
   * @template TDate
   * @param {DateRange<TDate>} date The new parsed date range.
   * @param {string} keyboardInputValue The current value of the keyboard input.
   */
  onChange: (date: DateRange<TDate>, keyboardInputValue?: string) => void;
  /**
   * Text for start input label and toolbar placeholder.
   * @default 'Start'
   */
  startText?: React.ReactNode;
}

export type DefaultizedProps<Props> = Props & { inputFormat: string };

export function useDateRangePickerDefaultizedProps<
  TDate,
  TInputDate extends ParseableDate<TDate>,
  Props extends BaseDateRangePickerProps<TDate, TInputDate>,
>(
  props: Props,
  name: string,
): DefaultizedProps<Props> &
  Required<
    Pick<
      BaseDateRangePickerProps<TDate, TInputDate>,
      'calendars' | 'mask' | 'startText' | 'endText'
    >
  > {
  const utils = useUtils<TDate>();
  const defaultDates = useDefaultDates();

  // This is technically unsound if the type parameters appear in optional props.
  // Optional props can be filled by `useThemeProps` with types that don't match the type parameters.
  const themeProps = useThemeProps({
    props,
    name,
  });

  return {
    calendars: 2,
    mask: '__/__/____',
    startText: 'Start',
    endText: 'End',
    inputFormat: utils.formats.keyboardDate,
    minDate: defaultDates.minDate,
    maxDate: defaultDates.maxDate,
    ...themeProps,
  };
}
