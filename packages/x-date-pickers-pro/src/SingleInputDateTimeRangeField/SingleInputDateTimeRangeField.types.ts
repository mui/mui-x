import * as React from 'react';
import { TextFieldProps } from '@mui/material/TextField';
import { MakeOptional, SlotComponentPropsFromProps } from '@mui/x-internals/types';
import { PickersTextFieldProps } from '@mui/x-date-pickers/PickersTextField';
import { AmPmProps, PickerRangeValue, UseFieldInternalProps } from '@mui/x-date-pickers/internals';
import { BuiltInFieldTextFieldProps, FieldOwnerState } from '@mui/x-date-pickers/models';
import {
  ExportedUseClearableFieldProps,
  UseClearableFieldSlots,
  UseClearableFieldSlotProps,
} from '@mui/x-date-pickers/hooks';
import { DateTimeRangeValidationError, RangeFieldSeparatorProps } from '../models';
import { ExportedValidateDateTimeRangeProps } from '../validation/validateDateTimeRange';

export interface UseSingleInputDateTimeRangeFieldProps<
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends MakeOptional<
      UseFieldInternalProps<
        PickerRangeValue,
        TEnableAccessibleFieldDOMStructure,
        DateTimeRangeValidationError
      >,
      'format'
    >,
    RangeFieldSeparatorProps,
    ExportedValidateDateTimeRangeProps,
    AmPmProps,
    ExportedUseClearableFieldProps {}

export type SingleInputDateTimeRangeFieldProps<
  TEnableAccessibleFieldDOMStructure extends boolean = true,
> = Omit<
  BuiltInFieldTextFieldProps<TEnableAccessibleFieldDOMStructure>,
  keyof UseSingleInputDateTimeRangeFieldProps<TEnableAccessibleFieldDOMStructure>
> &
  UseSingleInputDateTimeRangeFieldProps<TEnableAccessibleFieldDOMStructure> & {
    /**
     * Overridable component slots.
     * @default {}
     */
    slots?: SingleInputDateTimeRangeFieldSlots;
    /**
     * The props used for each component slot.
     * @default {}
     */
    slotProps?: SingleInputDateTimeRangeFieldSlotProps;
  };

export interface SingleInputDateTimeRangeFieldSlots extends UseClearableFieldSlots {
  /**
   * Form control with an input to render the value.
   * @default <PickersTextField />, or <TextField /> from '@mui/material' if `enableAccessibleFieldDOMStructure` is `false`.
   */
  textField?: React.ElementType;
}

export interface SingleInputDateTimeRangeFieldSlotProps extends UseClearableFieldSlotProps {
  textField?: SlotComponentPropsFromProps<
    PickersTextFieldProps | TextFieldProps,
    {},
    FieldOwnerState
  >;
}
