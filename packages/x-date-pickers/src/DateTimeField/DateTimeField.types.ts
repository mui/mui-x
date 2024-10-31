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

export interface UseDateTimeFieldProps<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends MakeOptional<
      UseFieldInternalProps<
        TDate | null,
        TDate,
        FieldSection,
        TEnableAccessibleFieldDOMStructure,
        DateTimeValidationError
      >,
      'format'
    >,
    ExportedValidateDateTimeProps<TDate>,
    ExportedUseClearableFieldProps,
    AmPmProps {}

export type DateTimeFieldProps<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean = true,
> =
  // The hook props
  UseDateTimeFieldProps<TDate, TEnableAccessibleFieldDOMStructure> &
    // The TextField props
    Omit<
      BuiltInFieldTextFieldProps<TEnableAccessibleFieldDOMStructure>,
      keyof UseDateTimeFieldProps<TDate, TEnableAccessibleFieldDOMStructure>
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
      slotProps?: DateTimeFieldSlotProps<TDate, TEnableAccessibleFieldDOMStructure>;
    };

export type DateTimeFieldOwnerState<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean,
> = DateTimeFieldProps<TDate, TEnableAccessibleFieldDOMStructure>;

export interface DateTimeFieldSlots extends UseClearableFieldSlots {
  /**
   * Form control with an input to render the value.
   * @default TextField from '@mui/material' or PickersTextField if `enableAccessibleFieldDOMStructure` is `true`.
   */
  textField?: React.ElementType;
}

export interface DateTimeFieldSlotProps<
  TDate extends PickerValidDate,
  TEnableAccessibleFieldDOMStructure extends boolean,
> extends UseClearableFieldSlotProps {
  textField?: SlotComponentProps<
    typeof TextField,
    {},
    DateTimeFieldOwnerState<TDate, TEnableAccessibleFieldDOMStructure>
  >;
}
