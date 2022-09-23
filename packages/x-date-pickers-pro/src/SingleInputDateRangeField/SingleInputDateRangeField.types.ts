import * as React from 'react';
import { SlotComponentProps } from '@mui/base/utils';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { BaseDateValidationProps, DefaultizedProps } from '@mui/x-date-pickers/internals';
import { UseFieldInternalProps, FieldSection } from '@mui/x-date-pickers/internals-fields';
import { DateRange, DayRangeValidationProps } from '../internal/models';
import { DateRangeValidationError } from '../internal/hooks/validation/useDateRangeValidation';

export interface UseSingleInputDateRangeFieldParams<TDate, TChildProps extends {}> {
  props: UseSingleInputDateRangeFieldComponentProps<TDate, TChildProps>;
  inputRef?: React.Ref<HTMLInputElement>;
}

export interface UseSingleInputDateRangeFieldProps<TDate>
  extends UseFieldInternalProps<DateRange<TDate>, DateRangeValidationError>,
    DayRangeValidationProps<TDate>,
    BaseDateValidationProps<TDate> {}

export type UseSingleInputDateRangeFieldDefaultizedProps<TDate> = DefaultizedProps<
  UseSingleInputDateRangeFieldProps<TDate>,
  keyof BaseDateValidationProps<TDate>
>;

export type UseSingleInputDateRangeFieldComponentProps<TDate, TChildProps extends {}> = Omit<
  TChildProps,
  keyof UseSingleInputDateRangeFieldProps<TDate>
> &
  UseSingleInputDateRangeFieldProps<TDate>;

export interface SingleInputDateRangeFieldProps<TDate>
  extends UseSingleInputDateRangeFieldComponentProps<TDate, TextFieldProps> {
  /**
   * Overrideable components.
   * @default {}
   */
  components?: SingleInputDateRangeFieldSlotsComponent;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: SingleInputDateRangeFieldSlotsComponentsProps<TDate>;
}

export type SingleInputDateRangeFieldOwnerState<TDate> = SingleInputDateRangeFieldProps<TDate>;

export interface SingleInputDateRangeFieldSlotsComponent {
  /**
   * Input rendered.
   * @default TextField
   */
  Input?: React.ElementType;
}

export interface SingleInputDateRangeFieldSlotsComponentsProps<TDate> {
  input?: SlotComponentProps<typeof TextField, {}, SingleInputDateRangeFieldOwnerState<TDate>>;
}

export interface DateRangeFieldSection extends FieldSection {
  dateName: 'start' | 'end';
}
