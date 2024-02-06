import * as React from 'react';
import { SlotComponentProps } from '@mui/base/utils';
import TextField from '@mui/material/TextField';
import { FieldsTextFieldProps } from '@mui/x-date-pickers/internals';
import { PickerValidDate } from '@mui/x-date-pickers/models';
import { UseClearableFieldSlots, UseClearableFieldSlotProps } from '@mui/x-date-pickers/hooks';
import { UseDateRangeFieldDefaultizedProps, UseDateRangeFieldProps } from '../internals/models';

export interface UseSingleInputDateRangeFieldProps<TDate extends PickerValidDate>
  extends UseDateRangeFieldProps<TDate> {}

export type UseSingleInputDateRangeFieldDefaultizedProps<
  TDate extends PickerValidDate,
  AdditionalProps extends {},
> = UseDateRangeFieldDefaultizedProps<TDate> &
  Omit<AdditionalProps, 'value' | 'defaultValue' | 'onChange'>;

export type UseSingleInputDateRangeFieldComponentProps<
  TDate extends PickerValidDate,
  TChildProps extends {},
> = Omit<TChildProps, keyof UseSingleInputDateRangeFieldProps<TDate>> &
  UseSingleInputDateRangeFieldProps<TDate>;

export type SingleInputDateRangeFieldProps<
  TDate extends PickerValidDate,
  TChildProps extends {} = FieldsTextFieldProps,
> = UseSingleInputDateRangeFieldComponentProps<TDate, TChildProps> & {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: SingleInputDateRangeFieldSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: SingleInputDateRangeFieldSlotProps<TDate>;
};

export type SingleInputDateRangeFieldOwnerState<TDate extends PickerValidDate> =
  SingleInputDateRangeFieldProps<TDate>;

export interface SingleInputDateRangeFieldSlots extends UseClearableFieldSlots {
  /**
   * Form control with an input to render the value.
   * Receives the same props as `@mui/material/TextField`.
   * @default TextField from '@mui/material'
   */
  textField?: React.ElementType;
}

export interface SingleInputDateRangeFieldSlotProps<TDate extends PickerValidDate>
  extends UseClearableFieldSlotProps {
  textField?: SlotComponentProps<typeof TextField, {}, SingleInputDateRangeFieldOwnerState<TDate>>;
}
