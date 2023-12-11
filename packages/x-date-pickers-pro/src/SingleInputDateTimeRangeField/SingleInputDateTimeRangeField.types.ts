import * as React from 'react';
import { SlotComponentProps } from '@mui/base/utils';
import TextField from '@mui/material/TextField';
import { FieldsTextFieldProps } from '@mui/x-date-pickers/internals/models/fields';
import { FieldSlots, FieldSlotProps } from '@mui/x-date-pickers/internals';
import {
  UseDateTimeRangeFieldDefaultizedProps,
  UseDateTimeRangeFieldProps,
} from '../internals/models';

export interface UseSingleInputDateTimeRangeFieldParams<TDate, TChildProps extends {}> {
  props: UseSingleInputDateTimeRangeFieldComponentProps<TDate, TChildProps>;
  inputRef?: React.Ref<HTMLInputElement>;
}

export interface UseSingleInputDateTimeRangeFieldProps<TDate>
  extends UseDateTimeRangeFieldProps<TDate> {}

export type UseSingleInputDateTimeRangeFieldDefaultizedProps<
  TDate,
  AdditionalProps extends {},
> = UseDateTimeRangeFieldDefaultizedProps<TDate> & AdditionalProps;

export type UseSingleInputDateTimeRangeFieldComponentProps<TDate, TChildProps extends {}> = Omit<
  TChildProps,
  keyof UseSingleInputDateTimeRangeFieldProps<TDate>
> &
  UseSingleInputDateTimeRangeFieldProps<TDate>;

export interface SingleInputDateTimeRangeFieldProps<TDate>
  extends UseSingleInputDateTimeRangeFieldComponentProps<TDate, FieldsTextFieldProps> {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: SingleInputDateTimeRangeFieldSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: SingleInputDateTimeRangeFieldSlotProps<TDate>;
}

export type SingleInputDateTimeRangeFieldOwnerState<TDate> =
  SingleInputDateTimeRangeFieldProps<TDate>;

export interface SingleInputDateTimeRangeFieldSlots extends FieldSlots {
  /**
   * Form control with an input to render the value.
   * Receives the same props as `@mui/material/TextField`.
   * @default TextField from '@mui/material'
   */
  textField?: React.ElementType;
}

export interface SingleInputDateTimeRangeFieldSlotProps<TDate> extends FieldSlotProps {
  textField?: SlotComponentProps<
    typeof TextField,
    {},
    SingleInputDateTimeRangeFieldOwnerState<TDate>
  >;
}
