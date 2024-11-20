import * as React from 'react';
import type { TextFieldProps } from '@mui/material/TextField';
import { MakeOptional, SlotComponentPropsFromProps } from '@mui/x-internals/types';
import {
  DateTimeValidationError,
  FieldSection,
  PickerValidDate,
  BuiltInFieldTextFieldProps,
  FieldOwnerState,
} from '../models';
import { UseFieldInternalProps } from '../internals/hooks/useField';
import {
  ExportedUseClearableFieldProps,
  UseClearableFieldSlots,
  UseClearableFieldSlotProps,
} from '../hooks/useClearableField';
import { ExportedValidateDateTimeProps } from '../validation/validateDateTime';
import { AmPmProps } from '../internals/models/props/time';
import { PickersTextFieldProps } from '../PickersTextField';

export interface UseDateTimeFieldProps<TEnableAccessibleFieldDOMStructure extends boolean>
  extends MakeOptional<
      UseFieldInternalProps<
        PickerValidDate | null,
        FieldSection,
        TEnableAccessibleFieldDOMStructure,
        DateTimeValidationError
      >,
      'format'
    >,
    ExportedValidateDateTimeProps,
    ExportedUseClearableFieldProps,
    AmPmProps {}

export type DateTimeFieldProps<TEnableAccessibleFieldDOMStructure extends boolean = true> =
  // The hook props
  UseDateTimeFieldProps<TEnableAccessibleFieldDOMStructure> &
    // The TextField props
    Omit<
      BuiltInFieldTextFieldProps<TEnableAccessibleFieldDOMStructure>,
      keyof UseDateTimeFieldProps<TEnableAccessibleFieldDOMStructure>
    > & {
      /**
       * Overridable component slots.
       * @default {}
       */
      slots?: DateTimeFieldSlots;
      /**
       * The props used for each component slot.
       * @default {}
       */
      slotProps?: DateTimeFieldSlotProps;
    };

export interface DateTimeFieldSlots extends UseClearableFieldSlots {
  /**
   * Form control with an input to render the value.
   * @default <PickersTextField />, or <TextField /> from '@mui/material' if `enableAccessibleFieldDOMStructure` is `false`.
   */
  textField?: React.ElementType;
}

export interface DateTimeFieldSlotProps extends UseClearableFieldSlotProps {
  textField?: SlotComponentPropsFromProps<
    PickersTextFieldProps | TextFieldProps,
    {},
    FieldOwnerState
  >;
}
