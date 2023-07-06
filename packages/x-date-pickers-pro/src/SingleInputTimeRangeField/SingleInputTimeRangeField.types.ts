import * as React from 'react';
import { SlotComponentProps } from '@mui/base/utils';
import TextField from '@mui/material/TextField';
import { FieldsTextFieldProps } from '@mui/x-date-pickers/internals/models/fields';
import { UncapitalizeObjectKeys } from '@mui/x-date-pickers/internals';
import { UseTimeRangeFieldDefaultizedProps, UseTimeRangeFieldProps } from '../internals/models';

export interface UseSingleInputTimeRangeFieldParams<TDate, TChildProps extends {}> {
  props: UseSingleInputTimeRangeFieldComponentProps<TDate, TChildProps>;
  inputRef?: React.Ref<HTMLInputElement>;
}

export interface UseSingleInputTimeRangeFieldProps<TDate> extends UseTimeRangeFieldProps<TDate> {}

export type UseSingleInputTimeRangeFieldDefaultizedProps<
  TDate,
  AdditionalProps extends {},
> = UseTimeRangeFieldDefaultizedProps<TDate> & AdditionalProps;

export type UseSingleInputTimeRangeFieldComponentProps<TDate, TChildProps extends {}> = Omit<
  TChildProps,
  keyof UseSingleInputTimeRangeFieldProps<TDate>
> &
  UseSingleInputTimeRangeFieldProps<TDate>;

export interface SingleInputTimeRangeFieldProps<TDate>
  extends UseSingleInputTimeRangeFieldComponentProps<TDate, FieldsTextFieldProps> {
  /**
   * Overridable components.
   * @default {}
   * @deprecated Please use `slots`.
   */
  components?: SingleInputTimeRangeFieldSlotsComponent;
  /**
   * The props used for each component slot.
   * @default {}
   * @deprecated Please use `slotProps`.
   */
  componentsProps?: SingleInputTimeRangeFieldSlotsComponentsProps<TDate>;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: UncapitalizeObjectKeys<SingleInputTimeRangeFieldSlotsComponent>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: SingleInputTimeRangeFieldSlotsComponentsProps<TDate>;
}

export type SingleInputTimeRangeFieldOwnerState<TDate> = SingleInputTimeRangeFieldProps<TDate>;

export interface SingleInputTimeRangeFieldSlotsComponent {
  /**
   * Form control with an input to render the value.
   * Receives the same props as `@mui/material/TextField`.
   * @default TextField from '@mui/material'
   */
  TextField?: React.ElementType;
}

export interface SingleInputTimeRangeFieldSlotsComponentsProps<TDate> {
  textField?: SlotComponentProps<typeof TextField, {}, SingleInputTimeRangeFieldOwnerState<TDate>>;
}
