import * as React from 'react';
import { SlotComponentProps } from '@mui/base/utils';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { UseSingleInputDateRangeFieldProps } from '../SingleInputDateRangeField';

export interface UseMultiInputDateRangeFieldParams<TInputDate, TDate, TChildProps extends {}> {
  sharedProps: UseMultiInputDateRangeFieldComponentProps<TInputDate, TDate, {}>;
  startInputProps: TChildProps;
  endInputProps: TChildProps;
  startInputRef?: React.Ref<HTMLInputElement>;
  endInputRef?: React.Ref<HTMLInputElement>;
}

export interface UseMultiInputDateRangeFieldProps<TInputDate, TDate>
  extends UseSingleInputDateRangeFieldProps<TInputDate, TDate> {}

export type UseMultiInputDateRangeFieldComponentProps<
  TInputDate,
  TDate,
  TChildProps extends {},
> = Omit<TChildProps, keyof UseMultiInputDateRangeFieldProps<TInputDate, TDate>> &
  UseMultiInputDateRangeFieldProps<TInputDate, TDate>;

export interface MultiInputDateRangeFieldProps<TInputDate, TDate>
  extends UseMultiInputDateRangeFieldComponentProps<TInputDate, TDate, {}> {
  /**
   * Overrideable components.
   * @default {}
   */
  components?: MultiInputDateRangeFieldSlotsComponent;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: MultiInputDateRangeFieldSlotsComponentsProps<TInputDate, TDate>;
}

export type MultiInputDateRangeFieldOwnerState<TInputDate, TDate> = MultiInputDateRangeFieldProps<
  TInputDate,
  TDate
>;

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

export interface MultiInputDateRangeFieldSlotsComponentsProps<TDate, TInputDate> {
  root?: SlotComponentProps<
    typeof Stack,
    {},
    MultiInputDateRangeFieldOwnerState<TDate, TInputDate>
  >;
  input?: SlotComponentProps<
    typeof TextField,
    {},
    MultiInputDateRangeFieldOwnerState<TDate, TInputDate> & { position: 'start' | 'end' }
  >;
  separator?: SlotComponentProps<
    typeof Typography,
    {},
    MultiInputDateRangeFieldOwnerState<TDate, TInputDate>
  >;
}
