import * as React from 'react';
import type { TextFieldProps } from '@mui/material/TextField';
import { PickerRangeValue, UseFieldInternalProps } from '@mui/x-date-pickers/internals';
import { BuiltInFieldTextFieldProps, FieldOwnerState } from '@mui/x-date-pickers/models';
import { SlotComponentPropsFromProps } from '@mui/x-internals/types';
import { PickersTextFieldProps } from '@mui/x-date-pickers/PickersTextField';
import {
  ExportedUseClearableFieldProps,
  UseClearableFieldSlots,
  UseClearableFieldSlotProps,
} from '@mui/x-date-pickers/hooks';
import { UseTimeRangeFieldProps } from '../internals/models';
import { TimeRangeValidationError } from '../models';

export interface UseSingleInputTimeRangeFieldProps<
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends UseTimeRangeFieldProps<TEnableAccessibleFieldDOMStructure>,
    ExportedUseClearableFieldProps,
    Pick<
      UseFieldInternalProps<
        PickerRangeValue,
        TEnableAccessibleFieldDOMStructure,
        TimeRangeValidationError
      >,
      'unstableFieldRef'
    > {}

export type SingleInputTimeRangeFieldProps<
  TEnableAccessibleFieldDOMStructure extends boolean = true,
> = Omit<
  BuiltInFieldTextFieldProps<TEnableAccessibleFieldDOMStructure>,
  keyof UseSingleInputTimeRangeFieldProps<TEnableAccessibleFieldDOMStructure>
> &
  UseSingleInputTimeRangeFieldProps<TEnableAccessibleFieldDOMStructure> & {
    /**
     * Overridable component slots.
     * @default {}
     */
    slots?: SingleInputTimeRangeFieldSlots;
    /**
     * The props used for each component slot.
     * @default {}
     */
    slotProps?: SingleInputTimeRangeFieldSlotProps;
  };

export interface SingleInputTimeRangeFieldSlots extends UseClearableFieldSlots {
  /**
   * Form control with an input to render the value.
   * @default <PickersTextField />, or <TextField /> from '@mui/material' if `enableAccessibleFieldDOMStructure` is `false`.
   */
  textField?: React.ElementType;
}

export interface SingleInputTimeRangeFieldSlotProps extends UseClearableFieldSlotProps {
  textField?: SlotComponentPropsFromProps<
    PickersTextFieldProps | TextFieldProps,
    {},
    FieldOwnerState
  >;
}
