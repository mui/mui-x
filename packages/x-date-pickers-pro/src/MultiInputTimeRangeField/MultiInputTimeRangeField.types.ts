import * as React from 'react';
import { SlotComponentProps } from '@mui/base/utils';
import Typography from '@mui/material/Typography';
import Stack, { StackProps } from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { FieldRef } from '@mui/x-date-pickers/models';
import { UseTimeRangeFieldProps } from '../internals/models/timeRange';
import { UseMultiInputRangeFieldParams } from '../internals/hooks/useMultiInputRangeField/useMultiInputRangeField.types';
import { RangeFieldSection, MultiInputRangeFieldClasses, RangePosition } from '../models';

export type UseMultiInputTimeRangeFieldParams<
  TDate,
  TEnableAccessibleFieldDOMStructure extends boolean,
  TTextFieldSlotProps extends {},
> = UseMultiInputRangeFieldParams<
  UseMultiInputTimeRangeFieldProps<TDate, TEnableAccessibleFieldDOMStructure>,
  TTextFieldSlotProps
>;

export interface UseMultiInputTimeRangeFieldProps<
  TDate,
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends Omit<
    UseTimeRangeFieldProps<TDate, TEnableAccessibleFieldDOMStructure>,
    'unstableFieldRef' | 'clearable' | 'onClear'
  > {
  unstableStartFieldRef?: React.Ref<FieldRef<RangeFieldSection>>;
  unstableEndFieldRef?: React.Ref<FieldRef<RangeFieldSection>>;
}

export type UseMultiInputTimeRangeFieldComponentProps<
  TDate,
  TEnableAccessibleFieldDOMStructure extends boolean,
  TChildProps extends {},
> = Omit<
  TChildProps,
  keyof UseMultiInputTimeRangeFieldProps<TDate, TEnableAccessibleFieldDOMStructure>
> &
  UseMultiInputTimeRangeFieldProps<TDate, TEnableAccessibleFieldDOMStructure>;

export interface MultiInputTimeRangeFieldProps<
  TDate,
  TEnableAccessibleFieldDOMStructure extends boolean = false,
> extends UseMultiInputTimeRangeFieldComponentProps<
    TDate,
    TEnableAccessibleFieldDOMStructure,
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
  slotProps?: MultiInputTimeRangeFieldSlotProps<TDate, TEnableAccessibleFieldDOMStructure>;
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
   * @default TextField from '@mui/material' or PickersTextField if `enableAccessibleFieldDOMStructure` is `true`.
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
  TEnableAccessibleFieldDOMStructure extends boolean,
> {
  root?: SlotComponentProps<
    typeof Stack,
    {},
    MultiInputTimeRangeFieldProps<TDate, TEnableAccessibleFieldDOMStructure>
  >;
  textField?: SlotComponentProps<
    typeof TextField,
    {},
    MultiInputTimeRangeFieldProps<TDate, TEnableAccessibleFieldDOMStructure> & {
      position: RangePosition;
    }
  >;
  separator?: SlotComponentProps<
    typeof Typography,
    {},
    MultiInputTimeRangeFieldProps<TDate, TEnableAccessibleFieldDOMStructure>
  >;
}
