import * as React from 'react';
import { SlotComponentProps } from '@mui/base/utils';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { UseMultiInputRangeFieldParams } from '../internal/hooks/useMultiInputRangeField';
import {
  UseDateTimeRangeFieldDefaultizedProps,
  UseDateTimeRangeFieldProps,
} from '../internal/models/dateTimeRange';

export interface UseMultiInputDateTimeRangeFieldParams<TDate, TChildProps extends {}>
  extends UseMultiInputRangeFieldParams<UseMultiInputDateTimeRangeFieldProps<TDate>, TChildProps> {}

export interface UseMultiInputDateTimeRangeFieldProps<TDate>
  extends UseDateTimeRangeFieldProps<TDate> {}

export type UseMultiInputDateTimeRangeFieldComponentProps<TDate, TChildProps extends {}> = Omit<
  TChildProps,
  keyof UseMultiInputDateTimeRangeFieldProps<TDate>
> &
  UseMultiInputDateTimeRangeFieldProps<TDate>;

export interface MultiInputDateTimeRangeFieldProps<TDate>
  extends UseMultiInputDateTimeRangeFieldComponentProps<TDate, {}> {
  /**
   * Overrideable components.
   * @default {}
   */
  components?: MultiInputDateTimeRangeFieldSlotsComponent;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: MultiInputDateTimeRangeFieldSlotsComponentsProps<TDate>;
}

export type MultiInputDateTimeRangeFieldOwnerState<TDate> =
  MultiInputDateTimeRangeFieldProps<TDate>;

export interface MultiInputDateTimeRangeFieldSlotsComponent {
  /**
   * Element rendered at the root.
   * @default MultiInputDateTimeRangeFieldRoot
   */
  Root?: React.ElementType;
  /**
   * Input rendered for the start or end date.
   * @default TextField
   */
  Input?: React.ElementType;
  /**
   * Element rendered between the two inputs.
   * @default MultiInputDateTimeRangeFieldSeparator
   */
  Separator?: React.ElementType;
}

export interface MultiInputDateTimeRangeFieldSlotsComponentsProps<TDate> {
  root?: SlotComponentProps<typeof Stack, {}, MultiInputDateTimeRangeFieldOwnerState<TDate>>;
  input?: SlotComponentProps<
    typeof TextField,
    {},
    MultiInputDateTimeRangeFieldOwnerState<TDate> & { position: 'start' | 'end' }
  >;
  separator?: SlotComponentProps<
    typeof Typography,
    {},
    MultiInputDateTimeRangeFieldOwnerState<TDate>
  >;
}

export type UseMultiInputDateTimeRangeFieldDefaultizedProps<TDate> =
  UseDateTimeRangeFieldDefaultizedProps<TDate>;
