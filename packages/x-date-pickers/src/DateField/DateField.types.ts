import * as React from 'react';
import { SlotComponentProps } from '@mui/base/utils';
import { TextFieldProps } from '@mui/material/TextField';
import { UseFieldInternalProps } from '../internals/hooks/useField';
import {
  DateValidationError,
  DateValidationProps,
} from '../internals/hooks/validation/useDateValidation';
import { DefaultizedProps } from '../internals/models/helpers';

export interface UseDateFieldParams<TInputDate, TDate, TChildProps extends {}> {
  props: UseDateFieldComponentProps<TInputDate, TDate, TChildProps>;
  inputRef?: React.Ref<HTMLInputElement>;
}

export interface UseDateFieldProps<TInputDate, TDate>
  extends UseFieldInternalProps<TInputDate | null, TDate | null, DateValidationError>,
    Partial<Omit<DateValidationProps<TInputDate, TDate>, 'value'>> {}

export type UseDateFieldDefaultizedProps<TInputDate, TDate> = DefaultizedProps<
  UseDateFieldProps<TInputDate, TDate>,
  'minDate' | 'maxDate' | 'disableFuture' | 'disablePast'
>;

export type UseDateFieldComponentProps<TInputDate, TDate, TChildProps extends {}> = Omit<
  TChildProps,
  keyof UseDateFieldProps<TInputDate, TDate>
> &
  UseDateFieldProps<TInputDate, TDate>;

export interface DateFieldProps<TInputDate, TDate>
  extends UseDateFieldComponentProps<TInputDate, TDate, TextFieldProps> {
  /**
   * Overrideable components.
   * @default {}
   */
  components?: DateFieldSlotsComponent;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: DateFieldSlotsComponentsProps<TInputDate, TDate>;
}

export type DateFieldOwnerState<TInputDate, TDate> = DateFieldProps<TInputDate, TDate>;

export interface DateFieldSlotsComponent {
  /**
   * Input rendered.
   * @default TextField
   * **/
  Input?: React.ElementType;
}

export interface DateFieldSlotsComponentsProps<TDate, TInputDate> {
  input?: SlotComponentProps<'input', {}, DateFieldOwnerState<TDate, TInputDate>>;
}
