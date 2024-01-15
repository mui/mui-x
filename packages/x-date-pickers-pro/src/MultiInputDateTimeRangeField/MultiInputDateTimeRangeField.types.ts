import * as React from 'react';
import { FieldRef } from '@mui/x-date-pickers/models';
import { SlotComponentProps } from '@mui/base/utils';
import Typography from '@mui/material/Typography';
import Stack, { StackProps } from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { UseDateTimeRangeFieldProps } from '../internals/models/dateTimeRange';
import { UseMultiInputRangeFieldParams } from '../internals/hooks/useMultiInputRangeField/useMultiInputRangeField.types';
import { RangeFieldSection, MultiInputRangeFieldClasses, RangePosition } from '../models';

export type UseMultiInputDateTimeRangeFieldParams<
  TDate,
  TEnableAccessibleFieldDOMStructure extends boolean,
  TTextFieldSlotProps extends {},
> = UseMultiInputRangeFieldParams<
  UseMultiInputDateTimeRangeFieldProps<TDate, TEnableAccessibleFieldDOMStructure>,
  TTextFieldSlotProps
>;

export interface UseMultiInputDateTimeRangeFieldProps<
  TDate,
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends Omit<
    UseDateTimeRangeFieldProps<TDate, TEnableAccessibleFieldDOMStructure>,
    'unstableFieldRef' | 'clearable' | 'onClear'
  > {
  unstableStartFieldRef?: React.Ref<FieldRef<RangeFieldSection>>;
  unstableEndFieldRef?: React.Ref<FieldRef<RangeFieldSection>>;
}

export type UseMultiInputDateTimeRangeFieldComponentProps<
  TDate,
  TEnableAccessibleFieldDOMStructure extends boolean,
  TChildProps extends {},
> = Omit<
  TChildProps,
  keyof UseMultiInputDateTimeRangeFieldProps<TDate, TEnableAccessibleFieldDOMStructure>
> &
  UseMultiInputDateTimeRangeFieldProps<TDate, TEnableAccessibleFieldDOMStructure>;

export interface MultiInputDateTimeRangeFieldProps<
  TDate,
  TEnableAccessibleFieldDOMStructure extends boolean = false,
> extends UseMultiInputDateTimeRangeFieldComponentProps<
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
  slots?: MultiInputDateTimeRangeFieldSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: MultiInputDateTimeRangeFieldSlotProps<TDate, TEnableAccessibleFieldDOMStructure>;
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
   * @default TextField from '@mui/material' or PickersTextField if `enableAccessibleFieldDOMStructure` is `true`.
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
  TEnableAccessibleFieldDOMStructure extends boolean,
> {
  root?: SlotComponentProps<
    typeof Stack,
    {},
    MultiInputDateTimeRangeFieldProps<TDate, TEnableAccessibleFieldDOMStructure>
  >;
  textField?: SlotComponentProps<
    typeof TextField,
    {},
    MultiInputDateTimeRangeFieldProps<TDate, TEnableAccessibleFieldDOMStructure> & {
      position: RangePosition;
    }
  >;
  separator?: SlotComponentProps<
    typeof Typography,
    {},
    MultiInputDateTimeRangeFieldProps<TDate, TEnableAccessibleFieldDOMStructure>
  >;
}
