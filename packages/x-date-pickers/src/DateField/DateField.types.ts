import * as React from 'react';
import { SlotComponentProps } from '@mui/base/utils';
import TextField from '@mui/material/TextField';
import { UseFieldInternalProps } from '../internals/hooks/useField';
import { DateValidationError } from '../internals/hooks/validation/useDateValidation';
import { DefaultizedProps, MakeOptional } from '../internals/models/helpers';
import {
  BaseDateValidationProps,
  DayValidationProps,
  MonthValidationProps,
  YearValidationProps,
} from '../internals/hooks/validation/models';
import { FieldsTextFieldProps } from '../internals';

export interface UseDateFieldParams<TDate, TChildProps extends {}> {
  props: UseDateFieldComponentProps<TDate, TChildProps>;
  inputRef?: React.Ref<HTMLInputElement>;
}

export interface UseDateFieldProps<TDate>
  extends MakeOptional<UseFieldInternalProps<TDate | null, DateValidationError>, 'format'>,
    DayValidationProps<TDate>,
    MonthValidationProps<TDate>,
    YearValidationProps<TDate>,
    BaseDateValidationProps<TDate> {}

export type UseDateFieldDefaultizedProps<TDate> = DefaultizedProps<
  UseDateFieldProps<TDate>,
  keyof BaseDateValidationProps<TDate> | 'format'
>;

export type UseDateFieldComponentProps<TDate, TChildProps extends {}> = Omit<
  TChildProps,
  keyof UseDateFieldProps<TDate>
> &
  UseDateFieldProps<TDate>;

export interface DateFieldProps<TDate>
  extends UseDateFieldComponentProps<TDate, FieldsTextFieldProps> {
  /**
   * Overrideable components.
   * @default {}
   */
  components?: DateFieldSlotsComponent;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: DateFieldSlotsComponentsProps<TDate>;
}

export type DateFieldOwnerState<TDate> = DateFieldProps<TDate>;

export interface DateFieldSlotsComponent {
  /**
   * Form control with an input to render the value.
   * Receives the same props as `@mui/material/TextField`.
   * @default TextField from '@mui/material'
   */
  TextField?: React.ElementType;
}

export interface DateFieldSlotsComponentsProps<TDate> {
  textField?: SlotComponentProps<typeof TextField, {}, DateFieldOwnerState<TDate>>;
}
