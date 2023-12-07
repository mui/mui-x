import * as React from 'react';
import { SlotComponentProps } from '@mui/base/utils';
import TextField from '@mui/material/TextField';
import { FieldsTextFieldProps } from '@mui/x-date-pickers/internals/models/fields';
import { FieldSlotsComponents, FieldSlotsComponentsProps } from '@mui/x-date-pickers/internals';
import { ExportedUseClearableFieldProps } from '@mui/x-date-pickers/hooks';
import {
  UseDateTimeRangeFieldDefaultizedProps,
  UseDateTimeRangeFieldProps,
} from '../internals/models';

export interface UseSingleInputDateTimeRangeFieldProps<TDate, TUseV6TextField extends boolean>
  extends UseDateTimeRangeFieldProps<TDate, TUseV6TextField>,
    ExportedUseClearableFieldProps {}

export type UseSingleInputDateTimeRangeFieldDefaultizedProps<
  TDate,
  TUseV6TextField extends boolean,
  AdditionalProps extends {},
> = UseDateTimeRangeFieldDefaultizedProps<TDate, TUseV6TextField> & AdditionalProps;

export type UseSingleInputDateTimeRangeFieldComponentProps<
  TDate,
  TUseV6TextField extends boolean,
  TChildProps extends {},
> = Omit<TChildProps, keyof UseSingleInputDateTimeRangeFieldProps<TDate, TUseV6TextField>> &
  UseSingleInputDateTimeRangeFieldProps<TDate, TUseV6TextField>;

export type SingleInputDateTimeRangeFieldProps<
  TDate,
  TUseV6TextField extends boolean = false,
  TChildProps extends {} = FieldsTextFieldProps,
> = UseSingleInputDateTimeRangeFieldComponentProps<TDate, TUseV6TextField, TChildProps> & {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: SingleInputDateTimeRangeFieldSlotsComponent;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: SingleInputDateTimeRangeFieldSlotsComponentsProps<TDate, TUseV6TextField>;
};

export interface SingleInputDateTimeRangeFieldSlotsComponent extends FieldSlotsComponents {
  /**
   * Form control with an input to render the value.
   * Receives the same props as `@mui/material/TextField`.
   * @default TextField from '@mui/material'
   */
  textField?: React.ElementType;
}

export interface SingleInputDateTimeRangeFieldSlotsComponentsProps<
  TDate,
  TUseV6TextField extends boolean,
> extends FieldSlotsComponentsProps {
  textField?: SlotComponentProps<
    typeof TextField,
    {},
    SingleInputDateTimeRangeFieldProps<TDate, TUseV6TextField>
  >;
}
