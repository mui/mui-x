import * as React from 'react';
import { SlotComponentProps } from '@mui/base/utils';
import TextField from '@mui/material/TextField';
import { FieldsTextFieldProps } from '@mui/x-date-pickers/internals/models/fields';
import { FieldSlotsComponents, FieldSlotsComponentsProps } from '@mui/x-date-pickers/internals';
import { ExportedUseClearableFieldProps } from '@mui/x-date-pickers/hooks';
import { UseTimeRangeFieldDefaultizedProps, UseTimeRangeFieldProps } from '../internals/models';

export interface UseSingleInputTimeRangeFieldProps<TDate, TUseV6TextField extends boolean>
  extends UseTimeRangeFieldProps<TDate, TUseV6TextField>,
    ExportedUseClearableFieldProps {}

export type UseSingleInputTimeRangeFieldDefaultizedProps<
  TDate,
  TUseV6TextField extends boolean,
  AdditionalProps extends {},
> = UseTimeRangeFieldDefaultizedProps<TDate, TUseV6TextField> & AdditionalProps;

export type UseSingleInputTimeRangeFieldComponentProps<
  TDate,
  TUseV6TextField extends boolean,
  TChildProps extends {},
> = Omit<TChildProps, keyof UseSingleInputTimeRangeFieldProps<TDate, TUseV6TextField>> &
  UseSingleInputTimeRangeFieldProps<TDate, TUseV6TextField>;

export type SingleInputTimeRangeFieldProps<
  TDate,
  TUseV6TextField extends boolean = false,
  TChildProps extends {} = FieldsTextFieldProps,
> = UseSingleInputTimeRangeFieldComponentProps<TDate, TUseV6TextField, TChildProps> & {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: SingleInputTimeRangeFieldSlotsComponent;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: SingleInputTimeRangeFieldSlotsComponentsProps<TDate, TUseV6TextField>;
};

export interface SingleInputTimeRangeFieldSlotsComponent extends FieldSlotsComponents {
  /**
   * Form control with an input to render the value.
   * Receives the same props as `@mui/material/TextField`.
   * @default TextField from '@mui/material'
   */
  textField?: React.ElementType;
}

export interface SingleInputTimeRangeFieldSlotsComponentsProps<
  TDate,
  TUseV6TextField extends boolean,
> extends FieldSlotsComponentsProps {
  textField?: SlotComponentProps<
    typeof TextField,
    {},
    SingleInputTimeRangeFieldProps<TDate, TUseV6TextField>
  >;
}
