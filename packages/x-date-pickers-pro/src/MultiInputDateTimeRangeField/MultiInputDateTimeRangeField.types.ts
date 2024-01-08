import * as React from 'react';
import { FieldRef, FieldTextFieldVersion } from '@mui/x-date-pickers/models';
import { SlotComponentProps } from '@mui/base/utils';
import Typography from '@mui/material/Typography';
import Stack, { StackProps } from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { UseDateTimeRangeFieldProps } from '../internals/models/dateTimeRange';
import { UseMultiInputRangeFieldParams } from '../internals/hooks/useMultiInputRangeField/useMultiInputRangeField.types';
import { RangeFieldSection, MultiInputRangeFieldClasses, RangePosition } from '../models';

export type UseMultiInputDateTimeRangeFieldParams<
  TDate,
  TTextFieldVersion extends FieldTextFieldVersion,
  TTextFieldSlotProps extends {},
> = UseMultiInputRangeFieldParams<
  UseMultiInputDateTimeRangeFieldProps<TDate, TTextFieldVersion>,
  TTextFieldSlotProps
>;

export interface UseMultiInputDateTimeRangeFieldProps<
  TDate,
  TTextFieldVersion extends FieldTextFieldVersion,
> extends Omit<
    UseDateTimeRangeFieldProps<TDate, TTextFieldVersion>,
    'unstableFieldRef' | 'clearable' | 'onClear'
  > {
  unstableStartFieldRef?: React.Ref<FieldRef<RangeFieldSection>>;
  unstableEndFieldRef?: React.Ref<FieldRef<RangeFieldSection>>;
}

export type UseMultiInputDateTimeRangeFieldComponentProps<
  TDate,
  TTextFieldVersion extends FieldTextFieldVersion,
  TChildProps extends {},
> = Omit<TChildProps, keyof UseMultiInputDateTimeRangeFieldProps<TDate, TTextFieldVersion>> &
  UseMultiInputDateTimeRangeFieldProps<TDate, TTextFieldVersion>;

export interface MultiInputDateTimeRangeFieldProps<
  TDate,
  TTextFieldVersion extends FieldTextFieldVersion = 'v6',
> extends UseMultiInputDateTimeRangeFieldComponentProps<
    TDate,
    TTextFieldVersion,
    Omit<StackProps, 'position'>
  > {
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
  slotProps?: MultiInputDateTimeRangeFieldSlotProps<TDate, TTextFieldVersion>;
}

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

export interface MultiInputDateTimeRangeFieldSlotProps<
  TDate,
  TTextFieldVersion extends FieldTextFieldVersion,
> {
  root?: SlotComponentProps<
    typeof Stack,
    {},
    MultiInputDateTimeRangeFieldProps<TDate, TTextFieldVersion>
  >;
  textField?: SlotComponentProps<
    typeof TextField,
    {},
    MultiInputDateTimeRangeFieldProps<TDate, TTextFieldVersion> & { position: RangePosition }
  >;
  separator?: SlotComponentProps<
    typeof Typography,
    {},
    MultiInputDateTimeRangeFieldProps<TDate, TTextFieldVersion>
  >;
}
