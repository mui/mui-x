import * as React from 'react';
import { SlotComponentProps } from '@mui/base/utils';
import TextField from '@mui/material/TextField';
import { FieldsTextFieldProps } from '@mui/x-date-pickers/internals/models/fields';
import { UncapitalizeObjectKeys } from '@mui/x-date-pickers/internals';
import { UseTimeRangeFieldDefaultizedProps, UseTimeRangeFieldProps } from '../internal/models';

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
   * Overrideable components.
   * @default {}
   * @deprecated
   */
  components?: SingleInputTimeRangeFieldSlotsComponent;
  /**
   * The props used for each component slot.
   * @default {}
   * @deprecated
   */
  componentsProps?: SingleInputTimeRangeFieldSlotsComponentsProps<TDate>;
  /**
   * Overrideable components.
   * @default {}
   */
  slots?: UncapitalizeObjectKeys<SingleInputTimeRangeFieldSlotsComponent>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotsProps?: SingleInputTimeRangeFieldSlotsComponentsProps<TDate>;
}

export type SingleInputTimeRangeFieldOwnerState<TDate> = SingleInputTimeRangeFieldProps<TDate>;

export interface SingleInputTimeRangeFieldSlotsComponent {
  /**
   * Input rendered.
   * @default TextField
   */
  Input?: React.ElementType;
}

export interface SingleInputTimeRangeFieldSlotsComponentsProps<TDate> {
  input?: SlotComponentProps<typeof TextField, {}, SingleInputTimeRangeFieldOwnerState<TDate>>;
}
