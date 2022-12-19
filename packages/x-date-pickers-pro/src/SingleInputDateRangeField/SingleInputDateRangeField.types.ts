import * as React from 'react';
import { SlotComponentProps } from '@mui/base/utils';
import TextField from '@mui/material/TextField';
import { FieldsTextFieldProps } from '@mui/x-date-pickers/internals/models';
import { UseDateRangeFieldDefaultizedProps, UseDateRangeFieldProps } from '../internal/models';

export interface UseSingleInputDateRangeFieldParams<TDate, TChildProps extends {}> {
  props: UseSingleInputDateRangeFieldComponentProps<TDate, TChildProps>;
  inputRef?: React.Ref<HTMLInputElement>;
}

export interface UseSingleInputDateRangeFieldProps<TDate> extends UseDateRangeFieldProps<TDate> {}

export type UseSingleInputDateRangeFieldDefaultizedProps<
  TDate,
  AdditionalProps extends {},
> = UseDateRangeFieldDefaultizedProps<TDate> & AdditionalProps;

export type UseSingleInputDateRangeFieldComponentProps<TDate, TChildProps extends {}> = Omit<
  TChildProps,
  keyof UseSingleInputDateRangeFieldProps<TDate>
> &
  UseSingleInputDateRangeFieldProps<TDate>;

export interface SingleInputDateRangeFieldProps<TDate>
  extends UseSingleInputDateRangeFieldComponentProps<TDate, FieldsTextFieldProps> {
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
