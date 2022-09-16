import * as React from 'react';
import { SlotComponentProps } from '@mui/base/utils';
import { TextFieldProps } from '@mui/material/TextField';
import { DefaultizedProps } from '@mui/x-date-pickers/internals';
import { UseFieldInternalProps, FieldSection } from '@mui/x-date-pickers/internals-fields';
import { DateRange } from '../internal/models';
import {
  DateRangeValidationError,
  DateRangeValidationProps,
} from '../internal/hooks/validation/useDateRangeValidation';

export interface UseSingleInputDateRangeFieldParams<TInputDate, TDate, TChildProps extends {}> {
  props: UseSingleInputDateRangeFieldComponentProps<TInputDate, TDate, TChildProps>;
  inputRef?: React.Ref<HTMLInputElement>;
}

export interface UseSingleInputDateRangeFieldProps<TInputDate, TDate>
  extends UseFieldInternalProps<DateRange<TInputDate>, DateRange<TDate>, DateRangeValidationError>,
    Partial<Omit<DateRangeValidationProps<TInputDate, TDate>, 'value'>> {}

export type UseSingleInputDateRangeFieldDefaultizedProps<TInputDate, TDate> = DefaultizedProps<
  UseSingleInputDateRangeFieldProps<TInputDate, TDate>,
  'minDate' | 'maxDate' | 'disableFuture' | 'disablePast'
>;

export type UseSingleInputDateRangeFieldComponentProps<
  TInputDate,
  TDate,
  TChildProps extends {},
> = Omit<TChildProps, keyof UseSingleInputDateRangeFieldProps<TInputDate, TDate>> &
  UseSingleInputDateRangeFieldProps<TInputDate, TDate>;

export interface SingleInputDateRangeFieldProps<TInputDate, TDate>
  extends UseSingleInputDateRangeFieldComponentProps<TInputDate, TDate, TextFieldProps> {
  /**
   * Overrideable components.
   * @default {}
   */
  components?: SingleInputDateRangeFieldSlotsComponent;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: SingleInputDateRangeFieldSlotsComponentsProps<TInputDate, TDate>;
}

export type SingleInputDateRangeFieldOwnerState<TInputDate, TDate> = SingleInputDateRangeFieldProps<
  TInputDate,
  TDate
>;

export interface SingleInputDateRangeFieldSlotsComponent {
  /**
   * Input rendered.
   * @default TextField
   */
  Input?: React.ElementType;
}

export interface SingleInputDateRangeFieldSlotsComponentsProps<TDate, TInputDate> {
  input?: SlotComponentProps<'input', {}, SingleInputDateRangeFieldOwnerState<TDate, TInputDate>>;
}

export interface DateRangeFieldSection extends FieldSection {
  dateName: 'start' | 'end';
}
