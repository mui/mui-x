import { TextFieldProps } from '@mui/material/TextField';
import { BaseDateValidationProps, DefaultizedProps } from '@mui/x-date-pickers/internals';
import { UseFieldInternalProps, FieldSection } from '@mui/x-date-pickers/internals-fields';
import { DateRange, DayRangeValidationProps } from '../internal/models';
import { DateRangeValidationError } from '../internal/hooks/validation/useDateRangeValidation';

export interface UseSingleInputDateRangeFieldProps<TInputDate, TDate>
  extends UseFieldInternalProps<DateRange<TInputDate>, DateRange<TDate>, DateRangeValidationError>,
    DayRangeValidationProps<TDate>,
    BaseDateValidationProps<TDate> {}

export type UseSingleInputDateRangeFieldDefaultizedProps<TInputDate, TDate> = DefaultizedProps<
  UseSingleInputDateRangeFieldProps<TInputDate, TDate>,
  'minDate' | 'maxDate' | 'disableFuture' | 'disablePast'
>;

export type UseSingleInputDateRangeFieldComponentProps<
  TInputDate,
  TDate,
  ChildProps extends {},
> = Omit<ChildProps, 'value' | 'defaultValue' | 'onChange' | 'onError'> &
  UseSingleInputDateRangeFieldProps<TInputDate, TDate>;

export type SingleInputDateRangeFieldProps<TInputDate, TDate> =
  UseSingleInputDateRangeFieldComponentProps<TInputDate, TDate, TextFieldProps>;

export interface DateRangeFieldSection extends FieldSection {
  dateName: 'start' | 'end';
}
