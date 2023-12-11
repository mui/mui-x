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
  TUseV6TextField extends boolean,
  TTextFieldSlotProps extends {},
> = UseMultiInputRangeFieldParams<
  UseMultiInputDateRangeFieldProps<TDate, TUseV6TextField>,
  TTextFieldSlotProps
>;

export interface UseMultiInputDateRangeFieldProps<TDate, TUseV6TextField extends boolean>
  extends Omit<
    UseDateRangeFieldProps<TDate, TUseV6TextField>,
    'unstableFieldRef' | 'clearable' | 'onClear'
  > {
  unstableStartFieldRef?: React.Ref<FieldRef<RangeFieldSection>>;
  unstableEndFieldRef?: React.Ref<FieldRef<RangeFieldSection>>;
}

export type UseMultiInputDateRangeFieldComponentProps<
  TDate,
  TUseV6TextField extends boolean,
  TChildProps extends {},
> = Omit<TChildProps, keyof UseMultiInputDateRangeFieldProps<TDate, TUseV6TextField>> &
  UseMultiInputDateRangeFieldProps<TDate, TUseV6TextField>;

export interface MultiInputDateRangeFieldProps<TDate, TUseV6TextField extends boolean = false>
  extends UseMultiInputDateRangeFieldComponentProps<
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
  slots?: MultiInputDateRangeFieldSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: MultiInputDateRangeFieldSlotProps<TDate, TUseV6TextField>;
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

export interface MultiInputDateRangeFieldSlotProps<TDate, TUseV6TextField extends boolean> {
  root?: SlotComponentProps<
    typeof Stack,
    {},
    MultiInputDateRangeFieldProps<TDate, TUseV6TextField>
  >;
  textField?: SlotComponentProps<
    typeof TextField,
    {},
    MultiInputDateRangeFieldProps<TDate, TUseV6TextField> & { position: RangePosition }
  >;
  separator?: SlotComponentProps<
    typeof Typography,
    {},
    MultiInputDateRangeFieldProps<TDate, TUseV6TextField>
  >;
}
