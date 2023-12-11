import * as React from 'react';
import { FieldRef } from '@mui/x-date-pickers/models';
import { SlotComponentProps } from '@mui/base/utils';
import Typography from '@mui/material/Typography';
import Stack, { StackProps } from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import {
  UseDateTimeRangeFieldDefaultizedProps,
  UseDateTimeRangeFieldProps,
} from '../internals/models/dateTimeRange';
import { RangePosition } from '../internals/models/range';
import { RangeFieldSection } from '../internals/models/fields';
import { UseMultiInputRangeFieldParams } from '../internals/hooks/useMultiInputRangeField/useMultiInputRangeField.types';
import { MultiInputRangeFieldClasses } from '../models';

export type UseMultiInputDateTimeRangeFieldParams<
  TDate,
  TTextFieldSlotProps extends {},
> = UseMultiInputRangeFieldParams<UseMultiInputDateTimeRangeFieldProps<TDate>, TTextFieldSlotProps>;

export interface UseMultiInputDateTimeRangeFieldProps<TDate>
  extends Omit<UseDateTimeRangeFieldProps<TDate>, 'unstableFieldRef' | 'clearable' | 'onClear'> {
  unstableStartFieldRef?: React.Ref<FieldRef<RangeFieldSection>>;
  unstableEndFieldRef?: React.Ref<FieldRef<RangeFieldSection>>;
}

export type UseMultiInputDateTimeRangeFieldComponentProps<TDate, TChildProps extends {}> = Omit<
  TChildProps,
  keyof UseMultiInputDateTimeRangeFieldProps<TDate>
> &
  UseMultiInputDateTimeRangeFieldProps<TDate>;

export interface MultiInputDateTimeRangeFieldProps<TDate>
  extends UseMultiInputDateTimeRangeFieldComponentProps<TDate, Omit<StackProps, 'position'>> {
  autoFocus?: boolean;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<MultiInputRangeFieldClasses>;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: MultiInputDateTimeRangeFieldSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: MultiInputDateTimeRangeFieldSlotProps<TDate>;
}

export type MultiInputDateTimeRangeFieldOwnerState<TDate> =
  MultiInputDateTimeRangeFieldProps<TDate>;

export interface MultiInputDateTimeRangeFieldSlots {
  /**
   * Element rendered at the root.
   * @default MultiInputDateTimeRangeFieldRoot
   */
  root?: React.ElementType;
  /**
   * Form control with an input to render a date and time.
   * It is rendered twice: once for the start date time and once for the end date time.
   * Receives the same props as `@mui/material/TextField`.
   * @default TextField from '@mui/material'
   */
  textField?: React.ElementType;
  /**
   * Element rendered between the two inputs.
   * @default MultiInputDateTimeRangeFieldSeparator
   */
  separator?: React.ElementType;
}

export interface MultiInputDateTimeRangeFieldSlotProps<TDate> {
  root?: SlotComponentProps<typeof Stack, {}, MultiInputDateTimeRangeFieldOwnerState<TDate>>;
  textField?: SlotComponentProps<
    typeof TextField,
    {},
    MultiInputDateTimeRangeFieldOwnerState<TDate> & { position: RangePosition }
  >;
  separator?: SlotComponentProps<
    typeof Typography,
    {},
    MultiInputDateTimeRangeFieldOwnerState<TDate>
  >;
}

export type UseMultiInputDateTimeRangeFieldDefaultizedProps<
  TDate,
  AdditionalProps extends {},
> = UseDateTimeRangeFieldDefaultizedProps<TDate> &
  Omit<AdditionalProps, 'value' | 'defaultValue' | 'onChange'>;
