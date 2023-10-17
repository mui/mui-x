import * as React from 'react';
import { SlotComponentProps } from '@mui/base/utils';
import TextField from '@mui/material/TextField';
import {
  FieldsTextFieldProps,
  FieldSlotsComponents,
  FieldSlotsComponentsProps,
} from '@mui/x-date-pickers/internals';
import { UseDateRangeFieldDefaultizedProps, UseDateRangeFieldProps } from '../internals/models';

export interface UseSingleInputDateRangeFieldParams<TDate, TChildProps extends {}> {
  props: UseSingleInputDateRangeFieldComponentProps<TDate, TChildProps>;
  inputRef?: React.Ref<HTMLInputElement>;
}

export interface UseSingleInputDateRangeFieldProps<TDate> extends UseDateRangeFieldProps<TDate> {}

export type UseSingleInputDateRangeFieldDefaultizedProps<
  TDate,
  AdditionalProps extends {},
> = UseDateRangeFieldDefaultizedProps<TDate> &
  Omit<AdditionalProps, 'value' | 'defaultValue' | 'onChange'>;

export type UseSingleInputDateRangeFieldComponentProps<TDate, TChildProps extends {}> = Omit<
  TChildProps,
  keyof UseSingleInputDateRangeFieldProps<TDate>
> &
  UseSingleInputDateRangeFieldProps<TDate>;

export type SingleInputDateRangeFieldProps<
  TDate,
  TChildProps extends {} = FieldsTextFieldProps,
> = UseSingleInputDateRangeFieldComponentProps<TDate, TChildProps> & {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: SingleInputDateRangeFieldSlotsComponent;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: SingleInputDateRangeFieldSlotsComponentsProps<TDate>;
};

export type SingleInputDateRangeFieldOwnerState<TDate> = SingleInputDateRangeFieldProps<TDate>;

export interface SingleInputDateRangeFieldSlotsComponent extends FieldSlotsComponents {
  /**
   * Form control with an input to render the value.
   * Receives the same props as `@mui/material/TextField`.
   * @default TextField from '@mui/material'
   */
  textField?: React.ElementType;
}

export interface SingleInputDateRangeFieldSlotsComponentsProps<TDate>
  extends FieldSlotsComponentsProps {
  textField?: SlotComponentProps<typeof TextField, {}, SingleInputDateRangeFieldOwnerState<TDate>>;
}
