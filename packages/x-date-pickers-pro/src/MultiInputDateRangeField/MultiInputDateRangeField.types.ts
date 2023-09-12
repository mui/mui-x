import * as React from 'react';
import { SlotComponentProps } from '@mui/base/utils';
import Typography from '@mui/material/Typography';
import Stack, { StackProps } from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { FieldRef } from '@mui/x-date-pickers/models';
import { UncapitalizeObjectKeys } from '@mui/x-date-pickers/internals';
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
  extends Omit<UseDateRangeFieldProps<TDate>, 'unstableFieldRef'> {
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
   * Overridable components.
   * @default {}
   * @deprecated Please use `slots`.
   */
  components?: MultiInputDateRangeFieldSlotsComponent;
  /**
   * The props used for each component slot.
   * @default {}
   * @deprecated Please use `slotProps`.
   */
  componentsProps?: MultiInputDateRangeFieldSlotsComponentsProps<TDate>;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: UncapitalizeObjectKeys<MultiInputDateRangeFieldSlotsComponent>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: MultiInputDateRangeFieldSlotsComponentsProps<TDate>;
}

export type MultiInputDateRangeFieldOwnerState<TDate> = MultiInputDateRangeFieldProps<TDate>;

export interface MultiInputDateRangeFieldSlotsComponent {
  /**
   * Element rendered at the root.
   * @default MultiInputDateRangeFieldRoot
   */
  Root?: React.ElementType;
  /**
   * Form control with an input to render a date.
   * It is rendered twice: once for the start date and once for the end date.
   * Receives the same props as `@mui/material/TextField`.
   * @default TextField from '@mui/material'
   */
  TextField?: React.ElementType;
  /**
   * Element rendered between the two inputs.
   * @default MultiInputDateRangeFieldSeparator
   */
  Separator?: React.ElementType;
}

export interface MultiInputDateRangeFieldSlotsComponentsProps<TDate> {
  root?: SlotComponentProps<typeof Stack, {}, MultiInputDateRangeFieldOwnerState<TDate>>;
  textField?: SlotComponentProps<
    typeof TextField,
    {},
    MultiInputDateRangeFieldOwnerState<TDate> & { position: RangePosition }
  >;
  separator?: SlotComponentProps<typeof Typography, {}, MultiInputDateRangeFieldOwnerState<TDate>>;
}
