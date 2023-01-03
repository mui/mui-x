import * as React from 'react';
import { SlotComponentProps } from '@mui/base/utils';
import Typography from '@mui/material/Typography';
import Stack, { StackProps } from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { UseDateRangeFieldProps } from '../internal/models/dateRange';
import { RangePosition } from '../internal/models/range';

export interface UseMultiInputDateRangeFieldParams<TDate, TChildProps extends {}> {
  sharedProps: Omit<TChildProps, keyof UseMultiInputDateRangeFieldProps<TDate>> &
    UseMultiInputDateRangeFieldProps<TDate>;
  startTextFieldProps: TChildProps;
  endTextFieldProps: TChildProps;
  startInputRef?: React.Ref<HTMLInputElement>;
  endInputRef?: React.Ref<HTMLInputElement>;
}

export interface UseMultiInputDateRangeFieldProps<TDate> extends UseDateRangeFieldProps<TDate> {}

export type UseMultiInputDateRangeFieldComponentProps<TDate, TChildProps extends {}> = Omit<
  TChildProps,
  keyof UseMultiInputDateRangeFieldProps<TDate>
> &
  UseMultiInputDateRangeFieldProps<TDate>;

export interface MultiInputDateRangeFieldProps<TDate>
  extends UseMultiInputDateRangeFieldComponentProps<
    TDate,
    Omit<StackProps, 'position'> & { autoFocus?: boolean }
  > {
  /**
   * Overrideable components.
   * @default {}
   */
  components?: MultiInputDateRangeFieldSlotsComponent;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: MultiInputDateRangeFieldSlotsComponentsProps<TDate>;
}

export type MultiInputDateRangeFieldOwnerState<TDate> = MultiInputDateRangeFieldProps<TDate>;

export interface MultiInputDateRangeFieldSlotsComponent {
  /**
   * Element rendered at the root.
   * @default MultiInputDateRangeFieldRoot
   */
  Root?: React.ElementType;
  /**
   * Form control with an input to render a date.
   * It is rendered twice: once for the start date and once for the end date.
   * Receives the same props as '@mui/material/TextField'.
   * @default TextField from '@mui/material'
   */
  TextField?: React.ElementType;
  /**
   * Element rendered between the two inputs.
   * @default MultiInputDateRangeFieldSeparator
   */
  Separator?: React.ElementType;
}

export interface MultiInputDateRangeFieldSlotsComponentsProps<TDate> {
  root?: SlotComponentProps<typeof Stack, {}, MultiInputDateRangeFieldOwnerState<TDate>>;
  textField?: SlotComponentProps<
    typeof TextField,
    {},
    MultiInputDateRangeFieldOwnerState<TDate> & { position: RangePosition }
  >;
  separator?: SlotComponentProps<typeof Typography, {}, MultiInputDateRangeFieldOwnerState<TDate>>;
}
