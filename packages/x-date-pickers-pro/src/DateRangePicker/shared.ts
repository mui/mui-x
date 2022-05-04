import * as React from 'react';
import {
  BasePickerProps,
  DateInputSlotsComponent,
  PickerStateValueManager,
  useDefaultDates,
  useUtils,
  ValidationProps,
} from '@mui/x-date-pickers/internals';
import { useThemeProps } from '@mui/material/styles';
import {
  DateRangePickerViewSlotsComponent,
  ExportedDateRangePickerViewProps,
} from './DateRangePickerView';
import { DateRangeValidationError } from '../internal/hooks/validation/useDateRangeValidation';
import { DateRange } from '../internal/models';
import { parseRangeInputValue } from '../internal/utils/date-utils';
import { ExportedDateRangePickerInputProps } from './DateRangePickerInput';

interface DateRangePickerSlotsComponent
  extends DateRangePickerViewSlotsComponent,
    DateInputSlotsComponent {}

export interface BaseDateRangePickerProps<TInputDate, TDate>
  extends Omit<BasePickerProps<DateRange<TInputDate>, DateRange<TDate>>, 'orientation'>,
    ExportedDateRangePickerViewProps<TDate>,
    ValidationProps<DateRangeValidationError, DateRange<TInputDate>>,
    ExportedDateRangePickerInputProps<TInputDate, TDate> {
  /**
   * The components used for each slot.
   * Either a string to use an HTML element or a component.
   * @default {}
   */
  components?: Partial<DateRangePickerSlotsComponent>;
  /**
   * Text for end input label and toolbar placeholder.
   * @default 'End'
   */
  endText?: React.ReactNode;
  /**
   * Custom mask. Can be used to override generate from format. (e.g. `__/__/____ __:__` or `__/__/____ __:__ _M`).
   * @default '__/__/____'
   */
  mask?: ExportedDateRangePickerInputProps<TInputDate, TDate>['mask'];
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
  TInputDate,
  TDate,
  Props extends BaseDateRangePickerProps<TInputDate, TDate>,
>(
  props: Props,
  name: string,
): DefaultizedProps<Props> &
  Required<
    Pick<
      BaseDateRangePickerProps<TInputDate, TDate>,
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

export const dateRangePickerValueManager: PickerStateValueManager<[any, any], [any, any], any> = {
  emptyValue: [null, null],
  getTodayValue: (utils) => [utils.date()!, utils.date()!],
  parseInput: parseRangeInputValue,
  areValuesEqual: (utils, a, b) => utils.isEqual(a[0], b[0]) && utils.isEqual(a[1], b[1]),
};
