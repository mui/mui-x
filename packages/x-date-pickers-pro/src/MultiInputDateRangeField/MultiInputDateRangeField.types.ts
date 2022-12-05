import * as React from 'react';
import { SlotComponentProps } from '@mui/base/utils';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { UseDateRangeFieldProps } from '../internal/models/dateRange';
import { RangePosition } from '../internal/models/range';

export interface UseMultiInputDateRangeFieldParams<TDate, TChildProps extends {}> {
  sharedProps: Omit<TChildProps, keyof UseMultiInputDateRangeFieldProps<TDate>> &
    UseMultiInputDateRangeFieldProps<TDate>;
  startInputProps: TChildProps;
  endInputProps: TChildProps;
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
  extends UseMultiInputDateRangeFieldComponentProps<TDate, {}> {
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
   * Input rendered for the start or end date.
   * @default TextField
   */
  Input?: React.ElementType;
  /**
   * Element rendered between the two inputs.
   * @default MultiInputDateRangeFieldSeparator
   */
  Separator?: React.ElementType;
}

export interface MultiInputDateRangeFieldSlotsComponentsProps<TDate> {
  root?: SlotComponentProps<typeof Stack, {}, MultiInputDateRangeFieldOwnerState<TDate>>;
  input?: SlotComponentProps<
    typeof TextField,
    {},
    MultiInputDateRangeFieldOwnerState<TDate> & { position: RangePosition }
  >;
  separator?: SlotComponentProps<typeof Typography, {}, MultiInputDateRangeFieldOwnerState<TDate>>;
}
