import * as React from 'react';
import { SlotComponentProps } from '@mui/base/utils';
import Typography from '@mui/material/Typography';
import Stack, { StackProps } from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { FieldRef, FieldTextFieldVersion } from '@mui/x-date-pickers/models';
import { UseDateRangeFieldProps } from '../internals/models/dateRange';
import { UseMultiInputRangeFieldParams } from '../internals/hooks/useMultiInputRangeField/useMultiInputRangeField.types';
import { RangeFieldSection, MultiInputRangeFieldClasses, RangePosition } from '../models';

export type UseMultiInputDateRangeFieldParams<
  TDate,
  TTextFieldVersion extends FieldTextFieldVersion,
  TTextFieldSlotProps extends {},
> = UseMultiInputRangeFieldParams<
  UseMultiInputDateRangeFieldProps<TDate, TTextFieldVersion>,
  TTextFieldSlotProps
>;

export interface UseMultiInputDateRangeFieldProps<
  TDate,
  TTextFieldVersion extends FieldTextFieldVersion,
> extends Omit<
    UseDateRangeFieldProps<TDate, TTextFieldVersion>,
    'unstableFieldRef' | 'clearable' | 'onClear'
  > {
  unstableStartFieldRef?: React.Ref<FieldRef<RangeFieldSection>>;
  unstableEndFieldRef?: React.Ref<FieldRef<RangeFieldSection>>;
}

export type UseMultiInputDateRangeFieldComponentProps<
  TDate,
  TTextFieldVersion extends FieldTextFieldVersion,
  TChildProps extends {},
> = Omit<TChildProps, keyof UseMultiInputDateRangeFieldProps<TDate, TTextFieldVersion>> &
  UseMultiInputDateRangeFieldProps<TDate, TTextFieldVersion>;

export interface MultiInputDateRangeFieldProps<
  TDate,
  TTextFieldVersion extends FieldTextFieldVersion = 'v6',
> extends UseMultiInputDateRangeFieldComponentProps<
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
  slots?: MultiInputDateRangeFieldSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: MultiInputDateRangeFieldSlotProps<TDate, TTextFieldVersion>;
}

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

export interface MultiInputDateRangeFieldSlotProps<
  TDate,
  TTextFieldVersion extends FieldTextFieldVersion,
> {
  root?: SlotComponentProps<
    typeof Stack,
    {},
    MultiInputDateRangeFieldProps<TDate, TTextFieldVersion>
  >;
  textField?: SlotComponentProps<
    typeof TextField,
    {},
    MultiInputDateRangeFieldProps<TDate, TTextFieldVersion> & { position: RangePosition }
  >;
  separator?: SlotComponentProps<
    typeof Typography,
    {},
    MultiInputDateRangeFieldProps<TDate, TTextFieldVersion>
  >;
}
