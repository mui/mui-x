import * as React from 'react';
import { TextFieldProps } from '@mui/material/TextField';
import { SlotComponentPropsFromProps } from '@mui/x-internals/types';
import { BuiltInFieldTextFieldProps, FieldOwnerState } from '@mui/x-date-pickers/models';
import {
  ExportedUseClearableFieldProps,
  UseClearableFieldSlots,
  UseClearableFieldSlotProps,
} from '@mui/x-date-pickers/hooks';
import { PickersTextFieldProps } from '@mui/x-date-pickers/PickersTextField';
import { DateRangeManagerFieldInternalProps } from '../managers/useDateRangeManager';

export interface UseSingleInputDateRangeFieldProps<
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends DateRangeManagerFieldInternalProps<TEnableAccessibleFieldDOMStructure>,
    ExportedUseClearableFieldProps {}

export type SingleInputDateRangeFieldProps<
  TEnableAccessibleFieldDOMStructure extends boolean = true,
> = Omit<
  BuiltInFieldTextFieldProps<TEnableAccessibleFieldDOMStructure>,
  keyof UseSingleInputDateRangeFieldProps<TEnableAccessibleFieldDOMStructure>
> &
  UseSingleInputDateRangeFieldProps<TEnableAccessibleFieldDOMStructure> & {
    /**
     * Overridable component slots.
     * @default {}
     */
    slots?: SingleInputDateRangeFieldSlots;
    /**
     * The props used for each component slot.
     * @default {}
     */
    slotProps?: SingleInputDateRangeFieldSlotProps;
  };

export interface SingleInputDateRangeFieldSlots extends UseClearableFieldSlots {
  /**
   * Form control with an input to render the value.
   * @default <PickersTextField />, or <TextField /> from '@mui/material' if `enableAccessibleFieldDOMStructure` is `false`.
   */
  textField?: React.ElementType;
}

export interface SingleInputDateRangeFieldSlotProps extends UseClearableFieldSlotProps {
  textField?: SlotComponentPropsFromProps<
    PickersTextFieldProps | TextFieldProps,
    {},
    FieldOwnerState
  >;
}
