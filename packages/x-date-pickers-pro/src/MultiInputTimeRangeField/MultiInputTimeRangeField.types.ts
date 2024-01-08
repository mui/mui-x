import * as React from 'react';
import { SlotComponentProps } from '@mui/base/utils';
import Typography from '@mui/material/Typography';
import Stack, { StackProps } from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { FieldRef, FieldTextFieldVersion } from '@mui/x-date-pickers/models';
import { UseTimeRangeFieldProps } from '../internals/models/timeRange';
import { UseMultiInputRangeFieldParams } from '../internals/hooks/useMultiInputRangeField/useMultiInputRangeField.types';
import { RangeFieldSection, MultiInputRangeFieldClasses, RangePosition } from '../models';

export type UseMultiInputTimeRangeFieldParams<
  TDate,
  TTextFieldVersion extends FieldTextFieldVersion,
  TTextFieldSlotProps extends {},
> = UseMultiInputRangeFieldParams<
  UseMultiInputTimeRangeFieldProps<TDate, TTextFieldVersion>,
  TTextFieldSlotProps
>;

export interface UseMultiInputTimeRangeFieldProps<
  TDate,
  TTextFieldVersion extends FieldTextFieldVersion,
> extends Omit<
    UseTimeRangeFieldProps<TDate, TTextFieldVersion>,
    'unstableFieldRef' | 'clearable' | 'onClear'
  > {
  unstableStartFieldRef?: React.Ref<FieldRef<RangeFieldSection>>;
  unstableEndFieldRef?: React.Ref<FieldRef<RangeFieldSection>>;
}

export type UseMultiInputTimeRangeFieldComponentProps<
  TDate,
  TTextFieldVersion extends FieldTextFieldVersion,
  TChildProps extends {},
> = Omit<TChildProps, keyof UseMultiInputTimeRangeFieldProps<TDate, TTextFieldVersion>> &
  UseMultiInputTimeRangeFieldProps<TDate, TTextFieldVersion>;

export interface MultiInputTimeRangeFieldProps<
  TDate,
  TTextFieldVersion extends FieldTextFieldVersion = 'v6',
> extends UseMultiInputTimeRangeFieldComponentProps<
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
   * Overridable slots.
   * @default {}
   */
  slots?: MultiInputTimeRangeFieldSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: MultiInputTimeRangeFieldSlotProps<TDate, TTextFieldVersion>;
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

export interface MultiInputTimeRangeFieldSlotProps<
  TDate,
  TTextFieldVersion extends FieldTextFieldVersion,
> {
  root?: SlotComponentProps<
    typeof Stack,
    {},
    MultiInputTimeRangeFieldProps<TDate, TTextFieldVersion>
  >;
  textField?: SlotComponentProps<
    typeof TextField,
    {},
    MultiInputTimeRangeFieldProps<TDate, TTextFieldVersion> & { position: RangePosition }
  >;
  separator?: SlotComponentProps<
    typeof Typography,
    {},
    MultiInputTimeRangeFieldProps<TDate, TTextFieldVersion>
  >;
}
