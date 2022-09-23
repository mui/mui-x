import { TextFieldProps } from '@mui/material/TextField';
import { BaseDateValidationProps, DefaultizedProps } from '@mui/x-date-pickers/internals';
import { UseFieldInternalProps, FieldSection } from '@mui/x-date-pickers/internals-fields';
import { DateRange, DayRangeValidationProps } from '../internal/models';
import { DateRangeValidationError } from '../internal/hooks/validation/useDateRangeValidation';

export interface UseSingleInputDateRangeFieldProps<TDate>
  extends UseFieldInternalProps<DateRange<TDate>, DateRangeValidationError>,
    DayRangeValidationProps<TDate>,
    BaseDateValidationProps<TDate> {}

export type UseSingleInputDateRangeFieldDefaultizedProps<TDate> = DefaultizedProps<
  UseSingleInputDateRangeFieldProps<TDate>,
  'minDate' | 'maxDate' | 'disableFuture' | 'disablePast'
>;

export type UseSingleInputDateRangeFieldComponentProps<TDate, ChildProps extends {}> = Omit<
  ChildProps,
  'value' | 'defaultValue' | 'onChange' | 'onError'
> &
  UseSingleInputDateRangeFieldProps<TDate>;

export type SingleInputDateRangeFieldProps<TDate> = UseSingleInputDateRangeFieldComponentProps<
  TDate,
  TextFieldProps
>;

export interface DateRangeFieldSection extends FieldSection {
  dateName: 'start' | 'end';
}
