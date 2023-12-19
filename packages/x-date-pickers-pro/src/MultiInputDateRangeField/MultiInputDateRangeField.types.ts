import * as React from 'react';
import { SlotComponentProps } from '@mui/base/utils';
import Typography from '@mui/material/Typography';
import Stack, { StackProps } from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { FieldRef } from '@mui/x-date-pickers/models';
import { UseDateRangeFieldProps } from '../internals/models/dateRange';
import { RangePosition } from '../internals/models/range';
import { UseMultiInputRangeFieldParams } from '../internals/hooks/useMultiInputRangeField/useMultiInputRangeField.types';
import { RangeFieldSection } from '../internals/models/fields';
import { MultiInputRangeFieldClasses } from '../models';

export type UseMultiInputDateRangeFieldParams<
  TDate,
  TTextFieldSlotProps extends {},
> = UseMultiInputRangeFieldParams<UseMultiInputDateRangeFieldProps<TDate>, TTextFieldSlotProps>;

export interface UseMultiInputDateRangeFieldProps<TDate>
  extends Omit<UseDateRangeFieldProps<TDate>, 'unstableFieldRef' | 'clearable' | 'onClear'> {
  unstableStartFieldRef?: React.Ref<FieldRef<RangeFieldSection>>;
  unstableEndFieldRef?: React.Ref<FieldRef<RangeFieldSection>>;
}

export type UseMultiInputDateRangeFieldComponentProps<TDate, TChildProps extends {}> = Omit<
  TChildProps,
  keyof UseMultiInputDateRangeFieldProps<TDate>
> &
  UseMultiInputDateRangeFieldProps<TDate>;

export interface MultiInputDateRangeFieldProps<TDate>
  extends UseMultiInputDateRangeFieldComponentProps<TDate, Omit<StackProps, 'position'>> {
  autoFocus?: boolean;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<MultiInputRangeFieldClasses>;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: MultiInputDateRangeFieldSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: MultiInputDateRangeFieldSlotProps<TDate>;
}

export type MultiInputDateRangeFieldOwnerState<TDate> = MultiInputDateRangeFieldProps<TDate>;

export interface MultiInputDateRangeFieldSlots {
  /**
   * Element rendered at the root.
   * @default MultiInputDateRangeFieldRoot
   */
  root?: React.ElementType;
  /**
   * Form control with an input to render a date.
   * It is rendered twice: once for the start date and once for the end date.
   * Receives the same props as `@mui/material/TextField`.
   * @default TextField from '@mui/material'
   */
  textField?: React.ElementType;
  /**
   * Element rendered between the two inputs.
   * @default MultiInputDateRangeFieldSeparator
   */
  separator?: React.ElementType;
}

export interface MultiInputDateRangeFieldSlotProps<TDate> {
  root?: SlotComponentProps<typeof Stack, {}, MultiInputDateRangeFieldOwnerState<TDate>>;
  textField?: SlotComponentProps<
    typeof TextField,
    {},
    MultiInputDateRangeFieldOwnerState<TDate> & { position: RangePosition }
  >;
  separator?: SlotComponentProps<typeof Typography, {}, MultiInputDateRangeFieldOwnerState<TDate>>;
}
