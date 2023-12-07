import * as React from 'react';
import { SlotComponentProps } from '@mui/base/utils';
import TextField from '@mui/material/TextField';
import {
  FieldsTextFieldProps,
  FieldSlotsComponents,
  FieldSlotsComponentsProps,
} from '@mui/x-date-pickers/internals';
import { ExportedUseClearableFieldProps } from '@mui/x-date-pickers/hooks';
import { UseDateRangeFieldProps } from '../internals/models';

export interface UseSingleInputDateRangeFieldProps<TDate, TUseV6TextField extends boolean>
  extends UseDateRangeFieldProps<TDate, TUseV6TextField>,
    ExportedUseClearableFieldProps {}

export type SingleInputDateRangeFieldProps<
  TDate,
  TUseV6TextField extends boolean = false,
  TChildProps extends {} = FieldsTextFieldProps,
> = Omit<TChildProps, keyof UseSingleInputDateRangeFieldProps<TDate, TUseV6TextField>> &
  UseSingleInputDateRangeFieldProps<TDate, TUseV6TextField> & {
    /**
     * Overridable component slots.
     * @default {}
     */
    slots?: SingleInputDateRangeFieldSlotsComponent;
    /**
     * The props used for each component slot.
     * @default {}
     */
    slotProps?: SingleInputDateRangeFieldSlotsComponentsProps<TDate, TUseV6TextField>;
  };

export interface SingleInputDateRangeFieldSlotsComponent extends FieldSlotsComponents {
  /**
   * Form control with an input to render the value.
   * Receives the same props as `@mui/material/TextField`.
   * @default TextField from '@mui/material'
   */
  textField?: React.ElementType;
}

export interface SingleInputDateRangeFieldSlotsComponentsProps<
  TDate,
  TUseV6TextField extends boolean,
> extends FieldSlotsComponentsProps {
  textField?: SlotComponentProps<
    typeof TextField,
    {},
    SingleInputDateRangeFieldProps<TDate, TUseV6TextField>
  >;
}
