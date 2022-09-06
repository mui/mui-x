import * as React from 'react';
import { TextFieldProps } from '@mui/material/TextField';
import { SlotComponentProps } from '@mui/base/utils';
import { UseFieldInternalProps } from '../internals/hooks/useField';
import {
  DateValidationError,
  DateValidationProps,
} from '../internals/hooks/validation/useDateValidation';
import { DefaultizedProps } from '../internals/models/helpers';

export interface UseDateFieldProps<TInputDate, TDate>
  extends UseFieldInternalProps<TInputDate | null, TDate | null, DateValidationError>,
    Partial<Omit<DateValidationProps<TInputDate, TDate>, 'value'>> {}

export type UseDateFieldDefaultizedProps<TInputDate, TDate> = DefaultizedProps<
  UseDateFieldProps<TInputDate, TDate>,
  'minDate' | 'maxDate' | 'disableFuture' | 'disablePast'
>;

export type UseDateFieldComponentProps<TInputDate, TDate, ChildProps extends {}> = Omit<
  ChildProps,
  'value' | 'defaultValue' | 'onChange' | 'onError'
> &
  UseDateFieldProps<TInputDate, TDate>;

export interface DateFieldProps<TInputDate, TDate>
  extends UseDateFieldComponentProps<TInputDate, TDate, TextFieldProps> {
  /**
   * Overrideable components.
   * @default {}
   */
  components?: Partial<DateFieldSlotsComponent>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: Partial<DateFieldSlotsComponentsProps<TInputDate, TDate>>;
}

export type DateFieldOwnerState<TInputDate, TDate> = DateFieldProps<TInputDate, TDate>;

export interface DateFieldSlotsComponent {
  /**
   * Root element.
   */
  Root: React.ElementType;
  /**
   * Input rendered.
   * @default Input
   * **/
  Input: React.ElementType;
}

export interface DateFieldSlotsComponentsProps<TDate, TInputDate> {
  root: SlotComponentProps<'div', {}, DateFieldOwnerState<TDate, TInputDate>>;
  input: SlotComponentProps<'input', {}, DateFieldOwnerState<TDate, TInputDate>>;
}
