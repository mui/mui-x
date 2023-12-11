import * as React from 'react';
import { FieldRef } from '@mui/x-date-pickers/models';
import { SlotComponentProps } from '@mui/base/utils';
import Typography from '@mui/material/Typography';
import Stack, { StackProps } from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { UseDateTimeRangeFieldProps } from '../internals/models/dateTimeRange';
import { RangePosition } from '../internals/models/range';
import { RangeFieldSection } from '../internals/models/fields';
import { UseMultiInputRangeFieldParams } from '../internals/hooks/useMultiInputRangeField/useMultiInputRangeField.types';
import { MultiInputRangeFieldClasses } from '../models';

export type UseMultiInputDateTimeRangeFieldParams<
  TDate,
  TUseV6TextField extends boolean,
  TTextFieldSlotProps extends {},
> = UseMultiInputRangeFieldParams<
  UseMultiInputDateTimeRangeFieldProps<TDate, TUseV6TextField>,
  TTextFieldSlotProps
>;

export interface UseMultiInputDateTimeRangeFieldProps<TDate, TUseV6TextField extends boolean>
  extends Omit<
    UseDateTimeRangeFieldProps<TDate, TUseV6TextField>,
    'unstableFieldRef' | 'clearable' | 'onClear'
  > {
  unstableStartFieldRef?: React.Ref<FieldRef<RangeFieldSection>>;
  unstableEndFieldRef?: React.Ref<FieldRef<RangeFieldSection>>;
}

export type UseMultiInputDateTimeRangeFieldComponentProps<
  TDate,
  TUseV6TextField extends boolean,
  TChildProps extends {},
> = Omit<TChildProps, keyof UseMultiInputDateTimeRangeFieldProps<TDate, TUseV6TextField>> &
  UseMultiInputDateTimeRangeFieldProps<TDate, TUseV6TextField>;

export interface MultiInputDateTimeRangeFieldProps<TDate, TUseV6TextField extends boolean = false>
  extends UseMultiInputDateTimeRangeFieldComponentProps<
    TDate,
    TUseV6TextField,
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
  slotProps?: MultiInputDateTimeRangeFieldSlotProps<TDate, TUseV6TextField>;
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

export interface MultiInputDateTimeRangeFieldSlotProps<TDate, TUseV6TextField extends boolean> {
  root?: SlotComponentProps<
    typeof Stack,
    {},
    MultiInputDateTimeRangeFieldProps<TDate, TUseV6TextField>
  >;
  textField?: SlotComponentProps<
    typeof TextField,
    {},
    MultiInputDateTimeRangeFieldProps<TDate, TUseV6TextField> & { position: RangePosition }
  >;
  separator?: SlotComponentProps<
    typeof Typography,
    {},
    MultiInputDateTimeRangeFieldProps<TDate, TUseV6TextField>
  >;
}
