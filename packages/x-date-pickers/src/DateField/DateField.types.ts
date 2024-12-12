import * as React from 'react';
import type { TextFieldProps } from '@mui/material/TextField';
import { MakeOptional, SlotComponentPropsFromProps } from '@mui/x-internals/types';
import {
  ExportedUseClearableFieldProps,
  UseClearableFieldSlots,
  UseClearableFieldSlotProps,
} from '../hooks/useClearableField';
import { DateValidationError, BuiltInFieldTextFieldProps, FieldOwnerState } from '../models';
import { UseFieldInternalProps } from '../internals/hooks/useField';
import { ExportedValidateDateProps } from '../validation/validateDate';
import { PickersTextFieldProps } from '../PickersTextField';
import { PickerValue } from '../internals/models';

export interface UseDateFieldProps<TEnableAccessibleFieldDOMStructure extends boolean>
  extends MakeOptional<
      UseFieldInternalProps<PickerValue, TEnableAccessibleFieldDOMStructure, DateValidationError>,
      'format'
    >,
    ExportedValidateDateProps,
    ExportedUseClearableFieldProps {}

export type DateFieldProps<TEnableAccessibleFieldDOMStructure extends boolean = true> =
  // The hook props
  UseDateFieldProps<TEnableAccessibleFieldDOMStructure> &
    // The TextField props
    Omit<
      BuiltInFieldTextFieldProps<TEnableAccessibleFieldDOMStructure>,
      keyof UseDateFieldProps<TEnableAccessibleFieldDOMStructure>
    > & {
      /**
       * Overridable component slots.
       * @default {}
       */
      slots?: DateFieldSlots;
      /**
       * The props used for each component slot.
       * @default {}
       */
      slotProps?: DateFieldSlotProps;
    };

export type DateFieldOwnerState<TEnableAccessibleFieldDOMStructure extends boolean> =
  DateFieldProps<TEnableAccessibleFieldDOMStructure>;

export interface DateFieldSlots extends UseClearableFieldSlots {
  /**
   * Form control with an input to render the value.
   * @default <PickersTextField />, or <TextField /> from '@mui/material' if `enableAccessibleFieldDOMStructure` is `false`.
   */
  textField?: React.ElementType;
}

export interface DateFieldSlotProps extends UseClearableFieldSlotProps {
  textField?: SlotComponentPropsFromProps<
    PickersTextFieldProps | TextFieldProps,
    {},
    FieldOwnerState
  >;
}
