import * as React from 'react';
import { SlotComponentProps } from '@mui/utils';
import TextField from '@mui/material/TextField';
import { BuiltInFieldTextFieldProps, PickerValidDate } from '@mui/x-date-pickers/models';
import {
  ExportedUseClearableFieldProps,
  UseClearableFieldSlots,
  UseClearableFieldSlotProps,
} from '@mui/x-date-pickers/hooks';
import { DateTimeRangeFieldInternalProps } from '../valueManagers';

export interface UseSingleInputDateTimeRangeFieldProps<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends DateTimeRangeFieldInternalProps<TDate, TEnableAccessibleFieldDOMStructure>,
    ExportedUseClearableFieldProps {}

export type SingleInputDateTimeRangeFieldProps<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean = false,
> = Omit<
  BuiltInFieldTextFieldProps<TEnableAccessibleFieldDOMStructure>,
  keyof UseSingleInputDateTimeRangeFieldProps<TDate, TEnableAccessibleFieldDOMStructure>
> &
  UseSingleInputDateTimeRangeFieldProps<TDate, TEnableAccessibleFieldDOMStructure> & {
    /**
     * Overridable component slots.
     * @default {}
     */
    slots?: SingleInputDateTimeRangeFieldSlots;
    /**
     * The props used for each component slot.
     * @default {}
     */
    slotProps?: SingleInputDateTimeRangeFieldSlotProps<TDate, TEnableAccessibleFieldDOMStructure>;
  };

export interface SingleInputDateTimeRangeFieldSlots extends UseClearableFieldSlots {
  /**
   * Form control with an input to render the value.
   * @default TextField from '@mui/material' or PickersTextField if `enableAccessibleFieldDOMStructure` is `true`.
   */
  textField?: React.ElementType;
}

export interface SingleInputDateTimeRangeFieldSlotProps<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends UseClearableFieldSlotProps {
  textField?: SlotComponentProps<
    typeof TextField,
    {},
    SingleInputDateTimeRangeFieldProps<TDate, TEnableAccessibleFieldDOMStructure>
  >;
}
