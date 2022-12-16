import * as React from 'react';
import { SlotComponentProps } from '@mui/base/utils';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import {
  UseTimeRangeFieldDefaultizedProps,
  UseTimeRangeFieldProps,
} from '../internal/models/timeRange';
import { RangePosition } from '../internal/models/range';

export interface UseMultiInputTimeRangeFieldParams<TDate, TChildProps extends {}> {
  sharedProps: Omit<TChildProps, keyof UseMultiInputTimeRangeFieldProps<TDate>> &
    UseMultiInputTimeRangeFieldProps<TDate>;
  startInputProps: TChildProps;
  endInputProps: TChildProps;
  startInputRef?: React.Ref<HTMLInputElement>;
  endInputRef?: React.Ref<HTMLInputElement>;
}

export interface UseMultiInputTimeRangeFieldProps<TDate> extends UseTimeRangeFieldProps<TDate> {}

export type UseMultiInputTimeRangeFieldComponentProps<TDate, TChildProps extends {}> = Omit<
  TChildProps,
  keyof UseMultiInputTimeRangeFieldProps<TDate>
> &
  UseMultiInputTimeRangeFieldProps<TDate>;

export interface MultiInputTimeRangeFieldProps<TDate>
  extends UseMultiInputTimeRangeFieldComponentProps<TDate, {}> {
  /**
   * Overrideable components.
   * @default {}
   */
  components?: MultiInputTimeRangeFieldSlotsComponent;
  /**
   * The props used for each component slot.
   * @default {}
   */
  componentsProps?: MultiInputTimeRangeFieldSlotsComponentsProps<TDate>;
}

export type MultiInputTimeRangeFieldOwnerState<TDate> = MultiInputTimeRangeFieldProps<TDate>;

export interface MultiInputTimeRangeFieldSlotsComponent {
  /**
   * Element rendered at the root.
   * @default MultiInputTimeRangeFieldRoot
   */
  Root?: React.ElementType;
  /**
   * Input rendered for the start or end date.
   * @default TextField
   */
  Input?: React.ElementType;
  /**
   * Element rendered between the two inputs.
   * @default MultiInputTimeRangeFieldSeparator
   */
  Separator?: React.ElementType;
}

export interface MultiInputTimeRangeFieldSlotsComponentsProps<TDate> {
  root?: SlotComponentProps<typeof Stack, {}, MultiInputTimeRangeFieldOwnerState<TDate>>;
  input?: SlotComponentProps<
    typeof TextField,
    {},
    MultiInputTimeRangeFieldOwnerState<TDate> & { position: RangePosition }
  >;
  separator?: SlotComponentProps<typeof Typography, {}, MultiInputTimeRangeFieldOwnerState<TDate>>;
}

export type UseMultiInputTimeRangeFieldDefaultizedProps<
  TDate,
  AdditionalProps extends {},
> = UseTimeRangeFieldDefaultizedProps<TDate> & AdditionalProps;
