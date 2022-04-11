import * as React from 'react';
import { ValidationProps } from '@mui/x-date-pickers/internals';
import { ExportedDateRangePickerViewProps } from './DateRangePickerView';
import { DateRangeValidationError } from '../internal/hooks/validation/useDateRangeValidation';
import { DateRange, RangeInput } from '../internal/models';
import { ExportedDateRangePickerInputProps } from './DateRangePickerInput';

export interface BaseDateRangePickerProps<TDate>
  extends ExportedDateRangePickerViewProps<TDate>,
    ValidationProps<DateRangeValidationError, RangeInput<TDate>>,
    ExportedDateRangePickerInputProps {
  /**
   * The components used for each slot.
   * Either a string to use an HTML element or a component.
   * @default {}
   */
  components?: ExportedDateRangePickerViewProps<TDate>['components'] &
    ExportedDateRangePickerInputProps['components'];
  /**
   * Text for end input label and toolbar placeholder.
   * @default 'End'
   */
  endText?: React.ReactNode;
  /**
   * Custom mask. Can be used to override generate from format. (e.g. `__/__/____ __:__` or `__/__/____ __:__ _M`).
   * @default '__/__/____'
   */
  mask?: ExportedDateRangePickerInputProps['mask'];
  /**
   * Min selectable date. @DateIOType
   * @default defaultMinDate
   */
  minDate?: TDate;
  /**
   * Max selectable date. @DateIOType
   * @default defaultMaxDate
   */
  maxDate?: TDate;
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
  /**
   * The value of the date range picker.
   */
  value: RangeInput<TDate>;
}
