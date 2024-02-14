import * as React from 'react';
import { SlotComponentProps } from '@mui/base/utils';
import TextField from '@mui/material/TextField';
import { FieldsTextFieldProps } from '@mui/x-date-pickers/internals';
import { PickerValidDate } from '@mui/x-date-pickers/models';
import { UseClearableFieldSlots, UseClearableFieldSlotProps } from '@mui/x-date-pickers/hooks';
import { UseTimeRangeFieldDefaultizedProps, UseTimeRangeFieldProps } from '../internals/models';

export interface UseSingleInputTimeRangeFieldProps<TDate extends PickerValidDate>
  extends UseTimeRangeFieldProps<TDate> {}

export type UseSingleInputTimeRangeFieldDefaultizedProps<
  TDate extends PickerValidDate,
  AdditionalProps extends {},
> = UseTimeRangeFieldDefaultizedProps<TDate> & AdditionalProps;

export type UseSingleInputTimeRangeFieldComponentProps<
  TDate extends PickerValidDate,
  TChildProps extends {},
> = Omit<TChildProps, keyof UseSingleInputTimeRangeFieldProps<TDate>> &
  UseSingleInputTimeRangeFieldProps<TDate>;

export interface SingleInputTimeRangeFieldProps<TDate extends PickerValidDate>
  extends UseSingleInputTimeRangeFieldComponentProps<TDate, FieldsTextFieldProps> {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: SingleInputTimeRangeFieldSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: SingleInputTimeRangeFieldSlotProps<TDate>;
}

export type SingleInputTimeRangeFieldOwnerState<TDate extends PickerValidDate> =
  SingleInputTimeRangeFieldProps<TDate>;

export interface SingleInputTimeRangeFieldSlots extends UseClearableFieldSlots {
  /**
   * Form control with an input to render the value.
   * Receives the same props as `@mui/material/TextField`.
   * @default TextField from '@mui/material'
   */
  textField?: React.ElementType;
}

export interface SingleInputTimeRangeFieldSlotProps<TDate extends PickerValidDate>
  extends UseClearableFieldSlotProps {
  textField?: SlotComponentProps<typeof TextField, {}, SingleInputTimeRangeFieldOwnerState<TDate>>;
}
