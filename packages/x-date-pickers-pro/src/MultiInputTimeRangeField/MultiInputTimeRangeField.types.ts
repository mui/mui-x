import * as React from 'react';
import { SlotComponentProps } from '@mui/base/utils';
import Typography from '@mui/material/Typography';
import Stack, { StackProps } from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { FieldRef } from '@mui/x-date-pickers/models';
import { UncapitalizeObjectKeys } from '@mui/x-date-pickers/internals';
import {
  UseTimeRangeFieldDefaultizedProps,
  UseTimeRangeFieldProps,
} from '../internals/models/timeRange';
import { RangePosition } from '../internals/models/range';
import { UseMultiInputRangeFieldParams } from '../internals/hooks/useMultiInputRangeField/useMultiInputRangeField.types';
import { RangeFieldSection } from '../internals/models/fields';
import { MultiInputRangeFieldClasses } from '../models';

export type UseMultiInputTimeRangeFieldParams<
  TDate,
  TTextFieldSlotProps extends {},
> = UseMultiInputRangeFieldParams<UseMultiInputTimeRangeFieldProps<TDate>, TTextFieldSlotProps>;

export interface UseMultiInputTimeRangeFieldProps<TDate>
  extends Omit<UseTimeRangeFieldProps<TDate>, 'unstableFieldRef'> {
  unstableStartFieldRef?: React.Ref<FieldRef<RangeFieldSection>>;
  unstableEndFieldRef?: React.Ref<FieldRef<RangeFieldSection>>;
}

export type UseMultiInputTimeRangeFieldComponentProps<TDate, TChildProps extends {}> = Omit<
  TChildProps,
  keyof UseMultiInputTimeRangeFieldProps<TDate>
> &
  UseMultiInputTimeRangeFieldProps<TDate>;

export interface MultiInputTimeRangeFieldProps<TDate>
  extends UseMultiInputTimeRangeFieldComponentProps<TDate, Omit<StackProps, 'position'>> {
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
  components?: MultiInputTimeRangeFieldSlotsComponent;
  /**
   * The props used for each component slot.
   * @default {}
   * @deprecated Please use `slotProps`.
   */
  componentsProps?: MultiInputTimeRangeFieldSlotsComponentsProps<TDate>;
  /**
   * Overridable slots.
   * @default {}
   */
  slots?: UncapitalizeObjectKeys<MultiInputTimeRangeFieldSlotsComponent>;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: MultiInputTimeRangeFieldSlotsComponentsProps<TDate>;
}

export type MultiInputTimeRangeFieldOwnerState<TDate> = MultiInputTimeRangeFieldProps<TDate>;

export interface MultiInputTimeRangeFieldSlotsComponent {
  /**
   * Element rendered at the root.
   * @default MultiInputTimeRangeFieldRoot
   */
  Root?: React.ElementType;
  /**
   * Form control with an input to render a time.
   * It is rendered twice: once for the start time and once for the end time.
   * Receives the same props as `@mui/material/TextField`.
   * @default TextField from '@mui/material'
   */
  TextField?: React.ElementType;
  /**
   * Element rendered between the two inputs.
   * @default MultiInputTimeRangeFieldSeparator
   */
  Separator?: React.ElementType;
}

export interface MultiInputTimeRangeFieldSlotsComponentsProps<TDate> {
  root?: SlotComponentProps<typeof Stack, {}, MultiInputTimeRangeFieldOwnerState<TDate>>;
  textField?: SlotComponentProps<
    typeof TextField,
    {},
    MultiInputTimeRangeFieldOwnerState<TDate> & { position: RangePosition }
  >;
  separator?: SlotComponentProps<typeof Typography, {}, MultiInputTimeRangeFieldOwnerState<TDate>>;
}

export type UseMultiInputTimeRangeFieldDefaultizedProps<
  TDate,
  AdditionalProps extends {},
> = UseTimeRangeFieldDefaultizedProps<TDate> &
  Omit<AdditionalProps, 'value' | 'defaultValue' | 'onChange'>;
