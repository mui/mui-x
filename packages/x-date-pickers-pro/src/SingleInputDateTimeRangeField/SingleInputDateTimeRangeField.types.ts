import * as React from 'react';
import { SlotComponentProps } from '@mui/base/utils';
import TextField from '@mui/material/TextField';
import { FieldsTextFieldProps } from '@mui/x-date-pickers/internals/models/fields';
import {
  UseDateTimeRangeFieldDefaultizedProps,
  UseDateTimeRangeFieldProps,
} from '../internal/models';

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
   * Overrideable components.
   * @default {}
   */
  components?: SingleInputDateTimeRangeFieldSlotsComponent;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: SingleInputDateTimeRangeFieldSlotsComponentsProps<TDate>;
}

export type SingleInputDateTimeRangeFieldOwnerState<TDate> =
  SingleInputDateTimeRangeFieldProps<TDate>;

export interface SingleInputDateTimeRangeFieldSlotsComponent {
  /**
   * Input rendered.
   * @default TextField
   */
  Input?: React.ElementType;
}

export interface SingleInputDateTimeRangeFieldSlotsComponentsProps<TDate> {
  input?: SlotComponentProps<typeof TextField, {}, SingleInputDateTimeRangeFieldOwnerState<TDate>>;
}
