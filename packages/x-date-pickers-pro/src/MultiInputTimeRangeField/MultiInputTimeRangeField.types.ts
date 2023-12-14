import * as React from 'react';
import { SlotComponentProps } from '@mui/base/utils';
import Typography from '@mui/material/Typography';
import Stack, { StackProps } from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { FieldRef } from '@mui/x-date-pickers/models';
import { UseTimeRangeFieldProps } from '../internals/models/timeRange';
import { RangePosition } from '../internals/models/range';
import { UseMultiInputRangeFieldParams } from '../internals/hooks/useMultiInputRangeField/useMultiInputRangeField.types';
import { RangeFieldSection, MultiInputRangeFieldClasses } from '../models';

export type UseMultiInputTimeRangeFieldParams<
  TDate,
  TUseV6TextField extends boolean,
  TTextFieldSlotProps extends {},
> = UseMultiInputRangeFieldParams<
  UseMultiInputTimeRangeFieldProps<TDate, TUseV6TextField>,
  TTextFieldSlotProps
>;

export interface UseMultiInputTimeRangeFieldProps<TDate, TUseV6TextField extends boolean>
  extends Omit<
    UseTimeRangeFieldProps<TDate, TUseV6TextField>,
    'unstableFieldRef' | 'clearable' | 'onClear'
  > {
  unstableStartFieldRef?: React.Ref<FieldRef<RangeFieldSection>>;
  unstableEndFieldRef?: React.Ref<FieldRef<RangeFieldSection>>;
}

export type UseMultiInputTimeRangeFieldComponentProps<
  TDate,
  TUseV6TextField extends boolean,
  TChildProps extends {},
> = Omit<TChildProps, keyof UseMultiInputTimeRangeFieldProps<TDate, TUseV6TextField>> &
  UseMultiInputTimeRangeFieldProps<TDate, TUseV6TextField>;

export interface MultiInputTimeRangeFieldProps<TDate, TUseV6TextField extends boolean = false>
  extends UseMultiInputTimeRangeFieldComponentProps<
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
   * Overridable slots.
   * @default {}
   */
  slots?: MultiInputTimeRangeFieldSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: MultiInputTimeRangeFieldSlotProps<TDate, TUseV6TextField>;
}

export interface MultiInputTimeRangeFieldSlots {
  /**
   * Element rendered at the root.
   * @default MultiInputTimeRangeFieldRoot
   */
  root?: React.ElementType;
  /**
   * Form control with an input to render a time.
   * It is rendered twice: once for the start time and once for the end time.
   * Receives the same props as `@mui/material/TextField`.
   * @default TextField from '@mui/material'
   */
  textField?: React.ElementType;
  /**
   * Element rendered between the two inputs.
   * @default MultiInputTimeRangeFieldSeparator
   */
  separator?: React.ElementType;
}

export interface MultiInputTimeRangeFieldSlotProps<TDate, TUseV6TextField extends boolean> {
  root?: SlotComponentProps<
    typeof Stack,
    {},
    MultiInputTimeRangeFieldProps<TDate, TUseV6TextField>
  >;
  textField?: SlotComponentProps<
    typeof TextField,
    {},
    MultiInputTimeRangeFieldProps<TDate, TUseV6TextField> & { position: RangePosition }
  >;
  separator?: SlotComponentProps<
    typeof Typography,
    {},
    MultiInputTimeRangeFieldProps<TDate, TUseV6TextField>
  >;
}
