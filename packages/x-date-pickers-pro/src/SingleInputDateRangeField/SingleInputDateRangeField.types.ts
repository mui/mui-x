import * as React from 'react';
import { SlotComponentProps } from '@mui/utils';
import TextField from '@mui/material/TextField';
import { BuiltInFieldTextFieldProps, PickerValidDate } from '@mui/x-date-pickers/models';
import {
  UseClearableFieldSlots,
  UseClearableFieldSlotProps,
  ExportedUseClearableFieldProps,
} from '@mui/x-date-pickers/hooks';
import { DateRangeFieldInternalProps } from '../valueManagers';

export interface UseSingleInputDateRangeFieldProps<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends DateRangeFieldInternalProps<TDate, TEnableAccessibleFieldDOMStructure>,
    ExportedUseClearableFieldProps {}

export type SingleInputDateRangeFieldProps<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean = false,
> = Omit<
  BuiltInFieldTextFieldProps<TEnableAccessibleFieldDOMStructure>,
  keyof UseSingleInputDateRangeFieldProps<TDate, TEnableAccessibleFieldDOMStructure>
> &
  UseSingleInputDateRangeFieldProps<TDate, TEnableAccessibleFieldDOMStructure> & {
    /**
     * Overridable component slots.
     * @default {}
     */
    slots?: SingleInputDateRangeFieldSlots;
    /**
     * The props used for each component slot.
     * @default {}
     */
    slotProps?: SingleInputDateRangeFieldSlotProps<TDate, TEnableAccessibleFieldDOMStructure>;
  };

export interface SingleInputDateRangeFieldSlots extends UseClearableFieldSlots {
  /**
   * Form control with an input to render the value.
   * @default TextField from '@mui/material' or PickersTextField if `enableAccessibleFieldDOMStructure` is `true`.
   */
  textField?: React.ElementType;
}

export interface SingleInputDateRangeFieldSlotProps<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends UseClearableFieldSlotProps {
  textField?: SlotComponentProps<
    typeof TextField,
    {},
    SingleInputDateRangeFieldProps<TDate, TEnableAccessibleFieldDOMStructure>
  >;
}
