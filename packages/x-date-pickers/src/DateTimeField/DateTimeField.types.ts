import * as React from 'react';
import { SlotComponentProps } from '@mui/base/utils';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { UseFieldInternalProps } from '../internals/hooks/useField';
import { DateTimeValidationError } from '../internals/hooks/validation/useDateTimeValidation';
import { DefaultizedProps, MakeOptional } from '../internals/models/helpers';
import {
  BaseDateValidationProps,
  DayValidationProps,
  MonthValidationProps,
  YearValidationProps,
} from '../internals/hooks/validation/models';

export interface UseDateTimeFieldParams<TDate, TChildProps extends {}> {
  props: UseDateTimeFieldComponentProps<TDate, TChildProps>;
  inputRef?: React.Ref<HTMLInputElement>;
}

export interface UseDateTimeFieldProps<TDate>
  extends MakeOptional<UseFieldInternalProps<TDate | null, DateTimeValidationError>, 'format'>,
    DayValidationProps<TDate>,
    MonthValidationProps<TDate>,
    YearValidationProps<TDate>,
    BaseDateValidationProps<TDate> {}

export type UseDateTimeFieldDefaultizedProps<TDate> = DefaultizedProps<
  UseDateTimeFieldProps<TDate>,
  'minDate' | 'maxDate' | 'disableFuture' | 'disablePast' | 'format'
>;

export type UseDateTimeFieldComponentProps<TDate, TChildProps extends {}> = Omit<
  TChildProps,
  keyof UseDateTimeFieldProps<TDate>
> &
  UseDateTimeFieldProps<TDate>;

export interface DateTimeFieldProps<TDate>
  extends UseDateTimeFieldComponentProps<TDate, TextFieldProps> {
  /**
   * Overrideable components.
   * @default {}
   */
  components?: DateTimeFieldSlotsComponent;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: DateTimeFieldSlotsComponentsProps<TDate>;
}

export type DateTimeFieldOwnerState<TDate> = DateTimeFieldProps<TDate>;

export interface DateTimeFieldSlotsComponent {
  /**
   * Input rendered.
   * @default TextField
   */
  Input?: React.ElementType;
}

export interface DateTimeFieldSlotsComponentsProps<TDate> {
  input?: SlotComponentProps<typeof TextField, {}, DateTimeFieldOwnerState<TDate>>;
}
