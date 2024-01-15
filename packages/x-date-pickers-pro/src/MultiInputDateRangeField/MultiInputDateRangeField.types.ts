import * as React from 'react';
import { SlotComponentProps } from '@mui/base/utils';
import Typography from '@mui/material/Typography';
import Stack, { StackProps } from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { FieldRef } from '@mui/x-date-pickers/models';
import { UseDateRangeFieldProps } from '../internals/models/dateRange';
import { UseMultiInputRangeFieldParams } from '../internals/hooks/useMultiInputRangeField/useMultiInputRangeField.types';
import { RangeFieldSection, MultiInputRangeFieldClasses, RangePosition } from '../models';

export type UseMultiInputDateRangeFieldParams<
  TDate,
  TEnableAccessibleFieldDOMStructure extends boolean,
  TTextFieldSlotProps extends {},
> = UseMultiInputRangeFieldParams<
  UseMultiInputDateRangeFieldProps<TDate, TEnableAccessibleFieldDOMStructure>,
  TTextFieldSlotProps
>;

export interface UseMultiInputDateRangeFieldProps<
  TDate,
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends Omit<
    UseDateRangeFieldProps<TDate, TEnableAccessibleFieldDOMStructure>,
    'unstableFieldRef' | 'clearable' | 'onClear'
  > {
  unstableStartFieldRef?: React.Ref<FieldRef<RangeFieldSection>>;
  unstableEndFieldRef?: React.Ref<FieldRef<RangeFieldSection>>;
}

export type UseMultiInputDateRangeFieldComponentProps<
  TDate,
  TEnableAccessibleFieldDOMStructure extends boolean,
  TChildProps extends {},
> = Omit<
  TChildProps,
  keyof UseMultiInputDateRangeFieldProps<TDate, TEnableAccessibleFieldDOMStructure>
> &
  UseMultiInputDateRangeFieldProps<TDate, TEnableAccessibleFieldDOMStructure>;

export interface MultiInputDateRangeFieldProps<
  TDate,
  TEnableAccessibleFieldDOMStructure extends boolean = false,
> extends UseMultiInputDateRangeFieldComponentProps<
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
   * Overridable component slots.
   * @default {}
   */
  slots?: MultiInputDateRangeFieldSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: MultiInputDateRangeFieldSlotProps<TDate, TEnableAccessibleFieldDOMStructure>;
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
   * @default TextField from '@mui/material' or PickersTextField if `enableAccessibleFieldDOMStructure` is `true`.
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
  TEnableAccessibleFieldDOMStructure extends boolean,
> {
  root?: SlotComponentProps<
    typeof Stack,
    {},
    MultiInputDateRangeFieldProps<TDate, TEnableAccessibleFieldDOMStructure>
  >;
  textField?: SlotComponentProps<
    typeof TextField,
    {},
    MultiInputDateRangeFieldProps<TDate, TEnableAccessibleFieldDOMStructure> & {
      position: RangePosition;
    }
  >;
  separator?: SlotComponentProps<
    typeof Typography,
    {},
    MultiInputDateRangeFieldProps<TDate, TEnableAccessibleFieldDOMStructure>
  >;
}
