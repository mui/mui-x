import * as React from 'react';
import { SlotComponentProps } from '@mui/utils';
import { MakeOptional } from '@mui/x-internals/types';
import TextField from '@mui/material/TextField';
import {
  DateTimeValidationError,
  FieldSection,
  PickerValidDate,
  BuiltInFieldTextFieldProps,
} from '../models';
import { UseFieldInternalProps } from '../internals/hooks/useField';
import {
  ExportedUseClearableFieldProps,
  UseClearableFieldSlots,
  UseClearableFieldSlotProps,
} from '../hooks/useClearableField';
import { ExportedValidateDateTimeProps } from '../validation/validateDateTime';
import { AmPmProps } from '../internals/models/props/time';

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
      slotProps?: DateTimeFieldSlotProps<TEnableAccessibleFieldDOMStructure>;
    };

export type DateTimeFieldOwnerState<TEnableAccessibleFieldDOMStructure extends boolean> =
  DateTimeFieldProps<TEnableAccessibleFieldDOMStructure>;

export interface DateTimeFieldSlots extends UseClearableFieldSlots {
  /**
   * Form control with an input to render the value.
   * @default TextField from '@mui/material' or PickersTextField if `enableAccessibleFieldDOMStructure` is `true`.
   */
  textField?: React.ElementType;
}

export interface DateTimeFieldSlotProps<TEnableAccessibleFieldDOMStructure extends boolean>
  extends UseClearableFieldSlotProps {
  textField?: SlotComponentProps<
    typeof TextField,
    {},
    DateTimeFieldOwnerState<TEnableAccessibleFieldDOMStructure>
  >;
}
